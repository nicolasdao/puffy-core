/**
 * Copyright (c) 2021, Cloudless Consulting Pty Ltd.
 * All rights reserved.
 * 
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

/*
API:
	- fetch
*/


/**
 * Sends an AJAX request. 
 * Examples:
 *
 * // Submit a Form with a file
 * const { status, data } = await fetch.get({
 *        uri: 'http://localhost:4220/entry/32',
 *        headers: {
 *                'Content-Type': 'multipart/form-data'
 *            },
 *        body: {
 *            hello: 'World',
 *            myFile: document.querySelector('input[type="file"]').files[0]
 *        }
 *    })
 * 
 * // POST URL encoded data
 * const { status, data } = await fetch.post({
 *        uri: 'http://localhost:4220/entry/32',
 *        headers: {
 *                'Content-Type': 'application/x-www-form-urlencoded'
 *            },
 *        body: {
 *            hello: 'World'
 *        }
 *    })
 *    
 */
export const fetch = {
	'get': function(input) {
		return  _fetchMethod({ uri: input.uri, method:'GET', headers:input.headers, body:input.body, responseType:input.responseType })
	},
	post: function(input) {
		return  _fetchMethod({ uri: input.uri, method:'POST', headers:input.headers, body:input.body, responseType:input.responseType })
	},
	put: function(input) {
		return  _fetchMethod({ uri: input.uri, method:'PUT', headers:input.headers, body:input.body, responseType:input.responseType })
	},
	delete: function(input) {
		return  _fetchMethod({ uri: input.uri, method:'DELETE', headers:input.headers, body:input.body, responseType:input.responseType })
	},
	options: function(input) {
		return  _fetchMethod({ uri: input.uri, method:'OPTIONS', headers:input.headers, body:input.body, responseType:input.responseType })
	},
	head: function(input) {
		return  _fetchMethod({ uri: input.uri, method:'HEAD', headers:input.headers, body:input.body, responseType:input.responseType })
	},
	patch: function(input) {
		return  _fetchMethod({ uri: input.uri, method:'PATCH', headers:input.headers, body:input.body, responseType:input.responseType })
	},
	graphql: {
		query: graphQLQuery, // fetch.graphql.query({ uri, headers:{}, query: `{ users(where:{ id:1 }){ id name } }` })
		mutation: graphQLMutation // fetch.graphql.mutate({ uri, headers:{}, query: `{ userInsert(input:{ name:"Nic" }){ id name } }` })
	}
}


function _getResponseHeaders(xhttp) {
	// Get the raw header string
	var headers = xhttp.getAllResponseHeaders() || ''

	// Convert the header string into an array
	// of individual headers
	var arr = headers.trim().split(/[\r\n]+/)

	// Create a map of header names to values
	return arr.reduce(function(acc,line) {
		var parts = line.split(': ')
		var header = parts.shift()
		var value = parts.join(': ')
		acc[header] = value
		return acc
	}, {})
}

function _doNothing() { return null }

function _parseResponse(xhttp) {
	var content
	try {
		content = xhttp.responseText
	} catch(err) {
		_doNothing(err)
		content = xhttp.response
	}
	var status = xhttp.status
	var headers = _getResponseHeaders(xhttp) || {}
	var contentType = headers['content-type'] || headers['Content-Type']
	var isJSON = contentType && contentType.indexOf('json') >= 0

	if (isJSON) {
		try {
			var c = JSON.parse(content)
			return { status, data:c, headers }
		} catch(e) {
			_doNothing(e)
			return { 
				status:500, 
				data:{ 
					error: {
						message: 'Fairplay SDK Error. Server responded successfully, but the SDK failed to parse JSON response', 
						data: content
					}
				}, 
				headers
			}
		}
	} else {
		return { status, data:content, headers }
	}
}

function _setRequestHeaders(xhttp, headers) {
	if (!headers || !xhttp)
		return
	if (typeof(headers) != 'object')
		throw new Error('Wrong argument exception. \'headers\' must be an object.')

	Object.keys(headers).forEach(function(key) {
		var value = headers[key]
		// Do not add 'multipart/form-data' content type if it is missing the boundary info. 
		// By not specifying it and POSTing a 'FormData' object, the browser automatically set the Content-Type as follow:
		//     'multipart/form-data; boundary=----WebKitFormBoundaryj7VA9uHwoGFvcBQx'
		const skip = (key == 'Content-Type' || key == 'content-type') && value && value.indexOf('multipart/form-data') >= 0 && value.indexOf('boundary') < 0
		if (!skip)
			xhttp.setRequestHeader(key, value)
	})
}

