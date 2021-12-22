import { catchErrors, wrapErrors, wrapCustomErrors, mergeErrors, getErrorMetadata } from './src/error.mjs'

const asyncSucceed = () => new Promise(next => next(123))
const asyncFail = () => new Promise((_,fail) => fail(new Error('Boom')))
// Add metadata to an error
const meta = { hello:'world' }
const asyncFailWithMetadata = () => new Promise((_,fail) => fail(wrapCustomErrors(meta)('Boom')))
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