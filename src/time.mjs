/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- delay
	- Timer
*/

const SECOND = 1000
const MINUTE = 60*SECOND
const HOUR = 60*MINUTE

/**
 * Creates an empty promise that returns after a certain delay. This promise also contain an extra API called 'cancel' which allows to
 * cancel the execution of that promise (e.g., p.cancel())
 * 
 * @param  {Number|[Number]} 	timeout 	Default 100ms. If array, it must contain 2 numbers representing an interval used to select a random number
 * @param  {Object}				resp		Response object returned when the timeout is over.
 * 
 * @return {Promise}			promise		(1) Cancellable promise
 *
 * (1) Example:
 * 		const d = delay(3000)
 *   	d.cancel()
 */
export const delay = (timeout, resp) => {
	let tRef
	let finished = false
	let output = Promise.resolve(null).then(() => {
		let t = timeout || 100
		if (Array.isArray(timeout)) {
			if (timeout.length != 2)
				throw new Error('Wrong argument exception. When \'timeout\' is an array, it must contain exactly 2 number items.')

			const start = timeout[0] * 1
			const end = timeout[1] * 1

			if (isNaN(start))
				throw new Error(`Wrong argument exception. The first item of the 'timeout' array is not a number (current: ${timeout[0]})`)

			if (isNaN(end))
				throw new Error(`Wrong argument exception. The second item of the 'timeout' array is not a number (current: ${timeout[1]})`)

			if (start > end)
				throw new Error(`Wrong argument exception. The first number of the 'timeout' array must be strictly smaller than the second number (current: [${timeout[0]}, ${timeout[1]}])`)			

			t = _getRandomNumbers({ start, end })
		}
		
		return new Promise(onSuccess => {
			tRef = setTimeout(() => {
				finished = true
				onSuccess(resp)
			}, t)
		})
	})

	output.cancel = () => {
		if (!finished)
			clearTimeout(tRef) 
	}

	return output
}

/**
 * const timer = new Timer()
 * timer.start()
 * console.log(`Ellapsed time is ${timer.time()}ms`)
 */
export const Timer = function() {
	let _start = Date.now()
	this.start = () => _start = Date.now()
	/**
	 * Gets the ellasped time.
	 * 
	 * @param  {String}  unit		Default 'ms'. Allowed values: 'millisecond', 'ms', 'second', 's', 'sec', 'minute', 'min', 'm', 'hour', 'h', 'hrs'
	 * @param  {Boolean} restart	Default false. True means the time is restarted.
	 * 
	 * @return {Number}  time		Ellapsed time since the timer was last started/restarted.
	 */
	this.time = (unit, restart) => {
		const n = Date.now()
		const ellapsedMs = n - (_start || n)
		
		if (restart)
			_start = Date.now()

		if (!unit || unit == 'millisecond' || unit == 'ms')
			return ellapsedMs
		else if (unit == 'second' || unit == 's' || unit == 'sec')
			return (ellapsedMs/SECOND).toFixed(2)*1
		else if (unit == 'minute' || unit == 'm' || unit == 'min')
			return (ellapsedMs/MINUTE).toFixed(2)*1
		else if (unit == 'hour' || unit == 'h' || unit == 'hrs')
			return (ellapsedMs/HOUR).toFixed(2)*1
		else
			throw new Error(`Wrong argument exception. Unit '${unit}' is unknown. Valid units are: 'millisecond', 'second', 'minute' and 'hour'.`)
	}
	this.reStart = () => _start = Date.now()
	return this
}

const _getRandomNumber = ({ start, end }) => {
	const endDoesNotExist = end === undefined
	if (start == undefined && endDoesNotExist)
		return Math.random()
	
	const _start = start >= 0 ? Math.round(start) : 0
	const _end = end >= 0 ? Math.round(end) : 0
	const size = endDoesNotExist ? _start : (_end - _start)
	const offset = endDoesNotExist ? 0 : _start
	return offset + Math.floor(Math.random() * size)
}

const _getRandomNumbers = ({ start, end, size }) => {
	const _start = start >= 0 ? Math.round(start) : 0
	const _end = end >= 0 ? Math.round(end) : 0
	const _size = _start <= _end ? (_end - _start) : 0
	size = size || 0
	if (size > _size)
		throw new Error(`Wrong argument exception. The interval [${_start}, ${_end}] does not contain enough elements to return ${size} random numbers`)
	
	if (size <= 0 || _size <= 0)
		return [_getRandomNumber({ start: _start, end: _end })]

	const _series = _seed(_size).map((_,idx) => idx)
	return _seed(size).reduce((acc) => {
		const index = _getRandomNumber({ start: 0, end: acc.s })
		acc.data.push(_start + _series[index])
		_series.splice(index,1) // remove that number
		acc.s-- 
		return acc
	}, { data: [], s: _size }).data
}


const _seed = (size=0) => Array.apply(null, Array(size))

