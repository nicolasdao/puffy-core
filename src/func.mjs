/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- chainAsync
	- chainSync
*/

import { catchErrors, PuffyResponse, wrapErrorsFn } from './error.mjs'

export const chainAsync = (...fns) => catchErrors((async () => {
	const e = wrapErrorsFn('\'chainAsync\' function failed')
	const l = fns.length
	const data = new Array(l)
	for (let i=0;i<l;i++) {
		const fn = fns[i]
		const t = typeof(fn)
		if (t != 'function')
			throw e(`Wrong argument exception. Function 'chainAsync' only accept arguments of type 'function'. Found ${t} in argument ${i} instead.`)
		const resp = await fn(data[i-1])
		if (!resp)
			data[i] = resp
		else if (resp instanceof PuffyResponse) {
			const [errors, result] = resp
			if (errors)
				throw e(errors)
			data[i] = result
		} else 
			data[i] = resp
	}

	return {
		data,
		value: data[l-1]
	}
})())

export const chainSync = (...fns) => catchErrors(() => {
	const e = wrapErrorsFn('\'chainAsync\' function failed')
	const l = fns.length
	const data = new Array(l)
	for (let i=0;i<l;i++) {
		const fn = fns[i]
		const t = typeof(fn)
		if (t != 'function')
			throw e(`Wrong argument exception. Function 'chainAsync' only accept arguments of type 'function'. Found ${t} in argument ${i} instead.`)
		const resp = fn(data[i-1])
		if (!resp)
			data[i] = resp
		else if (resp instanceof PuffyResponse) {
			const [errors, result] = resp
			if (errors)
				throw e(errors)
			data[i] = result
		} else 
			data[i] = resp
	}

	return {
		data,
		value: data[l-1]
	}
})