function _getBody(headers, body) {
	var bodyType = typeof(body)
	var nativeBody = !body || bodyType == 'string' || (body instanceof Blob) || (body instanceof FormData) || (body instanceof URLSearchParams)
	if (nativeBody)
		return body

	var contentType = (!headers || typeof(headers) != 'object' 
		? ''
		: headers['Content-Type'] || headers['content-type'] || '').toLowerCase().trim()

	var isUrlEncoded = contentType == 'application/x-www-form-urlencoded'
	var isFormEncoded = contentType == 'multipart/form-data'
	if ((isUrlEncoded || isFormEncoded) && bodyType == 'object') {
		var params = isUrlEncoded ? new URLSearchParams() : new FormData()
		for (var key in body) {
			var value = body[key]
			if (value !== null && value !== undefined) {
				if (isFormEncoded && typeof(value) == 'object' && !(value instanceof Blob))
					params.append(key, new Blob([JSON.stringify(value)], { type:'application/json' }))    
				else
					params.append(key, value)
			}
		}
		return params
	} else 
		return JSON.stringify(body)
}

/**
 * Sends an AJAX request. 
 * Examples:
 *
 * // Submit a Form with a file
 * const { status, data } = await _fetchMethod({
 *        uri: 'http://localhost:4220/entry/32',
 *        method: 'POST',
 *        headers: {
 *                'Content-Type': 'multipart/form-data'
 *            },
 *        body: {
 *            hello: 'World',
 *            myFile: document.querySelector('input[type="file"]').files[0]
 *        }
 *    })
 * 
 * // POST URL encoded data
 * const { status, data } = await _fetchMethod({
 *        uri: 'http://localhost:4220/entry/32',
 *        method: 'POST',
 *        headers: {
 *                'Content-Type': 'application/x-www-form-urlencoded'
 *            },
 *        body: {
 *            hello: 'World'
 *        }
 *    })
 *    
 * @param {String}	uri             
 * @param {String}	method			HTTP methods. Valid values are: 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD' and 'PATCH'.            
 * @param {Object}	headers			HTTP request headers.             
 * @param {Object}	body			Payload.
 * @param {String}	responseType	e.g., 'text', 'blob' (use 'blob' for images)
 * 
 * @yield {Number}	output.status	HTTP response status code 
 * @yield {Object}	output.data		If the response's content type if application/json, then 'data' is a JSON object, otherwise, it is a string. 
 * @yield {Object}	output.headers	HTTP response headers
 */
function _fetchMethod(input) { 
	var uri = input.uri
	var method = input.method
	var headers = input.headers || {}
	var body = input.body
	var responseType = input.responseType
	return new Promise(function (resolve,reject) {
		if (!WIN || !WIN.XMLHttpRequest)
			reject(new Error('\'window.XMLHttpRequest\' not found. The current runtime environment does not support. It might not be a browser.'))

		try {
			if (!uri)
				throw new Error('Missing required argument \'uri\'.')
			if (!method)
				throw new Error('Missing required argument \'method\'.')

			var xhttp = new WIN.XMLHttpRequest()
			// 1. Define the handler that processes the response.
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == WIN.XMLHttpRequest.DONE) {
					var res = _parseResponse(xhttp)
					resolve(res)
				}
			}
			if (responseType)
				xhttp.responseType = responseType
			xhttp.open(method, uri, true) 
			_setRequestHeaders(xhttp, headers)

			var payload = _getBody(headers, body)

			// 3. Execute the HTTP request.
			if (payload)
				xhttp.send(payload)
			else
				xhttp.send()
		} catch (e) {
			reject(e)
		}
	})
}

function graphQLQuery(input) {
	var uri = input.uri
	var headers = input.headers
	var query = input.query
	if (!uri)
		throw new Error('Missing required \'uri\' argument.')
	if (!query)
		throw new Error('Missing required \'query\' argument.')
	if (typeof(query) != 'string')
		throw new Error('Wrong argument exception. \'query\' must be a string.')

	var api_url = uri + '?query=' + encodeURIComponent(query)
	return _fetchMethod({ uri:api_url, method:'GET', headers })
}

function graphQLMutation(input) {
	var uri = input.uri
	var headers = input.headers
	var query = input.query
	if (!uri)
		throw new Error('Missing required \'uri\' argument.')
	if (!query)
		throw new Error('Missing required \'query\' argument.')
	if (typeof(query) != 'string')
		throw new Error('Wrong argument exception. \'query\' must be a string.')
	var api_url = uri + '?query=mutation' + encodeURIComponent(query)
	return _fetchMethod({ uri:api_url, method:'POST', headers })
}

const WIN = (typeof window !== 'undefined') ? window : null


