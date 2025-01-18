/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- get_url_parts
	- getUrlParts
*/


/**
 * Breaks down a URL's parts. (e.g., getUrlParts(window.location.href))
 * 
 * @param  {String} url						e.g., 'https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ.woff2?name=nic&age=40'
 * 
 * @return {String} parts.href				'https://fonts.gstatic.com/s/materialicons/v70/flUhRq6tzZclQEJ.woff2'
 * @return {String} parts.origin			'https://fonts.gstatic.com'
 * @return {String} parts.protocol			'https:'
 * @return {String} parts.username			''
 * @return {String} parts.password			''
 * @return {String} parts.host				'fonts.gstatic.com'
 * @return {String} parts.hostname			'fonts.gstatic.com'
 * @return {String} parts.port				''
 * @return {String} parts.pathname			'/s/materialicons/v70/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
 * @return {String} parts.search			'?name=carl&age=40'
 * @return {String} parts.searchParams		URLSearchParams {}
 * @return {Object} parts.queryParams       e.g., { name: 'carl', age: '40' }
 * @return {String} parts.hash				''
 * @return {String} parts.ext				'.woff2'
 */
export const getUrlParts = url => {
	const parts = new URL(url)
	parts.ext = null 
	if (parts.pathname)
		parts.ext = (parts.pathname.match(/\.([^.]*?)$/)||[])[0] || null 

	parts.queryParams = {}
	if (parts.searchParams && parts.searchParams.entries) {
		for (const [key, value] of parts.searchParams.entries())
			parts.queryParams[key] = value
	}

	return parts
}

export const get_url_parts = getUrlParts