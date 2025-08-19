import { state } from "../../../../../type/StateType"
import { getState, setState, getScene } from "../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { mountain } from "../../type/StateType"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { Collision } from "meta3d-jiehuo-abstract"

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).mountain)
}

let _setState = (state: state, treeState: mountain) => {
	return setState(state, {
		...getState(state),
		mountain: NullableUtils.return_(treeState)
	})
}

export let getNamePrefix = () => "Mountain"

export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`

export let buildMountainName = (categoryName, index) => `${categoryName}_${index}`

export let isMountains = (name: string) => {
	return name.includes(getNamePrefix())
}


export let addStaticLODContainerData = (state: state,
	staticLODContainer,
	details,
) => {
	return _setState(state, {
		..._getState(state),
		mountains: push(_getState(state).mountains, [
			staticLODContainer,
			details,
			staticLODContainer.name
		])
	})
}

export let initWhenImportScene = (state: state) => {
	let abstractState = getAbstractState(state)

	// abstractState = Collision.setPlayerCollisionableContainers(abstractState, Collision.getPlayerCollisionableContainers(abstractState).concat(_getState(state).mountains.map(data => data[0])))

	state = setAbstractState(state, abstractState)

	return Promise.resolve(state)
}

export let createState = (): mountain => {
	return {
		mountains: [],
	}
}

export let initialAttributes = (state, name) => {
	return state
}

export let dispose = (state: state) => {
	_getState(state).mountains.forEach(([staticLODContainer,
		details,
		name
	]) => {
		staticLODContainer.dispose()
	})

	state = _setState(state, createState())

	return Promise.resolve(state)
}