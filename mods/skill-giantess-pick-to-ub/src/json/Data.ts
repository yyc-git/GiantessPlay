import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getKeepUBBlockName, getProtocolName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum phase {
    Phase
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
export let getActionName = () => "Skill_Giantess_Pick_To_UB"

// export let getAnimationName = getActionName

// export let getForceAnimationName = () => getForceAnimationName()
export let getForceAnimationName = getActionName


export let getAllAnimationNames = () => [
    getForceAnimationName(),
]

export let isKeepPoseAnimation = () => true

export let getOperateRenderData = (): operateRenderData => {
    return {
        poseData: [
            {
                pose: pose.Pick,
                names: [
                    getActionName()
                ],
            },
        ],
        operateData: [
            {
                name: getActionName(),
                imageSrc: getImagePath("skill"),
                key: "T",
                rowIndex: 2,

                conditionFunc: (api, state, usedGirl) => {
                    return api.girl.getCurrentAnimationName(state, usedGirl) == animationNameType.KeepPick
                }
            },
        ]
    }
}

export let getAnimationBlendData = (
    api: api,
    [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]
): animationBlendData<animationNameType> => {
    return [
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl,getForceAnimationName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepUBBlockName()).getForceAnimationName(),
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.KeepPick],
            weight: 0.5,
            nextAnimationName: getForceAnimationName()
        },

    ]
}

// let _getStompPoint = (api: api, state, getShapeFunc) => {
//     return api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart.RightFoot))
// }


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
            ],
            timeline: [
            ]
        },

    ]
}

export let getActionData = (): actionData<string> => {
    return [
    ]
}

export let getPhase = (): phaseData<string> => {
    return [
        {
            name: getForceAnimationName(),
            value: [
                {
                    frameIndexRange: [0, 30],
                    phase: phase.Phase
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    return [
        {
            name: getForceAnimationName(),
            value: skillStressingValue.Zero
        },
    ]
}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
        [getForceAnimationName()]: {
            experienceFactor: experienceFactor.Middle
        },
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.Middle3,
        },
    ]
}

export let getAllSkillDataForLevelOrBoss = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.Zero
        },
    ]
}

export let getVMDRawData = () => {
    return [
        [
            getForceAnimationName(),
            _getVMDPath("pick_to_ub")
        ],
    ]
}

let _getForceAnimationFrameCount = () => 30

export let getAnimationFrameCount = () => {
    return {
        [getForceAnimationName()]: _getForceAnimationFrameCount(),
    }
}

export let isSkillState = (api: api, state: state, usedGirl) => {
    return true
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    return api.buildRandomDirectionInXZ()
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}

// export let createFSMStateByChangeAnimationName = (api: api, state: state, nextBlendingAnimationName: animationNameType) => {
//     let fsmState = null
//     switch (nextBlendingAnimationName) {
//         case getForceAnimationName():
//             state = api.changePose_(state,usedGIrl, pose.Sit)
//             break
//     }

//     return [state, fsmState]
// }