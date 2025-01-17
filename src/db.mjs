/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- newId
*/

const get_random_int = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

/**
 * Creates a unique BigInt id structured as follow: [Date.now][2 digits node][4 digits random number]
 * 
 * @param	{Object}	options
 * @param	{Date}			.timestamp	Default: new Date()
 * @param	{Number}		.node		Default: 0
 * @param	{Number}		.idx		Default: Random 4 digits
 * 
 * @return	{BigInt}	id
 */
export const newId = options => {
	let { timestamp, node=0, idx=null } = options || {}
	if (node < 0)
		node = 0
	else if (node > 99)
		node = 99

	const ts = timestamp || new Date()

	/* eslint-disable */
	const t = BigInt(ts.getTime())*BigInt(1000000)
	const n = BigInt(node)*BigInt(10000)
	let r = idx === null ? get_random_int(0, 9999) : idx
	if (r < 0)
		r = 0
	else if (r > 9999)
		r = 9999
	
	return t + n + BigInt(r)
	/* eslint-enable */
}