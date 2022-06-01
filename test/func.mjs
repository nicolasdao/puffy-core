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
import { chainAsync, chainSync } from '../src/func.mjs'
import { catchErrors } from '../src/error.mjs'

describe('func', () => {
	describe('.chainAsync', () => {
		it('01 - Should chain asynchronous functions', async () => {

			const [errors, data] = await chainAsync(
				() => Promise.resolve(1),
				previous => Promise.resolve(previous+1),
				previous => previous+2,
				previous => catchErrors(Promise.resolve(previous+1)),
				previous => previous+3
			)

			assert.isNotOk(errors)
			assert.isOk(data)
			assert.isOk(data.data)
			assert.equal(data.data[0], 1)
			assert.equal(data.data[1], 2)
			assert.equal(data.data[2], 4)
			assert.equal(data.data[3], 5)
			assert.equal(data.data[4], 8)
			assert.equal(data.value, 8)
			
			// console.log(errors)
			// console.log(data)
		})
		it('02 - Should capture failures gracefully', async () => {

			const [errors, data] = await chainAsync(
				() => Promise.resolve(1),
				previous => Promise.resolve(previous+1).then(() => { throw new Error('Boom')})
			)

			assert.isOk(errors)
			assert.isNotOk(data)
			assert.isOk(errors[0])
			assert.equal(errors[0].message, 'Boom')
			
			// console.log(errors)
			// console.log(data)
		})
		it('03 - Should capture PuffyResponse failures gracefully', async () => {

			const [errors, data] = await chainAsync(
				() => Promise.resolve(1),
				previous => catchErrors(Promise.resolve(previous+1).then(() => { throw new Error('Boom')}))
			)

			assert.isOk(errors)
			assert.isNotOk(data)
			assert.isOk(errors[0])
			assert.equal(errors[0].message, '\'chainAsync\' function failed')
			assert.isOk(errors[1])
			assert.equal(errors[1].message, 'Boom')
			
			// console.log(errors)
			// console.log(data)
		})
	})
	describe('.chainSync', () => {
		it('01 - Should chain synchronous functions', () => {

			const [errors, data] = chainSync(
				() => 1,
				previous => previous+1,
				previous => previous+2
			)

			assert.isNotOk(errors)
			assert.isOk(data)
			assert.isOk(data.data)
			assert.equal(data.data[0], 1)
			assert.equal(data.data[1], 2)
			assert.equal(data.data[2], 4)
			assert.equal(data.value, 4)
			
			// console.log(errors)
			// console.log(data)
		})
		it('02 - Should capture failures gracefully', () => {

			const [errors, data] = chainSync(
				() => 1,
				() => { throw new Error('Boom') }
			)

			assert.isOk(errors)
			assert.isNotOk(data)
			assert.isOk(errors[0])
			assert.equal(errors[0].message, 'Boom')
			
			// console.log(errors)
			// console.log(data)
		})
		it('03 - Should capture PuffyResponse failures gracefully', () => {

			const [errors, data] = chainSync(
				() => 1,
				() => catchErrors(() => { throw new Error('Boom') })
			)

			assert.isOk(errors)
			assert.isNotOk(data)
			assert.isOk(errors[0])
			assert.equal(errors[0].message, '\'chainAsync\' function failed')
			assert.isOk(errors[1])
			assert.equal(errors[1].message, 'Boom')
			
			// console.log(errors)
			// console.log(data)
		})
	})
})







