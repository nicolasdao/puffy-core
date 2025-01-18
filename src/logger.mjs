/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- log
*/

import { safeStringify } from './string.mjs'

const _void = x => x

/**
 * Gets the JSON string stored in the process.env.LOG_META environment variable
 * and parses it to an object.
 * 
 * @return {Object}	meta
 */
const _getGlobalMeta = () => {
	if (process.env.LOG_META) {
		try {
			const meta = JSON.parse(process.env.LOG_META)
			if (typeof(meta) == 'object' && Object.keys(meta).length)
				return meta
			else
				return {}
		} catch(e) {
			_void(e)
		}
	}

	return {}
}

const META = _getGlobalMeta()

/**
 * 
 * @param  {Object}		payload
 * @param  {String}			.level		Allowed values: 'INFO' (default), 'WARN', 'ERROR', 'CRITICAL'
 * @param  {String}			.opId		Operation id. Usefull to group log for analysis
 * @param  {String}			.message	Message
 * @param  {String}			.code		Code
 * @param  {Number}			.metric		
 * @param  {String}			.unit		
 * @param  {Number}			.time		Time. When set, 'metric' and 'unit' are ignored. 'unit' is 'ms'.
 * @param  {Boolean}		.test	
 * @param  {Object}			.data	
 * @param  {Object}			.errors		
 * 
 * @return {Void}
 *
 * NOTE: The properties listed above are the explicit properties. More can be added.
 */
export const log = payload => {
	let { level, message, code, time, opId, test, metric, unit, data, errors, ...rest } = payload || {}
	level = (level || 'INFO').toUpperCase()
	const log = {
		...META,
		...rest,
		level: level == 'INFO' || level == 'WARN' || level == 'ERROR' || level == 'CRITICAL' ? level : 'INFO',
		test: test ? true : false,
		message
	}
	if (code)
		log.code = code
	if (time) {
		log.metric = time
		log.unit = 'ms'
	} else if (metric) {
		log.metric = metric
		if (unit)
			log.unit = unit
	}
	if (opId)
		log.op_id = opId
	if (data)
		log.data = data
	if (errors) {
		if (errors instanceof Error)
			log.errors = [_parseError(errors)]	
		else if (Array.isArray(errors))
			log.errors = errors.map(_parseError)
		else
			log.errors = [_parseError(errors)]
	}

	if (log.level == 'INFO')
		console.log(safeStringify(log))
	else if (log.level == 'WARN')
		console.warn(safeStringify(log))
	else
		console.error(safeStringify(log))
}

/**
 * Converts an error object into an explicit object.
 * 
 * @param  {Error}	e
 * @return {Object}	output
 * @return {String}		.message
 * @return {String}		.stack
 */
const _parseError = e => {
	if (!e)
		return { message:'', stack:'' }
	else if (e instanceof Error)
		return { message:e.message, stack:e.stack }
	else if (typeof(e) == 'object')
		return { ...e, message:e.message, stack:e.stack }
	else 
		return { message:`${e}`, stack:'' }
}