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
import { catchErrors, wrapErrors, wrapErrorsFn, wrapCustomErrors, mergeErrors, getErrorMetadata, required } from '../src/error.mjs'
											
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
		}),
		it('03 - Should support async function', async () => {
			const robustAsyncFn = (fail) => catchErrors(async () => {
				await Promise.resolve(null)
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const [errors01, result01] = await robustAsyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = await robustAsyncFn(true)

			assert.isOk(errors02, '03')
			assert.isNotOk(result02 ,'04')
			assert.equal(errors02.length, 1, '05')
			assert.equal(errors02[0].message, 'Should fail', '06')
		}),
		it('04 - Should support wrapping the entire promise into a catch all error', async () => {

			const robustAsyncFn = (fail) => catchErrors('I have caught you damn error', async () => {
				await Promise.resolve(null)
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const [errors01, result01] = await robustAsyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = await robustAsyncFn(true)

			assert.isOk(errors02, '03')
			assert.isNotOk(result02 ,'04')
			assert.equal(errors02.length, 2, '05')
			assert.equal(errors02[0].message, 'I have caught you damn error', '06')
			assert.equal(errors02[1].message, 'Should fail', '07')
		}),
		it('05 - Should support wrapping the entire function into a catch all error', () => {

			const robustSyncFn = (fail) => catchErrors('I have caught you damn error', () => {
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
			assert.equal(errors02.length, 2, '05')
			assert.equal(errors02[0].message, 'I have caught you damn error', '06')
			assert.equal(errors02[1].message, 'Should fail', '07')
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
		it('02 - Should support an arbitrary amount of inputs, including both strings and Errors', () => {

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
					throw wrapErrors(errorMsg, 'this is another error', errors, new Error('I\'m an error too'), [new Error('We are errors')])
				else
					return result
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02)
			assert.isNotOk(result02)
			assert.equal(errors02.length, 5)
			assert.equal(errors02[0].message, 'robustSyncFn failed')
			assert.equal(errors02[1].message, 'this is another error')
			assert.equal(errors02[2].message, 'Should fail')
			assert.equal(errors02[3].message, 'I\'m an error too')
			assert.equal(errors02[4].message, 'We are errors')
		})
		it('03 - Should support single string input', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				robustSyncFn01(fail)
				throw wrapErrors(errorMsg)
			})

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02)
			assert.isNotOk(result02)
			assert.equal(errors02.length, 1)
			assert.equal(errors02[0].message, 'robustSyncFn failed')
		})
		it('04 - Should support single Error input', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				robustSyncFn01(fail)
				throw wrapErrors(new Error(errorMsg))
			})

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02)
			assert.isNotOk(result02)
			assert.equal(errors02.length, 1)
			assert.equal(errors02[0].message, 'robustSyncFn failed')
		})
		it('05 - Should support merging all the errors\' stacks into a single stack error', () => {

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
					throw wrapErrors(errorMsg, 'this is another error', errors, new Error('I\'m an error too'), [new Error('We are errors')], { merge:true })
				else
					return result
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02)
			assert.isNotOk(result02)
			assert.equal(errors02.length, 1)
			assert.isOk(errors02[0].stack.indexOf('robustSyncFn failed') >= 0)
			assert.isOk(errors02[0].stack.indexOf('this is another error') >= 0)
			assert.isOk(errors02[0].stack.indexOf('Should fail') >= 0)
			assert.isOk(errors02[0].stack.indexOf('I\'m an error too') >= 0)
			assert.isOk(errors02[0].stack.indexOf('We are errors') >= 0)
		})
		it('06 - Should support returning data even when an error is thrown', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				const [errors, result] = robustSyncFn01(fail)
				if (errors) {
					throw wrapErrors(errorMsg, 'this is another error', errors, new Error('I\'m an error too'), [new Error('We are errors')]).response('hello')
				}
				else
					return result
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02)
			assert.isOk(result02)
			assert.equal(result02, 'hello')
			assert.equal(errors02.length, 5)
			assert.equal(errors02[0].message, 'robustSyncFn failed')
			assert.equal(errors02[1].message, 'this is another error')
			assert.equal(errors02[2].message, 'Should fail')
			assert.equal(errors02[3].message, 'I\'m an error too')
			assert.equal(errors02[4].message, 'We are errors')
		})
	})
	describe('.wrapErrorsFn', () => {
		it('01 - Should stack all errors in a wrapping error', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const e = wrapErrorsFn('robustSyncFn failed')
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw e(errors)
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
		it('02 - Should support returning data even when an error is thrown', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw new Error('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const e = wrapErrorsFn('robustSyncFn failed')
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw e(errors).response('hello')
				else
					return result
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02, '03')
			assert.isOk(result02 ,'04')
			assert.equal(result02 ,'hello')
			assert.equal(errors02.length, 2, '05')
			assert.equal(errors02[0].message, 'robustSyncFn failed', '06')
			assert.equal(errors02[1].message, 'Should fail', '07')
		})
	})
	describe('.wrapCustomErrors', () => {
		it('01 - Should stack all errors in a wrapping error while adding custom metadata to the error', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw wrapCustomErrors({ id:456, code:897 })('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw wrapCustomErrors({ code:123 })(errorMsg, errors)
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
			assert.isOk(errors02[0].metadata, '08')
			assert.equal(errors02[0].metadata.code, 123, '09')
			assert.isOk(errors02[1].metadata, '10')
			assert.equal(errors02[1].metadata.id, 456, '11')
			assert.equal(errors02[1].metadata.code, 897, '12')
		})
		it('02 - Should support returning data even when an error is thrown', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw wrapCustomErrors({ id:456, code:897 })('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw wrapCustomErrors({ code:123 })(errorMsg, errors).response('hello')
				else
					return result
			})

			const [errors01, result01] = robustSyncFn()

			assert.isNotOk(errors01, '01')
			assert.equal(result01, 123 ,'02')

			const [errors02, result02] = robustSyncFn(true)

			assert.isOk(errors02, '03')
			assert.isOk(result02 ,'04')
			assert.equal(result02 ,'hello')
			assert.equal(errors02.length, 2, '05')
			assert.equal(errors02[0].message, 'robustSyncFn failed', '06')
			assert.equal(errors02[1].message, 'Should fail', '07')
			assert.isOk(errors02[0].metadata, '08')
			assert.equal(errors02[0].metadata.code, 123, '09')
			assert.isOk(errors02[1].metadata, '10')
			assert.equal(errors02[1].metadata.id, 456, '11')
			assert.equal(errors02[1].metadata.code, 897, '12')
		})
	})
	describe('.getErrorMetadata', () => {
		it('01 - Should extract all the error\'s metadata and merge them in a single metadata object.', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw wrapCustomErrors({ id:456, code:897 })('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw wrapCustomErrors({ code:123 })(errorMsg, errors)
				else
					return result
			})

			const [errors02] = robustSyncFn(true)

			assert.isOk(errors02, '03')
			const meta = getErrorMetadata(errors02) 
			assert.isOk(meta)
			assert.equal(meta.id, 456)
			assert.equal(meta.code, 897)
		})
		it('02 - Should support merging string.', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw wrapCustomErrors('Boom')('Should fail')
				else
					return 123
			})

			const robustSyncFn = (fail) => catchErrors(() => {
				const errorMsg = 'robustSyncFn failed'
				const [errors, result] = robustSyncFn01(fail)
				if (errors)
					throw wrapCustomErrors({ code:123 })(errorMsg, errors)
				else
					return result
			})

			const [errors02] = robustSyncFn(true)

			assert.isOk(errors02, '03')
			const meta = getErrorMetadata(errors02) 
			assert.isOk(meta)
			assert.equal(meta, 'Boom')
		})
		it('03 - Should support mixing \'wrapCustomErrors\' and \'wrapErrors\'.', () => {

			const robustSyncFn01 = (fail) => catchErrors(() => {
				if (fail)
					throw wrapCustomErrors('Boom')('Should fail')
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

			const [errors02] = robustSyncFn(true)

			assert.isOk(errors02, '03')
			const meta = getErrorMetadata(errors02) 
			assert.isOk(meta)
			assert.equal(meta, 'Boom')
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
	describe('.required', () => {
		it('01 - Should throw errors when an argument is required but is not defined.', () => {
			const test_required = ({ hello, world }) => catchErrors('\'test_required\' failed', () => {
				required({ hello, 'world.hello_again':world?.hello_again })

				console.log('\'test_required\' passed')
			}) 

			const test_required_01_errors = test_required({ hello:'Hello', world:{hello_again:'hello_again'} })[0]
			const test_required_02_errors = test_required({})[0]
			const test_required_03_errors = test_required({ hello:'Hello' })[0]
			const test_required_04_errors = test_required({ world:{hello_again:'hello_again'} })[0]

			assert.isNotOk(test_required_01_errors, '01')
			assert.isOk(test_required_02_errors, '02')
			assert.isOk(test_required_03_errors, '03')
			assert.isOk(test_required_04_errors, '04')
			assert.isOk(test_required_02_errors.some(x => x.message == 'Missing required argument \'hello\''), '05')
			assert.isOk(test_required_03_errors.some(x => x.message == 'Missing required argument \'world.hello_again\''), '06')
			assert.isOk(test_required_04_errors.some(x => x.message == 'Missing required argument \'hello\''), '07')
		})
	})
})








