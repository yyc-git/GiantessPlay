import { List } from "immutable";
import { getFlowState, getIsDebug, setFlowState } from "./state/State";
import { deferExecFuncData, flow, name, state } from "./type/StateType";
import { push, reducePromise } from "./utils/ArrayUtils";
import { getEmpty, getExn, getWithDefault, isNullable, return_ } from "./utils/NullableUtils";
import { requireCheck, test } from "./utils/Contract";
import { isInteger } from "./utils/NumberUtils";
import { getDelta, getDeltaFactor } from "./Device";
import { ArrayUtils, MutableMapUtils, NullableUtils } from "./Main";

export let createState = (): flow => {
	return {
		isStopLoop: false,
		// loopIndex: 0,
		deferExecFuncs: ArrayUtils.create(),
		needRemoveDeferExecFuncs: ArrayUtils.create(),

		lastTime: 0
	}
}

export let update = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
	let state = getAbstractStateFunc(specificState)

	let dt = getDelta(state)

	// let deferExecFuncs = ArrayUtils.clone(getFlowState(state).deferExecFuncs)
	let deferExecFuncs = getFlowState(state).deferExecFuncs

	specificState = setAbstractStateFunc(specificState, setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: ArrayUtils.create()
	}))

	return reducePromise<[specificState, Array<deferExecFuncData<specificState>>], deferExecFuncData<specificState>>(
		// getFlowState(state).deferExecFuncs,
		// ArrayUtils.clone(getFlowState(state).deferExecFuncs),
		deferExecFuncs,
		([specificState, result], { func, loopCount, time, name }, _) => {
			// if (_isDeferExecFuncDataRemoved(getAbstractStateFunc(specificState), name)) {
			// 	return Promise.resolve([specificState, result])
			// }

			if (!isNullable(loopCount)) {
				loopCount = getExn(loopCount) - 1

				result = push(result, {
					func,
					loopCount: return_(loopCount),
					time,
					name
				})

				if (loopCount <= 0) {
					return func(specificState).then(specificState => {
						return [specificState, result]
					})
				}

				return new Promise((resolve, reject) => {
					resolve([specificState, result])
				})
			}


			time = getExn(time) - dt

			result = push(result, {
				func,
				loopCount,
				time: return_(time),
				name
			})

			if (time <= 0) {
				return func(specificState).then(specificState => {
					return [specificState, result]
				})
			}

			return new Promise((resolve, reject) => {
				resolve([specificState, result])
			})
		}, [specificState, []]
	).then(([specificState, deferExecFuncs]) => {
		let state = getAbstractStateFunc(specificState)

		// deferExecFuncs = deferExecFuncs.concat(getFlowState(state).deferExecFuncs.filter(({ func, loopCount, time }) => {
		// 	return (!isNullable(loopCount) ?
		// 		getExn(loopCount) > 0 : (
		// 			!isNullable(time) ?
		// 				getExn(time) > 0 : false
		// 		))
		// 		&& NullableUtils.isNullable(deferExecFuncs.find((data) => {
		// 			return data.func === func
		// 		}))
		// }
		// ))

		// let newDeferExecFuncsAddedWhenUpdate = getFlowState(state).deferExecFuncs.filter(({ name }) => {
		// 	return NullableUtils.isNullable(deferExecFuncs.find(d => d.name == name))
		// 	// return NullableUtils.isNullable(deferExecFuncs.find(d => d.func == func))
		// }
		// )

		let newDeferExecFuncsAddedWhenUpdate = getFlowState(state).deferExecFuncs
		let newDeferExecFuncs = deferExecFuncs.filter(({ loopCount, time }) => {
			return (!isNullable(loopCount) ?
				getExn(loopCount) > 0 : (
					!isNullable(time) ?
						getExn(time) > 0 : false
				))
		}
		).concat(
			newDeferExecFuncsAddedWhenUpdate
		)

		state = setFlowState(state, {
			...getFlowState(state),
			deferExecFuncs: newDeferExecFuncs,
		})

		state = _actuallyRemoveDeferExecFuncData(state)

		return setAbstractStateFunc(specificState, state)
	})
}

export let isLoopStart = (state: state) => {
	return !getFlowState(state).isStopLoop
}

export let stopLoop = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		isStopLoop: true
	})
}

export let startLoop = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		isStopLoop: false
	})
}

export let addDeferExecFuncData = (state: state, func: (specificState: any) => Promise<any>, loopCount: number, name: name = "defaultName") => {
	requireCheck(() => {
		test("loopCount should be integer", () => {
			return isInteger(loopCount)
		})
	}, getIsDebug(state))

	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: push(getFlowState(state).deferExecFuncs, {
			func,
			loopCount: return_(loopCount),
			time: getEmpty(),
			name
		})
	})
}

