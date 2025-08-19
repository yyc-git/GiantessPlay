import { SkinnedMesh } from "three"
import { getDelta } from "../Device"
import { deepDispose } from "../scene/utils/DisposeUtils"
import { getMMDState, setMMDState } from "../state/State"
import { MMDAnimationHelper } from "../three/MMDAnimationHelper"
import { MMDLoader } from "../three/MMDLoader"
import { mmd, state } from "../type/StateType"

let _createMMDAnimationHelper = () => {
	return new MMDAnimationHelper()
}

export let _createMMDLoader = () => {
	return new MMDLoader()
}

export let getMMDLoader = (state: state) => {
	return getMMDState(state).loader
}

export let getMMDAnimationHelper = (state: state) => {
	return getMMDState(state).helper
}

export let update = (state: state) => {
	getMMDAnimationHelper(state).update(getDelta(state))

	return Promise.resolve(state)
}

export let createState = (): mmd => {
	return {
		loader: _createMMDLoader(),
		helper: _createMMDAnimationHelper()
	}
}

export let createAndSetNewMMDAnimationHelper = (state: state) => {
	return setMMDState(state, {
		...getMMDState(state),
		helper: _createMMDAnimationHelper()
	})
}

export let findAnimationAction = (state: state, mesh:SkinnedMesh, animationName) => {
	return getMMDAnimationHelper(state).findAnimationAction(mesh, animationName)
}

export let findAnimationClip = (state: state, mesh:SkinnedMesh, animationName) => {
	return findAnimationAction(state, mesh, animationName).getClip()
}

export let dispose = (state) => {
	let helper = getMMDAnimationHelper(state)

	helper.meshes.forEach(mesh => {
		deepDispose(mesh)

		helper.remove(mesh)
	})

	helper.animations = {}



let loader = getMMDLoader(state)




	return state
}