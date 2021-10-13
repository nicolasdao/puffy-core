/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- encoder
	- jwtDecode
*/

const ATOB = (typeof(window) !== 'undefined' && window.atob) ? window.atob : null
const BTOA = (typeof(window) !== 'undefined' && window.btoa) ? window.btoa : null
const BUFFER = (typeof(Buffer) !== 'undefined') ? Buffer : null
const SUPPORTED_ENCODING = { 'hex':true, 'utf8': true, 'base64': true, 'ascii': true, 'buffer': true, 'bin':true, 'int':true }

/**
 * Converts a string or number to various formats. Examples:
 * 		const stringToBuffer = encoder()('buffer')
 * 		stringToBuffer('Hello')
 *
 * 		const base64ToString = encoder('base64')('utf8') // equivalent to encoder('base64')()
 * 		base64ToString('SGVsbG8=')
 *
 * 		encoder()('buffer')('Hello')
 * 		encoder()('base64')('Hello')
 * 		encoder('base64')('utf8')('SGVsbG8=')
 * 		encoder('buffer')('utf8')(buf)
 * 		encoder('bin')('hex')('0001')
 * 		encoder('hex')('bin')('AF')
 *
 * @param  {String}			fromEncoding	Default 'utf8'. Allowed values: 'hex', 'utf8', 'base64', 'ascii', 'bin', 'int', 'buffer' (only for NodeJS)
 * @param  {String}			toEncoding		Default 'utf8'. Allowed values: 'hex', 'utf8', 'base64', 'ascii', 'bin', 'int', 'buffer' (only for NodeJS)
 * @param  {String|Number}	data			e.g., 'Hello', 'SGVsbG8=', '0001', 123
 * 
 * @return {Object}			value			
 */
export const encoder = fromEncoding => {
	// 1. Default the current 'type'.
	fromEncoding = fromEncoding || 'utf8'
	if (!SUPPORTED_ENCODING[fromEncoding])
		throw new Error(`Wrong argument exception. The 'encoder' method only accept the following encoding types: ${Object.keys(SUPPORTED_ENCODING)} (current: ${fromEncoding})`)
	if (fromEncoding == 'buffer' && !BUFFER)
		throw new Error('Current runtime environment does not support \'Buffer\'.')

	const inputIsBin = fromEncoding == 'bin'
	const inputIsNumber = fromEncoding == 'int'

	return toEncoding => {
		const outIsBin = toEncoding == 'bin'
		const outIsInt = toEncoding == 'int'
		const toEnc = outIsBin || outIsInt ? 'hex' : (toEncoding || 'utf8')
		if (toEncoding == 'buffer' && !BUFFER)
			throw new Error('Current runtime environment does not support \'Buffer\'.')

		return data => {
			// 3. Converts bin or number to 'hex'
			const o = inputIsBin ? _binToHex(data || '') : inputIsNumber ? (data*1).toString(16) : (data || '')
			const fromEnc = inputIsBin || inputIsNumber ? 'hex' : fromEncoding

			const isString = typeof(o) == 'string'
			const isBuffer = BUFFER && o instanceof BUFFER
			if (!isString && !isBuffer && !inputIsNumber)
				throw new Error(`Wrong argument exception. The 'encoder' method only accept input of type 'string', 'number' or 'Buffer' (current: ${typeof(o)})`)
			
			const v = _convert(fromEnc, toEnc, o, isString)

			if (outIsBin)
				return _hexToBin(v)
			else if (outIsInt)
				return parseInt(`0x${v}`)
			else
				return v
		}
	}
}


/**
 * Decodes a JWT.
 * 
 * @param  {String}  token			JWT string token
 * @param  {Boolean} options.noFail	Default false. True means that invalid tokens don't throw an exception but return null instead.
 * 
 * @return {Object}  jwt
 * @return {Object} 	.header
 * @return {String} 		.kid
 * @return {String} 		.alg	e.g., 'RS256'
 * @return {Object} 	.payload
 * @return {String} 		.iss
 * @return {String} 		.sub
 * @return {String} 		.scope  e.g., 'phone openid profile email'
 * @return {String} 		.iss
 * @return {Number} 		.exp	Expiry epoc time. Unit seconds (e.g., 1634090736)
 * @return {Number} 		.iat	Issued at epoc time. Unit seconds (e.g., 1634087136)
 * @return {String} 	.signBase64
 */
export const jwtDecode  = (token, options) => {
	if (!token)
		return null

	try {
		const [headerBase64, payloadBase64, signBase64] = token.split('.')

		return {
			header: _base64ToJson(headerBase64),
			payload: _base64ToJson(payloadBase64),
			signBase64
		}
	} catch(err) {
		if (options && options.noFail)
			return null
		throw err
	}
}

/**
 *
 * @param  {String}	 fromEnc	Default 'utf8'. Allowed values: 'hex', 'utf8', 'base64', 'ascii', 'buffer' (only for NodeJS)
 * @param  {String}	 toEnc		Default 'utf8'. Allowed values: 'hex', 'utf8', 'base64', 'ascii', 'buffer' (only for NodeJS)
 * @param  {Object}  data
 * @param  {Boolean} isString
 * 
 * @return {Object}  output
 */
const _convert = (fromEnc, toEnc, data, isString) => {
	if (!SUPPORTED_ENCODING[toEnc])
		throw new Error(`Wrong argument exception. The 'encoder.to' method only accept the following encoding types: ${Object.keys(SUPPORTED_ENCODING)} (current: ${toEnc})`)

	if (isString) {
		const o = fromEnc == 'hex' ? _sanitizeHexaString(data) : data
		if (toEnc == 'buffer') {
			if (!BUFFER)
				throw new Error('\'Buffer\' is not supported in the current runtime environment.') 

			return o ? BUFFER.from(o, fromEnc) : new BUFFER(0)
		} else
			return _transcodeEncodedString(o, fromEnc, toEnc)
	}
	else if (toEnc == 'buffer')
		return data
	else
		return data.toString(toEnc)
}

