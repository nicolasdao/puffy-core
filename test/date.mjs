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
import { addSeconds, addMinutes, addHours, addDays, addMonths, addYears, formatDate, getTimeDiff, toTz } from '../src/date.mjs'

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
			const refDate = new Date('2021-10-12T13:45:21Z')
			assert.equal(formatDate(refDate), '2021-10-12')
			assert.equal(formatDate(refDate, { format:'dd-MM-yyyy' }), '12-10-2021')
			assert.equal(formatDate(refDate, { format:'ddMMyyyy' }), '12102021')
			assert.equal(formatDate(refDate, { format:'MMyy' }), '1021')
			assert.equal(formatDate(refDate, { format:'dd/MM/yy' }), '12/10/21')
			assert.equal(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss' }), '12/10/21 13:45:21')
			assert.equal(formatDate(refDate, { format:'The dd of MMM, yyyy' }), 'The 12 of October, 2021')
			assert.equal(formatDate(refDate, { format:'The dd{nth} of MMM, yyyy' }), 'The 12th of October, 2021')
		})
		it('03 - Should support time zones', () => {
			const refDate = new Date('2021-10-12T13:45:21Z')
			assert.equal(formatDate(refDate, { tz:'Australia/Sydney' }), '2021-10-13')
			assert.equal(formatDate(refDate, { format:'dd-MM-yyyy', tz:'Australia/Sydney' }), '13-10-2021')
			assert.equal(formatDate(refDate, { format:'ddMMyyyy', tz:'Australia/Sydney' }), '13102021')
			assert.equal(formatDate(refDate, { format:'MMyy', tz:'Australia/Sydney' }), '1021')
			assert.equal(formatDate(refDate, { format:'dd/MM/yy', tz:'Australia/Sydney' }), '13/10/21')
			assert.equal(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss', tz:'Australia/Sydney' }), '13/10/21 00:45:21')
			assert.equal(formatDate(refDate, { format:'The dd of MMM, yyyy', tz:'Australia/Sydney' }), 'The 13 of October, 2021')
			assert.equal(formatDate(refDate, { format:'The dd{nth} of MMM, yyyy', tz:'Australia/Sydney' }), 'The 13th of October, 2021')
		})
	})
	describe('.toTz', () => {
		it('01 - Should create a UTC date that looks like the time in a specific timezone', () => {
			const refDate = new Date('2024-01-23T09:42:57.311Z')
			assert.equal(toTz(refDate).toISOString(), '2024-01-23T09:42:57.311Z')
			assert.equal(toTz(refDate,'local').toISOString(), '2024-01-23T17:42:57.311Z')
			assert.equal(toTz(refDate,'Australia/Sydney').toISOString(), '2024-01-23T20:42:57.311Z')
			assert.equal(toTz(refDate,'America/Chicago').toISOString(), '2024-01-23T03:42:57.311Z')
		})
	})
	describe('.getTimeDiff', () => {
		it('01 - Should get the time difference between two dates in ms', () => {
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+1000)
			assert.equal(getTimeDiff(date01, date02), 1000)
		})
		it('02 - Should not be impacted by the arguments\' order', () => {
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+1000)
			assert.equal(getTimeDiff(date02, date01), 1000)
		})
		it('03 - Should support date string', () => {
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+1000)
			assert.equal(getTimeDiff(date01, date02.toISOString()), 1000)
		})
		it('04 - Should support date number', () => {
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+1000)
			assert.equal(getTimeDiff(date01, date02.getTime()), 1000)
		})
		it('05 - Should support explicit \'ms\' unit', () => {
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+1000)
			assert.equal(getTimeDiff(date01, date02, 'ms'), 1000)
			assert.equal(getTimeDiff(date01, date02, 'millisecond'), 1000)
		})
		it('06 - Should support explicit \'second\' unit', () => {
			const UNIT_VAL = 4
			const MS_VAL = UNIT_VAL*1000
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+MS_VAL)
			assert.equal(getTimeDiff(date01, date02, 's'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'sec'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'second'), UNIT_VAL)
		})
		it('07 - Should support explicit \'minute\' unit', () => {
			const UNIT_VAL = 4
			const MS_VAL = UNIT_VAL*1000*60
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+MS_VAL)
			assert.equal(getTimeDiff(date01, date02, 'm'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'min'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'minute'), UNIT_VAL)
		})
		it('08 - Should support explicit \'hour\' unit', () => {
			const UNIT_VAL = 4
			const MS_VAL = UNIT_VAL*1000*60*60
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+MS_VAL)
			assert.equal(getTimeDiff(date01, date02, 'h'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'hour'), UNIT_VAL)
		})
		it('09 - Should support explicit \'day\' unit', () => {
			const UNIT_VAL = 4
			const MS_VAL = UNIT_VAL*1000*60*60*24
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+MS_VAL)
			assert.equal(getTimeDiff(date01, date02, 'd'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'day'), UNIT_VAL)
		})
		it('10 - Should support explicit \'week\' unit', () => {
			const UNIT_VAL = 4
			const MS_VAL = UNIT_VAL*1000*60*60*24*7
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+MS_VAL)
			assert.equal(getTimeDiff(date01, date02, 'w'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'week'), UNIT_VAL)
		})
		it('11 - Should support explicit \'month\' unit', () => {
			const UNIT_VAL = 4
			const MS_VAL = UNIT_VAL*1000*60*60*24*30.41
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+MS_VAL)
			assert.equal(getTimeDiff(date01, date02, 'month'), UNIT_VAL)
		})
		it('12 - Should support explicit \'month\' unit', () => {
			const UNIT_VAL = 4
			const MS_VAL = UNIT_VAL*1000*60*60*24*365
			const date01 = new Date('2021-10-12')
			const date02 = new Date(date01.getTime()+MS_VAL)
			assert.equal(getTimeDiff(date01, date02, 'y'), UNIT_VAL)
			assert.equal(getTimeDiff(date01, date02, 'year'), UNIT_VAL)
		})
	})
})







