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
	'am':'are',
	'Am':'Are',
	'he is':'they are',
	'He is':'They are',
	'he':'they', 
	'He':'They', 
	'he/she':'they', 
	'He/She':'They', 
	'i':'they',
	'I':'They',
	'is':'are', 
	'Is':'Are', 
	'its':'their', 
	'Its':'Their', 
	'she is':'they are',
	'She is':'They are',
	'she':'they',
	'She':'They',
	'was':'were',
	'Was':'Were',
	'you':'they',
	'You':'They',
}
export const plural = (...args) => {
	if (!args.length)
		return ''

	const [count, ...words] = args
	const pluralOn = count && count > 1

	return words.map(word => {
		word = word || ''
		if (/y$/.test(word))
			return pluralOn ? word.replace(/y$/, 'ies') : word 
		else if (SPECIAL_PLURAL[word])
			return pluralOn ? SPECIAL_PLURAL[word] : word
		else
			return pluralOn ? `${word}s` : word
	}).join(' ')
}





