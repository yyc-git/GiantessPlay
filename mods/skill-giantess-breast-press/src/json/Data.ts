import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum breastPressPhase {
    Down,
    Up,
}


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getLaughSoundResourcePath = () => _getPath("laugh", "mp3")

export let getLaughSoundResourceId = getLaughSoundResourcePath


export enum animationName {
    // BreastPress = "BreastPress",
    KeepBreastPress = "KeepBreastPress",
    BreastPressBack = "BreastPressBack",
}


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
export let getActionName = () => "Skill_Giantess_BreastPress"

// export let getAnimationName = getActionName

// export let getForceAnimationName = () => getForceAnimationName()
export let getForceAnimationName = getActionName


export let getAllAnimationNames = () => [
    getForceAnimationName(),
    animationName.KeepBreastPress,
    animationName.BreastPressBack,
]

export let isKeepPoseAnimation = () => true

export let getOperateRenderData = (): operateRenderData => {
    return {
        poseData: [
            {
                pose: pose.Crawl,
                names: [
                    getActionName()
                ],
            },
        ],
        operateData: [
            {
                name: getActionName(),
                imageSrc: getImagePath("skill"),
                key: "M",
                rowIndex: 1,
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
                // return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state)) && !hasPickDataFunc(state, usedGirl)
                return isEndFunc(state, usedGirl, getForceAnimationName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            // nextAnimationName: animationNameType.Idle,
            nextAnimationName: animationName.KeepBreastPress,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.KeepCrawl],
            weight: 0.5,
            nextAnimationName: getForceAnimationName()
        },


        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl, animationName.KeepBreastPress, api.getIsDebug(state))
            },
            currentAnimationNames: [animationName.KeepBreastPress],
            nextAnimationName: animationName.BreastPressBack,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl, animationName.BreastPressBack, api.getIsDebug(state))
            },
            currentAnimationNames: [animationName.BreastPressBack],
            nextAnimationName: animationNameType.KeepCrawl,
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
        {
            name: getForceAnimationName(),

            shapeDamage: [
                collisionPart.Head,
                collisionPart.LeftBreast, collisionPart.RightBreast,
                collisionPart.LeftThigh, collisionPart.RightThigh,
                collisionPart.LeftShank, collisionPart.RightShank,
                collisionPart.LeftFoot, collisionPart.RightFoot,
                collisionPart.Torso,
                // collisionPart.TrigoneAndButt,
            ],
            timeline: [
                {
                    frameIndex: 30,

                    track: track.Audio,
                    value: (state, usedGirl, { animationName, phase }): any => {
                        return api.NullableUtils.return_({
                            id: getLaughSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl)
                        })
                    },
                },
            ]
        },

        {
            name: animationName.KeepBreastPress,

            shapeDamage: [],
            timeline: [
                {
                    frameIndex: api.getEarlyFrameIndex(),
                    frameRange: 5,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: api.event.getStartKeepBreastPressEventName(),
                            eventData: { usedGirl }
                        }
                    }

                },
            ]
        },

        {
            name: animationName.BreastPressBack,

            shapeDamage: [],
            timeline: [
                // {
                //     frameIndex: api.getEarlyFrameIndex(),
                //     frameRange: 5,

                //     track: track.Audio,
                //     value: (state, usedGirl, _) => {
                //         if (api.NumberUtils.isRandomRate(0.7)) {
                //             return api.NullableUtils.getEmpty()
                //         }

                //         return api.NullableUtils.return_({
                //             id: getLaughSoundResourceId(),
                //             volume: api.getGiantessVolume(state, usedGirl)
                //         })
                //     }

                // },
                {
                    frameIndex: api.getLateFrameIndex(_getBreastPressBackAnimationFrameCount()),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: api.event.getEndBreastPressBackEventName(),
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
        {
            name: getForceAnimationName(),
            force: {
                [breastPressPhase.Down]: giantessForceSize.Middle,
            }
        },
        {
            name: animationName.BreastPressBack,
            force: {
                [breastPressPhase.Up]: giantessForceSize.Low,
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
                    frameIndexRange: [0, _getForceAnimationFrameCount()],
                    phase: breastPressPhase.Down
                },
            ]
        },
        {
            name: animationName.BreastPressBack,
            value: [
                {
                    frameIndexRange: [0, _getBreastPressBackAnimationFrameCount()],
                    phase: breastPressPhase.Up
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    let lowValue = skillStressingValue.Low
    let highValue = skillStressingValue.High

    return [
        {
            name: getForceAnimationName(),
            value: highValue
        },
        {
            name: animationName.KeepBreastPress,
            value: skillStressingValue.Middle3
        },
        {
            name: animationName.BreastPressBack,
            value: lowValue
        },
    ]
}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
        [getForceAnimationName()]: {
            experienceFactor: experienceFactor.High
        },
        // [animationName.KeepBreastPress]: {
        //     experienceFactor: experienceFactor.Middle3
        // },
        [animationName.BreastPressBack]: {
            experienceFactor: experienceFactor.Low
        },
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.High
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
            _getVMDPath("breast_press")
        ],
        [
            animationName.KeepBreastPress,
            _getVMDPath("keep_breast_press")
        ],
        [
            animationName.BreastPressBack,
            _getVMDPath("breast_press_back")
        ],
    ]
}

let _getForceAnimationFrameCount = () => 40

let _getBreastPressBackAnimationFrameCount = () => 20

export let getAnimationFrameCount = () => {
    return {
        [getForceAnimationName()]: _getForceAnimationFrameCount(),
        [animationName.KeepBreastPress]: 20,
        [animationName.BreastPressBack]: _getBreastPressBackAnimationFrameCount(),
    }
}

export let isSkillState = (api: api, state: state, usedGirl) => {
    switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
        case getForceAnimationName():
        case animationName.KeepBreastPress:
        case animationName.BreastPressBack:
            return true
        default:
            return false
    }
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    let direction
    switch (phase) {
        case breastPressPhase.Up:
            direction = api.buildUpDirection()
            break
        case breastPressPhase.Down:
            direction = api.buildDownDirection()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}