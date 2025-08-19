import { MathUtils } from "three"
import { getDelta } from "../Device"
import { getGPUSkinState, getIsDebug, setGPUSkinState } from "../state/State"
import { gpuSkinPlayMode, objectName, onCompleteFunc, state } from "../type/StateType"
import { forEach, getExn, getWithDefault, map } from "../utils/NullableUtils"
import { hasDuplicateItems, reducePromise } from "../utils/ArrayUtils"
import { MutableMapUtils } from "../Main"
import { requireCheck, test } from "../utils/Contract"
import { isAliveByName } from "../lod/LOD"

let _resetInstancedSkeletonAnimationData = (instancedSkeletonAnimationTimeMap, name) => {
	// return MutableMapUtils.map(instancedSkeletonAnimationTimeMap, (time, name) => {
	// 	if (name == name_) {
	// 		return 0
	// 	}

	// 	return time
	// })

	MutableMapUtils.set(instancedSkeletonAnimationTimeMap, name, 0)

	return instancedSkeletonAnimationTimeMap
}

export let playOnce = (state: state, onCompleteFunc: onCompleteFunc<any>, name: objectName, clipIndex) => {
	let { instancedSkeletonAnimationTimeMap, playedClipIndexMap, onceClipOnCompleteFuncMap } = getGPUSkinState(state)
	playedClipIndexMap = MutableMapUtils.set(playedClipIndexMap, name, [clipIndex, gpuSkinPlayMode.Once])
	onceClipOnCompleteFuncMap = MutableMapUtils.set(onceClipOnCompleteFuncMap, name, onCompleteFunc)
	// isOnceClipOnCompleteFuncExecutedMap = MutableMapUtils.set(isOnceClipOnCompleteFuncExecutedMap, name, false)

	instancedSkeletonAnimationTimeMap = _resetInstancedSkeletonAnimationData(instancedSkeletonAnimationTimeMap, name)

	return setGPUSkinState(state, {
		...getGPUSkinState(state),
		instancedSkeletonAnimationTimeMap,
		playedClipIndexMap,
		onceClipOnCompleteFuncMap
	})
}

export let playLoop = (state: state, name: objectName, clipIndex) => {
	let { instancedSkeletonAnimationTimeMap, playedClipIndexMap } = getGPUSkinState(state)

	playedClipIndexMap = MutableMapUtils.set(playedClipIndexMap, name, [clipIndex, gpuSkinPlayMode.Loop])

	instancedSkeletonAnimationTimeMap = _resetInstancedSkeletonAnimationData(instancedSkeletonAnimationTimeMap, name)

	return setGPUSkinState(state, {
		...getGPUSkinState(state),
		instancedSkeletonAnimationTimeMap,
		playedClipIndexMap,
	})
}


export let playLastFrame = (state: state, name: objectName, clipIndex) => {
	let { instancedSkeletonAnimationTimeMap, playedClipIndexMap } = getGPUSkinState(state)

	playedClipIndexMap = MutableMapUtils.set(playedClipIndexMap, name, [clipIndex, gpuSkinPlayMode.KeepLast])

	let duration = getClipDurations(state, name)[clipIndex]

	MutableMapUtils.set(instancedSkeletonAnimationTimeMap, name, duration)

	return setGPUSkinState(state, {
		...getGPUSkinState(state),
		instancedSkeletonAnimationTimeMap,
		playedClipIndexMap,
	})
}

let _updateLoopInstancedSkeletonAnimationTime = (state,
	// data: instancedSkeletonAnimationData,
	time,
	// index,
	duration: number,
	//  fps: number, steps,
	//  clipIndex
) => {
	let dt = getDelta(state);

	// let time = data.time

	time += dt;
	time = MathUtils.clamp(time - Math.floor(time / duration) * duration, 0, duration);

	// let frame = Math.floor(time * fps);
	// frame = frame % steps;

	// this.setFrameDataAt(index, clipIndex, frame);

	return time
}

