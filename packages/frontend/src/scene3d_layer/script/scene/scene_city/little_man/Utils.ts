import { TransformUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getPickObjectName, hasPickData, removePickData } from "../girl/PickPose"
import { getLittleManState, getName } from "./LittleMan"
import { getPosition } from "./Transform"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Vector3 } from "three"
import { stateMachine } from "meta3d-jiehuo-abstract/src/type/StateType"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { objectStateName, xzRange } from "../type/StateType"
import { isInXZRange } from "../manage/city1/soldier/utils/CommanderUtils"
import { getCameraFar } from "../utils/LittleManCameraUtils"

const _v1 = new Vector3();

let _isPicked = (state: state) => {
    return hasPickData(state) && getPickObjectName(state) == getName()
}

export let clearPick = (state: state) => {
    if (_isPicked(state)) {
        state = removePickData(state)
    }

    return state
}

export let getTargetPosition = (state: state) => {
    let aim = NullableUtils.getExn(getLittleManState(state).aim)

    let far = getCameraFar(state)

    return aim.getWorldPosition(new Vector3()).add(_v1.set(0, far * 0.02, 0))
}

export let getLookat = (state: state) => {
    let position = getPosition(state)

    return TransformUtils.getLookatQuaternion(
        position,
        getTargetPosition(state).clone().setY(position.y)
    )
}

export let isLieState = (stateMachine: stateMachine<state>) => {
    return StateMachine.isState(stateMachine, objectStateName.Lie) || StateMachine.isState(stateMachine, objectStateName.Standup)
}


export let isNotInMovableRanges = (boxCenter: Vector3, movableRanges: Array<xzRange>) => {
    if (movableRanges.length == 0) {
        return false
    }

    return !movableRanges.reduce((isIn, range) => {
        if (isIn) {
            return isIn
        }

        return isInXZRange(boxCenter, range)
    }, false)
}