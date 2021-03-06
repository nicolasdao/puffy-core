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
import { addSeconds, addMinutes, addHours, addDays, addMonths, addYears, formatDate } from '../src/date.mjs'

describe('date', () => {
	describe('.addSeconds', () => {
		it('01 - Should add seconds', () => {
			const refDate = new Date('2021-10-12')
			assert.equal(addSeconds(refDate, -2).toISOString(), '2021-10-11T23:59:58.000Z')
		})
	})
	describe('.addMinutes', () => {
		it('01 - Should add minutes', () => {
			const refDate = new Date('2021-10-12')
			assert.equal(addMinutes(refDate, 2).toISOString(), '2021-10-12T00:02:00.000Z')
		})
	})
	describe('.addHours', () => {
		it('01 - Should add hours', () => {
			const refDate = new Date('2021-10-12')
			assert.equal(addHours(refDate, 2).toISOString(), '2021-10-12T02:00:00.000Z')
		})
	})
	describe('.addDays', () => {
		it('01 - Should add days', () => {
			const refDate = new Date('2021-10-12')
			assert.equal(addDays(refDate, 2).toISOString(), '2021-10-14T00:00:00.000Z')
		})
	})
	describe('.addMonths', () => {
		it('01 - Should add months', () => {
			const refDate = new Date('2021-10-12')
			assert.equal(addMonths(refDate, 2).toISOString(), '2021-12-12T00:00:00.000Z')
		})
	})
	describe('.addYears', () => {
		it('01 - Should add years', () => {
			const refDate = new Date('2021-10-12')
			assert.equal(addYears(refDate, 2).toISOString(), '2023-10-12T00:00:00.000Z')
		})
	})
	describe('.formatDate', () => {
		it('01 - Should create a string that represents a short date', () => {
			const refDate = new Date('2021-10-12')
			assert.equal(formatDate(refDate), '2021-10-12')
		})
		it('02 - Should support short date format', () => {
			const refDate = new Date('2021-10-12T13:45:21')
			assert.equal(formatDate(refDate), '2021-10-12')
			assert.equal(formatDate(refDate, { format:'dd-MM-yyyy' }), '12-10-2021')
			assert.equal(formatDate(refDate, { format:'ddMMyyyy' }), '12102021')
			assert.equal(formatDate(refDate, { format:'MMyy' }), '1021')
			assert.equal(formatDate(refDate, { format:'dd/MM/yy' }), '12/10/21')
			assert.equal(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss' }), '12/10/21 13:45:21')
			assert.equal(formatDate(refDate, { format:'The dd of MMM, yyyy' }), 'The 12 of October, 2021')
			assert.equal(formatDate(refDate, { format:'The dd{nth} of MMM, yyyy' }), 'The 12th of October, 2021')
		})
	})
})







