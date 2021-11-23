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
import { batch, uniq, headTail, sortBy, seed, levelUp, flatten, flattenUniq } from '../src/collection.mjs'

describe('collection', () => {
	describe('.batch', () => {
		it('01 - Should group array items in smaller batches.', () => {
			const batches = batch([1,2,3,4,5,6,7,8,9,10], 3)
			assert.equal(batches.length, 4)
			assert.equal(batches[0].length, 3)
			assert.equal(batches[0][0], 1)
			assert.equal(batches[0][1], 2)
			assert.equal(batches[0][2], 3)
			assert.equal(batches[1].length, 3)
			assert.equal(batches[1][0], 4)
			assert.equal(batches[1][1], 5)
			assert.equal(batches[1][2], 6)
			assert.equal(batches[2].length, 3)
			assert.equal(batches[2][0], 7)
			assert.equal(batches[2][1], 8)
			assert.equal(batches[2][2], 9)
			assert.equal(batches[3].length, 1)
			assert.equal(batches[3][0], 10)
		})
	})
	describe('.uniq', () => {
		it('01 - Should remove duplicated items from array.', () => {
			const data = uniq([1,2,3,4,2,1,7,8,1,10])
			assert.equal(data.length, 7)
			assert.equal(data[0], 1)
			assert.equal(data[1], 2)
			assert.equal(data[2], 3)
			assert.equal(data[3], 4)
			assert.equal(data[4], 7)
			assert.equal(data[5], 8)
			assert.equal(data[6], 10)
		})
		it('02 - Should remove duplicated items from array using an identity function.', () => {
			const data = uniq([{ name:'nic', age:40 }, { name:'brendan', age:33 }, { name:'boris', age:34 }, { name:'nic', age:40 }], x => x.name)
			assert.equal(data.length, 3)
			assert.equal(data[0].name, 'nic')
			assert.equal(data[1].name, 'brendan')
			assert.equal(data[2].name, 'boris')
		})
	})
	describe('.headTail', () => {
		it('01 - Should break down an array between its head and its tail using an arbitrary head size.', () => {
			const data = headTail([1,2,3,4,2,1,7,8,1,10], 3)
			assert.equal(data.length, 2)
			assert.equal(data[0].length, 3)
			assert.equal(data[0][0], 1)
			assert.equal(data[0][1], 2)
			assert.equal(data[0][2], 3)
			assert.equal(data[1].length, 7)
			assert.equal(data[1][0], 4)
			assert.equal(data[1][1], 2)
			assert.equal(data[1][2], 1)
			assert.equal(data[1][3], 7)
			assert.equal(data[1][4], 8)
			assert.equal(data[1][5], 1)
			assert.equal(data[1][6], 10)
		})
	})
	describe('.sortBy', () => {
		it('01 - Should sort an array by ascending or descending order.', () => {
			const data01 = sortBy([1,2,3,4,2,1,7,8,1,10])
			assert.equal(data01.length, 10)
			assert.equal(data01[0], 1)
			assert.equal(data01[1], 1)
			assert.equal(data01[2], 1)
			assert.equal(data01[3], 2)
			assert.equal(data01[4], 2)
			assert.equal(data01[5], 3)
			assert.equal(data01[6], 4)
			assert.equal(data01[7], 7)
			assert.equal(data01[8], 8)
			assert.equal(data01[9], 10)
			const data02 = sortBy([1,2,3,4,2,1,7,8,1,10], 'desc')
			assert.equal(data02.length, 10)
			assert.equal(data02[9], 1)
			assert.equal(data02[8], 1)
			assert.equal(data02[7], 1)
			assert.equal(data02[6], 2)
			assert.equal(data02[5], 2)
			assert.equal(data02[4], 3)
			assert.equal(data02[3], 4)
			assert.equal(data02[2], 7)
			assert.equal(data02[1], 8)
			assert.equal(data02[0], 10)
		})
		it('02 - Should sort an array by ascending or descending order based on a identity function.', () => {
			const data = [{ name:'Boris', age:34 },{ name:'Nic', age:40 },{ name:'Brendan', age:33 }]
			const data01 = sortBy(data, x => x.age)
			assert.equal(data01.length, 3)
			assert.equal(data01[0].name, 'Brendan')
			assert.equal(data01[1].name, 'Boris')
			assert.equal(data01[2].name, 'Nic')
			const data02 = sortBy(data, x => x.age, 'desc')
			assert.equal(data02.length, 3)
			assert.equal(data02[2].name, 'Brendan')
			assert.equal(data02[1].name, 'Boris')
			assert.equal(data02[0].name, 'Nic')
		})
	})
	describe('.seed', () => {
		it('01 - Should generates arbitrary empty arrays.', () => {
			assert.equal(seed(3).length, 3)
			assert.equal(seed(20).length, 20)
		})
	})
	describe('.levelUp', () => {
		it('01 - Should level up a collection of arrays so they all have the same size (tail with undefined to make match size).', () => {
			const data = levelUp([1,2,3,4,5],[7,7,7,7,7,7,7,7,7,7,7,7])
			assert.equal(data.length, 2)
			assert.equal(data[0].length, 12)
			assert.equal(data[0].filter(a=>a).join(''), '12345')
			assert.equal(data[1].length, 12)
			assert.equal(data[1].filter(a=>a).join(''), '777777777777')
		})
	})
	describe('.flatten', () => {
		it('01 - Should merge and flatten collection or arrays and nested arrays.', () => {
			const data = flatten(1,[1,2,3],[4,5,[6,7]],8,9)
			assert.equal(data.length, 10)
			assert.equal(data.join(''), '1123456789')
		})
	})
	describe('.flattenUniq', () => {
		it('01 - Should merge and flatten collection or arrays and nested arrays and remove duplicated items.', () => {
			const data = flattenUniq(1,[1,2,3],[4,5,[6,7]],8,6)
			assert.equal(data.length, 8)
			assert.equal(data.join(''), '12345678')
		})
	})
})









