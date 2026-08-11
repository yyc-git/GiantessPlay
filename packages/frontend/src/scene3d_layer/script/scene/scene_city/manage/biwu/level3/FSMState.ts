import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../../type/StateType"
import { autoDifficulty, collisionPart, damageType, objectStateName } from "../../../type/StateType"
import { actionName, animationName } from "../../../data/biwu/level3/DataType"
import { getCurrentAnimationName, removeCustomDuration, setCustomDuration } from "../../../girl/Animation"
import { triggerAction } from "../Girl"
import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getGirlVolume } from "../../../utils/SoundUtils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { addExcitement } from "../../../girl/Excitement"
import { excitement, forceSize } from "../../../data/DataType"
import { getIdExn, markFinish, markWhetherNotExecuteGiantessAI, resetAllFinish, resetFinish } from "../../../behaviour_tree/BehaviourTreeManager"
import { triggerMainEvent } from "../../../game_event/GameEvent"
// import { markIsRunning } from "../../../utils/BehaviourManagerUtils"
import * as GameEventData from "../../../data/biwu/level3/GameEventData"
import { Flow } from "meta3d-jiehuo-abstract"
import { getHandType, getKey, handType, setHandType } from "../../../data/biwu/level3/behaviour_tree_data_all/BehaviourTreeData"
import * as BehaviourTreeDataLeftHand from "../../../data/biwu/level3/behaviour_tree_data_left_hand/BehaviourTreeData"
import * as BehaviourTreeDataRightHand from "../../../data/biwu/level3/behaviour_tree_data_right_hand/BehaviourTreeData"
import { MMD } from "meta3d-jiehuo-abstract"
import { changePose } from "../../../girl/Pose"
import { pose } from "../../../data/biwu/level3/CollisionShapeData"
import { isControlledState } from "../../../utils/FSMStateUtils"
import { getStateMachine, handleStressingStateExit } from "../../../girl/FSMState"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { buildNameByUsedGirl, disablePhysics, enablePhysics, setIsUpdatePhysics } from "../../../girl/Girl"
import { removeGetCenterFunc, setGetCenterFunc } from "../../../girl/Collision"
import { Vector3 } from "three"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as ShellTurret from "../../city1/milltary_building/ShellTurret"
import * as MissileTurret from "../../city1/milltary_building/MissileTurret"
import { damageWithMultipleData, getMaxForce } from "../../../utils/DamageUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getAutoDifficulty } from "../../../difficulty/Difficulty"
import { generateReward } from "../../../reward/RewardGenerator"
import { buildStressingName } from "../../../data/biwu/level3/reward/RewardData"
import { getRewardPropOffset, getRewardPropPosition } from "./Reward"
import { buildFakeGirlWeaponValue } from "../../../girl/Utils"
import { weaponType } from "../../../data/ValueType"
import { Event } from "meta3d-jiehuo-abstract"
import { buildGiantessStubData, getGiantessStressingEventName } from "../../../../../../utils/EventUtils"
import { getLevelDataExn, setLevelData } from "../../../CityScene"
// import { getBiwuSetting } from "../../../CityScene"

let _waitForFinish = (state: state, usedGirl) => {
	requireCheck(() => {
		test("should be stressing state", () => {
			return isControlledState(state, getStateMachine(state, usedGirl))
		})
	}, getIsDebug(state))

	if (getCurrentAnimationName(state, usedGirl) == animationName.KeepLie) {
		// state = setIsUpdatePhysics(state, true)
		state = disablePhysics(state, usedGirl)

		state = removeCustomDuration(state, usedGirl)

		return triggerAction(state, usedGirl, actionName.HeavyStressingLie as any).then(([state, _]) => {
			// state = _playSoundAndTriggerGameEvent(state)

			// return addExcitement(state, usedGirl, excitement.Middle)

			return _destroyAllTurretsOnBreast(state, usedGirl)
		})
	}

	return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		return _waitForFinish(state, usedGirl)
	}, 5)))
}

let _destroy = (state: state, usedGirl, queue) => {
	let validData = queue.getValidData(getAbstractState(state))
	if (validData.length == 0) {
		return Promise.resolve(state)
	}

	let weaponValue = buildFakeGirlWeaponValue(state, usedGirl, getMaxForce())

	return damageWithMultipleData(state, [
		[weaponValue.force, new Vector3(0, -1, 0)],
		[damageType.Direct, weaponType.Body]
	],
		weaponValue,
		buildNameByUsedGirl(usedGirl),
		NullableUtils.getEmpty(),
		ArrayUtils.unzip(validData)
	).then(TupleUtils.getTuple2First)
}

