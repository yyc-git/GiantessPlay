import { Euler, Quaternion, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD"
import { getAbstractState } from "../../../../state/State"
import { isEnter } from "../scenario/ScenarioManager"
import { getCurrentAnimationName } from "./Animation"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { animationName } from "../data/DataType"

const _v1 = /*@__PURE__*/ new Vector3();
const _e1 = /*@__PURE__*/ new Euler();
const _q1 = /*@__PURE__*/ new Quaternion();

let _getLookatKey = () => "headLookat"

export let headLookat = (state: state, targetPosition: Vector3, includeAnimations: any = [
    animationName.Idle,
    animationName.Walk,
    animationName.Run,
    animationName.Stomp]) => {
    if (isEnter(state)) {
        state = disposeLookat(state)

        return state
    }

    MutableMapUtils.set(getMMDAnimationHelper(getAbstractState(state)).notIKBoneCustomData, _getLookatKey(), (bone) => {
        if (bone.name == "頭") {
            if (!includeAnimations.includes(getCurrentAnimationName(state))) {
                return
            }

            let lookatQuaternion = TransformUtils.getLookatQuaternion(
                TransformUtils.getWorldPosition(bone, _v1),
                // LittleManTransform.getWorldPosition(state)
                targetPosition
            )

            // let beforeBoneLocalQuaterion = bone.quaternion.clone()

            let _ = TransformUtils.setWorldQuaternion(bone, getAbstractState(state), lookatQuaternion)

            // let yAngle = _e1.setFromQuaternion(bone.quaternion, 'YXZ').y

            let euler = _e1.setFromQuaternion(bone.quaternion, 'YXZ')

            // euler.y = NumberUtils.clamp(euler.y, -Math.PI / 2, Math.PI / 2)
            if (euler.y > Math.PI * 0.5) {
                euler.y = Math.PI - euler.y
            }
            else if (euler.y < -Math.PI * 0.5) {
                euler.y = -(Math.PI + euler.y)
            }

            // euler.x = 0
            euler.z = 0

            bone.quaternion.copy(
                _q1.setFromEuler(
                    euler
                )
            )

            // Console.log(
            //     _e1.setFromQuaternion(bone.quaternion, 'YXZ').y
            // )
            // if (yAngle <= -Math.PI / 2 || yAngle >= Math.PI / 2) {
            //     bone.quaternion.copy(beforeBoneLocalQuaterion)
            // }
        }
    })

    return state
}

export let disposeLookat = (state: state) => {
    MutableMapUtils.remove(getMMDAnimationHelper(getAbstractState(state)).notIKBoneCustomData, _getLookatKey())

    return state
}