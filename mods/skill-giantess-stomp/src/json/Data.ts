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

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getStompSoundResourcePath = () => _getPath("stomp", "mp3")

export let getStompSoundResourceId = getStompSoundResourcePath

export let getLaughSoundResourcePath = () => _getPath("laugh", "mp3")

export let getLaughSoundResourceId = getLaughSoundResourcePath


export enum animationName {
    // Stomp = "Stomp",
    KeepStomp = "KeepStomp",
    StompBack = "StompBack",
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
export let getActionName = () => "Skill_Giantess_Stomp"

// export let getAnimationName = getActionName

// export let getForceAnimationName = () => getForceAnimationName()
export let getForceAnimationName = getActionName


export let getAllAnimationNames = () => [
    getForceAnimationName(),
    animationName.KeepStomp,
    animationName.StompBack,
]

export let isKeepPoseAnimation = () => true

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
                imageSrc: getImagePath("stomp"),
                key: "E",
                rowIndex: 1,
            },
        ]
    }
}

export let getAnimationBlendData = (
    api: api,
    [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]
): animationBlendData<animationNameType> => {
    // return [
    //     {
    //         condition: (state, usedGirl) => {
    //             return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state)) && !hasPickDataFunc(state, usedGirl)
    //         },
    //         currentAnimationNames: [getForceAnimationName()],
    //         nextAnimationName: animationNameType.Idle,
    //         noBlend: true
    //     },
    //     {
    //         condition: (state, usedGirl) => {
    //             return isTriggerActionFunc(state, usedGirl, getActionName())
    //         },
    //         currentAnimationNames: [animationNameType.Idle],
    //         weight: 0.5,
    //         nextAnimationName: getForceAnimationName()
    //     },
    //     {
    //         condition: (state, usedGirl) => {
    //             return isTriggerActionFunc(state, usedGirl, getActionName())
    //         },
    //         currentAnimationNames: [animationNameType.Walk],
    //         weight: 0.5,
    //         nextAnimationName: getForceAnimationName()
    //     },
    //     {
    //         condition: (state, usedGirl) => {
    //             return isTriggerActionFunc(state, usedGirl, getActionName())
    //         },
    //         currentAnimationNames: [animationNameType.Run],
    //         weight: 0.5,
    //         nextAnimationName: getForceAnimationName()
    //     },


    //     {
    //         condition: (state, usedGirl) => {
    //             return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state)) && hasPickDataFunc(state, usedGirl)
    //         },
    //         currentAnimationNames: [getActionName()],
    //         nextAnimationName: animationNameType.KeepPick,
    //         // noBlend: true
    //     },
    //     {
    //         condition: (state, usedGirl) => {
    //             return isTriggerActionFunc(state, usedGirl, getActionName())
    //         },
    //         currentAnimationNames: [animationNameType.KeepPick],
    //         weight: 0.5,
    //         nextAnimationName: getForceAnimationName()
    //     },
    // ]

    return [
        {
            condition: (state, usedGirl) => {
                // return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state)) && !hasPickDataFunc(state, usedGirl)
                return isEndFunc(state, usedGirl, getForceAnimationName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            // nextAnimationName: animationNameType.Idle,
            nextAnimationName: animationName.KeepStomp,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.Idle],
            weight: 0.5,
            nextAnimationName: getForceAnimationName()
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.Walk],
            weight: 0.5,
            nextAnimationName: getForceAnimationName()
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.Run],
            weight: 0.5,
            nextAnimationName: getForceAnimationName()
        },


        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl, animationName.KeepStomp, api.getIsDebug(state))
            },
            currentAnimationNames: [animationName.KeepStomp],
            nextAnimationName: animationName.StompBack,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl, animationName.StompBack, api.getIsDebug(state))
            },
            currentAnimationNames: [animationName.StompBack],
            nextAnimationName: animationNameType.Idle,
            noBlend: true
        },

        // {
        //     condition: (state, usedGirl) => {
        //         return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state)) && hasPickDataFunc(state, usedGirl)
        //     },
        //     currentAnimationNames: [getActionName()],
        //     nextAnimationName: animationNameType.KeepPick,
        //     // noBlend: true
        // },
        // {
        //     condition: (state, usedGirl) => {
        //         return isTriggerActionFunc(state, usedGirl, getActionName())
        //     },
        //     currentAnimationNames: [animationNameType.KeepPick],
        //     weight: 0.5,
        //     nextAnimationName: getForceAnimationName()
        // },
    ]
}

let _getStompRangeBox = (api: api, state, [getHeightFunc, getShapeFunc], usedGirl) => {
    let height = getHeightFunc(state, usedGirl)

    let shape = getShapeFunc(state, usedGirl, collisionPart.RightFoot)

    let box = api.obb.toBox3(shape)

    // return box.expandByScalar(box.getSize(_v1).length() * Math.sqrt(height) * 0.6)
    // return box.expandByScalar(box.getSize(_v1).length() * Math.sqrt(height) * 0.1)
    // return box.expandByScalar(box.getSize(_v1).length() * Math.sqrt(height) * 0.001)
    // return box.expandByScalar(Math.sqrt(height))
    return api.box3.setBoxHeight(api.box3.expandByScalar(box, height * 0.2), api.getGroundY() * 2, api.getGroundY())
}

