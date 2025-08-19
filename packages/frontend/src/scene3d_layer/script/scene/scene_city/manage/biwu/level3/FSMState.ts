import { fsm_state } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../../type/StateType"
import { collisionPart, damageType, difficulty, objectStateName } from "../../../type/StateType"
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
import { excitement } from "../../../data/DataType"
import { getIdExn, markFinish, markWhetherNotExecuteGiantessAI } from "../../../behaviour_tree/BehaviourTreeManager"
import { triggerMainEvent } from "../../../game_event/GameEvent"
// import { markIsRunning } from "../../../utils/BehaviourManagerUtils"
import * as GameEventData from "../../../data/biwu/level3/GameEventData"
import { Flow } from "meta3d-jiehuo-abstract"
import { handType, setHandType } from "../../../data/biwu/level3/behaviour_tree_data_all/BehaviourTreeData"
import * as BehaviourTreeDataLeftHand from "../../../data/biwu/level3/behaviour_tree_data_left_hand/BehaviourTreeData"
import * as BehaviourTreeDataRightHand from "../../../data/biwu/level3/behaviour_tree_data_right_hand/BehaviourTreeData"
import { MMD } from "meta3d-jiehuo-abstract"
import { changePose } from "../../../girl/Pose"
import { pose } from "../../../data/biwu/level3/CollisionShapeData"
import { isStressingState } from "../../../utils/FSMStateUtils"
import { getStateMachine } from "../../../girl/FSMState"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { disablePhysics, enablePhysics, getName, setIsUpdatePhysics } from "../../../girl/Girl"
import { removeGetCenterFunc, setGetCenterFunc } from "../../../girl/Collision"
import { Vector3 } from "three"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as ShellTurret from "../../city1/milltary_building/ShellTurret"
import * as MissileTurret from "../../city1/milltary_building/MissileTurret"
import { damageWithData } from "../../../utils/DamageUtils"
import { weaponType } from "../../../data/ValueType"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getBiwuSetting } from "../../../CityScene"

let _waitForFinish = (state: state) => {
	requireCheck(() => {
		test("should be stressing state", () => {
			return isStressingState(getStateMachine(state))
		})
	}, getIsDebug(state))

	if (getCurrentAnimationName(state) == animationName.KeepLie) {
		// state = setIsUpdatePhysics(state, true)
		state = disablePhysics(state)

		state = removeCustomDuration(state)

		return triggerAction(state, actionName.HeavyStressingLie as any).then(([state, _]) => {
			// state = _playSoundAndTriggerGameEvent(state)

			// return addExcitement(state, excitement.Middle)

			return _destroyAllTurretsOnBreast(state)
		})
	}

	return Promise.resolve(setAbstractState(state, Flow.addDeferExecFuncData(getAbstractState(state), (state) => {
		return _waitForFinish(state)
	}, 5)))
}


let _destroy = (state: state, queue) => {
	let validData = queue.getValidData(getAbstractState(state))
	if (validData.length == 0) {
		return Promise.resolve(state)
	}

	return damageWithData(state, [
		[100000, new Vector3(0, -1, 0)],
		[damageType.Direct, weaponType.Heavy]
	],
		getName(),
		NullableUtils.getEmpty(),
		ArrayUtils.unzip(validData)
	).then(TupleUtils.getTuple2First)
}

let _destroyAllTurretsOnBreast = (state: state) => {
	return _destroy(state, ShellTurret.getAllModelQueues(state)[0]).then(state => {
		return _destroy(state, MissileTurret.getAllModelQueues(state)[0])
	})
}

let _setCustomDurationForInitialState = (state) => {
	let duration
	switch (getBiwuSetting(state).difficulty) {
		case difficulty.VeryEasy:
		case difficulty.Easy:
			duration = 3
			break
		case difficulty.Middle:
			duration = 2
			break
		case difficulty.Hard:
		case difficulty.VeryHard:
			duration = 1.5
			break
	}

	return setCustomDuration(state, duration)
}

export let createStressingState = (): fsm_state<state> => {
	return {
		name: objectStateName.Stressing,
		enterFunc: (state) => Promise.resolve(state),
		executeFunc: (state, _) => {
			console.log("stressing")

			state = setHandType(state, handType.None)

			state = setCustomDuration(state, 0.5)

			return _waitForFinish(state)
		},
		exitFunc: (state: state) => {
			// state = setIsUpdatePhysics(state, true)
			state = enablePhysics(state)

			state = _setCustomDurationForInitialState(state)


			return Promise.resolve(state)
		},
	}
}

// let _buildWaitForNotStressingName = () => "WaitForNotStressing"

// let _waitForNotStressing = (state: state, handType) => {
// 	if (!isStressingState(getStateMachine(state))) {
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


export let createInitialState = (): fsm_state<state> => {
	return {
		name: objectStateName.Initial2,
		enterFunc: (state) => {
			state = setGetCenterFunc(state, collisionPart_ => {
				let x = -220
				let y = 32
				switch (collisionPart_) {
					case collisionPart.RightBreast:
						return NullableUtils.return_(new Vector3(x, y, 82))
					case collisionPart.LeftBreast:
						return NullableUtils.return_(new Vector3(x, y, 61))
					default:
						return NullableUtils.getEmpty()
				}
			})

			return Promise.resolve(state)
		},
		executeFunc: (state, _) => {
			state = _setCustomDurationForInitialState(state)

			return Promise.resolve(state)
		},
		exitFunc: (state: state) => {
			// state = setIsUpdatePhysics(state, true)
			state = removeGetCenterFunc(state)

			return Promise.resolve(state)
		},
	}
}