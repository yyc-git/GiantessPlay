import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { actionData, actionName, animationBlendData, effect, excitement, experienceFactor, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"

// export enum phase {
//     Phase
// }


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")

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
export let getActionName = () => "Skill_Giantess_PutToBreast"

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
                key: "B",
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
                return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: animationNameType.Idle,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.KeepPick],
            nextAnimationName: getForceAnimationName(),
            noBlend: true
        },
    ]
}

export let getPutToBreastEventName = () => "Mod_getPutToBreastEventName"

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
                // collisionPart.RightHand,
            ],
            timeline: [
                {
                    frameIndex: 25,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getPutToBreastEventName(),
                            eventData: {
                                usedGirl
                            }
                        }
                    }
                },

            ]
        },

    ]
}

export let getActionData = (): actionData<string> => {
    return [
        // {
        //     name: getForceAnimationName(),
        //     force: {
        //         [phase.Phase]: 5,
        //     }
        // },
    ]
}

export let getPhase = (): phaseData<string> => {
    return [
        // {
        //     name: getForceAnimationName(),
        //     value: [
        //         {
        //             frameIndexRange: [0, 50],
        //             phase: phase.Phase
        //         },
        //     ]
        // },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    let lowValue = skillStressingValue.Low

    return [
        {
            name: getForceAnimationName(),
            value: lowValue
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
            excitement: skillExcitement.High3
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
            _getVMDPath("put_to_breast")
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
    switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
        case getForceAnimationName():
            return true
        default:
            return false
    }
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    return api.buildRandomDirectionInXZ()
    // throw new Error("error")
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
    // throw new Error("error")
}