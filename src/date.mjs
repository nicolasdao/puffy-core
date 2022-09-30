/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- addDays
	- addHours
	- addMinutes
	- addMonths
	- addSeconds
	- addYears
	- formatDate
*/

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const NTH_DAY = {
	1: 'st',
	21: 'st',
	31: 'st', 
	2: 'nd', 
	22: 'nd', 
	3: 'rd', 
	23: 'rd'
}

export const addDays = (d, v=0) => {
	const t = new Date(d)
	t.setDate(d.getDate() + v)
	return t
}

export const addMonths = (d, v=0) => {
	const t = new Date(d)
	t.setMonth(d.getMonth() + v)
	return t
}

export const addYears = (d, v=0) => {
	const t = new Date(d)
	t.setYear(d.getFullYear() + v)
	return t
}

export const addHours = (d, v=0) => {
	const t = new Date(d)
	t.setHours(d.getHours() + v)
	return t
}

export const addMinutes = (d, v=0) => {
	const t = new Date(d)
	t.setMinutes(d.getMinutes() + v)
	return t
}

export const addSeconds = (d, v=0) => {
	const t = new Date(d)
	t.setSeconds(d.getSeconds() + v)
	return t
}

/**
 * Convert a date into a specific short date string format
 * 
 * @param  {Date} 	 date    			e.g., 2018-11-22T00:00:00.000Z
 * @param  {Object}  options.format 	Default 'yyyy-MM-dd'
 * @param  {Boolean} options.utc 		Default false
 * @return {String}         			e.g., 2018-11-22
 */
export const formatDate = (date, options={}) => {
	if (!date)
		return null

	let d = date instanceof Date ? date : new Date(date)
	if (isNaN(d))
		throw new Error(`'${date}' is not a valid date`)

	const useUTC = options && options.utc

	const year = useUTC ? d.getUTCFullYear() : d.getFullYear()
	const year2digits = `${year}`.substring(2,4)
	let month = (useUTC ? d.getUTCMonth() : d.getMonth()) + 1
	const monthName = MONTH_NAMES[month-1]
	let day = useUTC ? d.getUTCDate() : d.getDate()
	const nth = NTH_DAY[day] || 'th'
	let hours = useUTC ? d.getUTCHours() : d.getHours()
	let minutes = useUTC ? d.getUTCMinutes() : d.getMinutes()
	let seconds = useUTC ? d.getUTCSeconds() : d.getSeconds()

	if (month < 10)
		month = `0${month}`
	if (day < 10)
		day = `0${day}`
	if (hours < 10)
		hours = `0${hours}`
	if (minutes < 10)
		minutes = `0${minutes}`
	if (seconds < 10)
		seconds = `0${seconds}`

	const format = (options || {}).format || 'yyyy-MM-dd'
	return format
		.replace('yyyy', year)
		.replace('MMM', monthName)
		.replace('yy', year2digits)
		.replace('MM', month)
		.replace('dd', day)
		.replace('HH', hours)
		.replace('mm', minutes)
		.replace('ss', seconds)
		.replace('{nth}', nth)
}

/**
 * Gets the ellapsed time between two dates.
 * 
 * @param  {Date|String|Number}	date01	
 * @param  {Date|String|Number}	date02	
 * @param  {String}				unit		Default 'ms'. Valid units: 'ms', 'millisecond', 'sec', 's', 'second', 'm', 'min', 'minute', 'h', 'hour', 'd', 'day', 'w', 'week', 'm', 'month', 'y', 'year'
 * @return {[type]}        [description]
 */
export const getTimeDiff = (date01, date02, unit='ms') => {
	const d1 = new Date(date01)
	const d2 = new Date(date02)
	if (isNaN(d1))
		throw new Error(`date01 (${date01}) is not a valid date`)
	if (isNaN(d2))
		throw new Error(`date02 (${date02}) is not a valid date`)

	const diff = Math.abs(d1.getTime() - d2.getTime())
	const u = `${unit}`.toLowerCase().trim()
	if (u == 'ms' || u == 'millisecond')
		return diff
	else if (u == 's' || u == 'sec' || u == 'second')
		return diff/1000
	else if (u == 'm' || u == 'min' || u == 'minute')
		return diff/1000/60
	else if (u == 'h' || u == 'hour')
		return diff/1000/60/60
	else if (u == 'd' || u == 'day')
		return diff/1000/60/60/24
	else if (u == 'w' || u == 'week')
		return diff/1000/60/60/24/7
	else if (u == 'month')
		return diff/1000/60/60/24/30.41
	else if (u == 'y' || u == 'year')
		return diff/1000/60/60/24/365
	else
		throw new Error(`unit '${unit}' is not supported`)
}






