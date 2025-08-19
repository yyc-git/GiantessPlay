import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { getState, setState, getName as getCitySceneName, getScene, getConfigData, isLittleRoad, getOrbitControlsTarget, getBasicBulletGunEmmitSoundResourceId } from "../CityScene";
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
import { computeBox, getBox, getFullHp, getLittleMan, getLittleManState, getName, getStateMachine, setGunInititalTransform, setHp, setLittleManState } from "./LittleMan";
import { getPosition, initTransform, setRotation } from "./Transform";
import { getAllAnimationNames, initWeights } from "./Animation";
import { setActionState } from "./Action";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getVolume, getLittleManVolume } from "../utils/SoundUtils";
import { getLookat, getTargetPosition } from "./Utils";
import { emitCurrentGunBullet } from "./Gun";

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();





export let handleShootAction = (state: state) => {
    // state = setRotation(state, getLookat(state))
    state = setActionState(state, littleManActionState.Attack)

    return state
}

export let shootStartHandler = (state: state, { userData }) => {
    // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
    //     SoundManager.buildNeedToPlaySoundData(getBasicBulletGunEmmitSoundResourceId(), getIsDebug(state), getLittleManVolume(state))
    // ))


    state = setRotation(state, getLookat(state))

    // let position = getPosition(state)

    // let bulletStartWorldPosition = _getBulletStartLocalPosition()
    //     .applyQuaternion(getLookat(state))
    //     .add(
    //         position
    //     )

    // let targetPosition = _getTargetPosition(state)

    // state = setAbstractState(state, ParticleManager.emitBullet(getAbstractState(state), {
    //     // speed: emitterSpeed,
    //     // life: emitterLife,
    //     // size: emitterSize,
    //     speed: emitterSpeed.VeryFast,
    //     life: emitterLife.Short,
    //     size: emitterSize.Middle,

    //     position: bulletStartWorldPosition.toArray(),
    //     direction: targetPosition.clone().sub(bulletStartWorldPosition).normalize().toArray(),
    // }, getParticleNeedCollisionCheckLoopCount(state)))


    return Promise.resolve(state)
}

export let shootEmitHandler = (state: state, { userData }) => {

    state = emitCurrentGunBullet(state)

    return Promise.resolve(state)
}


export let updateAimHud = (state: state) => {
    let aim = NullableUtils.getExn(getLittleManState(state).aim)

    aim.position.copy(
        ScreenUtils.convertScreenCoordniateToWorldCoordniate(
            _v1_1.set(
                getWidth() / 2,
                getHeight() / 2
            ),
            getCurrentCamera(getAbstractState(state)),
            false
        )
    )
    aim.updateMatrixWorld(true)

    return state
}

export let showAim = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).aim).visible = true

    return state
}

export let hideAim = (state: state) => {
    NullableUtils.getExn(getLittleManState(state).aim).visible = false

    return state
}