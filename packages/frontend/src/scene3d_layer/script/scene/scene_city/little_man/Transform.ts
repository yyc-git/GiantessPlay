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
import { isNotDamageState } from "../utils/FSMStateUtils"
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
import { computeBox, getCurrentModelData, getFullHp, getLittleMan, getLittleManState, getName, getStateMachine, setGunInititalTransform, setHp, setLittleManState, setStateMachine } from "./LittleMan";
import { isTriggerAction, resetIsTriggerAction } from "./Action";
import { Console } from "meta3d-jiehuo-abstract";
import { setBonePositionYOffset } from "../utils/BoneUtils";

const _q = new Quaternion();
const _e = new Euler();
const _m1 = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();

export let getPosition = (state: state) => {
    return getLittleMan(state).position
}

let _setPosition = (state: state, position) => {
    getLittleMan(state).position.copy(position)

    return state
}

export let setPositionAndComputeBox = (state: state, position) => {
    state = _setPosition(state, position)

    state = computeBox(state)

    return state
}


export let getWorldPosition = (state: state) => {
    // return getLittleMan(state).position

    getLittleMan(state).updateWorldMatrix(true, true)

    return TransformUtils.getWorldPosition(getLittleMan(state), new Vector3())
}


export let getWorldMatrix = (state: state) => {
    return getLittleMan(state).matrixWorld
}


export let getLocalMatrix = (state: state) => {
    return getLittleMan(state).matrix
}

export let setLocalMatrix = (state: state, matrix: Matrix4) => {
    let _ = TransformUtils.setMatrix(getLittleMan(state), matrix)

    return state
}

// export let updateLocalMatrix = (state: state) => {
//     getLittleMan(state).updateMatrix()

//     return state
// }

export let translate = (state: state, translation: Vector3) => {
    return _setPosition(
        state,
        getPosition(state).clone().add(
            translation
        )
    )
}

export let setRotation = (state: state, quat: Quaternion) => {
    getLittleMan(state).quaternion.copy(quat)

    return state
}

export let setScale = (state: state, scale: Vector3) => {
    getLittleMan(state).scale.copy(scale)

    return state
}

// let _getScalar = () => {
//     return 0.001
// }

// let _getPositionYOffset = () => {
//     return _getScalar() * -500
// }


export let initTransform = (state: state) => {
    state = setBonePositionYOffset(state, getLittleMan(state), getCurrentModelData(state).positionYOffset)

    state = _setPosition(state, NullableUtils.getExn(getLittleManState(state).initialPosition))
    // state = _setPosition(state, NullableUtils.getExn(getLittleManState(state).initialPosition.clone().setY(-10)))
    // state = _setPosition(state, NullableUtils.getExn(getLittleManState(state).initialPosition.clone().setY(_getPositionYOffset())))
    state = setRotation(state, NullableUtils.getExn(getLittleManState(state).initialQuaternion))
    // state = setScale(state, _v1.set(1, 1, 1))
    // state = setScale(state, _v1.setScalar(_getScalar()))
    state = setScale(state, _v1.setScalar(getCurrentModelData(state).scalar))
    // state = setScale(state, _v1.set(0.06, 0.06, 0.06,))


    // state = updateLocalMatrix(state)

    return state
}