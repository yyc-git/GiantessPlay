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

export enum phase {
    Spray,
    AfterSpray,
}

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getShoutSoundResourcePath = () => _getPath("shout", "mp3")

export let getShoutSoundResourceId = getShoutSoundResourcePath



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
export let getActionName = () => "Skill_Giantess_SprayMilk"

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
                pose: pose.Stand,
                names: [
                    getActionName()
                ],
            },
            // {
            //     pose: pose.Pick,
            //     names: [
            //         getActionName()
            //     ]
            // },
        ],
        operateData: [
            {
                name: getActionName(),
                imageSrc: getImagePath("skill"),
                key: "H",
                rowIndex: 1,
            },
        ]
    }
}

export let getSprayMilkEventName = () => "getSprayMilkEventName"

export let getAnimationBlendData = (
    api: api,
    [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]
): animationBlendData<animationNameType> => {
    return [
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl, getForceAnimationName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: animationNameType.Idle,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.Idle, animationNameType.Walk],
            weight: 0.5,
            nextAnimationName: getForceAnimationName()
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
                collisionPart.LeftBreast,
                collisionPart.RightBreast
            ],
            timeline: [
                {
                    frameIndex: 20,

                    track: track.Particle,
                    value: (state, usedGirl, _): any => {
                        let factor = api.getBreastVolumnFactor(state, usedGirl, 0.5, 4)

                        return api.NullableUtils.return_([
                            [
                                particle.Milk,
                                {
                                    speed: 1,
                                    life: 2000,
                                    size: api.box3.getBoxMaxSize(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.RightBreast))) * 3 * factor,
                                    position: api.vector3.clone(api.getCollisionPartCenter(state, usedGirl, collisionPart.RightBreast))
                                        .toArray()

                                }
                            ],
                            [
                                particle.Milk,
                                {
                                    speed: 1,
                                    life: 2000,
                                    size: api.box3.getBoxMaxSize(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.LeftBreast))) * 3 * factor,
                                    position: api.vector3.clone(api.getCollisionPartCenter(state, usedGirl, collisionPart.LeftBreast))
                                        .toArray()

                                }
                            ],
                        ])
                    }
                },
                {
                    frameIndex: 28,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getSprayMilkEventName(),
                            eventData: {
                                usedGirl
                            }
                        }
                    }
                },

                {
                    frameIndex: 20,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getShoutSoundResourcePath(),
                            volume: api.getGiantessVolume(state, usedGirl, true)
                        })
                    }
                },

                {
                    frameIndex: 25,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: api.getMilkSplashSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false)
                        })
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
                [phase.Spray]: giantessForceSize.Middle,
                [phase.AfterSpray]: giantessForceSize.Negative,
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
                    frameIndexRange: [20, 25],
                    phase: phase.Spray
                },
                {
                    frameIndexRange: [26, _getForceAnimationFrameCount()],
                    phase: phase.AfterSpray
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    // let lowValue = skillStressingValue.Low
    // let middleValue = skillStressingValue.Middle
    // let highValue = skillStressingValue.High

    return [
        {
            name: getForceAnimationName(),
            // value: highValue
            value: skillStressingValue.Zero
        },
    ]
}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
        [getForceAnimationName()]: {
            experienceFactor: experienceFactor.VeryHigh
        },
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.VeryHigh2
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
            _getVMDPath("spray_milk")
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
    switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
        case getForceAnimationName():
            return true
        default:
            return false
    }
}

export let computeForceDirectionDefault = (api: api, velocity, phase_) => {
    let direction
    switch (phase_) {
        case phase.Spray:
        case phase.AfterSpray:
            direction = api.buildRandomDirectionInXZ()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}