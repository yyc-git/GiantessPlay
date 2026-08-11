import { List } from "immutable";
import { getFlowState, getIsDebug, setFlowState } from "./state/State";
import { deferExecFuncData, flow, name, state } from "./type/StateType";
import { push, reducePromise } from "./utils/ArrayUtils";
import { getEmpty, getExn, getWithDefault, isNullable, return_ } from "./utils/NullableUtils";
import { requireCheck, test } from "./utils/Contract";
import { isInteger } from "./utils/NumberUtils";
import { getDelta, getDeltaFactor } from "./Device";
import { ArrayUtils, MutableRecordUtils, NullableUtils } from "./Main";

export let createState = (): flow => {
	return {
		frameIndex: -1,
		// fps: -1,
		fps: 60,
		maxFPS: -1,
		isStopLoop: true,
		isInReduce: false,
		stoppedLoopCount: 0,

		// loopIndex: 0,
		deferExecFuncs: ArrayUtils.create(),
		needRemoveDeferExecFuncs: ArrayUtils.create(),

		lastTime: 0,
		lastFrameIndex: 0,

		firstUpdateTime: 0,

	}
}

let _disposeDeferExecFuncs = (deferExecFuncs) => {
	deferExecFuncs.forEach(data => {
		data.func = null
	})

	deferExecFuncs = []
}

let _processDeferExecFunc = async <specificState>(
	specificState: specificState,
	data: deferExecFuncData<specificState>,
	dt: number,
	getAbstractStateFunc: (s: specificState) => state
): Promise<[specificState, deferExecFuncData<specificState> | null]> => {
	const { func, name, isPause } = data;
	let { loopCount, time } = data;

	// 检查是否已被移除
	const currentState = getAbstractStateFunc(specificState);
	if (NullableUtils.isNullable(func) || _isDeferExecFuncDataRemoved(currentState, name)) {
		// 返回原状态，不创建新对象
		return [specificState, null];
	}

	// 暂停状态处理 - 直接返回原数据对象
	if (isPause) {
		return [specificState, data];
	}

	// 处理循环次数类型
	if (!isNullable(loopCount)) {
		const currentLoopCount = getExn(loopCount);

		// 只在需要更新时创建新对象
		if (currentLoopCount > 1) {
			// 减少计数但不执行
			const newData = {
				...data,
				loopCount: return_(currentLoopCount - 1)
			};
			return [specificState, newData];
		}

		// 执行函数（计数为0或1）
		// try {
		const newSpecificState = await func(specificState);
		return [newSpecificState, null];
		// } catch (error) {
		// 	console.error(`Error executing defer function ${name}:`, error);
		// 	return [specificState, null];
		// }
	}

	// 处理时间类型
	if (!isNullable(time)) {
		const currentTime = getExn(time);

		// 只在需要更新时创建新对象
		if (currentTime > dt) {
			// 减少时间但不执行
			const newData = {
				...data,
				time: return_(currentTime - dt)
			};
			return [specificState, newData];
		}

		// 执行函数（时间已到）
		// try {
		const newSpecificState = await func(specificState);
		return [newSpecificState, null];
		// } catch (error) {
		// 	console.error(`Error executing defer function ${name}:`, error);
		// 	return [specificState, null];
		// }
	}

	// 无效数据 - 直接移除
	return [specificState, null];
};

