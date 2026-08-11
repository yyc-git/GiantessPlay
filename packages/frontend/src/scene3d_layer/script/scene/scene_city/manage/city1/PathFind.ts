import { PathFind } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { range, setStep } from "meta3d-jiehuo-abstract/src/ai/PathFind"
import { getGirlScale, getState, isLittleCharacterType } from "../../CityScene"
import { Event } from "meta3d-jiehuo-abstract"
import { getDestroyedEventName } from "../../utils/EventUtils"
import { isBuildings } from "./Buildings"
import { isTreesAndProps } from "./TreesAndProps"
import { LOD } from "meta3d-jiehuo-abstract"
import { getPositionParrelToObj, isSmallGiantess, isSmallOrMiddleGiantessScale } from "../../girl/Utils"
import { isBiggerBiggerAndMoreScale, isBiggerScale } from "../../girl/Animation"
import { getRenderAccuracy, getRenderSetting } from "../../../../../mod/SettingMod"
import { renderAccuracyLevel } from "setting-default/src/Type"
import { getPlayerPosition, isNearObject } from "../../utils/PlayerUtils"
import { attackTarget } from "../../type/StateType"
import { Vector2, Vector3 } from "three"
import { getIsDebug } from "../../../Scene"

let _buildSmallGridName = () => "_buildSmallGridName"

let _buildMiddleGridName = () => "_buildMiddleGridName"

let _buildBigGridName = () => "_buildBigGridName"

export let isVeryNearAttackTarget = (state, attackTarget_, startPosition, endPosition) => {
	switch (attackTarget_) {
		case attackTarget.LittleMan:
		case attackTarget.Object:
			return isNearObject(startPosition, endPosition, 20)
		case attackTarget.Building:
			return isNearObject(startPosition, endPosition, 30)
		case attackTarget.Giantess:
			return isNearObject(startPosition, endPosition, 50)
		default:
			throw new Error("err")
	}
}

export let isNearAttackTarget = (state, attackTarget_, startPosition, endPosition) => {
	// let playerPosition = getPositionParrelToObj(getPlayerPosition(state), startPosition.y)

	switch (attackTarget_) {
		case attackTarget.LittleMan:
		case attackTarget.Object:
			return isNearObject(startPosition, endPosition, 40)
		case attackTarget.Building:
			return isNearObject(startPosition, endPosition, 200)
		case attackTarget.Giantess:
			return isNearObject(startPosition, endPosition, 60)
		default:
			throw new Error("err")
	}
}

let _getGridName = (state: state, usedGirl, attackTarget_, startPosition: Vector3, endPosition: Vector3) => {
	let gridName

	switch (attackTarget_) {
		case attackTarget.LittleMan:
		case attackTarget.Object:
		case attackTarget.Building:
			if (isNearAttackTarget(state, attackTarget_, startPosition, endPosition)) {
				gridName = _buildSmallGridName()
			}
			else {
				gridName = _buildBigGridName()
			}
			break
		case attackTarget.Giantess:
			if (isNearAttackTarget(state, attackTarget_, startPosition, endPosition)) {
				if (isSmallOrMiddleGiantessScale(getGirlScale(state, usedGirl))) {
					gridName = _buildSmallGridName()
				}
				else {
					gridName = _buildMiddleGridName()
				}
			}
			else {
				gridName = _buildBigGridName()
			}
			break
		default:
			throw new Error("err")
	}

	return gridName
}

export let getGrid = (state: state, usedGirl, attackTarget_, startPosition: Vector3, endPosition) => {
	return PathFind.getGrid(getAbstractState(state), _getGridName(state, usedGirl, attackTarget_, startPosition, endPosition))
}

export let getGridForJudgeWalkable = (state: state) => {
	return PathFind.getGrid(getAbstractState(state), _buildSmallGridName())
}

