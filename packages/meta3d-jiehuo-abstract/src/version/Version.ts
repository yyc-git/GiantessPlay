import { NullableUtils } from "../Main"
import { getVersionState, setVersionState } from "../state/State"
import { getVersionCache, setVersionCache } from "../storage/Storage"
import { state, version } from "../type/StateType"
import { isArraysEqual } from "../utils/ArrayUtils"

export let createState = (): version => {
	return {
		mainVersion: 0,
		subVersion: 0,
		postfix: NullableUtils.getEmpty(),
		newContentChi: "",
		newContentEng: "",

		isVersionUpdate: false,
	}
}

export let getVersion = (state: state) => {
	let { mainVersion, subVersion, postfix } = getVersionState(state)

	return [mainVersion, subVersion, postfix]
}

export let getNewContent = (state: state) => {
	let { newContentChi, newContentEng } = getVersionState(state)

	return [newContentChi, newContentEng]
}

export let setVersion = (state: state, { mainVersion, subVersion, postfix, newContentChi, newContentEng }) => {
	return setVersionState(state, {
		...getVersionState(state),
		mainVersion,
		subVersion,
		postfix,
		newContentChi,
		newContentEng,
	})
}

export let getIsVersionUpdateFromBackend = (state: state) => {
	return getVersionCache(_buildVersionUpdateKey()).then(version => {
		return setVersionState(state, {
			...getVersionState(state),
			isVersionUpdate: NullableUtils.getWithDefault(NullableUtils.map(version => {
				return !isArraysEqual(version, getVersion(state))
			}, version), true)
		})
	})
}


let _buildVersionUpdateKey = () => "_buildVersionUpdateKey"

export let isVersionUpdate = (state) => {
	return getVersionState(state).isVersionUpdate
}

export let saveVersion = (state) => {
	return setVersionCache(_buildVersionUpdateKey(), getVersion(state))
}

export let dispose = (state) => {
	// return setVersionState(state, createState())
	return state
}

// export let clearVersionData = (state: state) => {
// 	return setVersionState(state, {
// 		...getVersionState(state),
// 		isVersionUpdate: false
// 	})
// }