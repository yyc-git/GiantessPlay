import { Camera } from "meta3d-jiehuo-abstract"
import { Euler, Quaternion, Vector3 } from "three"
import { command, targetType } from "../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
import { state } from "../../../../../../type/StateType";
import { markWhetherNotExecuteGiantessAI, setId, setTarget } from "../../../behaviour_tree/BehaviourTreeManager";
import { PathFind } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../../../state/State";
import { computeAndSetDirectionData, convertPathPointToVec3Position, convertVec3PositionToPathPoint, isReach, optimizeFirstPathPoint, stopMove } from "../../../behaviour_tree/action_node/WalkToTarget";
import { getPivotWorldPosition, setPivotWorldPositionAndUpdateBox, unlockGirlRotation } from "../../../girl/Utils";
import { getGridForGirl } from "../../../manage/city1/PathFind";
import { getName } from "../../../girl/Girl";
import { getIsDebug, getIsNotTestPerf } from "../../../../Scene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { road } from "meta3d-jiehuo-abstract/src/type/StateType";
import { Flow } from "meta3d-jiehuo-abstract";
import { actionName } from "../../../data/biwu/level1/DataType";
import { triggerAction as triggerGirlAction } from "../Girl";
import { triggerAction } from "../../../utils/CommandUtils";
import * as LittleMan from "../../../little_man/LittleMan"
import * as LittleManTransform from "../../../little_man/Transform"
import { command as commandData } from "../../../data/biwu/level1/ScenarioData";
import { enterScenario, exitScenario, markBegin, markFinish, moveCamera, playGirlAnimation, realtimeSay, say } from "../../../scenario/Command";
import { getCustomData, getCustomDataExn, setCustomData } from "../../../game_event/GameEvent";
import { lookatTargetPosition } from "../../../behaviour_tree/action_node/Utils";

const _q1 = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();

type pickdownArmyData = {
	// index: number
	getIndexFunc: (state: state) => number
}

let _move = (state: state, onCompleteFunc, pathIndex, path, targetPosition) => {
	// let stopMoveResult = NullableUtils.getEmpty()

	// if (!hasTarget(state)) {
	//     return _stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)
	// }


	if (pathIndex + 1 >= path.length
		// || isInGirlAttackRange(state, targetPosition, attackRange.Small, NullableUtils.getEmpty())
		// || isMoveCollisioned(state)
	) {
		// stopMoveResult = NullableUtils.return_(behaviourTreeNodeExecuteResult.Success)


		state = setAbstractState(state, CameraControls.resetDirectionData(getAbstractState(state), road.Giantess))
		// return stopMove(state, id, NullableUtils.getExn(stopMoveResult))
		return onCompleteFunc(state)
	}
	// else if (
	//     isMoveCollisioned(state)
	//     || isChangeScaling(state)
	//     || isStressingState(getStateMachine(state))
	// ) {
	//     stopMoveResult = NullableUtils.return_(behaviourTreeNodeExecuteResult.Fail)
	// }

	// if (!NullableUtils.isNullable(stopMoveResult)) {
	// 	// state = lookatTargetPosition(state, (state, lookatQuaternion) => lookatQuaternion, targetPosition)

	// 	return stopMove(state, id, NullableUtils.getExn(stopMoveResult))
	// }



	state = computeAndSetDirectionData(state, path[pathIndex], path[pathIndex + 1])

	return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		if (isReach(state, path[pathIndex + 1])) {
			state = setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(path[pathIndex + 1]))

			// if (!hasTarget(state)) {
			//     state = _stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)

			//     return Promise.resolve(state)
			// }



			return Promise.resolve(_move(state, onCompleteFunc, pathIndex + 1, path, targetPosition))
		}
		// else if (_isFarawayFromPath(state, path[pathIndex], path[pathIndex + 1])) {
		//     Console.warn(`far away from ${path[pathIndex + 1].toArray()}`)

		//     // Console.warn(
		//     //     convertVec3PositionToPathPoint(getPivotWorldPosition(state)),
		//     //     convertVec3PositionToPathPoint(getPivotWorldPosition(state)).distanceTo(
		//     //         path[pathIndex + 1]
		//     //     )
		//     // )


		//     state = _stopMove(state, id, behaviourTreeNodeExecuteResult.Fail)

		//     return Promise.resolve(state)
		// }

		return _move(state, onCompleteFunc, pathIndex, path, targetPosition)
	}, 1)))
}

export let walkToTargetPosition: command<{
	getTargetPositionFunc: (state: state) => [number, number, number]
}> = (state: state, onCompleteFunc, data) => {
	Console.log("walkToTargetPosition")


	let finder = PathFind.createAStarFinder()

	let targetPosition = _v1.fromArray(data.getTargetPositionFunc(state))


	let pathData = PathFind.findPath(getAbstractState(state), finder,
		convertVec3PositionToPathPoint(getPivotWorldPosition(state)),
		convertVec3PositionToPathPoint(targetPosition),
		getGridForGirl(state),
		getName(),
		getIsDebug(state),
		NullableUtils.getEmpty(),
		NullableUtils.return_(5)
	)
	state = setAbstractState(state, pathData[0])
	let path = pathData[1]

	if (path.length > 1) {
		path = optimizeFirstPathPoint(path, state)
		state = setPivotWorldPositionAndUpdateBox(state, convertPathPointToVec3Position(path[0]))


		if (getIsDebug(state) && getIsNotTestPerf(state)) {
			PathFind.showFindedPath(getAbstractState(state), path, NumberUtils.randomHexColor(), 0.005)
		}


		// state = markIsRunning(state, true)


		state = unlockGirlRotation(state)


		return _move(state, onCompleteFunc, 0, path, targetPosition)
	}

	return onCompleteFunc(state)
}

let _getPickdownArmyKey = () => "pickdownArmy"

export let getPickdownArmyData = (state: state) => {
	return getCustomData<[number, boolean]>(state, _getPickdownArmyKey())
}

export let getPickdownArmyDataExn = (state: state) => {
	return NullableUtils.getExn(getPickdownArmyData(state))
}

export let setPickdownArmyData = (state: state, index, isAddArmy) => {
	return setCustomData(state, _getPickdownArmyKey(), [index, isAddArmy])
}

export let pickdownArmy: command<pickdownArmyData> = (state: state, onCompleteFunc, data) => {
	Console.log("pickdownArmy")

	state = setPickdownArmyData(state, data.getIndexFunc(state), false)

	return triggerAction(state,
		[
			triggerGirlAction,
			onCompleteFunc,
		],
		actionName.PickdownFromIdle)
}