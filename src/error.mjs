/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- catch_errors
	- catchErrors
	- get_error_metadata
	- getErrorMetadata
	- merge_errors
	- mergeErrors
	- required
	- required
	- wrap_custom_errors
	- wrap_errors
	- wrap_errors_fn
	- wrapCustomErrors
	- wrapErrors
	- wrapErrorsFn
*/

export class PuffyResponse extends Array {}

/**
 * Makes sure that a promise marshall the error instead of failing.  How to use it:
 * 		const myAsyncFunction = () => catchErrors((async () => {
 * 			const [errors, data] = await otherAsyncFunc()
 * 			if (errors) 
 *				throw wrapErrors(`Boom! it broke for XYZ...`, errors)
 *
 *			return data
 * 		})())
 * 
 * @param  {Promise|Function}	promise 
 * @return {Error}				result[0]	Potential error. Null means no error
 * @return {Object}				result[1]	Result
 */
export const catchErrors = (arg01, arg02) => {
	const [globalErrorMsg, exec] = arg01 && typeof(arg01) == 'string' ? [arg01, arg02] : [null, arg01]
	if (!exec)
		try {
			throw new Error('Missing required argument \'exec\'.')
		} catch (err) {
			return _formatErrors(err, globalErrorMsg)
		} 

	if (exec.then && typeof(exec.then) == 'function')
		return exec
			.then(data => new PuffyResponse(null, data))
			.catch(err => _formatErrors(err, globalErrorMsg))

	const t = typeof(exec)
	if (t == 'function') {
		try {
			if (exec.constructor.name == 'AsyncFunction')
				return exec()
					.then(data => new PuffyResponse(null, data))
					.catch(err => _formatErrors(err, globalErrorMsg))
			else {
				const data = exec()
				return new PuffyResponse(null, data)
			}
		} catch (err) {
			return _formatErrors(err, globalErrorMsg)
		}
	}

	try {
		throw new Error(`Invalid argument exception. Function 'catchErrors' expects a single argument of type 'Function' or 'Promise'. Found '${t}' instead.`)
	} catch (err) {
		return _formatErrors(err, globalErrorMsg)
	}
}

/**
 * @param  {Object}		metadata
 * 
 * @return {Function}
 */
export const wrapCustomErrors = metadata => {
	const addMeta = metadata 
		? x => {
			if (x) {
				x.metadata = metadata
				if (!x.response)
					x.response = data => {
						x.__data = data
						return x
					}
			}
			return x
		}
		: x => {
			if (x && !x.response)
				x.response = data => {
					x.__data = data
					return x
				}
			return x
		}
	return (...args) => {
		if (!args.length)
			return new Error('Unknown error')

		const [head, ...rest] = args
		const [headError, ...errors] = _parseToErrors(head)
		let merge = false
		for (let i=0;i<rest.length;i++) {
			const error = rest[i]
			if (error) {
				if (error.merge && !error.message && !error.stack)
					merge = true
				else
					errors.push(..._parseToErrors(error))
			}
		}

		if (merge) 
			return addMeta(new Error([headError,...errors].map(e => e.stack).join('\n')))
		else {
			headError.errors = errors
			return addMeta(headError)
		}
	}
}

/**
 * Create a new error that wraps others. How to use it:
 * 		const myAsyncFunction = () => catchErrors((async () => {
 * 			const [errors, data] = await otherAsyncFunc()
 * 			if (errors) 
 *				throw wrapErrors(`Boom! it broke for XYZ...`, errors)
 *
 *			return data
 * 		})())
 * 
 * @param  {String}		msg				Error message.
 * @param  {Array}		errors			Previous errors.
 * @param  {Boolean}	options.merge	Default false. If true, all the errors' stacks are merge into the body of the new error.
 * 
 * @return {Error}		error
 */
export const wrapErrors = wrapCustomErrors()

