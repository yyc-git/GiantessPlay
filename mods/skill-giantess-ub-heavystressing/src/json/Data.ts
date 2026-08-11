import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getKeepUBBlockName, getProtocolName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillStressingFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { readState } from "meta3d-jiehuo-abstract/src/state/State"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum stressingPhase {
    Phase,
}

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
export let getActionName = () => "Skill_Giantess_UB_HeavyStressing"

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
            // currentAnimationNames: [api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepUBBlockName()).getForceAnimationName()],
            weight: 0.0,
            nextAnimationName: getForceAnimationName(),
            // noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,getForceAnimationName(), api.getIsDebug(state)) && api.hasPickData(state, usedGirl)

            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepUBBlockName()).getForceAnimationName(),
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state)) && !api.hasPickData(state, usedGirl)
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: animationNameType.Idle,
            weight: 0.5
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
        {
            name: getForceAnimationName(),

            shapeDamage: [
                collisionPart.TrigoneAndButt,
            ],
            timeline: [
            ]
        },
    ]
}

export let getActionData = (): actionData<string> => {
    return [
        {
            name: getForceAnimationName(),
            force: {
                [stressingPhase.Phase]: giantessForceSize.Low,
            }
        },
    ]
}

export let getPhase = (): phaseData<string> => {
    return [
        {
            name: getForceAnimationName(),
            value: [
                {
                    frameIndexRange: [0, 50],
                    phase: stressingPhase.Phase
                },
            ]
        },
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
            _getVMDPath("ub_heavy_stressing")
        ],
    ]
}

let _getForceAnimationFrameCount = () => 50

export let getAnimationFrameCount = () => {
    return {
        [getForceAnimationName()]: _getForceAnimationFrameCount(),
    }
}

export let isSkillState = (api: api, state: state, usedGirl) => {
    return false
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    return api.buildRandomDirectionInXZ()
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}