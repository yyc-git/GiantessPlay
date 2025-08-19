import { PathFind } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { range, setStep } from "meta3d-jiehuo-abstract/src/ai/PathFind"
import { getState, isLittleRoad } from "../../CityScene"
import { Event } from "meta3d-jiehuo-abstract"
import { getDestroyedEventName } from "../../utils/EventUtils"
import { isBuildings } from "./Buildings"
import { isTreesAndProps } from "./TreesAndProps"
import { LOD } from "meta3d-jiehuo-abstract"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { renderAccuracyLevel } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getScale } from "../../girl/Utils"
import { getName, getValue } from "../../girl/Girl"
import { isBiggerBiggerAndMoreScale, isBiggerScale } from "../../girl/Animation"

export let getGrid = (state: state) => {
	return PathFind.getGrid(getAbstractState(state), "grid")
}

export let setGrid = (state: state, grid) => {
	return setAbstractState(state, PathFind.setGrid(getAbstractState(state), "grid", grid))
}

let _getGridForGirlNormal = (state: state) => {
	return PathFind.getGrid(getAbstractState(state), "gridForGirlNormal")
}

let _getGridForGirlBigger = (state: state) => {
	return PathFind.getGrid(getAbstractState(state), "gridForGirlBigger")
}

let _getGridForGirlBiggerBigger = (state: state) => {
	return PathFind.getGrid(getAbstractState(state), "gridForGirlBiggerBigger")
}

export let isGetGridForGirlBigger = (state: state) => {
	return isBiggerScale(state)
}

export let isGetGridForGirlBiggerBigger = (state: state) => {
	return isBiggerBiggerAndMoreScale(state)
}

export let getGridForGirl = (state: state) => {
	if (isGetGridForGirlBigger(state)) {
		return _getGridForGirlBigger(state)
	}
	else if (isGetGridForGirlBiggerBigger(state)) {
		return _getGridForGirlBiggerBigger(state)
	}

	return _getGridForGirlNormal(state)
}

export let setGridForGirlNormal = (state: state, grid) => {
	return setAbstractState(state, PathFind.setGrid(getAbstractState(state), "gridForGirlNormal", grid))
}

export let setGridForGirlBigger = (state: state, grid) => {
	return setAbstractState(state, PathFind.setGrid(getAbstractState(state), "gridForGirlBigger", grid))
}

export let setGridForGirlBiggerBigger = (state: state, grid) => {
	return setAbstractState(state, PathFind.setGrid(getAbstractState(state), "gridForGirlBiggerBigger", grid))
}


export let getStep = (grid) => {
	return grid.step
}

export let destroyedHandler = (state: state, { userData }) => {
	let { toName } = userData

	if (isBuildings(toName) || isTreesAndProps(toName)) {
		let box = LOD.getBoxByName(getAbstractState(state), toName)

		state = setGrid(state, PathFind.setWalkableAt(getGrid(state), box, true))
		if (isLittleRoad(state)) {
			state = setGridForGirlNormal(state, PathFind.setWalkableAt(_getGridForGirlNormal(state), box, true))
		}

		return Promise.resolve(state)
	}

	return Promise.resolve(state)
}

let _createGridFromAllLODData = (state, allLODData, range, step) => {
	return allLODData.reduce((grid, lodData) => {
		let octree = lodData[0]

		return octree.getAllBoxes(getAbstractState(state)).reduce((grid, box) => {
			return PathFind.setWalkableAt(grid, box, false)
		}, grid)
	}, PathFind.createGrid(range, step))
}

export let createGrid = (state: state, range, step) => {
	let allLODData = getState(state).building.buildings.concat(
		getState(state).treeAndProp.treesAndProps
	).concat(
		getState(state).car.cars
	)

	return _createGridFromAllLODData(state, allLODData, range, step)
}

let _createGridForGirl = (state: state, range, step, isNormal) => {
	let allLODData

	if (isNormal) {
		allLODData = getState(state).building.buildings.concat(
			getState(state).treeAndProp.treesAndProps
		)
	}
	else {
		allLODData = []
	}

	return _createGridFromAllLODData(state, allLODData, range, step)
}

export let getStepByRenderAccuracy = (state: state) => {
	let step
	switch (RenderSetting.getRenderSetting(getAbstractState(state)).renderAccuracy) {
		case renderAccuracyLevel.VeryHigh:
		case renderAccuracyLevel.High:
			step = 3
			break
		case renderAccuracyLevel.Middle:
			step = 4
			break
		case renderAccuracyLevel.Low:
			step = 6
			break
	}

	return step
}

export let setGridForGirl = (state: state, range) => {
	state = setGridForGirlNormal(state, _createGridForGirl(state, range, 3, true))
	state = setGridForGirlBigger(state, _createGridForGirl(state, range, 10, false))
	state = setGridForGirlBiggerBigger(state, _createGridForGirl(state, range, 18, false))

	return state
}

export let initWhenImportScene = (state: state) => {
	let step = getStepByRenderAccuracy(state)

	const range: range = {
		min: [-325, -212],
		// max: [-210, -61]
		// max: [450, 470]
		max: [470, 470]
	}

	state = setAbstractState(state, setStep(getAbstractState(state), step))

	state = setGrid(state, createGrid(state, range, step))

	if (isLittleRoad(state)) {
		state = setGridForGirl(state, range)
	}


	state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), destroyedHandler))


	return Promise.resolve(state)
}

export let dispose = (state: state) => {
	state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), destroyedHandler))

	return Promise.resolve(state)
}