import { reducePromise } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { state } from "../../../../type/StateType"
import { command, commandCompleteFunc } from "../type/StateType"
import { getState, setState } from "./ScenarioManager"
import { List } from "immutable"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"

// export let addCommand =<Data> (state: state, command: command<Data>) => {
// 	return 1 as any
// }

// export let addCommands = <Data>(state: state, commands: Array<[Data, command<Data>]>) => {
// 	return setState(state, {
// 		...getState(state),
// 		allCommands: getState(state).allCommands.concat(commands)
// 	})
// }

export let addCommand = <Data>(state: state, command: [nullable<commandCompleteFunc>, Data, command<Data>]) => {
	return setState(state, {
		...getState(state),
		allCommands: getState(state).allCommands.push(command)
	})
}

export let clearCommand = (state: state) => {
	return setState(state, {
		...getState(state),
		allCommands: List()
	})
}

export let execute = (state: state) => {
	let allCommandArr = getState(state).allCommands.toArray()

	state = setState(state, {
		...getState(state),
		allCommands: List()
	})

	return reducePromise(
		// getState(state).allCommands.toArray(),
		allCommandArr,
		(state, [onCompleteFunc, data, command]) => {
			return command(state, onCompleteFunc, data)
		}, state
	)
	// .then(state => {
	// 	return setState(state, {
	// 		...getState(state),
	// 		allCommands: List()
	// 	})
	// })
}