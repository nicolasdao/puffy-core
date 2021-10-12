# PUFFY CORE

> WARNING: Only supported by NodeJS >= 13. To use this package with NodeJS 12, use the `--experimental-modules` flag.

A collection of ES6 modules with zero-dependencies to help manage common programming tasks in both NodeJS or native JS. 

```
npm i puffy-core
```

# Table of contents

> * [APIs](#apis)
>	- [`collection`](#collection)
>	- [`converter`](#converter)
>	- [`date`](#date)
>	- [`error`](#error)
>	- [`math`](#math)
>	- [`obj`](#obj)
>	- [`string`](#string)
>	- [`time`](#time)
>	- [`url`](#url)
>	- [`validate`](#validate)
> * [Unit test](#unit-test)
> * [License](#license)

# APIs
## `collection`

```js
import { batch, uniq, sortBy, seed, headTail, levelUp } from 'puffy-core/collection'

// batch
console.log(batch([1,2,3,4,5,6,7,8,9,10], 3)) // [[1,2,3], [4,5,6], [7,8,9], [10]]

// uniq
console.log(uniq([1,1,1,1,2,2])) // [1,2]
console.log(uniq([{ name:'Ben' },{ name:'Ben' },{ name:'Jerry' }], x => x.name)) // [{ name:'Ben' }, { name:'Jerry' }]

// sortBy
console.log(sortBy([2,1,4,3])) // [1,2,3,4]
console.log(sortBy([2,1,4,3], 'desc')) // [4,3,2,1]
console.log(sortBy([{ name:'Nic', age:40 }, { name:'Paul', age:50 }, { name:'Lin', age:30 }], x => x.age)) // [{ name:'Lin', age:30 }, { name:'Nic', age:40 }, { name:'Paul', age:50 }]
console.log(sortBy([{ name:'Nic', age:40 }, { name:'Paul', age:50 }, { name:'Lin', age:30 }], x => x.age, 'desc')) // [{ name:'Paul', age:50 }, { name:'Nic', age:40 }, { name:'Lin', age:30 }]

// seed
console.log(seed(3)) // [undefined, undefined, undefined]

// headTail
console.log(headTail([1,2,3,4,5,6,7,8], 3)) // [[1,2,3], [4,5,6,7,8]]

// levelUp
console.log(levelUp([1], [2,2], [3,3,3])) // [[1,undefined,undefined], [2,2,undefined], [3,3,3]]
```

## `converter`

```js
import { addZero, nbrToCurrency } from 'puffy-core/converter'

// addZero
console.log(addZero(123,10)) // '0000000123'

// nbrToCurrency
console.log(nbrToCurrency(123)) // '$123.00'
console.log(nbrToCurrency(123, '$')) // '$123.00'
console.log(nbrToCurrency(123, 'dollar')) // '$123.00'

console.log(nbrToCurrency(123, 'euro')) // '€123.00'
console.log(nbrToCurrency(123, '€')) // '€123.00'

console.log(nbrToCurrency(123, 'yen')) // '¥123.00'
console.log(nbrToCurrency(123, 'yuan')) // '¥123.00'
console.log(nbrToCurrency(123, '¥')) // '¥123.00'

console.log(nbrToCurrency(123, 'pound')) // '£123.00'
console.log(nbrToCurrency(123, '£')) // '£123.00'
```

## `date`

```js
import { addSeconds, addMinutes, addHours, addDays, addMonths, addYears, formatDate } from 'puffy-core/date'

// addSeconds
console.log(addSeconds(new Date()))

// addMinutes
console.log(addMinutes(new Date()))

// addHours
console.log(addHours(new Date()))

// addDays
console.log(addDays(new Date()))

// addMonths
console.log(addMonths(new Date()))

// addYears
console.log(addYears(new Date()))

// formatDate
const refDate = new Date('2021-10-12T13:45:21')
console.log(formatDate(refDate)) // '2021-10-12'
console.log(formatDate(refDate, { format:'dd-MM-yyyy' })) // '12-10-2021'
console.log(formatDate(refDate, { format:'ddMMyyyy' })) // '12102021'
console.log(formatDate(refDate, { format:'MMyy' })) // '1021'
console.log(formatDate(refDate, { format:'dd/MM/yy' })) // '12/10/21'
console.log(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss' })) // '12/10/21 13:45:21'
console.log(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss', utc:true })) // '12/10/21 03:45:21'
console.log(formatDate(refDate, { format:'The dd of MMM, yyyy' })) // 'The 12 of October, 2021'
console.log(formatDate(refDate, { format:'The dd{nth} of MMM, yyyy' })) // 'The 12th of October, 2021'
```

## `error`

```js
import { catchErrors, wrapErrors, mergeErrors } from 'puffy-core/error'

const asyncSucceed = () => new Promise(next => next(123))
const asyncFail = () => new Promise((,fail) => fail(new Error('Boom')))
const syncSucceed = () => 123
const syncFail = () => { throw new Error('Boom') }

const main = async () => {
	const allErrors = []

	// Handles Promises 
	const [errors01, data01] = await catchErrors(asyncSucceed())
	if (errors01) {
		console.log(`'asyncSucceed' failed`)
		allErrors.push(...errors01)
	} else
		console.log(`'asyncSucceed' succeeded`)


	const [errors02, data02] = await catchErrors(asyncFail())
	if (errors02) {
		console.log(`'asyncFail' failed`)
		allErrors.push(...errors02)
	} else
		console.log(`'asyncFail' succeeded`)

	// Handles synchronous functions 
	const [errors03, data03] = catchErrors(syncSucceed)
	if (errors03) {
		console.log(`'syncSucceed' failed`)
		allErrors.push(...errors03)
	} else
		console.log(`'syncSucceed' succeeded`)


	const [errors04, data04] = catchErrors(syncFail)
	if (errors04) {
		console.log(`'syncFail' failed`)
		allErrors.push(...errors04)
	} else
		console.log(`'syncFail' succeeded`)

	// Creates a new Error object with all the errors in it.
	if (allErrors.length)
		throw wrapErrors('A few errors occured', allErrors)
	else
		return 'no errors'
}

catchErrors(main()).then(([errors, data]) => {
	if (errors)
		console.error(mergeErrors(errors).message)
	else
		console.log(data)
})
```

## `math`

```js
import { avg, stdDev, median, getRandomNumber, getRandomNumbers } from 'puffy-core/math'

// avg
console.log(avg([5,5,5,5,5])) // 5
console.log(avg([1,2,3,4])) // 2.5

// stdDev
console.log(stdDev([5,5,5,5,5])) // 0
console.log(stdDev([1,2,3,4])) // 1.118033988749895

// median
console.log(median([5,5,5,5,5])) // 5
console.log(median([1,2,3,4])) // 2.5

// getRandomNumber
console.log(getRandomNumber()) // 0.37165509291630117
console.log(getRandomNumber({ start:1000, end:3000 })) // 2855
console.log(getRandomNumbers({ start:1000, end:3000, size:5 })) // [ 1434, 2276, 2468, 1881, 1095 ]
```

## `obj`

```js
import { merge, setProperty, getProperty, extractFlattenedJSON } from 'puffy-core/obj'

// merge
console.log(merge(
	{ name:'Nic', age:38 }, 
	{ address:{ street:'hello' } }, 
	{ friends:['Peter','Roger'], address:{ code:2000 }, age:40 }))
// {
//		name: 'Nic',
//		age: 40,
//		address: { street: 'hello', code: 2000 },
//		friends: [ 'Peter', 'Roger' ]
// }

// setProperty
console.log(setProperty({ name:'Nic' }, 'company.name', 'Neap Pty Ltd')) // { name:'Nic', company:{ name: 'Neap Pty Ltd' } }

// getProperty
console.log(getProperty({ name:'Nic', friends:[{ name:'Peter' },{ name:'Bob' }] }, 'name')) // 'Nic'
console.log(getProperty({ name:'Nic', friends:[{ name:'Peter' },{ name:'Bob' }] }, 'friends[1].name')) // 'Bob'

// extractFlattenedJSON
console.log(extractFlattenedJSON({
	'user.firstName': 'Nicolas',
	'user.age': 38,
	'user.friends[0].name': 'Brendan',
	'user.friends[0].age': 31,
	'user.friends[1].name': 'Boris',
	'user.friends[1].age': 32
}))
// {
// 	user: {
// 		firstName: 'Nicolas',
// 		age: 38,
// 		friends:[{
// 			name: 'Brendan',
// 			age: 31
// 		},{
// 			name: 'Boris',
// 			age: 32
// 		}]
// 	}
// }
```

## `string`

```js
import { plural } from 'puffy-core/string'

// plural
console.log(plural('cat', 1)) // cat
console.log(plural('cat', 2)) // cats
console.log(plural('He', 2)) // They
console.log(plural('She is', 2)) // They are
console.log(plural('its', 2)) // their
```

## `time`

```js
import { delay, Timer } from 'puffy-core/time'

const main = async () => {
	const start = Date.now()
	await delay(2000)
	console.log(`${Date.now() - start} milliseconds have passed.`)

	const timer = new Timer()
	await delay([1000, 5000]) // random delay between 1000 and 5000 ms.
	console.log(`${timer.time('second')} seconds have passed.`)

	timer.reStart() // equivalent to timer.time('second', true)
}

main()
```

## `url`

```js
import { getUrlParts } from 'puffy-core/url'

// getUrlParts
console.log(getUrlParts('https://localhost:3456/hello/world?name=carl&age=40#home'))

// {
// 	href: 'https://localhost:3456/hello/world?name=carl&age=40#home',
// 	origin: 'https://localhost:3456',
// 	protocol: 'https:',
// 	username: '',
// 	password: '',
// 	host: 'localhost:3456',
// 	hostname: 'localhost',
// 	port: '3456',
// 	pathname: '/hello/world',
// 	search: '?name=carl&age=40',
// 	searchParams: URLSearchParams { 'name' => 'carl', 'age' => '40' },
// 	queryParams: {
// 		name: 'carl',
// 		age: '40'
// 	},
// 	hash: '#home'
// }
```

## `validate`

```js
import { validateUrl, validateEmail } from 'puffy-core/validate'

// validateEmail
console.log(validateUrl('https://neap.co')) // true
console.log(validateUrl('hello')) // false
console.log(validateEmail('nic@neap.co')) // true
console.log(validateEmail('nic @neap.co')) // false
```

# Unit test

```
npm test
```

# License

BSD 3-Clause License

Copyright (c) 2019-2021, Cloudless Consulting Pty Ltd
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
