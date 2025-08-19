import { MutableMapUtils } from "../Main"
import { getGPUSkinState, setGPUSkinState } from "../state/State"
import { gpuSkin, state } from "../type/StateType"
import { getExn, getWithDefault, map, return_ } from "../utils/NullableUtils"
import * as GPUSkeleton from "./GPUSkeleton"
import * as GPUSkinAnimation from "./GPUSkinAnimation"
import { InstancedSkinnedMesh } from "./InstancedSkinnedMesh"
import { Map } from "immutable"

export let registerAnimation = GPUSkeleton.registerAnimation

// export let getClipData = GPUSkeleton.getClipData

// export let createInstancedSkinnedMesh = (geometry, material, count) => {
// 	return new InstancedSkinnedMesh(geometry, material, count)
// }

// export let play = (state: state, objectName, clipIndex) => {
// 	return setGPUSkinState(state, {
// 		...getGPUSkinState(state),
// 		playedClipIndexMap: getGPUSkinState(state).playedClipIndexMap.set(objectName, clipIndex)
// 	})
// }

// export let getInstancedSkinnedMesh = (state, skinObjectName) => {
// 	return getExn(getGPUSkinState(state).instancedSkinnedMeshMap.get(skinObjectName))
// }

// export let setInstancedSkinnedMesh = (state, skinObjectName, instancedSkinnedMesh) => {
// 	return setGPUSkinState(state, {
// 		...getGPUSkinState(state),
// 		instancedSkinnedMeshMap: getGPUSkinState(state).instancedSkinnedMeshMap.set(skinObjectName, instancedSkinnedMesh)
// 	})
// }

// export let getFPS = () => {
// 	return 60
// }

export let getMaxDuration = () => {
	// return 2
	// return 3
	return 5
	// return 20
}

export let update = <specificState>(specificState: specificState, [getAbstractStateFunc, setAbstractStateFunc]) => {
	return GPUSkinAnimation.update(specificState, [getAbstractStateFunc, setAbstractStateFunc])
}

export let playOnce = GPUSkinAnimation.playOnce

export let playLoop = GPUSkinAnimation.playLoop

export let playLastFrame = GPUSkinAnimation.playLastFrame

export let initAnimationData = GPUSkinAnimation.initAnimationData

export let createState = (): gpuSkin => {
	return {
		clipDurationsMap: MutableMapUtils.create(),
		clipStepsMap: MutableMapUtils.create(),

		instancedSkeletonAnimationTimeMap: MutableMapUtils.create(),
		playedClipIndexMap: MutableMapUtils.create(),
		onceClipOnCompleteFuncMap: MutableMapUtils.create(),
		// isOnceClipOnCompleteFuncExecutedMap: MutableMapUtils.create(),
	}
}

export let dispose = (state: state) => {
	return setGPUSkinState(state, createState())
}