export let addDeferExecFuncDataByTime = (state: state, func, time: number, name: name = "defaultName") => {
	// requireCheck(() => {
	// 	test("name shouldn't exist", () => {
	// 		return name == "defaultName" ? true : NullableUtils.isNullable(getFlowState(state).deferExecFuncs.find(d => {
	// 			return d.name == name
	// 		}))
	// 	})
	// }, getIsDebug(state))

	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: push(getFlowState(state).deferExecFuncs, {
			func,
			time: return_(time),
			loopCount: getEmpty(),
			name
		})
	})
}

export let hasDeferExecFuncData = (state: state, name: name) => {
	return !NullableUtils.isNullable(getFlowState(state).deferExecFuncs.find(d => d.name == name))
}

export let removeDeferExecFuncData = (state: state, name: name) => {
	// return setFlowState(state, {
	// 	...getFlowState(state),
	// 	needRemoveDeferExecFuncs: ArrayUtils.push(getFlowState(state).needRemoveDeferExecFuncs, name)
	// })

	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: getFlowState(state).deferExecFuncs.filter(d => d.name != name),
		needRemoveDeferExecFuncs: ArrayUtils.push(getFlowState(state).needRemoveDeferExecFuncs, name)
	})
}

let _actuallyRemoveDeferExecFuncData = (state: state) => {
	let needRemoveDeferExecFuncs = getFlowState(state).needRemoveDeferExecFuncs

	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: getFlowState(state).deferExecFuncs.filter(d => {
			return !ArrayUtils.includes(needRemoveDeferExecFuncs, d.name)
		}),
		needRemoveDeferExecFuncs: ArrayUtils.create()
	})
}

// let _isDeferExecFuncDataRemoved = (state: state, name: name) => {
// 	return ArrayUtils.includes(getFlowState(state).needRemoveDeferExecFuncs, name)
// }

let _getLastTime = (state: state) => {
	return getFlowState(state).lastTime
}

export let setLastTime = (state: state, lastTime) => {
	return setFlowState(state, {
		...getFlowState(state),
		lastTime: return_(lastTime)
	})
}

export let initLastTime = (state: state, lastTime) => {
	if (isNullable(_getLastTime(state))) {
		return setLastTime(state, lastTime)
	}

	return state
}

export let computeIntervalTime = (state: state, time) => {
	return time - getExn(_getLastTime(state))
}

export let dispose = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: []
	})
}

// export let convertTimeToLoopCount = (state: state, timeMsUnit: number) => {
// 	requireCheck(() => {
// 		test("time should > 0", () => {
// 			return timeMsUnit > 0
// 		})
// 	}, getIsDebug(state))

// 	Console.log(
// 		timeMsUnit,
// getDelta(state),
// 		(getDelta(state) * getDeltaFactor() * 1000),
// 		Math.floor(
// 			timeMsUnit / (getDelta(state) * getDeltaFactor() * 1000)
// 			* (1000 / 16)
// 		),
// 	)

// 	return Math.max(
// 		Math.floor(
// 			timeMsUnit / (getDelta(state) * getDeltaFactor() * 1000)
// 			* (1000 / 16)
// 		),
// 		1
// 	)
// }

// export let addInterval = (state: state, [getAbstractStateFunc, setAbstractStateFunc, conditionFunc, successFunc, failFunc], time) => {
// 	let _func = (state: state) => {
// 		return addDeferExecFuncDataByTime(state, (specificState) => {
// 			let promise
// 			if (!conditionFunc(specificState)) {
// 				promise = failFunc(specificState)
// 			}
// 			else {
// 				promise = successFunc(specificState)
// 			}

// 			return promise.then(specificState => setAbstractStateFunc(specificState, _func(getAbstractStateFunc(specificState))))
// 		}, time)
// 	}

// 	return _func(state)
// }

export let addInterval = (state: state, [getAbstractStateFunc, setAbstractStateFunc, handleFunc], time, name) => {
	let _func = (state: state) => {
		return addDeferExecFuncDataByTime(state, (specificState) => {
			let promise = handleFunc(specificState)
			// if (!conditionFunc(specificState)) {
			// 	promise = failFunc(specificState)
			// }
			// else {
			// 	promise = successFunc(specificState)
			// }

			return promise.then(specificState => setAbstractStateFunc(specificState, _func(getAbstractStateFunc(specificState))))
		}, time, name)
	}

	return _func(state)
}

export let clearInterval = (state: state, name) => {
	return removeDeferExecFuncData(state, name)
}