let _getStompPoint = (api: api, state, getShapeFunc, usedGirl) => {
    return api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart.RightFoot))
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

            shapeDamage: [collisionPart.RightFoot],
            timeline: [
                {
                    // frameIndex: 30,
                    // frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),
                    frameIndex: api.getLastFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Particle,
                    value: (state, usedGirl, _): any => {
                        let point = _getStompPoint(api, state, getShapeFunc, usedGirl)


                        if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.return_([[
                                particle.StompDust,
                                {
                                    // speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
                                    speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1) / 1.5,
                                    changeLife: 500,
                                    life: 3000,
                                    size: getScaleFunc(state, usedGirl),
                                    position: point.toArray()
                                    // position: getPositionParrelToObj(point, 3).toArray()
                                }
                            ]])
                        }

                        return api.NullableUtils.getEmpty()
                    }
                },
                {
                    // frameIndex: 30,
                    frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Effect,
                    value: (state, usedGirl, _): any => {
                        if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return effect.ScreenShake
                        }

                        // return null
                        // if (isLittleCharacterTypeFunc(state)) {
                        //     return effect.ScreenShake
                        // }

                        return null
                    }

                },
                {
                    // frameIndex: 30,
                    frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getStompSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false)
                        })
                    }

                },
                {
                    // frameIndex: 30,
                    frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),

                    track: track.RangeDamage,
                    value: (state, usedGirl, _) => {
                        return _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl)
                    }

                },
                {
                    // frameIndex: 30,
                    // frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),
                    frameIndex: api.getLastFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: api.event.getStompHitTerrainEventName(),
                            eventData: api.buildStompHitTerrainEventData(
                                _getStompPoint(api, state, getShapeFunc, usedGirl)
                                , force, _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl),
                                collisionPart.RightFoot,
                                api.getShoeType(state, usedGirl),
                                usedGirl
                            )
                        }
                    }

                },
                // {
                //     frameIndex: 35,

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
            ]
        },

        {
            name: animationName.KeepStomp,

            shapeDamage: [collisionPart.RightFoot],
            timeline: [
                {
                    frameIndex: api.getEarlyFrameIndex(),
                    frameRange: 5,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: api.event.getStartKeepStompEventName(),
                            eventData: {
                                usedGirl
                            }
                        }
                    }

                },
            ]
        },

        {
            name: animationName.StompBack,

            shapeDamage: [collisionPart.RightFoot],
            timeline: [
                {
                    frameIndex: api.getEarlyFrameIndex(),
                    frameRange: 5,

                    track: track.Audio,
                    value: (state, usedGirl, _) => {
                        if (api.NumberUtils.isRandomRate(0.7)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getLaughSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl)
                        })
                    }

                },
                {
                    frameIndex: api.getLateFrameIndex(_getStompBackAnimationFrameCount()),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: api.event.getEndStompBackEventName(),
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
                [stompPhase.Up]: giantessForceSize.Middle,
                [stompPhase.Down]: giantessForceSize.High2,
                [rangePhase.Range]: giantessForceSize.Low3,
            }
        },
        {
            name: animationName.KeepStomp,
            force: {
                [stompPhase.Keep]: giantessForceSize.High,
            }
        },
        {
            name: animationName.StompBack,
            force: {
                [stompPhase.Back]: giantessForceSize.Middle,
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
                    frameIndexRange: [0, 20],
                    phase: stompPhase.Up
                },
                {
                    // frameIndexRange: [21, 70],
                    frameIndexRange: [21, 30],
                    phase: stompPhase.Down
                },
            ]
        },
        {
            name: animationName.KeepStomp,
            value: [
                {
                    frameIndexRange: [0, 20],
                    phase: stompPhase.Keep
                },
            ]
        },
        {
            name: animationName.StompBack,
            value: [
                {
                    frameIndexRange: [0, 20],
                    phase: stompPhase.Back
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    let lowValue = skillStressingValue.Low
    // let middleValue = skillStressingValue.Middle
    // let highValue = skillStressingValue.High

    return [
        {
            name: getForceAnimationName(),
            value: lowValue
        },
        {
            name: animationName.KeepStomp,
            value: lowValue
        },
        {
            name: animationName.StompBack,
            value: lowValue
        },
    ]
}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
        [getForceAnimationName()]: {
            experienceFactor: experienceFactor.Low
        },
        [animationName.KeepStomp]: {
            experienceFactor: experienceFactor.Low
        },
        [animationName.StompBack]: {
            experienceFactor: experienceFactor.Low
        },
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.Low
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
            _getVMDPath("stomp")
        ],
        [
            animationName.KeepStomp,
            _getVMDPath("keep_stomp")
        ],
        [
            animationName.StompBack,
            _getVMDPath("stomp_back")
        ],
    ]
}

let _getForceAnimationFrameCount = () => 30

let _getStompBackAnimationFrameCount = () => 20

export let getAnimationFrameCount = () => {
    return {
        // [getForceAnimationName()]: 70,
        [getForceAnimationName()]: _getForceAnimationFrameCount(),
        [animationName.KeepStomp]: 20,
        [animationName.StompBack]: _getStompBackAnimationFrameCount(),
    }
}

export let isSkillState = (api: api, state: state, usedGirl) => {
    switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
        case getForceAnimationName():
        case animationName.KeepStomp:
        case animationName.StompBack:
            return true
        default:
            return false
    }
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    let direction
    switch (phase) {
        case stompPhase.Up:
        case stompPhase.Back:
            direction = api.buildUpDirection()
            break
        case stompPhase.Down:
        case stompPhase.Keep:
            direction = api.buildDownDirection()
            break
        case rangePhase.Range:
            direction = api.buildRandomDirectionInXZ()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    return phase == rangePhase.Range ? damageType.Normal : damageType.Direct
}