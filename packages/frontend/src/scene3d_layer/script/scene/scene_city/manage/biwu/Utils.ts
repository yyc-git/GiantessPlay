import { Euler, Quaternion, Vector3 } from "three";
import { state } from "../../../../../type/StateType";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD";
import { getAbstractState, setAbstractState } from "../../../../../state/State";
import { getCurrentAnimationName } from "../../girl/Animation";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import * as LittleManTransform from "../../little_man/Transform"
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { isEnter } from "../../scenario/ScenarioManager";
import { getAnimationBlendDataParam, getConfigData, setCharacterType, setConfigData, setGameEventDirectorData } from "../../CityScene";
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType";
import { isActionTriggering, setIsCanActiveSmallerFunc, setIsOnlyDamageLittleMan } from "../../girl/Girl";
import { getAutoDifficulty } from "../../difficulty/Difficulty";
import { autoDifficulty, damageType, usedGirlEnum } from "../../type/StateType";
import { setMovableRanges } from "../../little_man/LittleMan";
import { getRenderSetting, setPhysics } from "../../../../../mod/SettingMod";
import { physicsLevel } from "setting-default/src/Type";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getAnimationCollisionDataParam } from "../../girl/Collision";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
// import { getData } from "../../data/director/GameEventDirectorData";

const _v1 = /*@__PURE__*/ new Vector3();
const _e1 = /*@__PURE__*/ new Euler();
const _q1 = /*@__PURE__*/ new Quaternion();


// // export let lookatLittleMan = (state: state, excludeAnimations) => {
// export let lookatLittleMan = (state: state, includeAnimations) => {
//     if (isEnter(state)) {
//         state = disposeLookatLittleMan(state)

//         return state
//     }

//     MutableRecordUtils.set(getMMDAnimationHelper(getAbstractState(state), usedGirl).notIKBoneCustomData, _getLookatLittleManKey(), (bone) => {
//         if (bone.name == "頭") {
//             if (!includeAnimations.includes(getCurrentAnimationName(state, usedGirl))) {
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

export let getMovableRange = () => {
    return {
        // minX: -192,
        // maxX: 50,
        // minZ: -64,
        // maxZ: 64
        minX: -202,
        maxX: 60,
        minZ: -74,
        maxZ: 74
    }
}

export let initMap = (state: state) => {
    return setMovableRanges(state, [getMovableRange()])
}

export let initWhenImportScene = (state: state,
    [
        getAllAnimationNames,
        getAnimationFrameCountMap,
        getAnimationBlendData,
        getAnimationCollisionData
    ],
    actionData = [], phaseData = []
) => {
    // state = setGameEventDirectorData(state, getData(state))

    state = setConfigData(state, {
        ...getConfigData(state),
        girlAllAnimationNames: getAllAnimationNames(state),
        girlAllAnimationFrameCountMap: MutableRecordUtils.concat(getConfigData(state).girlAllAnimationFrameCountMap, getAnimationFrameCountMap() as any),

        animationBlendData: getConfigData(state).animationBlendData.concat(getAnimationBlendData(
            getAnimationBlendDataParam()
        ) as any),
        animationCollisionData: getConfigData(state).animationCollisionData.concat(getAnimationCollisionData(getAnimationCollisionDataParam() as any) as any),

        actionData: actionData.length > 0 ? actionData : getConfigData(state).actionData,
        phaseData: phaseData.length > 0 ? phaseData : getConfigData(state).phaseData,
    })

    state = {
        ...state,
        config: {
            ...state.config,
            isGirlRestoreHp: false
        }
    }


    state = setGameEventDirectorData(state, [])

    state = setIsCanActiveSmallerFuncUtils(state)

    return setCharacterType(state, characterType.LittleMan).then(state => {
        if (getRenderSetting(state).physics != physicsLevel.VeryHigh) {
            state = setPhysics(state, physicsLevel.High)
        }

        return state
    })
}

export let setGirlCanDamageTarget = (state: state, usedGirl) => {
    switch (getAutoDifficulty(state)) {
        case autoDifficulty.Hard:
        case autoDifficulty.VeryHard:
        case autoDifficulty.VeryHard1:
        case autoDifficulty.VeryHard2:
        case autoDifficulty.VeryHard3:
        case autoDifficulty.VeryHard4:
        case autoDifficulty.VeryHard5:
            return setIsOnlyDamageLittleMan(state, usedGirl, true)
        default:
            return setIsOnlyDamageLittleMan(state, usedGirl, false)
    }
}

export let setIsCanActiveSmallerFuncUtils = (state) => {
    return setIsCanActiveSmallerFunc(state, state => false)
}

export let getDamagePositionForLabel = (damagePosition, damageType_, y = 2) => {
    if (damageType_ == damageType.Range) {
        return NullableUtils.getEmpty<Vector3>()
    }

    return NullableUtils.map(
        damagePosition => {
            // if (isLittleCharacterType(state)) {
            return new Vector3(damagePosition.x, damagePosition.y + y, damagePosition.z)
            // }

            // return new Vector3(damagePosition.x, damagePosition.y + height / 10, damagePosition.z)
        },
        damagePosition
    )
}

export let getUsedGirl = () => {
    return usedGirlEnum.BossGiantess
}