let _updateOnceInstancedSkeletonAnimationTime = (
	// onCompleteFunc,
	state,
	// data: instancedSkeletonAnimationData,
	time,
	// index,
	duration: number,
	//  fps: number,
	// steps,
	// clipIndex
) => {
	let dt = getDelta(state);

	// let time = data.time

	if (time + dt >= duration) {
		// this.setFrameDataAt(index, clipIndex, this._getLastFrame(steps))

		return [true, time]
	}

	time += dt

	// let frame = Math.floor(time * fps);
	// frame = frame >= steps ? _getLastFrame(steps) : frame

	// this.setFrameDataAt(index, clipIndex, frame);

	// data.time = time

	return [false, time]
}

let _updateKeepLastInstancedSkeletonAnimationTime = (
	time,
	duration,
) => {
	time = duration

	return time
}

export let getClipDurations = (state: state, name: objectName) => {
	return MutableMapUtils.getExn(
		getGPUSkinState(state).clipDurationsMap, name
	)
}

export let getClipSteps = (state: state, name: objectName) => {
	return MutableMapUtils.getExn(
		getGPUSkinState(state).clipStepsMap, name
	)
}

export let initAnimationData = (state: state, name: objectName, allClipDurations, allClipSteps) => {
	state = _setTime(state, name, 0)

	return setGPUSkinState(state, {
		...getGPUSkinState(state),
		clipDurationsMap: MutableMapUtils.set(
			getGPUSkinState(state).clipDurationsMap,
			name, allClipDurations
		),
		clipStepsMap: MutableMapUtils.set(
			getGPUSkinState(state).clipStepsMap,
			name, allClipSteps,
		)
	})
	// MutableMapUtils.set(
	// 	getGPUSkinState(state).clipDurationsMap,
	// 	name, allClipDurations
	// )
	// MutableMapUtils.set(
	// 	getGPUSkinState(state).clipStepsMap,
	// 	name, allClipSteps,
	// )

	// return state
}

// let _reallocateInstancedSkeletonAnimationTimeMap = (specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
// 	let instancedSkeletonAnimationTimeMap = MutableMapUtils.map(getGPUSkinState(getAbstractStateFunc(specificState)).instancedSkeletonAnimationTimeMap, (_, name) => {
// 		return isAliveByName(getAbstractStateFunc(specificState), name)
// 	})


// 	// let newMap = MutableMapUtils.create()

// 	specificState = setAbstractStateFunc(specificState, setGPUSkinState(getAbstractStateFunc(specificState), {
// 		...getGPUSkinState(getAbstractStateFunc(specificState)),
// 		instancedSkeletonAnimationTimeMap: instancedSkeletonAnimationTimeMap
// 	}))

// 	return [specificState, instancedSkeletonAnimationTimeMap]
// }

