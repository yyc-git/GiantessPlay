import { Euler, Quaternion, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../state/State"
import { isEnter } from "../scenario/ScenarioManager"
import { getCurrentAnimationName } from "./Animation"
import { TransformUtils } from "meta3d-jiehuo-abstract"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { animationName } from "../data/DataType"
import { MMD } from "meta3d-jiehuo-abstract"
import { getStompBlockService } from "../../../../mod/SkillGiantessMod"
import { usedGirl } from "../type/StateType"

const _v1 = /*@__PURE__*/ new Vector3();
const _e1 = /*@__PURE__*/ new Euler();
const _q1 = /*@__PURE__*/ new Quaternion();

let _getLookatKey = (usedGirl) => `${usedGirl}_headLookat`

export let headLookat = (state: state,
    updateEulerFunc,
    usedGirl: usedGirl,
    targetPosition: Vector3,
    includeAnimations: any = [
        animationName.Idle,
        animationName.Walk,
        animationName.Run,
        // animationName.Stomp
    ].concat(
        getStompBlockService(state).getAllAnimationNames()
    )) => {
    if (isEnter(state)) {
        state = disposeLookat(state, usedGirl)

        return state
    }

    if (!MMD.hasMMDAnimationHelper(getAbstractState(state), usedGirl)) {
        return state
    }

    MutableRecordUtils.set(MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).notIKBoneCustomData, _getLookatKey(usedGirl), (bone) => {
        if (bone.name == "頭") {
            if (!includeAnimations.includes(getCurrentAnimationName(state, usedGirl))) {
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

            euler.z = 0

            euler = updateEulerFunc(state, euler)


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

export let disposeLookat = (state: state, usedGirl) => {
    if (!MMD.hasMMDAnimationHelper(getAbstractState(state), usedGirl)) {
        return state
    }

    MutableRecordUtils.remove(MMD.getMMDAnimationHelper(getAbstractState(state), usedGirl).notIKBoneCustomData, _getLookatKey(usedGirl))

    return state
}