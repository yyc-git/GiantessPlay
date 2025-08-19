import { getVersionState, setVersionState } from "../state/State"
import { state, version } from "../type/StateType"

export let createState = (): version => {
	return {
		mainVersion: 0,
		subVersion: 0
	}
}

export let getVersion = (state: state) => {
	let { mainVersion, subVersion } = getVersionState(state)

	return [mainVersion, subVersion]
}

export let setVersion = (state: state, mainVersion, subVersion) => {
	return setVersionState(state, {
		...getVersionState(state),
		mainVersion,
		subVersion
	})
}