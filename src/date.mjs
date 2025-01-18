/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- add_days
	- add_hours
	- add_minutes
	- add_months
	- add_seconds
	- add_years
	- addDays
	- addHours
	- addMinutes
	- addMonths
	- addSeconds
	- addYears
	- format_date
	- formatDate
	- get_timediff
	- getTimeDiff
	- to_tz
	- toTz
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

const timezone_date = (date, tz) => {
	const tz_date_string = new Intl.DateTimeFormat('en-GB',{ 
		timeZone:tz, 
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false 
	}).format(date)

	const ms = date.getUTCMilliseconds()

	const [,day,month,year,hour,min,sec] = tz_date_string.match(/^([0-9]{2})\/([0-9]{2})\/([0-9]{4}),\s([0-9]{2}):([0-9]{2}):([0-9]{2})/)
	return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}.${ms}Z`)
}

const add_zero = val => val < 10 ? `0${val}` : val
const add_double_zero = val => val < 10 ? `00${val}` : val < 100 ? `0${val}` : val

export const toTz = (date, tz) => {
	if (!date)
		return null

	let d = date instanceof Date ? date : new Date(date)
	if (isNaN(d))
		throw new Error(`'${date}' is not a valid date`)

	if (!tz || tz == 'utc' || tz == 'UTC')
		return d
	else if (tz == 'local') {
		const year = d.getFullYear()
		const month = add_zero(d.getMonth() + 1)
		const day = add_zero(d.getDate())
		const hours = add_zero(d.getHours())
		const minutes = add_zero(d.getMinutes())
		const seconds = add_zero(d.getSeconds())
		const milliseconds = add_double_zero(d.getMilliseconds())
		return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`)
	} else
		return timezone_date(d,tz)
}

/**
 * Convert a date into a specific short date string format
 * 
 * @param	{Date}		date			e.g., 2018-11-22T00:00:00.000Z
 * @param	{Object}	options.format	Default 'yyyy-MM-dd'
 * @param	{String}	options.tz		Default 'utc'. Valid values: 'utc', 'UTC', 'local', 'Australia/Sydney' ... IANA codes (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 * 
 * @return {String}         			e.g., 2018-11-22
 */
export const formatDate = (date, options={}) => {
	if (!date)
		return null

	let d = date instanceof Date ? date : new Date(date)
	if (isNaN(d))
		throw new Error(`'${date}' is not a valid date`)

	const { format='yyyy-MM-dd', tz } = options || {}
	const use_utc = !tz || tz == 'utc' || tz == 'UTC'
	const use_local = tz == 'local'
	let use_tz = use_utc
	if (!use_utc && !use_local) {
		use_tz = true
		d = timezone_date(d, tz)
	}

	let year = use_tz ? d.getUTCFullYear() : d.getFullYear()
	let year2digits = `${year}`.substring(2,4)
	let month = (use_tz ? d.getUTCMonth() : d.getMonth()) + 1
	let monthName = MONTH_NAMES[month-1]
	let day = use_tz ? d.getUTCDate() : d.getDate()
	let nth = NTH_DAY[day] || 'th'
	let hours = use_tz ? d.getUTCHours() : d.getHours()
	let minutes = use_tz ? d.getUTCMinutes() : d.getMinutes()
	let seconds = use_tz ? d.getUTCSeconds() : d.getSeconds()

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

export const add_days = addDays
export const add_months = addMonths
export const add_years = addYears
export const add_hours = addHours
export const add_minutes = addMinutes
export const add_seconds = addSeconds
export const to_tz = toTz
export const format_date = formatDate
export const get_timediff = getTimeDiff




