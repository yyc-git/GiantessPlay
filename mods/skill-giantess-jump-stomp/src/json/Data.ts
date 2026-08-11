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
export let getActionName = () => "Skill_Giantess_JumpStomp"

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
                key: "J",
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
            nextAnimationName: animationNameType.Idle,
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

    ]
}

let _getStompRangeBox = (api: api, state, [getHeightFunc, getShapeFunc], usedGirl) => {
    let height = getHeightFunc(state, usedGirl)

    let shape1 = getShapeFunc(state, usedGirl, collisionPart.RightFoot)
    let shape2 = getShapeFunc(state, usedGirl, collisionPart.LeftFoot)

    let box1 = api.obb.toBox3(shape1)
    let box2 = api.obb.toBox3(shape2)

    let box = api.box3.union(box1, box2)

    return api.box3.setBoxHeight(api.box3.expandByScalar(box, height * 0.3), api.getGroundY() * 2, api.getGroundY())
}


let _getStompPoint = (api: api, state, getShapeFunc, usedGirl) => {
    return [
        api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart.RightFoot)),
        api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart.LeftFoot)),
    ]
}

let _getDownToGroundFrameIndex = () => 45

export let getJumpStompHitTerrainEventName = () => "getJumpStompHitTerrainEventName"


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
                collisionPart.LeftFoot, collisionPart.RightFoot,
                collisionPart.TrigoneAndButt,
                collisionPart.LeftBreast,
                collisionPart.RightBreast,
            ],
            timeline: [
                {
                    frameIndex: _getDownToGroundFrameIndex(),
                    // frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Particle,
                    value: (state, usedGirl, _): any => {
                        let [point1, point2] = _getStompPoint(api, state, getShapeFunc, usedGirl)


                        if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.return_([
                                [
                                    particle.StompDust,
                                    {
                                        // speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
                                        speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1) / 1.5,
                                        changeLife: 500,
                                        life: 3000,
                                        size: getScaleFunc(state, usedGirl),
                                        position: point1.toArray()
                                        // position: getPositionParrelToObj(point, 3).toArray()
                                    }
                                ],
                                [
                                    particle.StompDust,
                                    {
                                        // speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
                                        speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1) / 1.5,
                                        changeLife: 500,
                                        life: 3000,
                                        size: getScaleFunc(state, usedGirl),
                                        position: point2.toArray()
                                        // position: getPositionParrelToObj(point, 3).toArray()
                                    }
                                ]
                            ])
                        }

                        return api.NullableUtils.getEmpty()
                    }
                },
                {
                    // frameIndex: 30,
                    // frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),
                    frameIndex: _getDownToGroundFrameIndex(),

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
                    // frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),
                    frameIndex: _getDownToGroundFrameIndex(),

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
                    frameIndex: 25,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getShoutSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, true)
                        })
                    }
                },

                {
                    // frameIndex: 30,
                    // frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),
                    frameIndex: _getDownToGroundFrameIndex(),

                    track: track.RangeDamage,
                    value: (state, usedGirl, _) => {
                        return _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl)
                    }

                },

                {
                    frameIndex: _getDownToGroundFrameIndex(),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getJumpStompHitTerrainEventName(),
                            eventData: api.buildStompHitTerrainEventData(
                                api.TupleUtils.getTuple2First(_getStompPoint(api, state, getShapeFunc, usedGirl)),
                                force,
                                _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl),
                                collisionPart.RightFoot,
                                api.getShoeType(state, usedGirl),
                                usedGirl
                            )
                        }
                    }
                },
                {
                    frameIndex: _getDownToGroundFrameIndex(),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: api.event.getStompHitTerrainEventName(),
                            eventData: api.buildStompHitTerrainEventData(
                                api.TupleUtils.getTuple2Last(_getStompPoint(api, state, getShapeFunc, usedGirl)),
                                force,
                                _getStompRangeBox(api, state, [getHeightFunc, getShapeFunc], usedGirl),
                                collisionPart.LeftFoot,
                                api.getShoeType(state, usedGirl),
                                usedGirl
                            )
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
                [stompPhase.Up]: giantessForceSize.High,
                [stompPhase.Down]: giantessForceSize.VeryHigh3,
                [rangePhase.Range]: giantessForceSize.High,
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
                    frameIndexRange: [0, 35],
                    phase: stompPhase.Up
                },
                {
                    frameIndexRange: [36, 45],
                    phase: stompPhase.Down
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
            value: skillStressingValue.Zero
        },
    ]
}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
        [getForceAnimationName()]: {
            // experienceFactor: experienceFactor.Middle3
            experienceFactor: experienceFactor.Low
        },
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.VeryHigh
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
            _getVMDPath("jump_stomp")
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

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    let direction
    switch (phase) {
        case stompPhase.Up:
            direction = api.buildUpDirection()
            break
        case stompPhase.Down:
            direction = api.buildDownDirection()
            break
        case rangePhase.Range:
            direction = api.buildDownDirection()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    // return phase == stompPhase.Down ? damageType.Direct : damageType.Normal
    return phase == rangePhase.Range ? damageType.Normal : damageType.Direct
}