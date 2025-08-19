import { Euler, Quaternion, Vector3 } from "three";
import { state } from "../../../../../type/StateType";
import { MutableMapUtils } from "meta3d-jiehuo-abstract";
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD";
import { getAbstractState, setAbstractState } from "../../../../../state/State";
import { getCurrentAnimationName } from "../../girl/Animation";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import * as LittleManTransform from "../../little_man/Transform"
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { isEnter } from "../../scenario/ScenarioManager";
import { getBiwuSetting, setRoad } from "../../CityScene";
import { physicsLevel, road } from "meta3d-jiehuo-abstract/src/type/StateType";
import { RenderSetting } from "meta3d-jiehuo-abstract";
import { setIsOnlyDamageLittleMan } from "../../girl/Girl";
import { difficulty } from "../../type/StateType";

const _v1 = /*@__PURE__*/ new Vector3();
const _e1 = /*@__PURE__*/ new Euler();
const _q1 = /*@__PURE__*/ new Quaternion();


// // export let lookatLittleMan = (state: state, excludeAnimations) => {
// export let lookatLittleMan = (state: state, includeAnimations) => {
//     if (isEnter(state)) {
//         state = disposeLookatLittleMan(state)

//         return state
//     }

//     MutableMapUtils.set(getMMDAnimationHelper(getAbstractState(state)).notIKBoneCustomData, _getLookatLittleManKey(), (bone) => {
//         if (bone.name == "頭") {
//             if (!includeAnimations.includes(getCurrentAnimationName(state))) {
//                 return
//             }

//             let lookatQuaternion = TransformUtils.getLookatQuaternion(
//                 TransformUtils.getWorldPosition(bone, _v1),
//                 LittleManTransform.getWorldPosition(state)
//             )

//             // let beforeBoneLocalQuaterion = bone.quaternion.clone()

//             let _ = TransformUtils.setWorldQuaternion(bone, getAbstractState(state), lookatQuaternion)

//             // let yAngle = _e1.setFromQuaternion(bone.quaternion, 'YXZ').y

//             let euler = _e1.setFromQuaternion(bone.quaternion, 'YXZ')
//             euler.y = NumberUtils.clamp(euler.y, -Math.PI / 2, Math.PI / 2)

//             bone.quaternion.copy(
//                 _q1.setFromEuler(
//                     euler
//                 )
//             )

//             // Console.log(
//             //     _e1.setFromQuaternion(bone.quaternion, 'YXZ').y
//             // )
//             // if (yAngle <= -Math.PI / 2 || yAngle >= Math.PI / 2) {
//             //     bone.quaternion.copy(beforeBoneLocalQuaterion)
//             // }
//         }
//     })

//     return state
// }


export let initWhenImportScene = (state: state) => {
    state = setRoad(state, road.LittleMan)

    if (RenderSetting.getRenderSetting(getAbstractState(state)).physics != physicsLevel.VeryHigh) {
        state = setAbstractState(state, RenderSetting.setPhysics(getAbstractState(state), physicsLevel.High))
    }

    return state
}

export let setGirlCanDamageTarget = (state: state) => {
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.Hard:
        case difficulty.VeryHard:
            return setIsOnlyDamageLittleMan(state, true)
        default:
            return setIsOnlyDamageLittleMan(state, false)
    }
}