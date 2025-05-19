# PUFFY CORE

> __WARNING__: 
> - Only supported by NodeJS >= 13. To use this package with NodeJS 12, use the `--experimental-modules` flag.
> - As of version >= 1.3.0 all APIs are also available in snake-case (e.g., `newId()` and `new_id()` are both available).

A collection of ES6 modules with zero-dependencies to help manage common programming tasks in both NodeJS or native JS. This package supports both the `import/export` and `require` APIs via the `exports` and `main` entry points in the `package.json`.

```
npm i puffy-core
```


# Table of contents

> * [APIs](#apis)
>	- [`collection`](#collection)
>	- [`converter`](#converter)
>	- [`crypto`](#crypto)
>	- [`date`](#date)
>	- [`db`](#db)
>	- [`error`](#error)
>		- [Quick start](#error-api---quick-start)
>		- [Adding a response even when an error is thrown](#adding-a-response-even-when-an-error-is-thrown)
>	- [`func`](#func)
>	- [`logger`](#logger)
>	- [`math`](#math)
>	- [`obj`](#obj)
>	- [`string`](#string)
>	- [`time`](#time)
>	- [`url`](#url)
>	- [`validate`](#validate)
> * [LLM system prompts](#llm-system-prompts)
> 	- [Overview](#overview)
> 	- [Error handling](#error-handling)
> * [Dev](#dev)
>	- [About this project](#about-this-project)
>	- [Building this project for both CommonJS and ES6 modules](#building-this-project-for-both-commonjs-and-es6-modules)
>	- [Unit test](#unit-test)
> * [Annexes](#annexes)
>	- [Creating URLs with the `URL` object](#creating-urls-with-the-url-object)
> * [License](#license)

# APIs
## `collection`

> CommonJS API: `const { collection } = require('puffy-core')`

```js
import { batch, uniq, sortBy, seed, headTail, levelUp, flatten, flattenUniq } from 'puffy-core/collection'

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

// flatten
console.log(flatten(1,[1,2,3],[4,5,[6,7]],8,9,[6])) // [1,1,2,3,4,5,6,7,8,9,6]

// flattenUniq
console.log(flattenUniq(1,[1,2,3],[4,5,[6,7]],8,9,[6])) // [1,2,3,4,5,6,7,8,9]
```

## `converter`

> CommonJS API: `const { converter } = require('puffy-core')`

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

## `crypto`

> CommonJS API: `const { crypto } = require('puffy-core')`

```js
import { encoder, jwtDecode } from 'puffy-core/crypto'

// encoder
const stringEncoder = encoder()
const stringToBase64 = stringEncoder('base64')
const stringToBin = stringEncoder('bin')
const stringToHex = stringEncoder('hex')
const stringToBuffer = stringEncoder('buffer')

const base64Encoder = encoder('base64')
const base64ToString = base64Encoder()
const base64ToBin = base64Encoder('bin')
const base64ToHex = base64Encoder('hex')
const base64ToBuffer = base64Encoder('buffer')

const binEncoder = encoder('bin')
const binToString = binEncoder()
const binToBase64 = binEncoder('base64')
const binToHex = binEncoder('hex')
const binToBuffer = binEncoder('buffer')

const bufferEncoder = encoder('buffer')
const bufferToString = bufferEncoder()
const bufferToBase64 = bufferEncoder('base64')
const bufferToHex = bufferEncoder('hex')
const bufferToBin = bufferEncoder('bin')

const str = 'hello world'
console.log(stringToBase64(str)) // 'aGVsbG8gd29ybGQ='
console.log(stringToBin(str)) // '0110100001100101011011000110110001101111001000000111011101101111011100100110110001100100'
console.log(stringToHex(str)) // '68656C6C6F20776F726C64'
console.log(stringToBuffer(str)) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

const base64Str = 'aGVsbG8gd29ybGQ='
console.log(base64ToString(base64Str)) // 'hello world'
console.log(base64ToBin(base64Str)) // '0110100001100101011011000110110001101111001000000111011101101111011100100110110001100100'
console.log(base64ToHex(base64Str)) // '68656C6C6F20776F726C64'
console.log(base64ToBuffer(base64Str)) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

const binStr = '0110100001100101011011000110110001101111001000000111011101101111011100100110110001100100'
console.log(binToString(binStr)) // 'hello world'
console.log(binToBase64(binStr)) // 'aGVsbG8gd29ybGQ='
console.log(binToHex(binStr)) // '68656C6C6F20776F726C64'
console.log(binToBuffer(binStr)) // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

const buf = stringToBuffer('hello world')
console.log(bufferToString(buf)) // 'hello world'
console.log(bufferToBase64(buf)) // 'aGVsbG8gd29ybGQ='
console.log(bufferToHex(buf)) // '68656C6C6F20776F726C64'
console.log(bufferToBin(buf)) // '0110100001100101011011000110110001101111001000000111011101101111011100100110110001100100'

// jwtDecode
const { header, payload, signBase64 } = jwtDecode('YOUR JWT TOKEN HERE')
const data = jwtDecode('YOUR JWT TOKEN HERE', { noFail:true }) // The 'noFail' option returns null instead of throwing an exception when the token is invalid.
```

## `date`

> CommonJS API: `const { date } = require('puffy-core')`

```js
import { addSeconds, addMinutes, addHours, addDays, addMonths, addYears, formatDate, getTimeDiff, toTz } from 'puffy-core/date'

// addSeconds
console.log(addSeconds(new Date(), 30))

// addMinutes
console.log(addMinutes(new Date(), 65))

// addHours
console.log(addHours(new Date(), 3))

// addDays
console.log(addDays(new Date(), 4))

// addMonths
console.log(addMonths(new Date(), 3))

// addYears
console.log(addYears(new Date(), -10))

// formatDate
const refDate = new Date('2021-10-12T13:45:21Z')
console.log(formatDate(refDate)) // '2021-10-12'
console.log(formatDate(refDate, { format:'dd-MM-yyyy' })) // '12-10-2021'
console.log(formatDate(refDate, { format:'ddMMyyyy' })) // '12102021'
console.log(formatDate(refDate, { format:'MMyy' })) // '1021'
console.log(formatDate(refDate, { format:'dd/MM/yy' })) // '12/10/21'
console.log(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss' })) // '12/10/21 13:45:21'
console.log(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss', utc:true })) // '12/10/21 03:45:21'
console.log(formatDate(refDate, { format:'The dd of MMM, yyyy' })) // 'The 12 of October, 2021'
console.log(formatDate(refDate, { format:'The dd{nth} of MMM, yyyy' })) // 'The 12th of October, 2021'

// formatDate with time zone (full list of time zones at https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
console.log(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss', tz:'Australia/Sydney' })) // '13/10/21 00:45:21'
console.log(formatDate(refDate, { format:'dd/MM/yy HH:mm:ss', tz:'local' })) // '12/10/21 21:45:21'

// Converts a UTC date into another UTC date shifted as if it was in a specific timezone.
const refDate2 = new Date('2024-01-23T09:42:57.311Z')
console.log(toTz(refDate2).toISOString())	// '2024-01-23T09:42:57.311Z'
console.log(toTz(refDate2,'local').toISOString())	// '2024-01-23T17:42:57.311Z'
console.log(toTz(refDate2,'Australia/Sydney').toISOString())	// '2024-01-23T20:42:57.311Z'
console.log(toTz(refDate2,'America/Chicago').toISOString())	// '2024-01-23T03:42:57.311Z'

// getTimeDiff (default unit is millisecond)
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09')))				// 10548540000
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'ms'))			// 10548540000
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'millisecond'))	// 10548540000
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 's'))			// 10548540
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'sec'))			// 10548540
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'second'))		// 10548540
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'm'))			// 175809
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'minute'))		// 175809
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'h'))			// 2930.15
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'hour'))		// 2930.15
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'd'))			// 122.08958333333334
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'day'))			// 122.08958333333334
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'w'))			// 17.441369047619048
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'week'))		// 17.441369047619048
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'month'))		// 4.0147840622602216
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'y'))			// 0.3344920091324201
console.log(getTimeDiff('2021-08-12', new Date('2021-12-12T13:09'), 'year'))		// 0.3344920091324201
```

## `db`

> CommonJS API: `const { db } = require('puffy-core')`

`newId` is an API the returns a `BigInt` that can be used as a primary key in any database. The advantage of that value is that it is random and grows monotonically with time. This is a great attribute of a primary key that can then be used to sort by creation time. The break down is as follow:

`1737111960607002926 -> 1737111960607 00 2926`, where:
- `1737111960607`. By default this is the current epoch in milliseconds. This can be set via the `timestamp` option.
- `00` is the `node`. By default, that value is `00`. This can be set up to 99 via the `node` option.
- `2926` is the `index aka idx`. By default, it is another random value ranging from `0` to `9999`. It can be manually set via the `idx` option.

```js
import { newId } from 'puffy-core/db'

console.log(newId()) 									// 1737111960607002926n -> 1737111960607 00 2926n
console.log(newId({ node:18 })) 						// 1737111960611181693n -> 1737111960611 18 1693n
console.log(newId({ node:18, idx:9999 })) 				// 1737111960611189999n -> 1737111960611 18 9999n
console.log(newId({ timestamp:new Date('1985-03-21') }))//  480211200000003307n ->  480211200000 00 3307n
```

## `error`
### `error` API - Quick start
> CommonJS API: `const { error } = require('puffy-core')`

This API uses a functional approach to handling errors. Instead of throwing errors, errors are accumulated. It is up to the software engineer to manage what to do with them. The Errors are accumulated in the inverse order of occurance. This means that the first error is the highest in the stack while the last error is at the bottom of the stack (i.e., the original error that occured in the first place).

Supported signatures:
- `const [errors, value] = catchErrors(() => console.log('hello'))`
- `const [errors, value] = await catchErrors(async () => console.log('hello'))`
- `const [errors, value] = await catchErrors(myRiskyPromise)`
- `const [errors, value] = catchErrors('Wrapper error message to give more context', () => console.log('hello'))`
- `const [errors, value] = await catchErrors('Wrapper error message to give more context', async () => console.log('hello'))`
- `const [errors, value] = await catchErrors('Wrapper error message to give more context', myRiskyPromise)`

```js
import { catchErrors, wrapErrors, wrapErrorsFn, wrapCustomErrors, mergeErrors, getErrorMetadata, PuffyResponse, required } from 'puffy-core/error'

// 'catchErrors' always returns a 2 items array: [errors, data]. This array is of type 'PuffyResponse'.

const asyncSucceed = () => new Promise(next => next(123))
const asyncFail = () => new Promise((_,fail) => fail(new Error('Boom')))
// Add metadata to an error
const meta = { hello:'world' }
const asyncFailWithMetadata = () => new Promise((_,fail) => fail(wrapCustomErrors(meta)('Boom')))
const syncSucceed = () => 123
const syncFail = () => { throw new Error('Boom') }

const test_required = ({ hello, world }) => catch_errors(`'test_required' failed`, () => {
	required({ hello, 'world.hello_again':world?.hello_again })

	console.log(`'test_required' passed`)
})

const main = async options => {
	const allErrors = []

	// This will not fail because all the required properties have been passed.
	const [test_required_01_errors] = test_required({ hello:'Hello', world:{hello_again:'hello_again'} })

	// This will fail because the 'world.hello_again' property has not been passed.
	const [test_required_02_errors] = test_required({ hello:'Hello' })
	if (test_required_02_errors) {
		console.log(`'test_required' failed`)
		allErrors.push(...test_required_02_errors)
	}

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

	// Adds metadata to errors
	const [errors05, data05] = await catchErrors(asyncFailWithMetadata())
	if (errors05) {
		console.log('Shows error metadata')
		console.log([errors05[0].metadata])
		// Merges all the metadata into single object
		console.log(getErrorMetadata(errors05))
		allErrors.push(...errors05)
	}

	// Creates a new Error object with all the errors in it.
	if (allErrors.length) {
		// This helps wrapping the error stack under another error that provide more context. This is equivalent to:
		// const e = (...errors) => wrapErrors(`This API broke`, ...errors)
		const e = wrapErrorsFn(`This API broke`)
		if (options && options.wrapErrors)
			throw e(allErrors)
		else
			throw wrapErrors('A few errors occured', allErrors)
	} else
		return 'no errors'
}

catchErrors(main()).then(([errors, data]) => {
	if (errors)
		console.error(mergeErrors(errors).message)
	else
		console.log(data)
})
```

> NOTES: 
>	- __`wrapErrors`__ supports an arbitrary amount of inputs with both string and Error types:
>	```js
>	wrapErrors('I am an error', new Error('I am another error'), [new Error('We are other errors')])
>	```
>	- __`wrapErrorsFn`__ is sugarcode for `(...errors) => wrapErrors(`This API broke`, ...errors)`.

### Adding a response even when an error is thrown

In this scenario, a process may partially succeed. In those types of cases, we want to capture both the errors and the completed responses. Such process (in the example below `myProcess`) would behave like this:

```js
const [errors, resp] = await myProcess(allItems)
if (errors)
	manageErrors(errors)
if (resp)
	manageResponse(resp)
```

By default, using the `catchErrors` in conjunction with one of the wrapping error APIs (i.e., `wrapErrors`, `wrapErrorsFn`, `wrapCustomErrors`) does not behave as such. By default, the behavior is either fully succeeded or fully failed. To change that behavior, all the wrapping error APIs support a `response` API that can pass a response back. For example:

```js
import { catchErrors, wrapErrors } from 'puffy-core/error'

const myProcess = items => catchErrors((async () => {
	// ... process items and catch errors
	if (errors)
		throw wrapErrors(`Some items have failed`, errors).response(processedItems)
	else
		return processedItems
})())
```

## `func`

> CommonJS API: `const { func } = require('puffy-core')`

```js
import { chainAsync, chainSync } from 'puffy-core/func'
import { catchErrors } from 'puffy-core/error'

const main = async () => {
	const [errors01, data01] = await chainAsync(
		() => Promise.resolve(1),								// 1
		previous => Promise.resolve(previous+1),				// 2
		previous => previous+2,									// 3
		previous => catchErrors(Promise.resolve(previous+1)),	// 4
		previous => previous+3									// 5
	)

	console.log(errors01) // null
	console.log(data01) // { data: [ 1, 2, 4, 5, 8 ], value: 8 } // where value is the last result.

	// Notice that the 4th function does not return [errors, data] to the 5th function, but data instead. 
	// This is by design. catchErrors return a array of type PuffyResponse which is interpreted by chainAsync
	// so that only the result is return if no errors occured.

	const [errors02, data02] = await chainAsync(
		() => Promise.resolve(1),
		previous => Promise.resolve(previous+1).then(() => { throw new Error('Boom')})
	)

	console.log(errors02) // [{ message:'Boom' }]
	console.log(data02) // null

	const [errors03, data03] = await chainAsync(
		() => Promise.resolve(1),
		previous => catchErrors(Promise.resolve(previous+1).then(() => { throw new Error('Boom')}))
	)

	console.log(errors03) // [{ message:`'chainAsync' function failed` }, { message:'Boom' }]
	console.log(data03) // null

	// Same API than 'chainAsync', but for synchronous functions.
	const [errors04, data04] = chainSync(
		() => 1,
		previous => previous+1,
		previous => previous+2
	)

	console.log(errors04) // null
	console.log(data04) // null
}

main()
```

## `logger`

> CommonJS API: `const { logger } = require('puffy-core')`

```js
import { log } from 'puffy-core/logger'

log({
	level:'INFO', // 'WARN', 'ERROR', 'CRITICAL'
	code:'12343',
	message:'Hello world',
	data:{
		hello:'world'
	},
	errors:['Oh shit',new Error('Damn!')]
})
```

```js
{"level":"INFO","test":false,"message":"Hello world","code":"12343","data":{"hello":"world"},"errors":[{"message":"Oh shit","stack":""},{"message":"Damn!","stack":"Error: Damn!\n    at main (file:///Users/nicolasdao/Documents/projects/puffy/puffy-core/index.mjs:20:21)\n    at file:///Users/nicolasdao/Documents/projects/puffy/puffy-core/index.mjs:65:1\n    at ModuleJob.run (node:internal/modules/esm/module_job:198:25)\n    at async Promise.all (index 0)\n    at async ESMLoader.import (node:internal/modules/esm/loader:409:24)\n    at async loadESM (node:internal/process/esm_loader:85:5)\n    at async handleMainPromise (node:internal/modules/run_main:61:12)"}]}
```

## `math`

> CommonJS API: `const { math } = require('puffy-core')`

```js
import { avg, stdDev, median, percentile, getRandomNumber, getRandomNumbers } from 'puffy-core/math'

// avg
console.log(avg([5,5,5,5,5])) // 5
console.log(avg([1,2,3,4]))   // 2.5

// stdDev
console.log(stdDev([5,5,5,5,5])) // 0
console.log(stdDev([1,2,3,4]))   // 1.118033988749895

// median
console.log(median([5,5,5,5,5])) // 5
console.log(median([1,2,3,4]))   // 2.5

// percentile
const percentile5th = percentile(5)
const percentile75th = percentile(75)
const percentile95th = percentile(95)
const data = [12,45,23,87,13,54,23,12,1,1,23,67,54,34,35,43,27,56]
console.log(percentile5th(data))  // 1
console.log(percentile75th(data)) // 54
console.log(percentile95th(data)) // 87

// getRandomNumber
console.log(getRandomNumber()) // 0.37165509291630117
console.log(getRandomNumber({ start:1000, end:3000 })) // 2855
console.log(getRandomNumbers({ start:1000, end:3000, size:5 })) // [ 1434, 2276, 2468, 1881, 1095 ]
```

## `obj`

> CommonJS API: `const { obj } = require('puffy-core')`

```js
import { merge, setProperty, getProperty, extractFlattenedJSON, exists, existsAny, existsAll, isEmpty } from 'puffy-core/obj'

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

// exists
console.log(exists()) // false
console.log(exists(undefined)) // false
console.log(exists(null)) // false
console.log(exists({})) // true
console.log(exists(0)) // true
console.log(exists('Hello')) // true

// existsAny
console.log(existsAny(null, undefined)) // false
console.log(existsAny(0, undefined)) // true

// existsAll
console.log(existsAll(null, undefined)) // false
console.log(existsAll(0, undefined)) // false
console.log(existsAll(0, '')) // true

// isEmpty
console.log(isEmpty()) // true
console.log(isEmpty({})) // true
console.log(isEmpty({ hello:'world' })) // false
```

## `string`

> CommonJS API: `const { string } = require('puffy-core')`

```js
import { plural, justifyLeft, safeStringify } from 'puffy-core/string'

// safeStringify. Same as JSON.stringify but can deal with BigInt

// plural
console.log(plural(1, 'cat')) // cat
console.log(plural(2, 'cat')) // cats
console.log(plural(2, 'He')) // They
console.log(plural(2, 'its')) // their
console.log(plural(1, 'Test record')) // Test record
console.log(plural(2, 'Test record')) // Test records

// Also support multiple words:
console.log(plural(1, 'Project', 'was')) // Project was
console.log(plural(2, 'Project', 'was')) // Projects were
console.log(plural(1, 'She', 'is')) // She is
console.log(plural(2, 'She', 'is')) // They are
console.log(plural(1, 'Test record', 'is')) // Test record is
console.log(plural(2, 'Test record', 'is')) // Test records are

// justifyLeft
const text = `		Hello,
	This is a list:
	- Fruits:
		- Apple
		- Orange`

console.log(justifyLeft(text))
/*
Hello,
This is a list:
- Fruits:
- Apple
- Orange
 */

console.log(justifyLeft(text, { prefix:'> ' }))
/*
> Hello,
> This is a list:
> - Fruits:
> - Apple
> - Orange
 */

// The 'anchorLine' is the line used as reference by all the other line. 
console.log(justifyLeft(text, { anchorLine:0 })) 
/*
		Hello,
		This is a list:
		- Fruits:
		- Apple
		- Orange
 */

console.log(justifyLeft(text, { remove:'	' })) 
/*
	Hello,
This is a list:
- Fruits:
	- Apple
	- Orange
 */

console.log(justifyLeft(text, { remove:true, anchorLine:1 })) 
/*
	Hello,
This is a list:
- Fruits:
	- Apple
	- Orange
 */

console.log(justifyLeft(text, { remove:true, anchorLine:1, skip:0 })) 
/*
This is a list:
- Fruits:
	- Apple
	- Orange
 */

console.log(justifyLeft(text, { remove:true, anchorLine:1, skip:[0,1] })) 
/*
- Fruits:
	- Apple
	- Orange
 */
```

## `time`

> CommonJS API: `const { time } = require('puffy-core')`

```js
import { delay, Timer } from 'puffy-core/time'

const main = async () => {
	const start = Date.now()
	// 1. Creating a 2 seconds delay
	await delay(2000)
	console.log(`${Date.now() - start} milliseconds have passed.`)

	// 2. Creating and starting a new timer
	const timer = new Timer()
	
	// 3. Creating a random delay between 1000 and 5000 ms.
	await delay([1000, 5000]) 
	
	// 4. Logging the ellapsed time
	console.log(`${timer.time('second')} seconds have passed.`)

	// 5. Restaring the timer. This is equivalent to timer.time('second', true)
	timer.reStart() 

	// 6. Creating a custom response after the delay
	const r = await delay(1000, { hello:'world' })
	console.log(r) // { hello:'world' }

	// 7. Cancelling a delay. This can be required to prevent other actions to be triggered or to prevent a serverless function to run longer than it should.
	const race1 = delay(5000, 'race1')
	const race2 = delay(3000, 'race2')
	const winner = await Promise.race([race1, race2])
	if (winner == 'race1')
		race2.cancel()
	else
		race1.cancel()
}

main()
```

## `url`

> - CommonJS API: `const { url } = require('puffy-core')`
> - To create new URLs safely, use the native `URL` object as described in the [Annexes](#annexes) under the [Creating URLs with the `URL` object](#creating-urls-with-the-url-object) section.

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

> CommonJS API: `const { validate } = require('puffy-core')`

```js
import { validateUrl, validateEmail } from 'puffy-core/validate'

// validateEmail
console.log(validateUrl('https://neap.co')) // true
console.log(validateUrl('hello')) // false
console.log(validateEmail('nic@neap.co')) // true
console.log(validateEmail('nic @neap.co')) // false
```

# LLM system prompts

## Overview
This section provides premade system prompts that can be copy-pasted into coding agents to learn how to use each puffy-core API.

## Error handling

### CommonJS

Wrap **all** functions—especially those doing I/O—with `catch_errors` from **puffy-core** (`npm i puffy-core`) to capture and propagate meaningful errors in a readable stack trace.

**Core APIs**

* **catch\_errors**

    ```js
    catch_errors(
        'High-level context message',
        () => /* sync fn */             // or async: async () => …
    )
    // → [errors, result]
    // If `errors` ≠ null, the operation failed.
    ```

    * Always provide a clear context string.
    * Never let errors fail silently; they bubble up as `errors`.

* **wrap\_errors**

    ```js
    const { error: { catch_errors, wrap_errors: e } } = require('puffy-core')
    // …
    throw e('Specific failure reason', caughtErrors)
    ```

    * Alias as `e` for brevity.
    * Wrap caught errors with extra context before re-throwing.

---

## 1. Synchronous Example

```js
const { error: { catch_errors, wrap_errors: e } } = require('puffy-core')

const processDataSync = input => {
    if (!input || typeof input !== 'string')
        throw new Error('Invalid input: Expected non-empty string.')
    if (input === 'fail')
        throw new Error('Simulated failure.')
    return `Processed: ${input.toUpperCase()}`
}

const handleSync = data => {
    const [errors, result] = catch_errors(
        'Failed to handle sync operation',
        () => {
            const [innerErr, processed] = catch_errors(
                'Failed to process data synchronously',
                () => processDataSync(data)
            )
            if (innerErr) throw e('Data processing step failed', innerErr)
            return `Result: ${processed}`
        }
    )

    if (errors) {
        console.error('handleSync errors:')
        errors.forEach(err => console.error(`- ${err.message}`))
        return null
    }
    console.log('handleSync result:', result)
    return result
}

handleSync('test')
handleSync('fail')
handleSync(null)
```

---

## 2. Asynchronous Example

```js
const { error: { catch_errors, wrap_errors: e } } = require('puffy-core')

const fetchData = async id =>
    new Promise((res, rej) => {
        setTimeout(() => {
            if (id === 0) rej(new Error('Network error.'))
            else if (id < 0) rej(new Error(`Not found: ${id}`))
            else res({ id, data: `Data for ${id}` })
        }, 10)
    })

const handleAsync = async id => {
    const [errors, result] = await catch_errors(
        'Failed to handle async operation',
        async () => {
            const [fetchErr, fetched] = await catch_errors(
                `Failed to fetch data for item ${id}`,
                fetchData(id)
            )
            if (fetchErr) throw e('Data fetch step failed', fetchErr)
            return `Fetched: ${JSON.stringify(fetched)}`
        }
    )

    if (errors) {
        console.error('handleAsync errors:')
        errors.forEach(err => console.error(`- ${err.message}`))
        return null
    }
    console.log('handleAsync result:', result)
    return result
}

;(async () => {
    await handleAsync(1)
    await handleAsync(0)
    await handleAsync(-1)
})()
```

---

**Remember:**

* Always wrap each step with `catch_errors('context', …)`.
* On inner failure, `throw e('step context', caughtErrors)`.
* Log or re-throw the aggregated `errors` for full traceability.

### ES Modules

Wrap **all** functions—especially those doing I/O—with `catch_errors` from **puffy-core** (`npm i puffy-core`) to capture and propagate meaningful errors in a readable stack trace.

**Core APIs**

* **catch\_errors**

    ```js
    catch_errors(
        'High-level context message',
        () => /* sync fn */             // or async: async () => …
    )
    // → [errors, result]
    // If `errors` ≠ null, the operation failed.
    ```

    * Always provide a clear context string.
    * Never let errors fail silently; they bubble up as `errors`.

* **wrap\_errors**

    ```js
    import { catch_errors, wrap_errors as e } from 'puffy-core/error';
    // …
    throw e('Specific failure reason', caughtErrors)
    ```

    * Alias as `e` for brevity.
    * Wrap caught errors with extra context before re-throwing.

---

## 1. Synchronous Example

```js
import { catch_errors, wrap_errors as e } from 'puffy-core/error'

export const processDataSync = input => {
    if (!input || typeof input !== 'string')
        throw new Error('Invalid input: Expected non-empty string.')
    if (input === 'fail')
        throw new Error('Simulated failure.')
    return `Processed: ${input.toUpperCase()}`
}

export const handleSync = data => {
    const [errors, result] = catch_errors(
        'Failed to handle sync operation',
        () => {
            const [innerErr, processed] = catch_errors(
                'Failed to process data synchronously',
                () => processDataSync(data)
            )
            if (innerErr) throw e('Data processing step failed', innerErr)
            return `Result: ${processed}`
        }
    )

    if (errors) {
        console.error('handleSync errors:')
        errors.forEach(err => console.error(`- ${err.message}`))
        return null
    }
    console.log('handleSync result:', result)
    return result
}

handleSync('test')
handleSync('fail')
handleSync(null)
```

---

## 2. Asynchronous Example

```js
import { catch_errors, wrap_errors as e } from 'puffy-core/error'

export const fetchData = async id =>
    new Promise((res, rej) => {
        setTimeout(() => {
            if (id === 0) rej(new Error('Network error.'))
            else if (id < 0) rej(new Error(`Not found: ${id}`))
            else res({ id, data: `Data for ${id}` })
        }, 10)
    })

export const handleAsync = async id => {
    const [errors, result] = await catch_errors(
        'Failed to handle async operation',
        async () => {
            const [fetchErr, fetched] = await catch_errors(
                `Failed to fetch data for item ${id}`,
                fetchData(id)
            )
            if (fetchErr) throw e('Data fetch step failed', fetchErr)
            return `Fetched: ${JSON.stringify(fetched)}`
        }
    )

    if (errors) {
        console.error('handleAsync errors:')
        errors.forEach(err => console.error(`- ${err.message}`))
        return null
    }
    console.log('handleAsync result:', result)
    return result
}

(async () => {
    await handleAsync(1)
    await handleAsync(0)
    await handleAsync(-1)
})();
```

---

**Remember:**

* Always wrap each step with `catch_errors('context', …)`.
* On inner failure, `throw e('step context', caughtErrors)`.
* Log or re-throw the aggregated `errors` for full traceability.

# Dev
## About this project

This project is built using ES6 modules located under the `src` folder. All the entry point definitions are located in the `package.json` under the `exports` property.

[`rollup`](https://rollupjs.org/) is used to compile the ES6 modules to CommonJS.

## Building this project for both CommonJS and ES6 modules

```
npm run build
```

This command compiles the ES6 modules located under the `src` folder to `.cjs` file sent to the `dist` folder.

## Unit test

```
npm test
```

# Annexes
## Creating URLs with the `URL` object

The `URL` is a native object supported in both browser and NodeJS environments:

```js
const u = new URL('https://example.com')
console.log(u.toString()) // 'https://example.com'
u.pathname = 'blog' // or u.pathname = '/blog'
console.log(u.toString()) // 'https://example.com/blog'
u.searchParams.set('hello', 'world')
console.log(u.toString()) // 'https://example.com/blog?hello=world'
u.hash = 'footer' // or u.hash = '#footer'
console.log(u.toString()) // 'https://example.com/blog?hello=world#footer'
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
