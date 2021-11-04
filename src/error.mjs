/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- catchErrors
	- wrapErrors
	- mergeErrors
*/

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
export const catchErrors = exec => {
	if (!exec)
		try {
			throw new Error('Missing required argument \'exec\'.')
		} catch (err) {
			return _formatErrors(err)
		} 

	if (exec.then && typeof(exec.then) == 'function')
		return exec
			.then(data => ([null,data]))
			.catch(_formatErrors)

	const t = typeof(exec)
	if (t == 'function') {
		try {
			const data = exec()
			return [null, data]
		} catch (err) {
			return _formatErrors(err)
		}
	}

	try {
		throw new Error(`Invalid argument exception. Function 'catchErrors' expects a single argument of type 'Function' or 'Promise'. Found '${t}' instead.`)
	} catch (err) {
		return _formatErrors(err)
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
export const wrapErrors = (...args) => {
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
		return new Error([headError,...errors].map(e => e.stack).join('\n'))
	else {
		headError.errors = errors
		return headError
	}

	// errors = errors || []
	// if (options && options.merge) {
	// 	const erroMsg = [{ stack:msg }, ...errors].map(e => e.stack).join('\n')
	// 	return new Error(erroMsg)
	// } else {
	// 	const error = new Error(msg)
	// 	error.errors = errors
	// 	return error
	// }
}

export const mergeErrors = (errors=[]) => {
	if (!errors.length)
		return new Error()

	const error = new Error(errors[0].message)
	error.stack = errors.map(e => e.stack||'' ).filter(x => x).join('\n')

	return error
}

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

const _formatErrors = err => {
	if (err && err.errors && err.errors[0]) {
		const errors = [err, ...err.errors]
		err.errors = null
		return [errors, null]
	} else
		return [[err],null]
}

