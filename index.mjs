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
	console.log(data04) // { data: [ 1, 2, 4 ], value: 4 }
}

main()