/**
 * Create a new error that wraps others. How to use it:
 * 		const myAsyncFunction = () => catchErrors((async () => {
 * 			const [errors, data] = await otherAsyncFunc()
 * 			if (errors) 
 *				throw wrapErrors(`Boom! it broke for XYZ...`, errors)
 *
 *			return data
 * 		})())
 * 
 * @param  {String}		msg				Error message.
 * @param  {Array}		errors			Previous errors.
 * @param  {Boolean}	options.merge	Default false. If true, all the errors' stacks are merge into the body of the new error.
 * 
 * @return {Error}		error
 */
export const wrapErrorsFn = (...args) => (..._args) => wrapErrors(...args, ..._args)

/**
 * Merges all the metadata values from each error into a single object. The latest error's metadata takes precedence.
 * 
 * @param  {[Error]}	errors[]
 * @param  {Object}			.metadata
 * 
 * @return {Object}		metadata
 */
export const getErrorMetadata = errors => {
	if (!errors || !errors.length)
		return null
	
	let metadata = null
	for(let i=errors.length-1;i>=0;i--) {
		const e = errors[i]
		if (e.metadata) {
			if (!metadata)
				metadata = e.metadata
			else if (typeof(metadata) == 'object' && !Array.isArray(metadata) && typeof(e.metadata) == 'object' && !Array.isArray(e.metadata)) {
				for (let [key, value] of Object.entries(e.metadata)) {
					if (!metadata[key])
						metadata[key] = value
				}
			}
		}
	}
	return metadata
}

/**
 * Merges an array of errors into a single Error instance.
 * 
 * @param  {[Error]}	errors
 * @return {Error}		error
 * @return {String}			.message	errors[0].message
 * @return {String}			.stack		Concatenated errors' stacks
 */
export const mergeErrors = errors => {
	errors = errors || []
	if (!errors.length)
		return new Error()

	const error = new Error(errors[0].message)
	error.stack = errors.map(e => e.stack||'' ).filter(x => x).join('\n')

	return error
}

/**
 * Parses any object into an array of Error instances.
 * 
 * @param  {Object}		e
 * 
 * @return {[Error]}	errors
 */
const _parseToErrors = e => {
	if (!e)
		return [new Error('Unknown error')]

	if (Array.isArray(e))
		return e.reduce((acc,err) => {
			acc.push(..._parseToErrors(err))
			return acc
		}, [])
	else if (typeof(e) == 'string')
		return [new Error(e)]
	else if (e instanceof Error)
		return [e]
	else if (e.message) {
		if (e.stack)
			return [e]
		else
			return [new Error(e.message)]
	} else
		return [new Error('Unknown error')]
}

/**
 * Parses an Error instance with an 'errors' property into a PuffyResponse instance.
 * 
 * @param  {Error}			err
 * @param  {[Error]}			.errors
 * @param  {Object}				.__data
 * @param  {String}			globalErrorMsg		Optional error message that wraps all the others 
 * 
 * @return {PuffyResponse}	puffyResponse
 */
const _formatErrors = (err, globalErrorMsg) => {
	if (err && err.errors && err.errors[0]) {
		const errors = globalErrorMsg 
			? [new Error(globalErrorMsg), err, ...err.errors] 
			: [err, ...err.errors]
		err.errors = null
		return new PuffyResponse(errors, (err||{}).__data||null)
	} else {
		const errors = globalErrorMsg
			? [new Error(globalErrorMsg), err]
			: [err]
		return new PuffyResponse(errors, (err||{}).__data||null) 
	}
}

export const required = input => {
	if (!input)
		throw wrapErrors('Missing required argument \'input\'')
	if (typeof(input) == 'object') {
		for (let key in input) {
			if (!input[key])
				throw wrapErrors(`Missing required argument '${key}'`)
		}
	}
}

export const catch_errors = catchErrors
export const get_error_metadata = getErrorMetadata
export const merge_errors = mergeErrors
export const wrap_custom_errors = wrapCustomErrors
export const wrap_errors = wrapErrors
export const wrap_errors_fn = wrapErrorsFn

