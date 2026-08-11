import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getKeepSitBlockName, getProtocolName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, particle, phaseData, skillStressingFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { readState } from "meta3d-jiehuo-abstract/src/state/State"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


// export let getSoundResourcePath = () => _getPath("sound", "mp3")

// export let getSoundResourceId = getSoundResourcePath



// export enum languageKey {
//     OperateKey,
// }

// export let getTextData = () => {
//     return {
//         [language.Chinese]: {
//             [languageKey.OperateKey]: "E",
//         },
//         [language.English]: {
//             [languageKey.OperateKey]: "E",
//         },
//     }
// }

// export let getActionName = () => "Skill_LittleMan_Action_Swiping"

// export let getActionName = () => "Skill_LittleMan_Animation_Swiping"
export let getActionName = () => "Skill_Giantess_Sit_HeavyStressing_Breast"

// export let getAnimationName = getActionName

// export let getForceAnimationName = () => getForceAnimationName()
export let getForceAnimationName = getActionName


export let getAllAnimationNames = () => [
    getForceAnimationName(),
]

export let isKeepPoseAnimation = () => false

export let getOperateRenderData = (): operateRenderData => {
    return {
        poseData: [
        ],
        operateData: [
        ]
    }
}

export let getAnimationBlendData = (
    api: api,
    [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc],
    state
): animationBlendData<animationNameType> => {
    return [
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: api.getAnimationNamesExceptDamageNames(state),
            weight: 0.0,
            nextAnimationName: getForceAnimationName(),
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,getForceAnimationName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepSitBlockName()).getForceAnimationName(),
            noBlend: true
        },

    ]
}


export let getAnimationCollisionData = (api: api, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
    getShapeFunc,
    getScaleFunc,
    getHeightFunc,
    isLittleCharacterTypeFunc
]): Array<animationCollisionData<string>> => {
    return [
        // {
        //     name: getForceAnimationName(),

        //     shapeDamage: [
        //         collisionPart.RightHand,
        //         collisionPart.RightLowerArm,
        //         collisionPart.RightUpperArm,
        //     ],
        //     timeline: [
        //     ]
        // },
    ]
}

export let getActionData = (): actionData<string> => {
    return [
    ]
}

export let getPhase = (): phaseData<string> => {
    return [
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    return [
    ]
}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
    ]
}

export let getAllSkillDataForLevelOrBoss = () => {
    return [
    ]
}

export let getVMDRawData = () => {
    return [
        [
            getForceAnimationName(),
            _getVMDPath("sit_heavy_stressing_breast")
        ],
    ]
}

let _getForceAnimationFrameCount = () => 60

export let getAnimationFrameCount = () => {
    return {
        [getForceAnimationName()]: _getForceAnimationFrameCount(),
    }
}

export let isSkillState = (api: api, state: state, usedGirl) => {
    return false
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    throw new Error("error");
}

export let computeDamageTypeDefault = (phase) => {
    throw new Error("error");
}