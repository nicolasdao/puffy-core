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
import { delay, Timer } from '../src/time.mjs'

describe('time', () => {
	describe('.delay', () => {
		it('01 - Should delay execution.', done => {
			const seq = []
			const start = Date.now()
			delay(20).then(() => seq.push({ id:3, time: Date.now() - start }))
			delay(10).then(() => seq.push({ id:1, time: Date.now() - start }))
			delay(15).then(() => seq.push({ id:2, time: Date.now() - start }))
			delay(25).then(() => {
				assert.equal(seq.length, 3, '01')
				assert.equal(seq[0].id, 1, '02')
				assert.equal(seq[1].id, 2, '03')
				assert.equal(seq[2].id, 3, '04')
				done()
			}).catch(done)
		})
		it('02 - Should support cancelling a delayed execution.', done => {
			const seq = []
			const start = Date.now()
			const d_01 = delay(30)
			const d_03 = delay(15)
			const d_02 = delay(10).then(() => d_01.cancel())
			d_01.then(() => seq.push({ id:3, time: Date.now() - start }))
			d_02.then(() => seq.push({ id:1, time: Date.now() - start }))
			d_03.then(() => seq.push({ id:2, time: Date.now() - start }))
			delay(25).then(() => {
				assert.equal(seq.length, 2, '01')
				assert.equal(seq[0].id, 1, '02')
				assert.isOk(10 <= seq[0].time && seq[0].time <= 15 , '03')
				assert.equal(seq[1].id, 2, '04')
				assert.isOk(15 <= seq[1].time && seq[1].time <= 20 , '05')
				done()
			}).catch(done)
		})
	})
	describe('.Timer', () => {
		it('01 - Should measure time.', async () => {
			const timer = new Timer()
			await delay(20)
			const t = timer.time()
			assert.isAtLeast(t, 20)
			assert.isBelow(t, 100)
		})
		it('02 - Should support units.', async () => {
			const timer = new Timer()
			await delay(20)
			const t = timer.time('second')
			assert.isAtLeast(t, 0.02)
			assert.isBelow(t, 0.1)
		})
	})
})









