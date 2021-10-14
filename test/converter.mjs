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
import { addZero, nbrToCurrency, s2cCase, objectS2Ccase, objectCapital2Ccase } from '../src/converter.mjs'

describe('converter', () => {
	describe('.addZero', () => {
		it('01 - Should prefix a number with \'0s\' to match a specific string length.', () => {
			const data01 = addZero(123,10)
			const data02 = addZero(123,2)

			assert.equal(data01.length, 10)
			assert.equal(data01, '0000000123')
			assert.equal(data02.length, 3)
			assert.equal(data02, '123')
		})
	})
	describe('.nbrToCurrency', () => {
		it('01 - Should parse a number into a 2 decimal places currency string', () => {
			assert.equal(nbrToCurrency(123.93321), '$123.93')
			assert.equal(nbrToCurrency(123.93581, '$'), '$123.94')
			assert.equal(nbrToCurrency(123.1, '€'), '€123.10')
			assert.equal(nbrToCurrency(0.1, '¥'), '¥0.10')
			assert.equal(nbrToCurrency(32, '£'), '£32.00')
		})
		it('02 - Should support currency names', () => {
			assert.equal(nbrToCurrency(123.93321, 'dollar'), '$123.93')
			assert.equal(nbrToCurrency(123.1, 'euro'), '€123.10')
			assert.equal(nbrToCurrency(0.1, 'yuan'), '¥0.10')
			assert.equal(nbrToCurrency(0.1, 'yen'), '¥0.10')
			assert.equal(nbrToCurrency(32, 'pound'), '£32.00')
		})
	})
	describe('.s2cCase', () => {
		it('01 - Should convert a snake case string to camel case.', () => {
			assert.equal(s2cCase('moreInfo'), 'moreInfo','01')
			assert.equal(s2cCase('first_name'), 'firstName','02')
			assert.equal(s2cCase('place_of_birth'), 'placeOfBirth','03')
			assert.equal(s2cCase('Place_ofBiRth'), 'PlaceOfBiRth','04')
			assert.equal(s2cCase('Place_of___biRth'), 'PlaceOfBiRth','04')
		})
	})
	describe('.objectS2Ccase', () => {
		it('01 - Should convert an object with snake case fields to camel case fields.', () => {
			const o = objectS2Ccase({
				moreInfo: 'Hello',
				first_name:'Nic',
				place_of_birth: 'Liege'
			})
			assert.equal(Object.keys(o).length, 3,'01')
			assert.equal(o.moreInfo, 'Hello','02')
			assert.equal(o.firstName, 'Nic','03')
			assert.equal(o.placeOfBirth, 'Liege','04')
		})
	})
	describe('.objectCapital2Ccase', () => {
		it('01 - Should convert an object with capital case fields to camel case fields.', () => {
			const o = objectCapital2Ccase({
				MoreInfo: 'Hello',
				First_name:'Nic',
				Place_of_birth: 'Liege'
			})
			assert.equal(Object.keys(o).length, 3,'01')
			assert.equal(o.moreInfo, 'Hello','02')
			assert.equal(o.firstName, 'Nic','03')
			assert.equal(o.placeOfBirth, 'Liege','04')
		})
	})
})







