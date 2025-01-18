/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/


/*
API:
	- add_zero
	- addZero
	- c2s_case
	- c2sCase
	- capital2cCase
	- capital_2_c_case
	- nbr_to_currency
	- nbrToCurrency
	- object_c_2_s_case
	- object_capital_2_c_case
	- object_s_2_c_case
	- objectC2Scase
	- objectCapital2Ccase
	- objectS2Ccase
	- s2c_case
	- s2cCase
	- to_array
	- to_boolean
	- to_number
	- to_obj
	- toArray
	- toBoolean
	- toNumber
	- toObj
*/

/**
 * Converts a number to a string prefixed with a currency symbol.
 * 
 * @param  {Number} nbr
 * @param  {String} symbol			Currency symbol, or one of the followinh currency name: 'dollar', 'euro', 'yen', 'yuan' or 'pound'
 * 
 * @return {String} 
 */
export const nbrToCurrency = (nbr, symbol='$') => {
	if (typeof(nbr) != 'number')
		return `${symbol}0.00`

	let s = symbol
	if (symbol == 'dollar')
		s = '$'
	else if (symbol == 'euro')
		s = '€'
	else if (symbol == 'yen' || symbol == 'yuan')
		s = '¥'
	else if (symbol == 'pound')
		s = '£'

	return `${s}${nbr.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`
}

/**
 * Convert snake case to camel case
 * @param  {String} s 	e.g., "hello_world"
 * @return {String}   	e.g., "helloWorld"
 */
export const s2cCase = s => (s || '').replace(/_+/g,'_').replace(/_[^_]/g, m => m[1].toUpperCase())

/**
 * Convert camel case to snake case
 * @param  {String} s 	e.g., "helloWorld"
 * @return {String}   	e.g., "hello_world"
 */
export const c2sCase = s => (s || '').replace(/\s/g, '').split(/(?=[A-Z]{1})/g).map(x => x.toLowerCase()).join('_')

/**
 * Convert capital case to camel case
 * @param  {String} s 	e.g., "HelloWorld"
 * @return {String}   	e.g., "helloWorld"
 */
export const capital2cCase = s => s2cCase((s || '').replace(/^./, s => s.toLowerCase()))

/**
 * Converts an object's field names from camel case to snake case. For example: { helloWorld: 'Nic' } to { hello_world: 'Nic' }
 * 
 * @param  {Object} obj		e.g., { helloWorld: 'Nic' }
 * @return {Object} output	e.g., { hello_world: 'Nic' }
 */
export const objectC2Scase = obj => {
	if (!obj || typeof(obj) != 'object') 
		return obj 

	return Object.keys(obj).reduce((acc, key) => {
		const v = obj[key]
		const p = c2sCase(key)
		if (v && typeof(v) == 'object' && !(v instanceof Date)) {
			if (Array.isArray(v))
				acc[p] = v.map(x => objectC2Scase(x))
			else
				acc[p] = objectC2Scase(v)
		} else
			acc[p] = v 
		return acc
	}, {})
}

/**
 * Converts an object's field names from snake case to camel case.
 * 
 * @param  {Object} obj		e.g., { hello_world: 'Nic' }
 * @return {Object} output	e.g., { helloWorld: 'Nic' }
 */
export const objectS2Ccase = obj => {
	if (!obj || typeof(obj) != 'object') 
		return obj 

	return Object.keys(obj).reduce((acc, key) => {
		const v = obj[key]
		const p = s2cCase(key)
		if (v && typeof(v) == 'object' && !(v instanceof Date)) {
			if (Array.isArray(v))
				acc[p] = v.map(x => objectS2Ccase(x))
			else
				acc[p] = objectS2Ccase(v)
		} else
			acc[p] = v 
		return acc
	}, {})
}

// Transforms 
/**
 * Converts an object's field names from capital case to camel case.
 * 
 * @param  {Object} obj		e.g., { HelloWorld: 'Nic' }
 * @return {Object} output	e.g., { helloWorld: 'Nic' }
 */
export const objectCapital2Ccase = obj => {
	if (!obj || typeof(obj) != 'object') 
		return obj 

	return Object.keys(obj).reduce((acc, key) => {
		const v = obj[key]
		const p = capital2cCase(key)
		if (v && typeof(v) == 'object' && !(v instanceof Date)) {
			if (Array.isArray(v))
				acc[p] = v.map(x => objectCapital2Ccase(x))
			else
				acc[p] = objectCapital2Ccase(v)
		} else
			acc[p] = v 
		return acc
	}, {})
}

export const addZero = (nbr,l) => {
	let r = `${nbr}`
	if (!l || isNaN(nbr*1))
		return r

	const currentLength = r.length
	if (currentLength >= l)
		return r

	for(let i=0;i<l-currentLength;i++)
		r = '0'+r

	return r
}

export const toNumber = (val,_default) => {
	if (val === null || val === undefined)
		return 0 

	const t = typeof(val)
	if (t == 'boolean')
		return val ? 1 : 0

	const _v = (t == 'string' ? val.trim(): `${val}`).toLowerCase()

	const v = _v*1
	if (!_v || isNaN(v))
		return _default === undefined ? null : _default
	else
		return v
}

export const toBoolean = (val,_default) => {
	if (val === null || val === undefined)
		return false 

	const t = typeof(val)
	if (t == 'number')
		return t == 0 ? false : true
	else if (t == 'boolean')
		return val
	else if (t == 'object')
		return true

	const _v = (t == 'string' ? val.trim(): `${val}`).toLowerCase()
	return (_v == 'true' || _v == '1') ? true : (_v == 'false' || _v == '0') ? false : _default
}

export const toObj  = (val,_default) => {
	if (!val)
		return null

	const t = typeof(val)

	if (t == 'object')
		return val

	const _v = t == 'string' ? val.trim() : `${val}`

	try {
		return JSON.parse(_v)
	} catch(e) {
		return (() => _default)(e)
	}
}

export const toArray  = (val,_default) => {
	if (!val)
		return []

	const t = typeof(val)

	const _v = t == 'string' ? val.trim() : `${val}`

	try {
		const a = JSON.parse(_v)
		return Array.isArray(a) ? a : [a]
	} catch(e) {
		return (() => _default)(e)
	}
}

export const nbr_to_currency = nbrToCurrency
export const s2c_case = s2cCase
export const c2s_case = c2sCase
export const capital_2_c_case = capital2cCase
export const object_c_2_s_case = objectC2Scase
export const object_s_2_c_case = objectS2Ccase
export const object_capital_2_c_case = objectCapital2Ccase
export const add_zero = addZero
export const to_number = toNumber
export const to_boolean = toBoolean
export const to_obj = toObj
export const to_array = toArray