export let update = async <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
	let state = getAbstractStateFunc(specificState)

	let dt = getDelta(state)

	specificState = setAbstractStateFunc(specificState, setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: ArrayUtils.create(),
		isInReduce: true
	}))

	let oldDeferExcFuncs = getFlowState(state).deferExecFuncs


	let remainingDeferExecFuncs = []
	let currentSpecificState = specificState;
	for (const data of ArrayUtils.clone(oldDeferExcFuncs)) {
		const [newSpecificState, newData] = await _processDeferExecFunc(
			currentSpecificState,
			data,
			dt,
			getAbstractStateFunc
		);

		currentSpecificState = newSpecificState;

		if (newData) {
			remainingDeferExecFuncs.push(newData);
		}
	}

	state = getAbstractStateFunc(currentSpecificState)

	_disposeDeferExecFuncs(oldDeferExcFuncs)

	let newDeferExecFuncsAddedWhenUpdate = getFlowState(state).deferExecFuncs
	let newDeferExecFuncs = remainingDeferExecFuncs.filter(({ loopCount, time }) => {
		return (!isNullable(loopCount) ?
			getExn(loopCount) > 0 : (
				!isNullable(time) ?
					getExn(time) > 0 : false
			))
	}
	)
		.filter(({ name }) => {
			return !_isDeferExecFuncDataRemoved(getAbstractStateFunc(currentSpecificState), name)
		})
		.concat(
			newDeferExecFuncsAddedWhenUpdate
		)

	// console.log("after update:", newDeferExecFuncs)

	state = setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: newDeferExecFuncs,
		isInReduce: false
	})

	// state = _actuallyRemoveDeferExecFuncData(state)
	state = _clearNeedRemoveDeferExecFuncs(state)

	return setAbstractStateFunc(currentSpecificState, state)
}
// /** 处理延迟函数执行 */
// let _processDeferFunctions = async <specificState>(
// 	deferFuncs,
// 	specificState: specificState,
// 	dt: number,
// 	getAbstractStateFunc,
// ): Promise<[specificState, any[]]> => {
// 	let currentState = specificState;
// 	const remainingFuncs = [];

// 	for (const data of deferFuncs) {
// 		const { func, loopCount, time, name } = data;
// 		const currentAbstractState = getAbstractStateFunc(currentState);

// 		// 检查是否已被移除
// 		if (_isDeferExecFuncDataRemoved(currentAbstractState, name)) {
// 			continue;
// 		}

// 		// 处理循环次数类型
// 		if (loopCount !== undefined && loopCount !== null) {
// 			const newLoopCount = loopCount - 1;

// 			if (newLoopCount <= 0) {
// 				// 执行函数并更新状态
// 				currentState = await func(currentState);
// 			} else {
// 				// 保留修改后的函数数据
// 				remainingFuncs.push({ ...data, loopCount: newLoopCount });
// 			}
// 		}
// 		// 处理时间类型
// 		else if (time !== undefined && time !== null) {
// 			const newTime = time - dt;

// 			if (newTime <= 0) {
// 				// 执行函数并更新状态
// 				currentState = await func(currentState);
// 			} else {
// 				// 保留修改后的函数数据
// 				remainingFuncs.push({ ...data, time: newTime });
// 			}
// 		}
// 	}

// 	return [currentState, remainingFuncs];
// };

// /** 验证延迟函数是否有效 */
// let _isValidDefer = (state: state) =>
// 	(data): boolean => {
// 		const { loopCount, time, name } = data;

// 		// 检查有效性条件
// 		const isValid = (loopCount !== null ? loopCount > 0 :
// 			(time !== null ? time > 0 : false));

// 		// 检查是否未被移除
// 		return isValid && !_isDeferExecFuncDataRemoved(state, name);
// 	};


// export let update = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
//     let state = getAbstractStateFunc(specificState);
//     const dt = getDelta(state);

//     // 准备执行环境
//     specificState = setAbstractStateFunc(
//         specificState,
//         setFlowState(state, {
//             ...getFlowState(state),
//             deferExecFuncs: [],
//             isInReduce: true
//         })
//     );

//     return _processDeferFunctions(
//         ArrayUtils.clone(getFlowState(state).deferExecFuncs),
//         specificState,
//         dt,
//         getAbstractStateFunc
//     ).then(([newSpecificState, remainingDeferFuncs]) => {
//         const currentState = getAbstractStateFunc(newSpecificState);
//         const flowState = getFlowState(currentState);

//         // 过滤有效延迟函数
//         const validDeferFuncs = remainingDeferFuncs.filter(_isValidDefer(currentState));

//         // 合并新添加的函数
//         const newDeferExecFuncs = [
//             ...validDeferFuncs,
//             ...flowState.deferExecFuncs
//         ];

//         // 更新状态
//         const updatedState = setFlowState(currentState, {
//             ...flowState,
//             deferExecFuncs: newDeferExecFuncs,
//             isInReduce: false
//         });

//         return setAbstractStateFunc(
//             newSpecificState,
//             _clearNeedRemoveDeferExecFuncs(updatedState)
//         );
//     });

// }

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
			name,
			isPause: false
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
			name,
			isPause: false
		})
	})
}

