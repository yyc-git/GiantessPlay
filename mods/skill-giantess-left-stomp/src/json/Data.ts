import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { animationName as animationNameStomp } from "skill-giantess-stomp/src/json/Data"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum leftStompPhase {
    LeftUp,
    LeftDown,
    BackLeftUp,
    BackLeftDown,
    BackRightUp,
    BackRightDown,
}


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getStompSoundResourcePath = () => _getPath("stomp", "mp3")

export let getStompSoundResourceId = getStompSoundResourcePath


// export enum animationName {
//     KeepLeftStomp = "KeepLeftStomp",
//     LeftStompBack = "LeftStompBack",
// }


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
export let getActionName = () => "Skill_Giantess_LeftStomp"

// export let getAnimationName = getActionName

// export let getForceAnimationName = () => getForceAnimationName()
export let getForceAnimationName = getActionName


export let getAllAnimationNames = () => [
    getForceAnimationName(),
    // animationName.KeepLeftStomp,
    // animationName.LeftStompBack,
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
                imageSrc: getImagePath("stomp"),
                key: "F",
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
                return isEndFunc(state, usedGirl, getForceAnimationName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            // weight: 0.5,
            nextAnimationName: animationNameType.Idle,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameStomp.KeepStomp],
            nextAnimationName: getForceAnimationName(),
            noBlend: true
        },

    ]
}

let _getStompRangeBox = (api: api, state, [getHeightFunc, getShapeFunc], usedGirl, collisionPart_, factor) => {
    let height = getHeightFunc(state, usedGirl)

    let shape = getShapeFunc(state, usedGirl, collisionPart_)

    let box = api.obb.toBox3(shape)

    return api.box3.setBoxHeight(api.box3.expandByScalar(box, height * 0.2 * factor), api.getGroundY() * 2, api.getGroundY())
}

let _getStompPoint = (api: api, state, getShapeFunc, usedGirl, collisionPart_) => {
    return api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart_))
}


let _getLeftStompWorkFrameIndex = () => 30

let _getBackLeftStompWorkFrameIndex = () => 60

let _getBackRightStompWorkFrameIndex = () => 90

export let getLeftStompHitTerrainEventName = () => "getLeftStompHitTerrainEventName"

export let getAnimationCollisionData = (api: api, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
    getShapeFunc,
    getScaleFunc,
    getHeightFunc,
    isLittleCharacterTypeFunc
]): Array<animationCollisionData<string>> => {
    return [
        {
            name: getForceAnimationName(),

            shapeDamage: [collisionPart.LeftFoot, collisionPart.RightFoot],
            timeline: [
                {
                    frameIndices: [_getLeftStompWorkFrameIndex(), _getBackLeftStompWorkFrameIndex()],

                    track: track.Particle,
                    value: (state, usedGirl, _): any => {
                        let point = _getStompPoint(api, state, getShapeFunc, usedGirl, collisionPart.LeftFoot)


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
                    frameIndex: _getBackRightStompWorkFrameIndex(),

                    track: track.Particle,
                    value: (state, usedGirl, _): any => {
                        let point = _getStompPoint(api, state, getShapeFunc, usedGirl, collisionPart.RightFoot)


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
                    frameIndices: [_getLeftStompWorkFrameIndex(), _getBackLeftStompWorkFrameIndex(), _getBackRightStompWorkFrameIndex()],

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
                    frameIndices: [_getLeftStompWorkFrameIndex(), _getBackLeftStompWorkFrameIndex(), _getBackRightStompWorkFrameIndex()],

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
                    frameIndex: _getLeftStompWorkFrameIndex(),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getLeftStompHitTerrainEventName,
                            eventData: api.buildStompHitTerrainEventData(
                                _getStompPoint(api, state, getShapeFunc, usedGirl, collisionPart.LeftFoot)
                                , force, _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl, collisionPart.LeftFoot, 0.7),
                                collisionPart.LeftFoot,
                                api.getShoeType(state, usedGirl)
                            )
                        }
                    }
                },
                {
                    frameIndex: _getBackLeftStompWorkFrameIndex(),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getLeftStompHitTerrainEventName(),
                            eventData: api.buildStompHitTerrainEventData(
                                _getStompPoint(api, state, getShapeFunc, usedGirl, collisionPart.LeftFoot)
                                , force, _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl, collisionPart.LeftFoot, 0.4),
                                collisionPart.LeftFoot,
                                api.getShoeType(state, usedGirl)
                            )
                        }
                    }
                },
                {
                    frameIndex: _getBackRightStompWorkFrameIndex(),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getLeftStompHitTerrainEventName(),
                            eventData: api.buildStompHitTerrainEventData(
                                _getStompPoint(api, state, getShapeFunc, usedGirl, collisionPart.RightFoot)
                                , force, _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl, collisionPart.RightFoot, 0.7),
                                collisionPart.RightFoot,
                                api.getShoeType(state, usedGirl)
                            )
                        }
                    }
                },

                {
                    frameIndex: _getLeftStompWorkFrameIndex(),

                    track: track.RangeDamage,
                    value: (state, usedGirl, _) => {
                        return _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl, collisionPart.LeftFoot, 0.7)
                    }
                },
                {
                    frameIndex: _getBackLeftStompWorkFrameIndex(),

                    track: track.RangeDamage,
                    value: (state, usedGirl, _) => {
                        return _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl, collisionPart.LeftFoot, 0.4)
                    }
                },
                {
                    frameIndex: _getBackRightStompWorkFrameIndex(),
                    // frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),

                    track: track.RangeDamage,
                    value: (state, usedGirl, _) => {
                        return _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl, collisionPart.RightFoot, 0.7)
                    }
                },
                // {
                //     // frameIndex: 30,
                //     frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),

                //     track: track.Event,
                //     value: (state, usedGirl, {
                //         force
                //     }): any => {
                //         return {
                //             eventName: api.event.getStompHitTerrainEventName(),
                //             eventData: api.buildStompHitTerrainEventData(
                //                 _getStompPoint(api, state, getShapeFunc)
                //                 , force, _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc]),
                //                 api.getCollisionPartOBB(state, usedGirl,  collisionPart.LeftFoot),
                //                 api.getShoeType(state, usedGirl)
                //             )
                //         }
                //     }

                // },
            ]
        },

        // {
        //     name: animationName.KeepLeftStomp,

        //     shapeDamage: [],
        //     timeline: [
        //         {
        //             // frameIndex: api.getEarlyFrameIndex(),
        //             frameIndex: api.getFirstFrameIndex(),
        //             frameRange: 5,

        //             track: track.Event,
        //             value: (state, usedGirl, {
        //                 force
        //             }): any => {
        //                 return {
        //                     eventName: api.event.getFirstStartKeepLeftStompEventName(),
        //                     eventData: {usedGirl}
        //                 }
        //             }

        //         },
        //     ]
        // },

        // {
        //     name: animationName.LeftStompBack,

        //     shapeDamage: [],
        //     timeline: [
        //         // {
        //         //     frameIndex: api.getEarlyFrameIndex(),
        //         //     frameRange: 5,

        //         //     track: track.Audio,
        //         //     value: (state, usedGirl, _) => {
        //         //         if (api.NumberUtils.isRandomRate(0.7)) {
        //         //             return api.NullableUtils.getEmpty()
        //         //         }

        //         //         return api.NullableUtils.return_({
        //         //             id: getLaughSoundResourceId(),
        //         //             volume: api.getGiantessVolume(state, usedGirl)
        //         //         })
        //         //     }

        //         // },
        //         {
        //             frameIndex: api.getLateFrameIndex(_getStompBackAnimationFrameCount()),

        //             track: track.Event,
        //             value: (state, usedGirl, {
        //                 force
        //             }): any => {
        //                 return {
        //                     eventName: api.event.getEndLeftStompBackEventName(),
        //                     eventData: {usedGirl}
        //                 }
        //             }

        //         },
        //     ]
        // },
    ]
}

