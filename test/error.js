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
import { catchErrors, wrapErrors, mergeErrors } from '../src/error.js'
											
describe('error', () => {
	describe('.catchErrors', () => {
		it('01 - Should never let an error in a synchrounous function interrupt the program', () => {

			const robustSyncFn = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02, '03')
			assert.isNotOk(result02 ,'04')
			assert.equal(errors02.length, 1, '05')
			assert.equal(errors02[0].message, 'Should fail', '06')
		})
		it('02 - Should never let an error in an asynchrounous function interrupt the program', async () => {

			const robustAsyncFn = (fail) => catchErrors((async () => {
				await Promise.resolve(null)
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})())

			const [errors01, result01] = await robustAsyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = await robustAsyncFn(true)

			assert.isOk(errors02, '03')
			assert.isNotOk(result02 ,'04')
			assert.equal(errors02.length, 1, '05')
			assert.equal(errors02[0].message, 'Should fail', '06')
		})
	})
	describe('.wrapErrors', () => {
		it('01 - Should stack all errors in a wrapping error', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw wrapErrors(errorMsg, errors)
				else
					return result
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02, '03')
			assert.isNotOk(result02 ,'04')
			assert.equal(errors02.length, 2, '05')
			assert.equal(errors02[0].message, 'robustSyncFn failed', '06')
			assert.equal(errors02[1].message, 'Should fail', '07')
		})
	})
	describe('.mergeErrors', () => {
		it('01 - Should merge all the stacked errors in a single error', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw wrapErrors(errorMsg, errors)
				else
					return result
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)
			const error = mergeErrors(errors02)

			assert.isOk(errors02, '03')
			assert.isNotOk(result02 ,'04')
			assert.equal(errors02.length, 2, '05')
			assert.equal(errors02[0].message, 'robustSyncFn failed', '06')
			assert.equal(errors02[1].message, 'Should fail', '07')
			assert.isOk(error, '08')
			assert.isOk(error instanceof Error, '09')
			assert.equal(error.message, 'robustSyncFn failed', '10')
			assert.isOk(error.stack, '11')
			assert.isOk(error.stack.indexOf('robustSyncFn failed') >= 0, '12')
			assert.isOk(error.stack.indexOf('Should fail') >= 0, '13')
		})
	})
})








