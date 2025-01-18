/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- batch
	- flatten
	- flatten_uniq
	- flattenUniq
	- head_tail
	- headTail
	- level_up
	- levelUp
	- seed
	- sort_by
	- sortBy
	- uniq
*/

/**
 * Breaks down an array in a collection of array of size 'batchSize'.
 * 
 * @param  {Array}  col       Initial collection (e.g. [1,2,3,4,5])
 * @param  {Number} batchSize Size of each batch (e.g. 2)
 * @return {Array}           collection of array of size 'batchSize' (e.g. [[1,2], [3,4], [5]]).
 */
export const batch = (col, batchSize=1) => {
	const l = (col || []).length-1
	return l < 0 ? [] : col.reduce((acc,item,idx) => {
		acc.current.value.push(item)
		acc.current.size++
		if (acc.current.size == batchSize || idx == l) {
			acc.result.push(acc.current.value)
			acc.current = { value:[], size:0 }
		}
		return acc
	},{ result:[], current: { value:[], size:0 } }).result
}

/**
 * Breaks down an array into an array with 2 items:
 * 	[0]: Head of size 'headSize' (default 'headSize' is 1)
 * 	[1]: The rest of the items
 * 	
 * @param  {Array}   a        	Original array
 * @param  {Number} headSize 	Default 1
 * @return {Array}           	Array of length 2
 */
export const headTail = (a, headSize=1) => (a || []).reduce((acc, v, idx) => {
	idx < headSize ? acc[0].push(v) : acc[1].push(v)
	return acc
}, [[],[]])

/**
 * Removes duplicate items from array. 
 * 
 * @param  {[Object]} arr  		Array of items
 * @param  {Function} fn 		Optional. Default x => x. Function used to pick a property used to define identity.
 * @return {[Object]} output    Array 'a' with unique items.
 */
export const uniq = (arr, fn) => {
	fn = fn || (x => x)
	arr = arr || []
	return arr.reduce((a,obj) => {
		const key = fn(obj)
		if (!a.keys[key]) {
			a.keys[key] = true 
			a.value.push(obj)
		}

		return a
	}, { keys:{}, value:[] }).value
}

export const sortBy = (obj, ...args) => {
	const l = args.length
	const fn = !l || typeof(args[0]) != 'function' ? (x => x) : args[0]
	const dir = l == 1 && typeof(args[0]) == 'string' ? args[0] : l == 2 && typeof(args[1]) == 'string' ? args[1] : 'asc'

	return Array.isArray(obj) ? _arraySortBy(obj, fn, dir == 'desc' ? 'desc' : 'asc') : _objectSortBy(obj, fn, dir == 'desc' ? 'desc' : 'asc')
}

export const seed = (size=0) => Array.apply(null, Array(size))

export const levelUp = (...collections) => {
	if (collections.length == 0)
		return []

	const lengths = collections.filter(col => col && col.length).map(col => col.length)
	if (lengths.length == 0)
		return collections
	
	const maxLength = Math.max(...collections.filter(col => col && col.length).map(col => col.length))

	return collections.map(col => {
		const l = (col || []).length
		if (l == 0) {
			return seed(maxLength)
		}
		if (l == maxLength)
			return col 

		const diff = maxLength - l
		return [...col, ...seed(diff)]
	})
}

const _flatten = options => (...args) => {
	const { noduplicate } = options||{}
	const results = []
	for (let i=0;i<args.length;i++) {
		const obj = args[i]
		if (Array.isArray(obj))
			results.push(...flatten(...obj))
		else
			results.push(obj)
	}

	return noduplicate ? Array.from(new Set(results)) : results
}

export const flatten = _flatten()
export const flattenUniq = _flatten({ noduplicate:true })

const _objectSortBy = (obj, fn = x => x, dir='asc') => Object.keys(obj || {})
	.map(key => ({ key, value: obj[key] }))
	.sort((a,b) => {
		const vA = fn(a.value)
		const vB = fn(b.value)
		if (dir == 'asc') {
			if (vA < vB)
				return -1
			else if (vA > vB)
				return 1
			else
				return 0
		} else {
			if (vA > vB)
				return -1
			else if (vA < vB)
				return 1
			else
				return 0
		}
	}).reduce((acc,v) => {
		acc[v.key] = v.value
		return acc
	}, {})

const _arraySortBy = (arr, fn = x => x, dir='asc') => (arr || []).sort((a,b) => {
	const vA = fn(a)
	const vB = fn(b)
	if (dir == 'asc') {
		if (vA < vB)
			return -1
		else if (vA > vB)
			return 1
		else
			return 0
	} else {
		if (vA > vB)
			return -1
		else if (vA < vB)
			return 1
		else
			return 0
	}
})

export const flatten_uniq = flattenUniq
export const head_tail = headTail
export const level_up = levelUp
export const sort_by = sortBy
