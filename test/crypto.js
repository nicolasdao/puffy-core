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
import { encoder, jwtDecode } from '../src/crypto.js'

describe('crypto', () => {
	describe('.encoder', () => {
		it('01 - Should encode/decode multiple formats.', () => {
			const helloBase64 = 'aGVsbG8gd29ybGQ='
			const helloBin = '0110100001100101011011000110110001101111001000000111011101101111011100100110110001100100'
			const helloHex = '68656C6C6F20776F726C64'

			const stringEncoder = encoder()
			const stringToBase64 = stringEncoder('base64')
			const stringToBin = stringEncoder('bin')
			const stringToHex = stringEncoder('hex')

			const base64Encoder = encoder('base64')
			const base64ToString = base64Encoder()
			const base64ToBin = base64Encoder('bin')
			const base64ToHex = base64Encoder('hex')

			const binEncoder = encoder('bin')
			const binToString = binEncoder()
			const binToBase64 = binEncoder('base64')
			const binToHex = binEncoder('hex')
			
			assert.equal(stringToBase64('hello world'), helloBase64)
			assert.equal(stringToBin('hello world'), helloBin)
			assert.equal(stringToHex('hello world'), helloHex)

			assert.equal(base64ToString(helloBase64), 'hello world')
			assert.equal(base64ToBin(helloBase64), helloBin)
			assert.equal(base64ToHex(helloBase64), helloHex)

			assert.equal(binToString(helloBin), 'hello world')
			assert.equal(binToBase64(helloBin), helloBase64)
			assert.equal(binToHex(helloBin), helloHex)
			
		})
	})
	describe('.jwtDecode', () => {
		it('01 - Should decode a JWT.', () => {
			const accessToken = 'eyJraWQiOiJjVzZQcVpBeG5DQ1wvXC9jOFJURE9jeHpObW9XRVFZQ2hiR1JPV2NhdnJiQjQ9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIzYzViNTAzNC0xOTc1LTQ4ODktYTgzOS1kNDNhN2UwZmJjNDgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTIuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTJfazYzcHpWSmdRIiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiN24wNmZwcjF0NG50bTFob2ZiaDhibmhwOTYiLCJvcmlnaW5fanRpIjoiMmQ0ODc1NzktZmJiNy00NjAzLWI3MTMtM2FjYjE4MTQxZjljIiwiZXZlbnRfaWQiOiJjNGMwNGI2Ny1mOWZhLTQ1ZDQtYWU1MS1iZWQ1NzYwMmY3NjUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6InBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjM0MDg3MTM2LCJleHAiOjE2MzQwOTA3MzYsImlhdCI6MTYzNDA4NzEzNiwianRpIjoiZGZlOTkxYzAtZDFmOC00MGFjLThjNTEtMWZjNTc2YWEwOTRkIiwidXNlcm5hbWUiOiIzYzViNTAzNC0xOTc1LTQ4ODktYTgzOS1kNDNhN2UwZmJjNDgifQ.XCJKcdQcC96R_gyY8VV_k1RbSEOLD0yOMVWkxbjPQYANVEhh269LRWwqyRO4WD5835BFpT8cUsVDGKDsSYdDx9phE-3fw3AK5EqthnrwYaq1VKhQOVJL-sOSA6CUSuLwBsRLfdHO4gzFwuNMXuKtQVwCiNhsr-8hpDv6_2PLVSDP_kkviUU2X50cqkQc7MnyEZfHPjsgm06O9eRaJ45lX8dd-g8BQdur5KNQoxAmKHZwwiCuaXg8Bs2l4kPxpJwaVHybMaMLa-9szDHQ0vfOvH54gVgApgCJL2smb9C3QBbnXH54nLGgGYuI7f0L_oiTNWB0a1N6Meh6ObckXO8-LQ'
			
			const { header, payload, signBase64 } = jwtDecode(accessToken)

			assert.isOk(header)
			assert.isOk(payload)
			assert.isOk(signBase64)
			assert.deepEqual(header, {
				kid: 'cW6PqZAxnCC//c8RTDOcxzNmoWEQYChbGROWcavrbB4=', 
				alg: 'RS256'
			})
			assert.deepEqual(payload, {
				sub: '3c5b5034-1975-4889-a839-d43a7e0fbc48',
				iss: 'https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_k63pzVJgQ',
				version: 2,
				client_id: '7n06fpr1t4ntm1hofbh8bnhp96',
				origin_jti: '2d487579-fbb7-4603-b713-3acb18141f9c',
				event_id: 'c4c04b67-f9fa-45d4-ae51-bed57602f765',
				token_use: 'access',
				scope: 'phone openid profile email',
				auth_time: 1634087136,
				exp: 1634090736,
				iat: 1634087136,
				jti: 'dfe991c0-d1f8-40ac-8c51-1fc576aa094d',
				username: '3c5b5034-1975-4889-a839-d43a7e0fbc48'
			})
			assert.equal(signBase64, 'XCJKcdQcC96R_gyY8VV_k1RbSEOLD0yOMVWkxbjPQYANVEhh269LRWwqyRO4WD5835BFpT8cUsVDGKDsSYdDx9phE-3fw3AK5EqthnrwYaq1VKhQOVJL-sOSA6CUSuLwBsRLfdHO4gzFwuNMXuKtQVwCiNhsr-8hpDv6_2PLVSDP_kkviUU2X50cqkQc7MnyEZfHPjsgm06O9eRaJ45lX8dd-g8BQdur5KNQoxAmKHZwwiCuaXg8Bs2l4kPxpJwaVHybMaMLa-9szDHQ0vfOvH54gVgApgCJL2smb9C3QBbnXH54nLGgGYuI7f0L_oiTNWB0a1N6Meh6ObckXO8-LQ')
		})
		it('02 - Should throw an exception when the token in invalid.', () => {
			try {
				jwtDecode('edew')
				throw new Error('Should have failed')
			} catch(err) {
				if (err.message == 'Should have failed')
					throw err
				else
					assert.isOk(err)
			}
		})
		it('03 - Should support a noFail mode that returns null rather then throwing an exception.', () => {
			const data = jwtDecode('edew', { noFail:true })			
			assert.isNotOk(data)
		})
	})
})