const _base64ToJson = b64 => {
	const base64 = b64.replace(/-/g, '+').replace(/_/g, '/')
	const jsonPayload = decodeURIComponent(
		_base64ToUtf8(base64)
			.split('')
			.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join(''))

	return JSON.parse(jsonPayload)
}

const _base64ToUtf8 = base64 => {
	if (!base64)
		return ''
	if (ATOB)
		return ATOB(base64)
	else if (BUFFER)
		return BUFFER(base64, 'base64').toString()
	else
		throw new Error('Undetermined runtime environment. Could not determine whether the runtime is NodeJS (Buffer) or a browser (window.atob).')
}

const BIN_TO_HEX_MAP = {'0': '0000','1': '0001','2': '0010','3': '0011','4': '0100','5': '0101','6': '0110','7': '0111','8': '1000','9': '1001','a': '1010','b': '1011','c': '1100','d': '1101','e': '1110','f': '1111','A': '1010','B': '1011','C': '1100','D': '1101','E': '1110','F': '1111' }
const _hexToBin = hexaString => {
	let bitmaps = ''
	if (!hexaString)
		return bitmaps

	for (let i = 0; i < hexaString.length; i++)
		bitmaps += BIN_TO_HEX_MAP[hexaString[i]]

	return bitmaps
}

const HEX_TO_BIN_MAP = {'0000': '0','0001': '1','0010': '2','0011': '3','0100': '4','0101': '5','0110': '6','0111': '7','1000': '8','1001': '9','1010': 'A','1011': 'B','1100': 'C','1101': 'D','1110': 'E','1111': 'F' }
const _binToHex = binString => {
	let hex = ''
	if (!binString)
		return hex

	let counter = 0
	const l = binString.length
	const s = binString.split('').reverse().join('')
	let acc = ''
	for (let i = 0; i < l; i++) {
		counter++
		acc = s[i] + acc
		if (counter == 4) {
			counter = 0
			const v = HEX_TO_BIN_MAP[acc]
			acc = ''
			if (!v)
				throw new Error(`Failed to convert 'binString' to hexa string. Invalid characters between index ${l-i+1} and ${l-i+4} for input ${binString}.`)
			hex = v + hex
		}
	}

	if (counter > 0) {
		let h = s.slice(-counter).split('').reverse().join('')
		if (counter == 1)
			h = `000${h}`
		else if (counter == 2)
			h = `00${h}`
		else
			h = `0${h}`

		const v = HEX_TO_BIN_MAP[h]
		if (!v)
			throw new Error(`Failed to convert 'binString' to hexa string. Invalid characters between index 0 and ${counter} for input ${binString}.`)
		hex = v + hex
	}

	return hex
}

/**
 * Makes sure that the hex string is formatted properly to be understood by the Buffer API. 
 * 
 * @param  {String} hex		e.g., '1', '0001'
 * @return {String}       	e.g., '01', '0001'
 */
const _sanitizeHexaString = hex => {
	if (!hex)
		return ''
	return hex.length%2 ? `0${hex}` : hex
}

/**
 * 
 * @param  {String} str
 * @param  {String}	 fromEnc	Default 'utf8'. Allowed values: 'hex', 'utf8', 'base64', 'ascii', 'buffer' (only for NodeJS)
 * @param  {String}	 toEnc		Default 'utf8'. Allowed values: 'hex', 'utf8', 'base64', 'ascii', 'buffer' (only for NodeJS)
 * 
 * @return {String} transcodedString
 */
const _transcodeEncodedString = (str, fromEnc, toEnc) => {
	fromEnc = fromEnc || 'utf8'
	toEnc = toEnc || 'utf8'

	if (fromEnc == toEnc)
		return str

	if (BUFFER) {
		const o = BUFFER.from(str||'', fromEnc).toString(toEnc)
		return toEnc == 'hex' ? o.toUpperCase() : o
	}
	else if (ATOB) {
		const _fromEnc = fromEnc == 'utf8' || fromEnc == 'ascii' ? 'string' : fromEnc
		const _toEnc = toEnc == 'utf8' || toEnc == 'ascii' ? 'string' : toEnc
		if (_fromEnc == _toEnc)
			return str

		if (_fromEnc == 'base64') {
			if (_toEnc == 'string')
				return ATOB(str)
			else if (_toEnc == 'hex')
				return _browserBase64ToHex(str)
		} else if (_fromEnc == 'string') {
			if (_toEnc == 'base64')
				return BTOA(str)
			else if (_toEnc == 'hex')
				return _browserBase64ToHex(BTOA(str))
		} else if (_fromEnc == 'hex') {
			if (_toEnc == 'base64')
				return _browserHexToBase64(str)
			else if (_toEnc == 'string')
				return ATOB(_browserHexToBase64(str))
		}

		throw new Error(`Converting '${fromEnc}' to '${toEnc}' is not supported.`)
	} else 
		throw new Error('The current runtime environment does not support the basic utilities to encode or decode.')
}

const _browserBase64ToHex = str => {
	const raw = ATOB(str)
	let result = ''
	for (let i = 0; i < raw.length; i++) {
		const hex = raw.charCodeAt(i).toString(16)
		result += (hex.length === 2 ? hex : '0' + hex)
	}
	return result.toUpperCase()
}

const _browserHexToBase64 = hexstring => BTOA(((hexstring||'').match(/\w{2}/g)||[])
	.map(a => String.fromCharCode(parseInt(a, 16)))
	.join(''))





