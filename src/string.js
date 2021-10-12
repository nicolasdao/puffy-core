/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- plural
*/

const SPECIAL_PLURAL = { 
	'is':'are', 
	'Is':'Are', 
	'its':'their', 
	'Its':'Their', 
	'he/she':'they', 
	'he':'they', 
	'she':'they',
	'He/She':'They', 
	'He':'They', 
	'She':'They',
	'he is':'they are',
	'He is':'They are',
	'she is':'they are',
	'She is':'They are'
}
export const plural = (word, count) => {
	if (!word)
		return ''

	if (/y$/.test(word))
		return count && count > 1 ? word.replace(/y$/, 'ies') : word 
	else if (SPECIAL_PLURAL[word])
		return count && count > 1 ? SPECIAL_PLURAL[word] : word
	else
		return count && count > 1 ? `${word}s` : word
}