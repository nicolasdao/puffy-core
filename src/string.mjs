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
	'that':'those',
	'That':'Those',
	'this':'these',
	'This':'These',
	'his':'their',
	'His':'Their',
	'her':'their',
	'Her':'Their',
	'him':'them',
	'Him':'Them'
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

/**
 * Justifies text to the left.
 * 
 * @param  {String}			text
 * @param  {Object}			options
 * @param  {String} 			.prefix			Default ''.
 * @param  {Boolean} 			.anchorLine		Default false. Overrides 'options.start'.
 * @param  {String|Boolean} 	.remove				
 * @param  {Number|[Number]} 	.skip			
 * 
 * @return {String}		justifiedText
 */
export const justifyLeft = (text, options) => {
	if (!text)
		return ''

	const bits = text.split('\n')

	const { prefix, anchorLine, remove, skip } = options || {}
	const defaultChar = anchorLine >= 0 
		? ((bits[anchorLine]||'').match(/^\s*/)||[])[0]||''
		: ''
	const _prefix = `${prefix||''}${defaultChar}`

	let replaceFn = line => line.replace(/^\s*/, _prefix)

	if (remove) {
		const rm = typeof(remove) == 'boolean' ? defaultChar : remove
		replaceFn = line => line.indexOf(rm) === 0 ? line.replace(rm,prefix||'') : line
	}

	const _skip = (typeof(skip*1) == 'number' ? [skip] : Array.isArray(skip) ? skip : []).filter(x => !isNaN(x*1) && (x*1) >= 0).map(x => x*1)
	if (_skip.length)
		return bits.reduce((acc,bit,idx) => {
			if (_skip.indexOf(idx) < 0)
				acc.push(replaceFn(bit))
			return acc
		}, []).join('\n')
	else
		return bits.map(replaceFn).join('\n')
}




