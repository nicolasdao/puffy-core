/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- SPECIAL_CHAR
	- validate_date
	- validate_email
	- validate_special_char
	- validate_url
	- validateDate
	- validateEmail
	- validateSpecialChar
	- validateUrl
*/

const SPECIAL_CHAR_REGEX = /[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/
export const SPECIAL_CHAR = ' !"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'

export const validateUrl = (value='') => 
	/^http[s]{0,1}:\/\/localhost:[0-9]+/.test(value) ||
	/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)

export const validateEmail = (value='') => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value)

export const validateDate = (d, options={ exception: { toggle: false, message: null } }) => { 
	const test = d && typeof(d.getTime) == 'function' && !isNaN(d.getTime())
	if (!test && options.exception.toggle)
		throw new Error(options.exception.message || `${d} is not a Date object.`)
	return test
}


export const validateSpecialChar = (value='') => SPECIAL_CHAR_REGEX.test(value)

export const validate_url = validateUrl
export const validate_email = validateEmail
export const validate_date = validateDate
export const validate_special_char = validateSpecialChar