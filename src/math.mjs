/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- avg
	- stdDev
	- median
	- getRandomNumber
	- getRandomNumbers
	- percentile
*/

/**
 * Calculates the average of a specific field on an array objects
 * 
 * @param  {Array}   	arr 	e.g. [{ name: 'Nic', age: 36 }, { name: 'Boris', age: 30 }]
 * @param  {Function} 	fn  	e.g. x => x.age
 * @return {Number}       		e.g. 33
 */
export const avg = (arr=[], fn) => {
	if (arr.length == 0) 
		return null 
	const f = fn || (x => x) 
	return arr.reduce((a,v) => a + f(v), 0)/arr.length
}

/**
 * Calculates the standard deviation of a specific field on an array objects
 * 
 * @param  {Array}   	arr 	e.g. [{ name: 'Nic', age: 36 }, { name: 'Boris', age: 30 }]
 * @param  {Function} 	fn  	e.g. x => x.age
 * @return {Number}       		e.g. 33
 */
export const stdDev = (arr=[], fn) => {
	if (arr.length == 0) 
		return null
	const f = fn || (x => x)
	const { result, resultSquare } = arr.reduce((a,v) => {
		const val = f(v)
		return { result: a.result + val, resultSquare: a.resultSquare + Math.pow(val,2) }
	}, { result:0, resultSquare:0 })

	const l = arr.length
	return Math.sqrt((resultSquare/l) - Math.pow((result/l), 2))
}

/**
 * Calculates the median of a specific field on an array objects
 * 
 * @param  {Array}   	arr 	e.g. [{ name: 'Nic', age: 36 }, { name: 'Boris', age: 30 }]
 * @param  {Function} 	fn  	e.g. x => x.age
 * @return {Number}       		e.g. 33
 */
export const median = (arr=[], fn) => {
	const f = fn || (x => x)
	const l = arr.length
	if (l == 0)
		return 0
	// odd length
	else if (l & 1) 
		return arr.map(x => f(x)).sort((a,b) => a-b)[Math.floor(l/2)]
	// even length
	else {
		const idx_1 = Math.floor(l/2)
		const idx_0 = idx_1 - 1
		const a = arr.map(x => f(x)).sort((a,b) => a-b)
		return (a[idx_0] + a[idx_1])/2
	}
}

/**
 * High-order function that helps to calculate percentile of a specific field on an array objects.
 * NOTES: Uses the nearest-rank algorithm (https://en.wikipedia.org/wiki/Percentile#The_nearest-rank_method)
 * 
 * @param  {Number}   	nth		Nth percentile
 * 
 * @return {Function}
 */
export const percentile = nth => {
	if (nth === undefined || nth === null)
		throw new Error('Missing required argument \'nth\'')
	if (isNaN(nth*1))
		throw new Error(`Wrong argument exception. 'nth' is expected to be a number. Found \`${nth}\` instead.`)
	
	nth = Math.round(nth*1)

	if (nth < 0 || nth > 100)
		throw new Error(`Wrong argument exception. 'nth' must be a value between 0 and 100. Found \`${nth}\` instead.`)

	const factor = nth/100

	/**
	 * Calculates the nth percentile of a collection using an optional mapping function.
	 * NOTES: Uses the nearest-rank algorithm (https://en.wikipedia.org/wiki/Percentile#The_nearest-rank_method)
	 * 
	 * @param  {Array}   	arr 	e.g. [{ name: 'Nic', age: 36 }, { name: 'Boris', age: 30 }]
	 * @param  {Function} 	fn  	e.g. x => x.age
	 * @return {Number}       		e.g. 33
	 */
	return (arr=[], fn) => {
		const f = fn || (x => x)
		const l = arr.length
		if (l == 0)
			return 0

		const sortedAscArray = arr.map(x => f(x)).sort((a,b) => a-b)
		const index = factor == 0 ? 0 : Math.ceil(factor*l)-1

		return sortedAscArray[index]
	}
}

export const getRandomNumber = options => {
	let { start, end } = options || {}
	const endDoesNotExist = end === undefined
	if (start == undefined && endDoesNotExist)
		return Math.random()
	
	const _start = start >= 0 ? Math.round(start) : 0
	const _end = end >= 0 ? Math.round(end) : 0
	const size = endDoesNotExist ? _start : (_end - _start)
	const offset = endDoesNotExist ? 0 : _start
	return offset + Math.floor(Math.random() * size)
}

export const getRandomNumbers = options => {
	let { start, end, size } = options || {}
	const _start = start >= 0 ? Math.round(start) : 0
	const _end = end >= 0 ? Math.round(end) : 0
	const _size = _start <= _end ? (_end - _start) : 0
	size = size || 0
	if (size > _size)
		throw new Error(`Wrong argument exception. The interval [${_start}, ${_end}] does not contain enough elements to return ${size} random numbers`)
	
	if (size <= 0 || _size <= 0)
		return [getRandomNumber({ start: _start, end: _end })]

	const _series = _seed(_size).map((_,idx) => idx)
	return _seed(size).reduce((acc) => {
		const index = getRandomNumber({ start: 0, end: acc.s })
		acc.data.push(_start + _series[index])
		_series.splice(index,1) // remove that number
		acc.s-- 
		return acc
	}, { data: [], s: _size }).data
}

const _seed = (size=0) => Array.apply(null, Array(size))
