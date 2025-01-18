/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- diff
	- exists
	- exists_all
	- exists_any
	- existsAll
	- existsAny
	- extract_flattened_json
	- extractFlattenedJSON
	- get_property
	- get_type
	- getProperty
	- getType
	- is_empty
	- is_obj
	- isEmpty
	- isObj
	- merge
	- mirror
	- same
	- set_property
	- setProperty
*/

/**
 * Checks if an object exists, i.e., it is not equal to null or undefined.
 * 
 * @param  {Object}		o
 * 
 * @return {Boolean}	result
 */
export const exists = o => o !== null && o !== undefined
export const existsAny = (...args) => args.some(exists)
export const existsAll = (...args) => args.every(exists)


export const merge = (...objs) => objs.reduce((acc, obj) => { //Object.assign(...objs.map(obj => JSON.parse(JSON.stringify(obj))))
	obj = obj || {}
	if (typeof(obj) != 'object' || Array.isArray(obj) || (obj instanceof Date))
		return acc
	
	Object.keys(obj).forEach(property => {
		const val = obj[property]
		const originVal = acc[property]
		const readyToMerge = !originVal || !val || typeof(val) != 'object' || Array.isArray(val) || typeof(originVal) != 'object' || Array.isArray(originVal)
		acc[property] = readyToMerge ? val : merge(originVal, val)	
	})

	return acc
}, {})

export const isEmpty = obj => {
	if (!obj)
		return true 
	try {
		const o = JSON.stringify(obj)
		return o == '{}'
	} catch(e) {
		return (() => false)(e)
	}
}

export const isObj = obj => {
	if (!obj || typeof(obj) != 'object' || Array.isArray(obj) || (obj instanceof Date))
		return false 

	try {
		const o = JSON.stringify(obj) || ''
		return o.match(/^\{(.*?)\}$/)
	} catch(e) {
		return (() => false)(e)
	}
}

export const diff = (orig={}, current={}) => {
	return Object.keys(current).reduce((acc, key) => {
		const val = current[key]
		const origVal = orig[key]
		if (val == undefined || origVal == val) 
			return acc
		
		const origValIsObj = isObj(origVal)

		if (!origValIsObj && origVal != val) {
			acc[key] = val
			return acc
		} 

		const valIsObj = isObj(val)

		if (origValIsObj && valIsObj) {
			const objDiff = diff(origVal, val)
			if (!isEmpty(objDiff))
				acc[key] = objDiff
			return acc
		}

		if (origVal != val) {
			acc[key] = val
			return acc
		} 
		return acc
	}, {})
}

/**
 * 
 * @param  {Object} o_1     			That can be anything, incl. primitive type
 * @param  {Object} o_2     			That can be anything, incl. primitive type
 * @param  {Object} options.throwError 	Default false. If set to true, a failed test throws an exception with the details.
 * @return {Boolean}         			Whether or not the test passes
 */
export const same = (o_1, o_2, options={}) => {
	const failed = msg => {
		if (options.throwError)
			throw new Error(msg)
		else
			return false
	}
	if (o_1 === o_2)
		return true
	
	if (o_1 === null || o_1 === undefined)
		return failed('The first object is non-truthy while the second is truthy')

	if (o_2 === null || o_2 === undefined)
		return failed('The second object is non-truthy while the first is truthy')
	
	const o_1_type = o_1 instanceof Date ? 'date' : Array.isArray(o_1) ? 'array' : typeof(o_1)
	const o_2_type = o_2 instanceof Date ? 'date' : Array.isArray(o_2) ? 'array' : typeof(o_2)

	if (o_1_type != o_2_type)
		return failed(`Object types do not match (${o_1_type} != ${o_2_type})`)

	if (o_1_type == 'date')
		return o_1.toString() == o_2.toString() ? true : failed(`Dates don't match (${o_1} != ${o_2})`)

	if (o_1_type == 'object') {
		const o_1_keys = Object.keys(o_1)
		const o_2_keys = Object.keys(o_2)
		if (o_1_keys.length > o_2_keys.length) {
			const additionalKey = o_1_keys.find(key => !o_2_keys.some(k => k == key))
			return failed(`Property '${additionalKey}' in the first object does not exit in the second`)
		}

		if (o_1_keys.length < o_2_keys.length) {
			const additionalKey = o_2_keys.find(key => !o_1_keys.some(k => k == key))
			return failed(`Property '${additionalKey}' in the second object does not exit in the first`)
		}

		const additionalKey = o_2_keys.find(key => !o_1_keys.some(k => k == key))
		if (additionalKey)
			return failed(`Property '${additionalKey}' in the second object does not exit in the first`)

		return o_1_keys.reduce((isSame, key) => {
			if (!isSame)
				return isSame
			const o_1_val = o_1[key]
			const o_2_val = o_2[key]
			try {
				return same(o_1_val, o_2_val, { throwError: true })
			} catch(err) {
				return failed(`Differences in property '${key}': ${err.message}`)
			}
		}, true)
	}
	
	if (o_1_type == 'array') {
		if (o_1.length != o_2.length) {
			return failed('Arrays don\'t have the same amount of items')
		}

		return o_1.reduce((isSame, obj_1) => {
			if (!isSame)
				return isSame
			return o_2.some(obj_2 => same(obj_1, obj_2)) ? true : failed(`No objects in the second array can match object ${JSON.stringify(obj_1, null, ' ')}`)
		}, true)
	}

	return failed(`Those 2 objects are not equal: ${o_1}, ${o_2}`) 
}

