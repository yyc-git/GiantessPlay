import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleRoad, getOrbitControlsTarget } from "../CityScene";
import { littleMan, littleManActionState, objectStateName } from "../type/StateType";
import { ModelLoader } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { Loader } from "meta3d-jiehuo-abstract";
import { actionName, animationName } from "../little_man_data/DataType";
import { SkinAnimation } from "meta3d-jiehuo-abstract";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { fsm_state, labelAnimation } from "meta3d-jiehuo-abstract/src/type/StateType";
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract";
import { getIsDebug } from "../../Scene";
import { SkinBlendAnimation } from "meta3d-jiehuo-abstract";
import { changeToPhongMaterial } from "meta3d-jiehuo-abstract/src/utils/MaterialUtils";
import { addBox3Helper } from "../utils/ConfigUtils";
import { getAnimationBlendDuration } from "../little_man_data/Data";
import { getAnimationFrameCount } from "../little_man_data/Const";
import { littleManValue } from "../little_man_data/ValueType";
import { Device } from "meta3d-jiehuo-abstract";
import { NewThreeInstance } from "meta3d-jiehuo-abstract";
import { Object3DUtils } from "meta3d-jiehuo-abstract";
import { move } from "./Move";
import { ThirdPersonControls } from "meta3d-jiehuo-abstract";
import { Shadow } from "meta3d-jiehuo-abstract";
import { Render } from "meta3d-jiehuo-abstract";
import { getLittleHandTransform, getLittleHandTransformForDebug, getLittleHandTransformPrefix } from "../utils/SkeletonUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Billboard } from "meta3d-jiehuo-abstract";
import { ScreenUtils } from "meta3d-jiehuo-abstract";
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera";
import { getHeight, getWidth } from "meta3d-utils/src/View";
import { getLittleManShootStartEventName, getMissionFailEventName } from "../../../../utils/EventUtils";
import { Event } from "meta3d-jiehuo-abstract";
import { getGirlPositionParrelToArmy, getParticleNeedCollisionCheckLoopCount, } from "../utils/ArmyUtils";
import { isControlledState, isNotDamageState } from "../utils/FSMStateUtils"
import { getRandomCollisionPart } from "../utils/CollisionUtils";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { emitPrecision, emitterLife, emitterSize, emitterSpeed } from "../data/ValueType";
import { updateAnimationCollision } from "./Collision";
import { Map } from "immutable";
import * as DamageUtils from "../utils/DamageUtils"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { Flow } from "meta3d-jiehuo-abstract";
import { getDeathAnimationResourcePath } from "../data/Const";
import { hp } from "../data/DataType";
import { computeBox, getFullHp, getLittleMan, getLittleManState, getName, getStateMachine, setGunInititalTransform, setHp, setLittleManState } from "./LittleMan";
import { getPosition, initTransform, setRotation } from "./Transform";
import { getAllAnimationNames, getCurrentAnimationName, initWeights } from "./Animation";
import { handleShootAction } from "./Shoot";
import { handleSwipingAction } from "./Swiping";
import { handleBlinkAction } from "./Blink";
import { getCurrentData } from "../little_man_data/SkillData";
import { isLieState } from "./Utils";
import { isCanAction } from "./climb/ClimbManager";

let _isKeepPoseAnimation = (name: animationName) => {
    switch (name) {
        case animationName.Idle:
            return true
        default:
            return false
    }
}

export let isActionTriggering = (state: state, name: actionName) => {
    // switch (name) {
    //     case actionName.Run:
    //         return isActionState(state, actionState.Run)
    //     default:
    //         return isTriggerAction(state, name)
    // }
    return isTriggerAction(state, name)
}

export let isActionValid = (state: state, name: actionName) => {
    // if (!_isBelongToCurrentPoseAndScaleState(state, name)) {
    //     return false
    // }

    // let { excitement } = _getSkillData(name)

    // if (!isExcitementEnough(state, excitement)) {
    //     return false
    // }


    if (!isNotDamageState(getStateMachine(state)) || (isControlledState(getStateMachine(state)) && name !== actionName.Idle)
    ) {
        return false
    }

    if (isActionTriggering(state, name)) {
        return false
    }


    if (StateMachine.isState(getStateMachine(state), objectStateName.Climb) && !isCanAction(state)) {
        switch (name) {
            case actionName.Blink:
            case actionName.Shoot:
            case actionName.Swiping:
                return false
        }
    }

    if (_isKeepPoseAnimation(getCurrentAnimationName(state))
        // && name !== actionName.Bigger
    ) {
        return true
    }

    switch (name) {
        case actionName.Lie:
        case actionName.Standup:
            return true
        default:
            return !isLieState(getStateMachine(state))
    }
}

let _isDamageAction = (name: actionName) => {
    return [
        actionName.Shake,
        actionName.Death,
    ].includes(name as any)
}

let _setTriggerAction = (state, triggeredAction) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        triggeredAction: NullableUtils.return_(triggeredAction)
    })
}

export let triggerAction = (state, name: actionName): Promise<state> => {
    if (_isDamageAction(name)) {
        state = _setTriggerAction(state, name)
        return Promise.resolve(state)
    }



    if (!isActionValid(state, name)) {
        return Promise.resolve(state)
    }

    state = _setTriggerAction(state, name)


    switch (name) {
        case actionName.Shoot:
            state = handleShootAction(state)
            break
        case actionName.Swiping:
            state = handleSwipingAction(state)
            break
        case actionName.Blink:
            state = handleBlinkAction(state)
            break
        case actionName.Lie:
            state = setActionState(state, littleManActionState.Lie)
            break
    }


    return Promise.resolve(state)
}

export let isTriggerAction = (state, name) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            triggeredAction => {
                return triggeredAction == name
            },
            getLittleManState(state).triggeredAction
        ),
        false
    )
}

export let resetIsTriggerAction = (state) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        triggeredAction: NullableUtils.getEmpty()
    })
}

export let getActionState = (state) => {
    return getLittleManState(state).actionState
}

export let isActionState = (state, actionState) => {
    return getActionState(state) == actionState
}

export let setActionState = (state, actionState) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        actionState: actionState
    })
}

export let getTriggeredActionTime = (state, name) => {
    return NullableUtils.getWithDefault(getLittleManState(state).triggeredActionTime.get(name), 0)
}

export let setTriggeredActionTime = (state, name, time) => {
    return setLittleManState(state, {
        ...getLittleManState(state),
        triggeredActionTime: getLittleManState(state).triggeredActionTime.set(name, time)
    })
}

export let getRemainCoolingTime = (state, name) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(coolingTime => {
            let now = performance.now()

            return coolingTime - (now - getTriggeredActionTime(state, name))
        }, getCurrentData(state, name).coolingTime),
        0
    )
}