import { getPlayClipData } from "../gpu_skin/GPUSkinAnimation"
import { fsm_state, stateMachine, fsmStateName } from "../type/StateType"
import { requireCheck, test } from "../utils/Contract"
import { getWithDefault, isNullable, map, return_ } from "../utils/NullableUtils"

export let create = (name, currentState): stateMachine<any> => {
	return {
		name,
		previousState: null,
		currentState
	}
}

export let isState = (stateMachine: stateMachine<any>, fsmStateName: fsmStateName) => {
	return stateMachine.currentState.name == fsmStateName
}

export let isPreviousState = (stateMachine: stateMachine<any>, fsmStateName: fsmStateName) => {
	return getWithDefault(
		map(
			previousState => previousState.name == fsmStateName,
			stateMachine.previousState,
		),
		false
	)
}

export let changeState = <specificState>(specificState: specificState, stateMachine: stateMachine<specificState>, newState: fsm_state<specificState>): Promise<[specificState, stateMachine<specificState>]> => {
	if (isState(stateMachine, newState.name)) {
		return Promise.resolve([specificState, stateMachine])
	}

	stateMachine = {
		...stateMachine,
		previousState: return_(stateMachine.currentState),
		currentState: newState
	}

	return getWithDefault(
		map(
			previousState => {
				return previousState.exitFunc(specificState, stateMachine)
			},
			stateMachine.previousState
		),
		Promise.resolve(specificState)
	).then(specificState => {
		return newState.enterFunc(specificState, stateMachine).then(specificState => {
			return [specificState, stateMachine]
		})
	})
}

export let execute = <specificState, T>(specificState: specificState, stateMachine: stateMachine<specificState>, data: T) => {
	requireCheck(() => {
		test("previous specificState shouldn't equal current specificState", () => {
			return !isPreviousState(stateMachine, stateMachine.currentState.name)
		})
		// }, getIsDebug(specificState))
	}, true)

	return stateMachine.currentState.executeFunc(specificState, data, stateMachine)
}

export let changeAndExecuteState = <specificState>(specificState: specificState, setStateMachineFunc, stateMachine, newState, name, data) => {
	if (isState(stateMachine, newState.name)) {
		return Promise.resolve(specificState)
	}

	// Console.log(
	// 	"a:",
	// 	stateMachine.currentState,
	// 	newState
	// )

	return changeState(specificState, stateMachine, newState).then(([specificState, stateMachine]) => {
		specificState = setStateMachineFunc(specificState, name, stateMachine)

		return execute(specificState, stateMachine, data)
	})
}

export let changeAndExecuteStateWithoutName = <specificState>(specificState: specificState, setStateMachineFunc, stateMachine, newState, data) => {
	if (isState(stateMachine, newState.name)) {
		return Promise.resolve(specificState)
	}

	// Console.log(
	// 	"b:",
	// 	stateMachine.currentState,
	// 	newState
	// )
	return changeState(specificState, stateMachine, newState).then(([specificState, stateMachine]) => {
		specificState = setStateMachineFunc(specificState, stateMachine)

		return execute(specificState, stateMachine, data)
	})
}