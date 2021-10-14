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
import { validateSpecialChar, validateUrl, validateEmail } from '../src/validate.mjs'
		
describe('validate', () => {
	describe('.validateSpecialChar', () => {
		it('01 - Should validate that a string contains at least one special character', () => {
			//  !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
			const specialChars = [' ', '!', '"', '#', '$', '%','&', '\'', '(', ')', '*', '+',',', '-', '.', '/', ':', ';','<', '=', '>', '?', '@', '[',']', '^', '_', '`', '{', '|','}', '~']
			const invalidString = 'hellonic'
			assert.isNotOk(validateSpecialChar(invalidString), '0')
			specialChars.forEach((specialChar, idx) => {
				assert.isOk(validateSpecialChar(`${invalidString}${specialChar}`), `${idx+1}`)
			})
		})
	})
	describe('.validateUrl', () => {
		it('01 - Should validate that a URL is valid or not.', () => {
			const goodUrls = [
				'https://cloudlessconsulting.com', 
				'http://www.example.com/dewde?query=hello#world', 
				'http://localhost:80'
			]
			const badUrls = [
				null, 
				'hello', 
				'https:cs.com', 
				'https://example', 
				'http://'
			]
			
			let counter = 0
			for (let url of goodUrls)
				assert.isOk(validateUrl(url), `${++counter} - ${url} should be a valid URL.`)
			for (let url of badUrls)
				assert.isNotOk(validateUrl(url), `${++counter} - ${url} should be an invvalid URL.`)
		})
	})
	describe('.validateEmail', () => {
		it('01 - Should validate that an email is valid or not.', () => {
			const goodEmails = [
				'nic@neap.co', 
				'no-reply@cloudlesslabs.com'
			]
			const badEmails = [
				null, 
				'hello', 
				'@cloudlesslabs.com', 
				'cloudlesslabs.com', 
				'nic @neap.co'
			]
			
			let counter = 0
			for (let email of goodEmails)
				assert.isOk(validateEmail(email), `${++counter} - ${email} should be a valid URL.`)
			for (let email of badEmails)
				assert.isNotOk(validateEmail(email), `${++counter} - ${email} should be an invvalid URL.`)
		})
	})
})









