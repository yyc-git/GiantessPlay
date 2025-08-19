import { state } from "../../../../../type/StateType"
import { getState, setState, getScene } from "../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { tile } from "../../type/StateType"
import { push } from "meta3d-jiehuo-abstract/src/utils/ArrayUtils"

let _getState = (state: state) => {
	return NullableUtils.getExn(getState(state).tile)
}

let _setState = (state: state, treeState: tile) => {
	return setState(state, {
		...getState(state),
		tile: NullableUtils.return_(treeState)
	})
}

export let getNamePrefix = () => "Tile"

export let buildCategoryName = (index) => `${getNamePrefix()}_${index}`

export let buildTileName = (categoryName, index) => `${categoryName}_${index}`

// export let isTiles = (categoryName: string) => {
// 	return categoryName.includes(getNamePrefix())
// }

export let addStaticLODContainerData = (state: state,
	staticLODContainer,
	details,
) => {
	return _setState(state, {
		..._getState(state),
		tiles: push(_getState(state).tiles, [
			staticLODContainer,
			details,
			staticLODContainer.name
		])
	})
}


export let createState = (): tile => {
	return {
		tiles: [],
	}
}

export let initialAttributes = (state, name) => {
	return state
}

export let dispose = (state: state) => {
	_getState(state).tiles.forEach(([staticLODContainer,
		details,
		name
	]) => {
		staticLODContainer.dispose()
	})

	state = _setState(state, {
		..._getState(state),
		tiles: [],
	})

	return Promise.resolve(state)
}