export let setGrid = (state: state, range, step) => {
	// return setAbstractState(state, PathFind.setGrid(getAbstractState(state), "grid", grid))

	state = setAbstractState(state, PathFind.setGrid(getAbstractState(state), _buildSmallGridName(), createGrid(state, range, step)))
	state = setAbstractState(state, PathFind.setGrid(getAbstractState(state), _buildMiddleGridName(), createGrid(state, range, step * 2)))
	state = setAbstractState(state, PathFind.setGrid(getAbstractState(state), _buildBigGridName(), createGrid(state, range, step * 4)))

	return state

}

let _getAllGrids = (state: state): Array<[string, any]> => {
	return [
		_buildSmallGridName(),
		_buildMiddleGridName(),
		_buildBigGridName(),
	].map(gridName => {
		return [gridName, PathFind.getGrid(getAbstractState(state), gridName)]
	})
}

let _setWalkableAt = (state, box, isWalkable) => {
	return _getAllGrids(state).reduce((state, [gridName, grid]) => {
		return setAbstractState(state, PathFind.setGrid(getAbstractState(state), gridName, PathFind.setWalkableAt(grid, box, isWalkable)))
	}, state)
}

export let findValidPosition = (state, position: Vector3) => {
	return PathFind.findValidPosition(
		new Vector2(position.x, position.z),
		PathFind.getGrid(getAbstractState(state), _buildSmallGridName()),
		getIsDebug(state)
	)
}

// export let getRefindPathTime = (state: state, attackTarget_, startPosition, endPosition) => {
// 	switch (_getGridName(state, attackTarget_, startPosition, endPosition)) {
// 		case _buildSmallGridName():
// 			return 4000
// 		case _buildMiddleGridName():
// 			return 4000 * 1.8
// 		case _buildBigGridName():
// 			return 4000 * 2.5
// 		default:
// 			throw new Error("err")
// 	}
// }
export let getRefindPathTime = () => {
	// switch (_getGridName(state, attackTarget_, startPosition, endPosition)) {
	// 	case _buildSmallGridName():
	// 		return 4000
	// 	case _buildMiddleGridName():
	// 		return 4000 * 1.8
	// 	case _buildBigGridName():
	// 		return 4000 * 2.5
	// 	default:
	// 		throw new Error("err")
	// }
	return 4000
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

export let isGetGridForGirlBigger = (state: state, usedGirl) => {
	return isBiggerScale(state, usedGirl)
}

export let isGetGridForGirlBiggerBigger = (state: state, usedGirl) => {
	return isBiggerBiggerAndMoreScale(state, usedGirl)
}

export let getGridForGirl = (state: state, usedGirl) => {
	if (isGetGridForGirlBigger(state, usedGirl)) {
		return _getGridForGirlBigger(state)
	}
	else if (isGetGridForGirlBiggerBigger(state, usedGirl)) {
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

		state = _setWalkableAt(state, box, true)
		// if (isLittleCharacterType(state)) {
		state = setGridForGirlNormal(state, PathFind.setWalkableAt(_getGridForGirlNormal(state), box, true))
		// }

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
	switch (getRenderAccuracy(state)) {
		// case renderAccuracyLevel.MostHigh2:
		// case renderAccuracyLevel.MostHigh:
		case renderAccuracyLevel.VeryHigh:
		case renderAccuracyLevel.High:
			step = 3
			break
		case renderAccuracyLevel.Middle:
			step = 4
			break
		case renderAccuracyLevel.Low:
        default:
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

export let initWhenImportScene = (state: state, range: range) => {
	let step = getStepByRenderAccuracy(state)

	// const range: range = {
	// 	min: [-325, -212],
	// 	// max: [-210, -61]
	// 	// max: [450, 470]
	// 	max: [470, 470]
	// }

	state = setAbstractState(state, setStep(getAbstractState(state), step))

	// state = setGrid(state, createGrid(state, range, step))
	state = setGrid(state, range, step)

	// if (isLittleCharacterType(state)) {
	state = setGridForGirl(state, range)
	// }


	state = setAbstractState(state, Event.on(getAbstractState(state), getDestroyedEventName(), destroyedHandler))


	return Promise.resolve(state)
}

export let dispose = (state: state) => {
	state = setAbstractState(state, Event.off(getAbstractState(state), getDestroyedEventName(), destroyedHandler))

	return Promise.resolve(state)
}