export let addOrUpdateDeferExecFuncDataByTime = (state: state, func, time: number, name: name) => {
	if (getFlowState(state).isInReduce) {
		state = removeDeferExecFuncData(state, name)
	}
	else {
		state = directlyRemoveDeferExecFuncData(state, name)
	}

	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: push(getFlowState(state).deferExecFuncs, {
			func,
			time: return_(time),
			loopCount: getEmpty(),
			name,
			isPause: false
		})
	})
}

export let pauseDeferExecFuncData = (state: state, name: name) => {
	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: getFlowState(state).deferExecFuncs.map(d => {
			if (d.name == name) {
				return {
					...d,
					isPause: true
				}
			}

			return d
		}),
	})
}

export let resumeDeferExecFuncData = (state: state, name: name) => {
	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: getFlowState(state).deferExecFuncs.map(d => {
			if (d.name == name) {
				return {
					...d,
					isPause: false
				}
			}

			return d
		}),
	})
}

export let hasDeferExecFuncData = (state: state, name: name) => {
	return !NullableUtils.isNullable(getFlowState(state).deferExecFuncs.find(d => d.name == name))
}

// export let hasDeferExecFuncData = (state: state, name: name, func) => {
// 	return !NullableUtils.isNullable(getFlowState(state).deferExecFuncs.find(d => d.name == name && d.func === func))
// }

export let directlyRemoveDeferExecFuncData = (state: state, name: name) => {
	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: getFlowState(state).deferExecFuncs.filter(d => d.name != name),
	})
}

// export let removeDeferExecFuncData = (state: state, name: name, func = NullableUtils.getEmpty<any>()) => {
export let removeDeferExecFuncData = (state: state, name: name) => {
	// return setFlowState(state, {
	// 	...getFlowState(state),
	// 	needRemoveDeferExecFuncs: ArrayUtils.push(getFlowState(state).needRemoveDeferExecFuncs, name)
	// })

	return setFlowState(state, {
		...getFlowState(state),
		deferExecFuncs: getFlowState(state).deferExecFuncs.filter(d => d.name != name),
		// needRemoveDeferExecFuncs: ArrayUtils.push(getFlowState(state).needRemoveDeferExecFuncs, [name,
		// 	NullableUtils.map(d => {
		// 		return d.func
		// 	}, getFlowState(state).deferExecFuncs.find(d => d.name == name)
		// 	)
		// ])
		needRemoveDeferExecFuncs: ArrayUtils.push(getFlowState(state).needRemoveDeferExecFuncs, name)
	})
}

// let _actuallyRemoveDeferExecFuncData = (state: state) => {
// 	// let needRemoveDeferExecFuncs = getFlowState(state).needRemoveDeferExecFuncs

// 	return setFlowState(state, {
// 		...getFlowState(state),
// 		deferExecFuncs: getFlowState(state).deferExecFuncs.filter(d => {
// 			// return !ArrayUtils.includes(needRemoveDeferExecFuncs, d.name)
// 			// return !_isDeferExecFuncDataRemoved(state, d.name, d.func)
// 			return !_isDeferExecFuncDataRemovedByName(state, d.name)
// 		}),
// 		needRemoveDeferExecFuncs: ArrayUtils.create()
// 	})
// }
let _clearNeedRemoveDeferExecFuncs = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		needRemoveDeferExecFuncs: ArrayUtils.create()
	})
}

let _isDeferExecFuncDataRemoved = (state: state, name: name) => {
	// return !NullableUtils.isNullable(getFlowState(state).needRemoveDeferExecFuncs.find(n => {
	// 	return n[0] == name
	// }))
	return ArrayUtils.includes(getFlowState(state).needRemoveDeferExecFuncs, name)
}

// let _isDeferExecFuncDataRemoved = (state: state, name: name, func) => {
// 	return !NullableUtils.isNullable(getFlowState(state).needRemoveDeferExecFuncs.find(n => {
// 		return n[0] == name && NullableUtils.getWithDefault(
// 			NullableUtils.map(f => {
// 				return f === func
// 			}, n[1]), true
// 		)
// 	}))
// 	// return ArrayUtils.includes(getFlowState(state).needRemoveDeferExecFuncs, name)
// }

let _getLastTime = (state: state) => {
	return getFlowState(state).lastTime
}

