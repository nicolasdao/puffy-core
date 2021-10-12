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
import { avg, stdDev, median } from '../src/math.js'

describe('math', () => {
	describe('.avg', () => {
		it('01 - Should calculate the average of an array of numbers.', () => {
			assert.equal(avg([5,5,5,5,5]), 5)
			assert.equal(avg([1,2,3,4]), 2.5)
		})
		it('02 - Should calculate the average of an array of object when an identity function is specified.', () => {
			assert.equal(avg([{ name:'Nic', age:40 },{ name:'Lin', age:30 }], x => x.age), 35)
		})
	})
	describe('.stdDev', () => {
		it('01 - Should calculate the standard deviation of an array of numbers.', () => {
			assert.equal(stdDev([5,5,5,5,5]), 0)
			assert.equal(stdDev([1,2,3,4]), 1.118033988749895)
		})
		it('02 - Should calculate the standard deviation of an array of object when an identity function is specified.', () => {
			assert.equal(stdDev([{ name:'Nic', age:40 },{ name:'Lin', age:30 }], x => x.age), 5)
		})
	})
	describe('.median', () => {
		it('01 - Should calculate the median of an array of numbers.', () => {
			assert.equal(median([5,5,5,5,5]), 5)
			assert.equal(median([1,2,3,4]), 2.5)
		})
		it('02 - Should calculate the median of an array of object when an identity function is specified.', () => {
			assert.equal(median([{ name:'Nic', age:40 },{ name:'Lin', age:30 }], x => x.age), 35)
		})
	})
})









