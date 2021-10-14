/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

// To skip a test, either use 'xit' instead of 'it', or 'describe.skip' instead of 'describe'.
// To only run a test, use 'it.only' instead of 'it'.

import { assert } from 'chai'
import { getUrlParts } from '../src/url.mjs'

describe('url', () => {
	describe('.getUrlParts', () => {
		it('01 - Should do something', () => {
			const data = getUrlParts('https://localhost:3456/hello/world?name=carl&age=40#home')
			assert.equal(data.origin, 'https://localhost:3456')
			assert.equal(data.protocol, 'https:')
			assert.equal(data.host, 'localhost:3456')
			assert.equal(data.hostname, 'localhost')
			assert.equal(data.port, '3456')
			assert.equal(data.pathname, '/hello/world')
			assert.equal(data.search, '?name=carl&age=40')
			assert.equal(data.queryParams.name, 'carl')
			assert.equal(data.queryParams.age, '40')
			assert.equal(data.hash, '#home')
		})
	})
})