export let update = <specificState>(
	specificState: specificState,
	[getAbstractStateFunc, setAbstractStateFunc],
	// fps,
	// clipData
) => {
	let state = getAbstractStateFunc(specificState)

	let { instancedSkeletonAnimationTimeMap, playedClipIndexMap } = getGPUSkinState(state)

	// if (MutableMapUtils.getCount(instancedSkeletonAnimationTimeMap) > 1000) {
	// if (MutableMapUtils.getCount(instancedSkeletonAnimationTimeMap) > 100) {
	// 	let d = _reallocateInstancedSkeletonAnimationTimeMap(specificState, [getAbstractStateFunc, setAbstractStateFunc])
	// 	specificState = d[0]
	// 	instancedSkeletonAnimationTimeMap = d[1]
	// }

	let [completedNames, newInstancedSkeletonAnimationTimeMap] = MutableMapUtils.reduce(instancedSkeletonAnimationTimeMap,
		([completedNames, newInstancedSkeletonAnimationTimeMap], time, name) => {
			return getWithDefault(
				map(([clipIndex, gpuSkinPlayMode_]) => {
					let duration = getClipDurations(state, name)[clipIndex]

					let newTime
					switch (gpuSkinPlayMode_) {
						case gpuSkinPlayMode.Loop:
							newTime = _updateLoopInstancedSkeletonAnimationTime(state,
								time,
								// i,
								duration,
								//  fps, steps,
								// clipIndex
							)
							break
						case gpuSkinPlayMode.Once:
							let d = _updateOnceInstancedSkeletonAnimationTime(state,
								time,
								// i,
								duration,
								//  fps,
								// steps,
								// clipIndex
							)
							let isComplete = d[0]
							newTime = d[1]


							if (isComplete
								// && !MutableMapUtils.getExn(isOnceClipOnCompleteFuncExecutedMap, name)
							) {
								completedNames.push(name)
							}
							break
						case gpuSkinPlayMode.KeepLast:
							newTime = _updateKeepLastInstancedSkeletonAnimationTime(
								time,
								duration,
							)
							break
						default:
							throw new Error("err")

					}

					return [completedNames,
						MutableMapUtils.set(
							newInstancedSkeletonAnimationTimeMap, name, newTime
						)
					]
				},
					MutableMapUtils.get(playedClipIndexMap, name)
				),
				[completedNames, newInstancedSkeletonAnimationTimeMap]
			)
		}, [[], new Map()]
	)

	specificState = setAbstractStateFunc(specificState, setGPUSkinState(getAbstractStateFunc(specificState), {
		...getGPUSkinState(getAbstractStateFunc(specificState)),
		instancedSkeletonAnimationTimeMap: newInstancedSkeletonAnimationTimeMap
	}))

	let gpuSkinState = getGPUSkinState(getAbstractStateFunc(specificState))


	// completedNames.forEach(completedName => {
	// 	MutableMapUtils.remove(gpuSkinState.playedClipIndexMap, completedName)
	// 	// MutableMapUtils.remove(gpuSkinState.onceClipOnCompleteFuncMap, completedName)
	// 	// _resetInstancedSkeletonAnimationData(gpuSkinState.instancedSkeletonAnimationTimeMap, completedName)
	// })

	requireCheck(() => {
		test("shouldn't be duplicate", () => {
			return !hasDuplicateItems(completedNames, name => name)
		})
	}, getIsDebug(state))

	return reducePromise(completedNames, (specificState, completedName) => {
		// let gpuSkinState = getGPUSkinState(getAbstractStateFunc(specificState))

		// MutableMapUtils.set(gpuSkinState.isOnceClipOnCompleteFuncExecutedMap, completedName, true)

		// specificState = setAbstractStateFunc(specificState, setGPUSkinState(getAbstractStateFunc(specificState), gpuSkinState))


		MutableMapUtils.remove(gpuSkinState.playedClipIndexMap, completedName)

		let onceClipOnCompleteFunc = MutableMapUtils.getExn(gpuSkinState.onceClipOnCompleteFuncMap, completedName)
		MutableMapUtils.remove(gpuSkinState.onceClipOnCompleteFuncMap, completedName)

		return onceClipOnCompleteFunc(specificState)
	}, specificState)
}

export let getPlayClipData = (state: state, name) => {
	return MutableMapUtils.get(getGPUSkinState(state).playedClipIndexMap, name)
}

export let getTime = (state: state, name) => {
	return MutableMapUtils.get(getGPUSkinState(state).instancedSkeletonAnimationTimeMap, name)
}

let _setTime = (state: state, name, time) => {
	// return setGPUSkinState(state, {
	// 	...getGPUSkinState(state),
	// 	instancedSkeletonAnimationTimeMap: getGPUSkinState(state).instancedSkeletonAnimationTimeMap.set(name, time)
	// })

	MutableMapUtils.set(
		getGPUSkinState(state).instancedSkeletonAnimationTimeMap,
		name, time
	)

	return state
}