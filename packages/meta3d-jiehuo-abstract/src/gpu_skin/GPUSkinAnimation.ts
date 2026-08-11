import { MathUtils } from "three"
import { getDelta } from "../Device"
import { getGPUSkinState, getIsDebug, setGPUSkinState } from "../state/State"
import { gpuSkinPlayMode, objectName, onCompleteFunc, state } from "../type/StateType"
import { forEach, getExn, getWithDefault, map } from "../utils/NullableUtils"
import { hasDuplicateItems, reducePromise } from "../utils/ArrayUtils"
import { Flow, MutableMapUtils, NumberUtils } from "../Main"
import { requireCheck, test } from "../utils/Contract"

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

// export let playSpecificFrame = (state: state, name: objectName, durationPercent: number, clipIndex) => {
// 	let { instancedSkeletonAnimationTimeMap, playedClipIndexMap } = getGPUSkinState(state)

// 	playedClipIndexMap = MutableMapUtils.set(playedClipIndexMap, name, [clipIndex, gpuSkinPlayMode.KeepLast])

// 	// let duration = _getClipDuration(state, name, clipIndex) * durationPercent

// 	// MutableMapUtils.set(instancedSkeletonAnimationTimeMap, name, duration)

// 	let time = (getClipSteps(state, name)[clipIndex] - 1) / Flow.getMaxFPS(state)

// 	MutableMapUtils.set(instancedSkeletonAnimationTimeMap, name, time)


// 	return setGPUSkinState(state, {
// 		...getGPUSkinState(state),
// 		instancedSkeletonAnimationTimeMap,
// 		playedClipIndexMap,
// 	})
// }

export let playLastFrame = (state: state, name: objectName, clipIndex) => {
	// /*! because fps is not always equal 60/30, so InstancedSkinnedMesh->update->compute frame has a little error, so need use 0.99 instead of 1
	// * 
	// */
	// // return playSpecificFrame(state, name, 1, clipIndex)
	// return playSpecificFrame(state, name,
	// 	// 0.99 * (Flow.getMaxFPS(state) / 60),
	// 	0.9,
	// 	clipIndex)

	let { instancedSkeletonAnimationTimeMap, playedClipIndexMap } = getGPUSkinState(state)

	playedClipIndexMap = MutableMapUtils.set(playedClipIndexMap, name, [clipIndex, gpuSkinPlayMode.KeepLast])

	// let duration = _getClipDuration(state, name, clipIndex) * durationPercent

	// MutableMapUtils.set(instancedSkeletonAnimationTimeMap, name, duration)

	let time = (getClipSteps(state, name)[clipIndex] - 1) / Flow.getMaxFPS(state)

	MutableMapUtils.set(instancedSkeletonAnimationTimeMap, name, time)


	return setGPUSkinState(state, {
		...getGPUSkinState(state),
		instancedSkeletonAnimationTimeMap,
		playedClipIndexMap,
	})

}

let _updateLoopInstancedSkeletonAnimationTime = (state,
	// data: instancedSkeletonAnimationData,
	name,
	time,
	// index,
	duration: number,
	//  fps: number, steps,
	//  clipIndex
) => {
	let dt = getDelta(state);

	// let time = data.time


	// time += dt;
	time += dt / getAnimationDurationFactor(state, name);
	time = MathUtils.clamp(time - Math.floor(time / duration) * duration, 0, duration);

	// let frame = Math.floor(time * fps);
	// frame = frame % steps;

	// this.setFrameDataAt(index, clipIndex, frame);

	return time
}

let _updateOnceInstancedSkeletonAnimationTime = (
	// onCompleteFunc,
	state,
	name,
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

	let animationDurationFactor = getAnimationDurationFactor(state, name)

	// if (time + dt >= duration) {
	if (time + dt / animationDurationFactor >= duration) {
		// this.setFrameDataAt(index, clipIndex, this._getLastFrame(steps))

		return [true, time]
	}

	// time += dt
	time += dt / animationDurationFactor

	// let frame = Math.floor(time * fps);
	// frame = frame >= steps ? _getLastFrame(steps) : frame

	// this.setFrameDataAt(index, clipIndex, frame);

	// data.time = time

	return [false, time]
}

let _updateKeepSpecificInstancedSkeletonAnimationTime = (
	time,
) => {
	return time
}

let _getClipDuration = (state: state, name: objectName, clipIndex) => {
	// console.log(
	// 	"_getClipDuration:",
	// 	Flow.getFrameIndex(state),
	// 	MutableMapUtils.entries(getGPUSkinState(state).clipDurationsMap),
	// 	name
	// )
	// return MutableMapUtils.getExn(
	// 	getGPUSkinState(state).clipDurationsMap, name
	// )

	// return NumberUtils.fixFloatError(
	// 	MutableMapUtils.getExn(
	// 		getGPUSkinState(state).clipDurationsMap, name
	// 	)[clipIndex],
	// 	3
	// )
	return MutableMapUtils.getExn(
		getGPUSkinState(state).clipDurationsMap, name
	)[clipIndex]
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
					let duration = _getClipDuration(state, name, clipIndex)

					let newTime
					switch (gpuSkinPlayMode_) {
						case gpuSkinPlayMode.Loop:
							newTime = _updateLoopInstancedSkeletonAnimationTime(state,
								name,
								time,
								// i,
								duration,
								//  fps, steps,
								// clipIndex
							)
							break
						case gpuSkinPlayMode.Once:
							let d = _updateOnceInstancedSkeletonAnimationTime(state,
								name,
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
							newTime = _updateKeepSpecificInstancedSkeletonAnimationTime(
								time,
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

export let getAnimationDurationFactor = (state: state, name) => {
	return (1 + MutableMapUtils.getWithDefault(
		getGPUSkinState(state).animationDurationFactorMap,
		name,
		0
	))
}

export let setAnimationDurationFactor = (state: state, name, value) => {
	MutableMapUtils.set(
		getGPUSkinState(state).animationDurationFactorMap,
		name,
		value
	)

	return state
}