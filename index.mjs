import { chain_async, chain_sync } from 'puffy-core/func'
import { catch_errors, required } from 'puffy-core/error'
import { new_id } from 'puffy-core/db'
import { log } from 'puffy-core/logger'

const test_required = ({ hello, world }) => catch_errors(`'test_required' failed`, () => {
	required({ hello, 'world.hello_again':world?.hello_again })

	console.log(`'test_required' passed`)
})

const main = async () => {
	console.log(Date.now())
	console.log(new_id()) // 1737111832148007184n
	console.log(new_id({ node:18 })) // 1737111832148007184n
	console.log(new_id({ node:18, idx:9999 })) // 1737111832148007184n
	console.log(new_id({ timestamp:new Date('1985-03-21') })) // 1737111832148007184n

	console.log({
		test_required_01_errors: test_required({ hello:'Hello', world:{hello_again:'hello_again'} })[0],
		test_required_02_errors: test_required({})[0],
		test_required_03_errors: test_required({ hello:'Hello' })[0],
		test_required_04_errors: test_required({ world:{hello_again:'hello_again'} })[0]
	})

	log({
		level:'INFO',
		code:'12343',
		message:'Hello world',
		data:{
			hello:'world'
		},
		errors:['Oh shit',new Error('Damn!')]
	})

	const [errors01, data01] = await chain_async(
		() => Promise.resolve(1),								// 1
		previous => Promise.resolve(previous+1),				// 2
		previous => previous+2,									// 3
		previous => catch_errors(Promise.resolve(previous+1)),	// 4
		previous => previous+3									// 5
	)

	console.log(errors01) // null
	console.log(data01) // { data: [ 1, 2, 4, 5, 8 ], value: 8 } // where value is the last result.

	// Notice that the 4th function does not return [errors, data] to the 5th function, but data instead. 
	// This is by design. catch_errors return a array of type PuffyResponse which is interpreted by chain_async
	// so that only the result is return if no errors occured.

	const [errors02, data02] = await chain_async(
		() => Promise.resolve(1),
		previous => Promise.resolve(previous+1).then(() => { throw new Error('Boom')})
	)

	console.log(errors02) // [{ message:'Boom' }]
	console.log(data02) // null

	const [errors03, data03] = await chain_async(
		() => Promise.resolve(1),
		previous => catch_errors(Promise.resolve(previous+1).then(() => { throw new Error('Boom')}))
	)

	console.log(errors03) // [{ message:`'chain_async' function failed` }, { message:'Boom' }]
	console.log(data03) // null

	// Same API than 'chain_async', but for synchronous functions.
	const [errors04, data04] = chain_sync(
		() => 1,
		previous => previous+1,
		previous => previous+2
	)

	console.log(errors04) // null
	console.log(data04) // { data: [ 1, 2, 4 ], value: 4 }
}

main()