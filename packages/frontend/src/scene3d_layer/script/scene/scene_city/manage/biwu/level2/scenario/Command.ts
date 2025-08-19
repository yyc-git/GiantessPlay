import { Camera } from "meta3d-jiehuo-abstract"
import { Euler, Quaternion, Vector3 } from "three"
import { command, result, targetType } from "../../../../type/StateType";
import { Console } from "meta3d-jiehuo-abstract";
import { state } from "../../../../../../../type/StateType";
import { PathFind } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../../../../state/State";
import { computeAndSetDirectionData, convertPathPointToVec3Position, convertVec3PositionToPathPoint, isReach, optimizeFirstPathPoint, stopMove } from "../../../../behaviour_tree/action_node/WalkToTarget";
import { getPivotWorldPosition, setPivotWorldPositionAndUpdateBox, unlockGirlRotation } from "../../../../girl/Utils";
import { getGridForGirl } from "../../../../manage/city1/PathFind";
import { getName, setTriggerAction } from "../../../../girl/Girl";
import { getIsDebug, getIsNotTestPerf } from "../../../../../Scene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { CameraControls } from "meta3d-jiehuo-abstract";
import { road } from "meta3d-jiehuo-abstract/src/type/StateType";
import { Flow } from "meta3d-jiehuo-abstract";
import { actionName } from "../../../../data/biwu/level2/DataType";
import { triggerAction as triggerGirlAction } from "../../Girl";
import { triggerAction } from "../../../../utils/CommandUtils";
import * as LittleMan from "../../../../little_man/LittleMan"
import * as LittleManTransform from "../../../../little_man/Transform"
import { command as commandData } from "../../../../data/biwu/level2/ScenarioData";
import { enterScenario, exitScenario, markBegin, markFinish, moveCamera, playGirlAnimation, realtimeSay, say } from "../../../../scenario/Command";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { playBiggerAnimation } from "../../../../girl/Animation";
import { pickdownArmy, walkToTargetPosition } from "../../scenario/Command";
import { lookat, wait } from "../../level1/scenario/Command";

const _q1 = new Quaternion();
const _v1 = new Vector3();
const _v2 = new Vector3();

type biggerData = {
	scale: number
}

export let getCommand = (command_: commandData) => {
	switch (command_) {
		case commandData.bigger:
			return bigger
		case commandData.walkToTargetPosition:
			return walkToTargetPosition
		case commandData.pickdownArmy:
			return pickdownArmy
		case commandData.wait:
			return wait

		case commandData.lookat:
			return lookat

		case commandData.enterScenario:
			return enterScenario
		case commandData.moveCamera:
			return moveCamera
		case commandData.playGirlAnimation:
			return playGirlAnimation
		case commandData.say:
			return say
		case commandData.realtimeSay:
			return realtimeSay
		case commandData.exitScenario:
			return exitScenario
		case commandData.markBegin:
			return markBegin
		case commandData.markFinish:
			return markFinish
		default:
			throw new Error("unknown commandData")
	}
}

export let bigger: command<biggerData> = (state: state, onCompleteFunc, data) => {
	state = setTriggerAction(state, actionName.Bigger)

	state = playBiggerAnimation(state, [
		onCompleteFunc,
		state => {
			return [
				data.scale,
				2
			]
		},
	])

	return Promise.resolve(state)
}