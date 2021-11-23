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
import { plural, justifyLeft } from '../src/string.mjs'

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
			assert.equal(plural(1, 'That'), 'That')
			assert.equal(plural(2, 'That'), 'Those')
			assert.equal(plural(1, 'this'), 'this')
			assert.equal(plural(2, 'this'), 'these')
			assert.equal(plural(1, 'his'), 'his')
			assert.equal(plural(2, 'his'), 'their')
			assert.equal(plural(1, 'him'), 'him')
			assert.equal(plural(2, 'him'), 'them')
			assert.equal(plural(1, 'her'), 'her')
			assert.equal(plural(2, 'her'), 'their')
			assert.equal(plural(2, 'its'), 'their')
			assert.equal(plural(1, 'he is'), 'he is')
			assert.equal(plural(2, 'he is'), 'they are')
			assert.equal(plural(2, 'He is'), 'They are')
			assert.equal(plural(2, 'She is'), 'They are')
			assert.equal(plural(1, 'Test record'), 'Test record')
			assert.equal(plural(2, 'Test record'), 'Test records')
		})
		it('02 - Should pluralize multiple words at a time.', () => {
			assert.equal(plural(1, 'Project', 'was'), 'Project was')
			assert.equal(plural(2, 'Project', 'was'), 'Projects were')
			assert.equal(plural(1, 'she', 'is'), 'she is')
			assert.equal(plural(2, 'She', 'is'), 'They are')
			assert.equal(plural(1, 'Test record', 'is'), 'Test record is')
			assert.equal(plural(2, 'Test record', 'is'), 'Test records are')
		})
	})
	describe('.justifyLeft', () => {
		it('01 - Should justify all the lines to the left (no more spaces).', () => {
			const text = `    Hello,
				This is a test
				with multiple lines
				messed up.`
			const expected = 'Hello,\nThis is a test\nwith multiple lines\nmessed up.'

			assert.equal(justifyLeft(text), expected)
		})
		it('02 - Should justify all the lines to the left (no more spaces) and start with a specific set of characters.', () => {
			const text = `    Hello,
				This is a test
				with multiple lines
				messed up.`
			const expected = '> Hello,\n> This is a test\n> with multiple lines\n> messed up.'

			assert.equal(justifyLeft(text, { prefix:'> ' }), expected)
		})
		it('03 - Should justify all the lines to the left (no more spaces) and start with same indent as the first line.', () => {
			const text = `    Hello,
				This is a test
				with multiple lines
				messed up.`
			const expected = '    Hello,\n    This is a test\n    with multiple lines\n    messed up.'

			assert.equal(justifyLeft(text, { anchorLine:0 }), expected)
		})
		it('04 - Should justify all the lines to the left (no more spaces) and start with same indent as the 3rd line.', () => {
			const text = `    Hello,
				This is a test
					with multiple lines
				messed up.`
			const expected = '					Hello,\n					This is a test\n					with multiple lines\n					messed up.'

			assert.equal(justifyLeft(text, { anchorLine:2 }), expected)
		})
		it('05 - Should remove a specific amount of space on each line.', () => {
			const text = `
				Hello,
				The items list is:
					- Fruits:
						- Apple
						- Orange
					- Bred`
			const expected = '\nHello,\nThe items list is:\n	- Fruits:\n		- Apple\n		- Orange\n	- Bred'

			assert.equal(justifyLeft(text, { remove:'				' }), expected)
		})
		it('06 - Should remove the same amount of space than the anchor line on each line.', () => {
			const text = `
				Hello,
				The items list is:
					- Fruits:
						- Apple
						- Orange
					- Bred`
			const expected = '\nHello,\nThe items list is:\n	- Fruits:\n		- Apple\n		- Orange\n	- Bred'

			assert.equal(justifyLeft(text, { remove:true, anchorLine:1 }), expected)
		})
		it('07 - Should skip lines.', () => {
			const text = `
				Hello,
				The items list is:
					- Fruits:
						- Apple
						- Orange
					- Bred`
			const expected = 'Hello,\nThe items list is:\n	- Fruits:\n		- Apple\n		- Orange\n	- Bred'

			assert.equal(justifyLeft(text, { remove:true, anchorLine:1, skip:0 }), expected)
			assert.equal(justifyLeft(text, { remove:true, anchorLine:1, skip:[0] }), expected)
		})
		it('08 - Should combine all options.', () => {
			const text = `
				Hello,
				The items list is:
					- Fruits:
						- Apple
						- Orange
					- Bred`
			const expected = '> Hello,\n> The items list is:\n> 	- Fruits:\n> 		- Apple\n> 		- Orange\n> 	- Bred'

			assert.equal(justifyLeft(text, { remove:true, anchorLine:1, skip:0, prefix:'> ' }), expected)
		})
	})
})









