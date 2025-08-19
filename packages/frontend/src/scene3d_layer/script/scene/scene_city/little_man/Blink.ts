import { NullableUtils } from "meta3d-jiehuo-abstract";
import { Quaternion, Matrix4, Vector3, Vector2, AxesHelper, Box3, Object3D, SkinnedMesh, Mesh, MeshPhongMaterial, LoopRepeat, Euler } from "three";
import { state } from "../../../../type/StateType";
import { computeTransformForCamera } from "../Camera";
import { road } from "meta3d-jiehuo-abstract/src/type/StateType";
import { computeTranslate, translate, updateMoveCollision } from "./Move";
import { Device } from "meta3d-jiehuo-abstract";
import { getAbstractState, setAbstractState } from "../../../../state/State";
import { getPosition, setRotation } from "./Transform";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { Console } from "meta3d-jiehuo-abstract";
import { getTriggeredActionTime, resetIsTriggerAction, setTriggeredActionTime } from "./Action";
import { ThirdPersonControls } from "meta3d-jiehuo-abstract";
import { updateCamera } from "../LittleManCamera";
import { updateAimHud } from "./Shoot";
import { ParticleManager } from "meta3d-jiehuo-abstract";
import { Flow } from "meta3d-jiehuo-abstract";
import { actionName } from "../little_man_data/DataType";
import { SoundManager } from "meta3d-jiehuo-abstract";
import { getBlinkSoundResourceId } from "../little_man_data/Const";
import { getIsDebug } from "../../Scene";
import { getLittleManVolume } from "../utils/SoundUtils";
import { getConfigData } from "../CityScene";
import { getCurrentData } from "../little_man_data/SkillData";
import { getBox, getStateMachine } from "./LittleMan";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { objectStateName } from "../type/StateType";
import { computeVelocityForBlink, correctBoxCenterForBlink } from "./climb/ClimbManager";
import { getPositionY } from "../manage/city1/Army";
import { getGirlPositionYKey } from "../manage/biwu/level3/ArmyManager";

const _q = new Quaternion();
const _e = new Euler();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v1_1 = new Vector2();

let _computeVelocity = (state, forward, side, delta, controlRotationAngle) => {
    let _func = (factor) => {
        if (factor < 25) {
            return new Vector3(0, 0, 0)
        }

        let newForward = forward * factor
        let newSide = side * factor

        let velocity, isJudgeGirl
        if (StateMachine.isState(getStateMachine(state), objectStateName.Climb)) {
            velocity = computeVelocityForBlink(state, delta, newForward, newSide, controlRotationAngle)

            if (velocity.equals(_v1.set(0, 0, 0))) {
                return _func(factor / 2)
            }

            // /*! move up a little to avoid move collision with down obb
            // * 
            // */
            // littleManCollisionBox = getBox(state).clone().translate(_v1.set(0, 1, 0))
            isJudgeGirl = false
        }
        else {
            velocity = computeTranslate(state, delta, newForward, newSide, controlRotationAngle)

            velocity.setY(0)

            // littleManCollisionBox = getBox(state)
            isJudgeGirl = true
        }


        if (!state.config.isNotMoveCollision) {
            // velocity = updateMoveCollision(velocity, littleManCollisionBox, state, true, false)
            velocity = updateMoveCollision(velocity, state, isJudgeGirl)

            if (velocity.equals(_v1.set(0, 0, 0))) {
                return _func(factor / 2)
            }
        }

        return velocity
    }

    const factor = 100

    return _func(factor)
}

export let handleBlinkAction = (state: state) => {
    state = resetIsTriggerAction(state)

    let now = performance.now()

    let coolingTime = NullableUtils.getExn(getCurrentData(state, actionName.Blink).coolingTime)

    if (now - getTriggeredActionTime(state, actionName.Blink) < coolingTime) {
        return state
    }


    let delta = Device.getDelta(getAbstractState(state))

    let [controlRotationAngle, forward, side] = computeTransformForCamera(state, road.LittleMan)

    if (forward == 0 && side == 0) {
        // return state
        forward = 1
    }

    let velocity = _computeVelocity(state, forward, side, delta, controlRotationAngle)


    // velocity.setY(0)

    let beforePosition = getPosition(state).clone()


    state = translate(state, velocity)


    if (StateMachine.isState(getStateMachine(state), objectStateName.Climb)) {
        state = correctBoxCenterForBlink(state)
    }


    // state = setRotation(state, TransformUtils.getLookatQuaternion(
    //     _v1.set(0, 0, 0),
    //     beforeVelocity
    // ))

    // Console.log(
    //     velocity, beforeVelocity
    // )


    // state = setAbstractState(state, ThirdPersonControls.updateCamera(getAbstractState(state), velocity, getOrbitControlsTarget(state),
    //     isCameraCollision(state)
    // )
    // )
    state = updateCamera(state, velocity)

    state = setAbstractState(state, ParticleManager.emitBlink(getAbstractState(state),
        {
            speed: 1,
            life: 1000,
            size: 10,
            // position: beforePosition.setY(2).toArray()
            position: beforePosition.setY(beforePosition.y + 2).toArray()
        }
    ))

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getBlinkSoundResourceId(), getIsDebug(state), getLittleManVolume(state, getPosition(state)))))


    state = setTriggeredActionTime(state, actionName.Blink, now)

    return state
}
