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
			assert.equal(plural(1, 'cat'), 'cat')
			assert.equal(plural(2, 'cat'), 'cats')
			assert.equal(plural(1, 'city'), 'city')
			assert.equal(plural(2, 'city'), 'cities')
			assert.equal(plural(2, 'City'), 'Cities')
			assert.equal(plural(1, 'is'), 'is')
			assert.equal(plural(2, 'is'), 'are')
			assert.equal(plural(1, 'he is'), 'he is')
			assert.equal(plural(2, 'he is'), 'they are')
			assert.equal(plural(2, 'He is'), 'They are')
			assert.equal(plural(2, 'She is'), 'They are')
		})
		it('02 - Should pluralize multiple words at a time.', () => {
			assert.equal(plural(1, 'Project', 'was'), 'Project was')
			assert.equal(plural(2, 'Project', 'was'), 'Projects were')
			assert.equal(plural(1, 'she', 'is'), 'she is')
			assert.equal(plural(2, 'She', 'is'), 'They are')
		})
	})
})









