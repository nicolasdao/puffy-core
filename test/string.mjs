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
import { plural } from '../src/string.mjs'

describe('string', () => {
	describe('.plural', () => {
		it('01 - Should pluralize words if there is more than one.', () => {
			assert.equal(plural('cat', 1), 'cat')
			assert.equal(plural('cat', 2), 'cats')
			assert.equal(plural('city', 1), 'city')
			assert.equal(plural('city', 2), 'cities')
			assert.equal(plural('City', 2), 'Cities')
			assert.equal(plural('is', 1), 'is')
			assert.equal(plural('is', 2), 'are')
			assert.equal(plural('he is', 1), 'he is')
			assert.equal(plural('he is', 2), 'they are')
			assert.equal(plural('He is', 2), 'They are')
			assert.equal(plural('She is', 2), 'They are')
		})
	})
})