export let getActionData = (): actionData<string> => {
    return [
        {
            name: getForceAnimationName(),
            force: {
                [leftStompPhase.LeftUp]: giantessForceSize.Low2,
                [leftStompPhase.LeftDown]: giantessForceSize.Middle4,

                [leftStompPhase.BackLeftUp]: giantessForceSize.Low1,
                [leftStompPhase.BackLeftDown]: giantessForceSize.Middle2,

                [leftStompPhase.BackRightUp]: giantessForceSize.Low1,
                [leftStompPhase.BackRightDown]: giantessForceSize.Middle3,

                [rangePhase.Range]: giantessForceSize.Low1,
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
                    phase: leftStompPhase.LeftUp
                },
                {
                    frameIndexRange: [21, 30],
                    phase: leftStompPhase.LeftDown
                },
                {
                    frameIndexRange: [40, 50],
                    phase: leftStompPhase.BackLeftUp
                },
                {
                    frameIndexRange: [51, 60],
                    phase: leftStompPhase.BackLeftDown
                },
                {
                    frameIndexRange: [70, 80],
                    phase: leftStompPhase.BackRightUp
                },
                {
                    frameIndexRange: [81, 90],
                    phase: leftStompPhase.BackRightDown
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
            // value: lowValue
            value: skillStressingValue.Zero
        },
        // {
        //     name: animationName.KeepLeftStomp,
        //     value: 0
        // },
        // {
        //     name: animationName.LeftStompBack,
        //     value: 0
        // },
    ]
}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
        [getForceAnimationName()]: {
            experienceFactor: experienceFactor.Low
        },
        // [animationName.KeepLeftStomp]: {
        //     experienceFactor: experienceFactor.Middle3
        // },
        // [animationName.LeftStompBack]: {
        //     experienceFactor: experienceFactor.Middle3
        // },
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.High,
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
            _getVMDPath("left_stomp")
        ],
        // [
        //     animationName.KeepLeftStomp,
        //     _getVMDPath("keep_left_stomp")
        // ],
        // [
        //     animationName.LeftStompBack,
        //     _getVMDPath("left_stomp_back")
        // ],
    ]
}

let _getForceAnimationFrameCount = () => 100

// let _getStompBackAnimationFrameCount = () => 20

export let getAnimationFrameCount = () => {
    return {
        // [getForceAnimationName()]: 70,
        [getForceAnimationName()]: _getForceAnimationFrameCount(),
        // [animationName.KeepLeftStomp]: 20,
        // [animationName.LeftStompBack]: _getStompBackAnimationFrameCount(),
    }
}

export let isSkillState = (api: api, state: state, usedGirl) => {
    switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
        case getForceAnimationName():
            // case animationName.KeepLeftStomp:
            // case animationName.LeftStompBack:
            return true
        default:
            return false
    }
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    let direction
    switch (phase) {
        case leftStompPhase.LeftUp:
        case leftStompPhase.BackLeftUp:
        case leftStompPhase.BackRightUp:
            direction = api.buildUpDirection()
            break
        case leftStompPhase.LeftDown:
        case leftStompPhase.BackLeftDown:
        case leftStompPhase.BackRightDown:
            direction = api.buildDownDirection()
            break
        case rangePhase.Range:
            direction = api.buildRandomDirectionInXZ()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    switch (phase) {
        case leftStompPhase.LeftDown:
        case leftStompPhase.BackLeftDown:
        case leftStompPhase.BackRightDown:
            return damageType.Direct
        default:
            return damageType.Normal
    }
}