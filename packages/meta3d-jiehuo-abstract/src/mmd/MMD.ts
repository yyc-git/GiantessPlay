import { SkinnedMesh } from "three"
import { getDelta } from "../Device"
import { deepDispose, removeAndDispose } from "../scene/utils/DisposeUtils"
import { getMMDState, setMMDState } from "../state/State"
import { MMDAnimationHelper } from "../three/MMDAnimationHelper"
import { MMDLoader } from "../three/MMDLoader"
import { mmd, state, usedGirlEnum } from "../type/StateType"
import { Map } from "immutable"
import { ArrayUtils, NullableUtils, SkinAnimation } from "../Main"
import { getCurrentScene, getScene } from "../scene/Scene"
// import { isGiantessCharacterType } from "../scene/Scene"

let _createMMDAnimationHelper = () => {
	return new MMDAnimationHelper()
}

export let _createMMDLoader = () => {
	return new MMDLoader()
}

export let getMMDLoader = (state: state) => {
	return getMMDState(state).loader
}

export let getMMDAnimationHelperByUsedGirl = (state: state, usedGirl) => {
	return NullableUtils.getExn(getMMDState(state).helperMap.get(usedGirl))
}

export let getMMDAnimationHelper = (state: state, usedGirl,) => {
	return getMMDAnimationHelperByUsedGirl(state, usedGirl,)
}

export let hasMMDAnimationHelper = (state: state, usedGirl) => {
	return getMMDState(state).helperMap.has(usedGirl)
}

export let update = (state: state, usedGirl) => {
	// if (!isGiantessCharacterType(state)) {
	// 	return Promise.resolve(state)
	// }

	getMMDAnimationHelper(state, usedGirl).update(getDelta(state))

	return Promise.resolve(state)
}

export let createState = (): mmd => {
	return {
		loader: _createMMDLoader(),
		// helper: _createMMDAnimationHelper()
		helperMap: Map(),
		// currentUsedGirl: usedGirlEnum.None,
		currentUsedGirls: [],
	}
}

// export let createAndSetNewMMDAnimationHelper = (state: state) => {
// 	return setMMDState(state, {
// 		...getMMDState(state),
// 		helper: _createMMDAnimationHelper()
// 	})
// }

export let findAnimationAction = (state: state, usedGirl, mesh: SkinnedMesh, animationName) => {
	return getMMDAnimationHelper(state, usedGirl).findAnimationAction(mesh, animationName)
}

export let findAnimationClip = (state: state, usedGirl, mesh: SkinnedMesh, animationName) => {
	return findAnimationAction(state, usedGirl, mesh, animationName).getClip()
}

export let createAndSetHelper = (state: state, usedGirl) => {
	return setMMDState(state, {
		...getMMDState(state),
		helperMap: getMMDState(state).helperMap.set(usedGirl, _createMMDAnimationHelper())
	})
}

// export let setCurrentUsedGirl = (state: state, usedGirl) => {
// 	return setMMDState(state, {
// 		...getMMDState(state),
// 		currentUsedGirl: usedGirl
// 	})
// }

export let addCurrentUsedGirl = (state: state, usedGirl) => {
	return setMMDState(state, {
		...getMMDState(state),
		currentUsedGirls: ArrayUtils.push(getMMDState(state).currentUsedGirls, usedGirl)
	})
}

export let removeCurrentUsedGirl = (state: state, usedGirl) => {
	return setMMDState(state, {
		...getMMDState(state),
		currentUsedGirls: ArrayUtils.filter(getMMDState(state).currentUsedGirls, (currentUsedGirl) => {
			return currentUsedGirl != usedGirl
		})
	})
}

export let setCurrentUsedGirls = (state: state, value) => {
	return setMMDState(state, {
		...getMMDState(state),
		currentUsedGirls: value
	})
}

export let dispose = (state) => {
	// return state
	// let meshes = []
	getMMDState(state).helperMap.forEach((helper, _) => {
		// meshes = meshes.concat(helper.meshes)

		helper.meshes.forEach(mesh => {
			// deepDispose(mesh)

			// helper.remove(mesh)


			// helper.remove(mesh)

			deepDispose(mesh)

			helper.remove(mesh, SkinAnimation.disposeClipAndMixer)
		})

		helper.animations = {}
		helper.ikBoneCustomData = {}
		helper.notIKBoneCustomData = {}

		helper.meshes = []
		helper.objects = null
	})


	// meshes.forEach(mesh => {
	// 	removeAndDispose(getCurrentScene(state), mesh)
	// })

	state = setMMDState(state, {
		...createState(),
		loader: getMMDState(state).loader
	})


	return state
}