let _destroyAllTurretsOnBreast = (state: state, usedGirl) => {
	return _destroy(state, usedGirl, ShellTurret.getAllModelQueues(state)[0]).then(state => {
		return _destroy(state, usedGirl, MissileTurret.getAllModelQueues(state)[0])
	})
}

let _setCustomDurationForInitialState = (state, usedGirl) => {
	let duration
	switch (getAutoDifficulty(state)) {
		case autoDifficulty.VeryEasy:
		case autoDifficulty.Easy:
			duration = 3
			break
		case autoDifficulty.Middle:
			duration = 2
			break
		case autoDifficulty.Hard:
		case autoDifficulty.VeryHard:
		case autoDifficulty.VeryHard1:
		case autoDifficulty.VeryHard2:
		case autoDifficulty.VeryHard3:
		case autoDifficulty.VeryHard4:
		case autoDifficulty.VeryHard5:
			duration = 1.5
			break
	}

	return setCustomDuration(state, usedGirl, duration)
}

let _buildHandTypeKey = (usedGirl) => `${usedGirl}_handType`

export let createStressingState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => {
			// state = resetFinish(state, getKey())
			// state = resetFinish(state, BehaviourTreeDataLeftHand.getKey())
			// state = resetFinish(state, BehaviourTreeDataRightHand.getKey())
			state = resetAllFinish(state, usedGirl)

			state = setLevelData(state, _buildHandTypeKey(usedGirl), getHandType(state))

			return Promise.resolve(state)
		},
		executeFunc: (state, [_, fromName, damagePosition]) => {
			console.log("stressing")

			return Event.trigger(state, getAbstractState, getGiantessStressingEventName(), buildGiantessStubData(fromName)).then(state => {
				state = generateReward(state, fromName, buildStressingName(), buildNameByUsedGirl(usedGirl), damagePosition, getRewardPropPosition(state, usedGirl), getRewardPropOffset(state))

				state = setHandType(state, handType.None)

				state = setCustomDuration(state, usedGirl, 0.5)

				return _waitForFinish(state, usedGirl)
			})
		},
		exitFunc: (state: state) => {
			// state = setIsUpdatePhysics(state, true)
			state = enablePhysics(state, usedGirl)

			state = _setCustomDurationForInitialState(state, usedGirl)

			state = handleStressingStateExit(state, usedGirl)

			state = setHandType(state, getLevelDataExn(state, _buildHandTypeKey(usedGirl)))

			return Promise.resolve(state)
		},
	}
}

// let _buildWaitForNotStressingName = () => "WaitForNotStressing"

// let _waitForNotStressing = (state: state, handType) => {
// 	if (!isControlledState(state, getStateMachine(state))) {
// 		state = setHandType(state, handType)

// 		return state
// 	}

// 	return setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
// 		return Promise.resolve(_waitForNotStressing(state, handType))
// 	}, 5, _buildWaitForNotStressingName()))
// }

// export let hasHandTypeWhenNotStressing = (state: state) => {
// 	return Flow.hasDeferExecFuncData(getAbstractState(state), _buildWaitForNotStressingName())
// }

// export let setHandTypeWhenNotStressing = (state: state, handType) => {
// 	state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _buildWaitForNotStressingName()))

// 	state = _waitForNotStressing(state, handType)

// 	return state
// }


export let createInitialState = (usedGirl): fsm_state<state> => {
	return {
		name: objectStateName.Initial2,
		enterFunc: (state) => {
			// state = setGetCenterFunc(state, collisionPart_ => {
			// 	let x = -220
			// 	let y = 32
			// 	switch (collisionPart_) {
			// 		case collisionPart.RightBreast:
			// 			return NullableUtils.return_(new Vector3(x, y, 82))
			// 		case collisionPart.LeftBreast:
			// 			return NullableUtils.return_(new Vector3(x, y, 61))
			// 		default:
			// 			return NullableUtils.getEmpty()
			// 	}
			// })

			return Promise.resolve(state)
		},
		executeFunc: (state, _) => {
			state = _setCustomDurationForInitialState(state, usedGirl)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => {
			// state = setIsUpdatePhysics(state, true)
			// state = removeGetCenterFunc(state)

			return Promise.resolve(state)
		},
	}
}