export let setLastTime = (state: state, lastTime) => {
	return setFlowState(state, {
		...getFlowState(state),
		// lastTime: return_(lastTime)
		lastTime: lastTime
	})
}


let _getLastFrameIndex = (state: state) => {
	return getFlowState(state).lastFrameIndex
}

let _setLastFrameIndex = (state: state, value) => {
	return setFlowState(state, {
		...getFlowState(state),
		lastFrameIndex: value
	})
}

// export let initLastTime = (state: state, lastTime) => {
// 	if (isNullable(_getLastTime(state))) {
// 		return setLastTime(state, lastTime)
// 	}

// 	return state
// }

export let computeIntervalTime = (state: state, time) => {
	return time - getExn(_getLastTime(state))
}

export let dispose = (state: state) => {
	// return setFlowState(state, {
	// 	...getFlowState(state),
	// 	deferExecFuncs: [],
	// 	frameIndex: -1,
	// 	stoppedLoopCount: 0,

	// 	lastTime: 0,
	// 	lastFrameIndex: 0,

	// 	firstUpdateTime: 0,

	// 	// isStopLoop: false,
	// 	// isInReduce: false,

	// })

	let { maxFPS, isStopLoop, isInReduce, needRemoveDeferExecFuncs } = getFlowState(state)

	return setFlowState(state, {
		...createState(),
		maxFPS,
		isStopLoop,
		isInReduce,
		needRemoveDeferExecFuncs,
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

export let addInstantIntervalAndClear = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc, handleFunc, clearFunc], intervalTime, clearTime, name): Promise<specificState> => {
	let _func = (specificState, totalTime) => {
		if (totalTime > clearTime) {
			return clearFunc(specificState)
		}

		return handleFunc(specificState).then(specificState => {
			return setAbstractStateFunc(specificState, addDeferExecFuncDataByTime(getAbstractStateFunc(specificState), (specificState) => {
				return _func(specificState,
					totalTime + intervalTime
				)
			}, intervalTime, name))
		})
	}

	return _func(specificState, 0)
}

export let clearInterval = (state: state, name) => {
	// return removeDeferExecFuncData(state, name)
	if (getFlowState(state).isInReduce) {
		state = removeDeferExecFuncData(state, name)
	}
	else {
		state = directlyRemoveDeferExecFuncData(state, name)
	}

	return state
}

export let getFrameIndex = (state: state) => {
	return getFlowState(state).frameIndex
}

export let setFrameIndex = (state: state, value) => {
	return setFlowState(state, {
		...getFlowState(state),
		frameIndex: value
	})
}

export let getFPS = (state: state) => {
	return getFlowState(state).fps
}

export let setFPS = (state: state, time: number, frameIndex) => {
	let lastTime = _getLastTime(state)

	if (time - lastTime >= 1000) {
		state = setLastTime(state, time)

		let lastFrameIndex = _getLastFrameIndex(state)

		state = _setLastFrameIndex(state, frameIndex)

		return setFlowState(state, {
			...getFlowState(state),
			fps: Math.round(1000 * (frameIndex - lastFrameIndex) / (time - lastTime))
		})
	}

	return state
}

export let getMaxFPS = (state: state) => {
	return getFlowState(state).maxFPS
}

export let setMaxFPS = (state: state, usedFPS: number) => {
	return setFlowState(state, {
		...getFlowState(state),
		maxFPS: usedFPS
	})
}

export let getStoppedLoopCount = (state: state) => {
	return getFlowState(state).stoppedLoopCount
}

export let setStoppedLoopCount = (state: state, value) => {
	return setFlowState(state, {
		...getFlowState(state),
		stoppedLoopCount: value
	})
}

export let addStoppedLoopCount = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		stoppedLoopCount: getStoppedLoopCount(state) + 1
	})
}

export let getFirstUpdateTime = (state: state) => {
	return getFlowState(state).firstUpdateTime
}

export let setFirstUpdateTime = (state: state, value) => {
	if (getFirstUpdateTime(state) == 0) {
		return setFlowState(state, {
			...getFlowState(state),
			firstUpdateTime: value
		})
	}

	return state
}


export let resetFirstUpdateTime = (state: state) => {
	return setFlowState(state, {
		...getFlowState(state),
		firstUpdateTime: 0
	})
}
