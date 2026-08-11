import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { animationName } from "skill-giantess-breast-press/src/json/Data"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum rubPhase {
    Left,
    Right,
    Front,
    Back,
    Center,
}

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getBreastPressRubSoundResourcePath = () => _getPath("rub", "mp3")

export let getLaughSoundResourcePath = () => _getPath("laugh", "mp3")

export let getBreastPressRubSoundResourceId = getBreastPressRubSoundResourcePath

export let getLaughSoundResourceId = getLaughSoundResourcePath

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
export let getActionName = () => "Skill_Giantess_BreastPressRub"

export let getForceAnimationName = getActionName

export let getAllAnimationNames = () => [
    getForceAnimationName(),
]

export let isKeepPoseAnimation = () => false

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
                key: "R",
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
                return isEndFunc(state, usedGirl, getActionName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: animationName.KeepBreastPress,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationName.KeepBreastPress],
            nextAnimationName: getForceAnimationName(),
            noBlend: true
        },

    ]
}

export let getBreastPressRubEventName = () => "getBreastPressRubEventName"

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
                    frameIndex: 10,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getBreastPressRubSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false)
                        })
                    }

                },
                {
                    frameIndex: 20,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getBreastPressRubSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false)
                        })
                    }

                },
                {
                    frameIndex: 30,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getBreastPressRubSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false)
                        })
                    }

                },
                {
                    frameIndex: 40,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getBreastPressRubSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false)
                        })
                    }

                },
                {
                    frameIndex: api.getLastFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getBreastPressRubEventName(),
                            eventData: api.NullableUtils.return_({
                                usedGirl
                            })
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
                [rubPhase.Left]: giantessForceSize.Low,
                [rubPhase.Right]: giantessForceSize.Low,
                [rubPhase.Front]: giantessForceSize.Low,
                [rubPhase.Back]: giantessForceSize.Low,
                [rubPhase.Center]: giantessForceSize.Low,
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
                    frameIndexRange: [0, 10],
                    phase: rubPhase.Left
                },
                {
                    frameIndexRange: [11, 20],
                    phase: rubPhase.Front
                },
                {
                    frameIndexRange: [21, 30],
                    phase: rubPhase.Right
                },
                {
                    frameIndexRange: [31, 40],
                    phase: rubPhase.Back
                },
                {
                    frameIndexRange: [41, 50],
                    phase: rubPhase.Center
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    // let lowValue = skillStressingValue.Low
    // let middleValue = skillStressingValue.Middle
    let highValue = skillStressingValue.High

    return [
        {
            name: getForceAnimationName(),
            value: highValue
        },
    ]

}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
        [getForceAnimationName()]: {
            experienceFactor: experienceFactor.High1
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
            _getVMDPath("breast_press_rub")
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
    let direction
    switch (phase) {
        case rubPhase.Right:
        case rubPhase.Back:
        case rubPhase.Front:
        case rubPhase.Left:
        case rubPhase.Center:
            direction = api.buildDownDirection()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}