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
import { merge, diff, mirror, setProperty, getProperty, extractFlattenedJSON, exists, existsAny, existsAll, isEmpty } from '../src/obj.mjs'

describe('obj', () => {
	describe('.merge', () => {
		it('01 - Should merge objects', () => {
			const o1 = {
				project: {
					name: 'P1',
					updated: 'Tuesday'
				}
			}
			const o2 = {
				id: 1,
				project: {
					description: 'Cool cool',
					updated: 'Wednesday'
				}
			}

			assert.deepEqual(merge(o1,o2), { id:1, project:{ name:'P1', updated:'Wednesday', description:'Cool cool'} })
		})
		it('02 - Should support nullifying certain properties', () => {
			const o1 = {
				project: {
					name: 'P1',
					updated: 'Tuesday'
				}
			}
			const o2 = {
				id: 1,
				project: {
					description: 'Cool cool',
					updated: null
				}
			}

			assert.deepEqual(merge(o1,o2), { id:1, project:{ name:'P1', updated:null, description:'Cool cool'} })
		})
	})
	describe('.diff', () => {
		it('01 - Should return an object with all the differences.', () => {
			const o1 = {
				project: {
					name: 'P1',
					updated: 'Tuesday'
				},
				age:40
			}
			const o2 = {
				id: 1,
				project: {
					name: 'P1',
					description: 'Cool cool',
					updated: 'Wednesday'
				},
				age:40
			}

			assert.deepEqual(diff(o1,o2), {
				id: 1,
				project: {
					description: 'Cool cool',
					updated: 'Wednesday'
				}
			})
			assert.deepEqual(diff(o1,o1), {})
		})
	})
	describe('.mirror', () => {
		it('01 - Should mirror an object properties', () => {
			const o1 = {
				project: {
					name: 'P1',
					updated: 'Tuesday'
				}
			}
			const o2 = {
				id: 1,
				project: {
					description: 'Cool cool',
					updated: 'Wednesday'
				}
			}

			const data01 = mirror(o1,o2)
			const data02 = mirror(o2,o1)

			assert.deepEqual(data01, { id:1, project:{ updated:'Tuesday', description:'Cool cool'} })
			assert.deepEqual(data02, { project:{ name: 'P1', updated:'Wednesday'} })
		})
	})
	describe('.setProperty', () => {
		it('01 - Should set a specific object\'s property value', () => {
			const o = setProperty(setProperty({ name:'Nic' }, 'company.name', 'Neap Pty Ltd'), 'age', 38)

			assert.equal(o.name, 'Nic', '01')
			assert.equal(o.company.name, 'Neap Pty Ltd', '02')
			assert.equal(o.age, 38, '03')
		})
	})
	describe('.getProperty', () => {
		it('01 - Should get an object\'s property value based on a property path.', () => {
			const obj = { 
				name:'Nic', 
				address:{ line1:'Cool street' }, 
				friends:[{ name:'Michael' },{ name:'Brendan', events:[[null,{name:'Crazy'}]] }] 
			}
			assert.equal(getProperty(obj, 'name'), 'Nic')
			assert.equal(getProperty(obj, 'address.line1'), 'Cool street')
			assert.equal(getProperty(obj, 'friends[0].name'), 'Michael')
			assert.equal(getProperty(obj, 'friends[1].events[0][1].name'), 'Crazy')
			assert.notOk(getProperty(obj, 'friends[2].events[0][1].name'))
			assert.equal(getProperty([1,2,3], '[2]'), 3)
			assert.notOk(getProperty(null, 'address.line1'))
		})
	})
	describe('.extractFlattenedJSON', () => {
		it('01 - Should parse a flattened JSON into a deep JSON', () => {
			const obj =  extractFlattenedJSON({
				'user.firstName': 'Nicolas',
				'user.age': 38,
				'user.friends[0].name': 'Brendan',
				'user.friends[0].age': 31,
				'user.friends[1].name': 'Boris',
				'user.friends[1].age': 32
			})
			
			assert.deepEqual(obj, {
				user: {
					firstName: 'Nicolas',
					age: 38,
					friends:[{
						name: 'Brendan',
						age: 31
					},{
						name: 'Boris',
						age: 32
					}]
				}
			})
		})
	})
	describe('.exists', () => {
		it('01 - Should confirm whether an object exists or not (i.e., is not equal to null or undefined)', () => {
			assert.strictEqual(exists(), false)
			assert.strictEqual(exists(undefined), false)
			assert.strictEqual(exists(null), false)
			assert.strictEqual(exists({}), true)
			assert.strictEqual(exists(0), true)
			assert.strictEqual(exists('Hello'), true)
		})
	})
	describe('.existsAny', () => {
		it('01 - Should confirm whether at least one object exists or not', () => {
			assert.strictEqual(existsAny(null, undefined), false)
			assert.strictEqual(existsAny(0, undefined), true)
		})
	})
	describe('.existsAll', () => {
		it('01 - Should confirm whether at all objects exist or not', () => {
			assert.strictEqual(existsAll(null, undefined), false)
			assert.strictEqual(existsAll(0, undefined), false)
			assert.strictEqual(existsAll(0, ''), true)
		})
	})
	describe('.isEmpty', () => {
		it('01 - Should confirm whether an object is empty or not', () => {
			assert.strictEqual(isEmpty(), true) 
			assert.strictEqual(isEmpty({}), true) 
			assert.strictEqual(isEmpty({ hello:'world' }), false) 
		})
	})
})