const NON_OBJECT_TYPES = { 'number':true, 'string':true, 'boolean':true, 'undefined':true, }
/**
 * Returns more granular types than 'typeof'. 
 * 
 * @param  {Object} obj 
 * 
 * @return {String}	type	Supported types: 'number', 'string', 'boolean', 'undefined', 'array', 'date', 'object', null
 */
export const getType = obj => {
	const t = typeof(obj)
	if (NON_OBJECT_TYPES[t])
		return t 
	if (obj === null)
		return null
	if (Array.isArray(obj))
		return 'array'
	if (obj instanceof Date)
		return 'date'

	return t
}

export const mirror = (obj, refObj) => {
	const refProps = Object.keys(refObj) || []
	const props = (Object.keys(obj) || [])
	const propsToKeep = props.filter(p => refProps.some(pp => pp == p))
	const propsToAdd = refProps.filter(p => !props.some(pp => pp == p))
	return [...propsToKeep, ...propsToAdd].reduce((acc,prop) => {
		const v = obj[prop]
		const refV = refObj[prop]
		if (v === undefined)
			acc[prop] = refV
		else {
			const vType = getType(v)
			const refVtype = getType(refV)
			if (vType == 'object' && refVtype == 'object')
				acc[prop] = mirror(v,refV)
			else if (vType == refVtype)
				acc[prop] = v
			else 
				acc[prop] = refV
		}
		return acc
	},{})
}

/**
 * Sets an object's property with a specific value. 
 * 
 * @param  {Object} obj   Original object.
 * @param  {String} prop  Property to be set (e.g., 'name' or 'project.name').
 * @param  {Object} value Value to be set with.
 * @return {Object}       Original object with the property set.
 */
export const setProperty = (obj,prop, value) => {
	if (!prop)
		return obj 
	
	obj = obj || {}
	const props = prop.split('.')
	const l = props.length-1
	props.reduce((acc,p,idx) => {
		if (idx == l)
			acc[p] = value 
		else if (!acc[p])
			acc[p] = {}
		return acc[p]
	},obj)

	return obj
}

/**
 * Gets an object's property based on the property path. 
 * 
 * @param  {Object} obj   Original object.
 * @param  {String} prop  e.g., 'name' or 'project.name' or 'friends[1].events[0][1].name' or '[2]'
 * 
 * @return {Object}       Value.
 */
export const getProperty = (obj,prop) => {
	if (!prop)
		return obj 
	
	obj = obj || {}
	const props = prop.split('.').filter(x => x)
	const l = props.length
	const lastIndex = l-1
	let value = obj
	for (let i=0;i<l;i++) {
		if (i == lastIndex)
			value = _getPropValue(value, props[i])
		else
			value = _getPropValue(value, props[i]) || {}
	}
	return value
}

/**
 * Example: 
 * const obj = extractFlattenedJSON({
 * 	'user.firstName': 'Nicolas',
 * 	'user.age': 38,
 * 	'user.friends[0].name': 'Brendan',
 * 	'user.friends[0].age': 31,
 * 	'user.friends[1].name': 'Boris',
 * 	'user.friends[1].age': 32
 * }) -> 
 * {
 * 	user: {
 * 		firstName: 'Nicolas',
 * 		age: 38,
 * 		friends: [{ name: 'Brendan', age: 31 }, { name: 'Boris', age: 32 }]
 * 	}
 * }
 * 
 * @param  {Object} obj
 * 
 * @return {Object}    
 */
export const extractFlattenedJSON = obj => {
	obj = obj || {}
	return Object.keys(obj).reduce((acc,key) => {
		if (/\./.test(key)) {
			const props = key.split('.')
			const chainProp = (obj, props, val) => {
				const [prop,...rest] = props
				const arrayIdx = ((prop.match(/\[[0-9]*\]/) || [])[0] || 'no').replace(/[[\]]/g,'')*1
				const isArray = !isNaN(arrayIdx)

				if (isArray) {
					const arrayName = prop.split('[')[0]
					if (!obj[arrayName]) 
						obj[arrayName] = []

					if (rest.some(x => x)) {
						if (!obj[arrayName][arrayIdx])
							obj[arrayName][arrayIdx] = {}
						chainProp(obj[arrayName][arrayIdx], rest, val)
					}
					else 
						obj[arrayName][arrayIdx] = val
				} else {
					if (!obj[prop])
						obj[prop] = {}
					if (rest.some(x => x)) 
						chainProp(obj[prop], rest, val)
					else 
						obj[prop] = val
				}
			}
			chainProp(acc, props, obj[key])
		} else
			acc[key] = obj[key]
		return acc
	}, {})
}

/**
 * Gets the value for that prop. 
 * 
 * @param  {Object} obj		e.g., { name:'Nic', friends:[{ name:'Michael' }], events:[['hello'],['world']] }
 * @param  {String} prop	e.g., 'name', or 'friends[0]' or 'events[1][0]'
 * 
 * @return {Object} value	e.g., 'Nic', { name:'Michael' }, 'world' 
 */
const _getPropValue = (obj, prop) => {
	if (!prop)
		return obj 
	const arrayPositions = prop.match(/\[(.*?)\]/g)
	if (arrayPositions) {
		const p = prop.match(/^(.*?)\[/)[1]
		let value = p ? obj[p] : obj
		for (let i=0,l=arrayPositions.length;i<l;i++) {
			const idx = arrayPositions[i].replace(/(^.|.$)/g,'')
			value = (value||[])[idx]
		}
		return value
	} else
		return obj[prop]
}

export const exists_any = existsAny
export const exists_all = existsAll
export const is_empty = isEmpty
export const is_obj = isObj
export const get_type = getType
export const set_property = setProperty
export const get_property = getProperty
export const extract_flattened_json = extractFlattenedJSON
