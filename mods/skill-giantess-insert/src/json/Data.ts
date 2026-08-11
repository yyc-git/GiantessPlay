import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getProtocolName, getKeepUBBlockName, getBuffProtocolName, getBuffGirlExcitementBlockName, getBuffLevelGiantessExcitementBlockName } from "../script/Utils"
import { actionData, actionName, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { service as buffService } from "buff-protocol/src/service/ServiceType"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum phase {
    BigInsert,
    SmallInsert1,
    SmallInsert2,
    SmallInsert3,
    SmallInsert4,
    // Keep,
}


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")

export let getBigInsertSound1ResourcePath = () => _getPath("insert_1", "mp3")

export let getBigInsertSound1ResourceId = getBigInsertSound1ResourcePath

export let getBigInsertSound2ResourcePath = () => _getPath("insert_2", "mp3")

export let getBigInsertSound2ResourceId = getBigInsertSound2ResourcePath

export let getBigInsertSound3ResourcePath = () => _getPath("insert_3", "mp3")

export let getBigInsertSound3ResourceId = getBigInsertSound3ResourcePath

export let getBigInsertSound4ResourcePath = () => _getPath("insert_4", "mp3")

export let getBigInsertSound4ResourceId = getBigInsertSound4ResourcePath

export let getSmallInsertSound1ResourcePath = () => _getPath("insert_0_0", "mp3")

export let getSmallInsertSound1ResourceId = getSmallInsertSound1ResourcePath

export let getSmallInsertSound2ResourcePath = () => _getPath("insert_0_1", "mp3")

export let getSmallInsertSound2ResourceId = getSmallInsertSound2ResourcePath

export let getSmallInsertSound3ResourcePath = () => _getPath("insert_0_2", "mp3")

export let getSmallInsertSound3ResourceId = getSmallInsertSound3ResourcePath

export let getSmallInsertSound4ResourcePath = () => _getPath("insert_0_3", "mp3")

export let getSmallInsertSound4ResourceId = getSmallInsertSound4ResourcePath

export let getKeepSoundResourcePath = () => _getPath("insert_l", "mp3")

export let getKeepSoundResourceId = getKeepSoundResourcePath

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
export let getActionName = () => "Skill_Giantess_Insert"

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
                key: "R",
                rowIndex: 1,

                conditionFunc: (api, state, usedGirl) => {
                    return api.girl.getCurrentAnimationName(state, usedGirl) == api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepUBBlockName()).getForceAnimationName()
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
                return isEndFunc(state, usedGirl, getActionName(), api.getIsDebug(state)) && api.hasPickData(state, usedGirl)
                // return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            // nextAnimationName: api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepUBBlockName()).getForceAnimationName(),
            nextAnimationName: animationNameType.KeepPick,
            weight: 0.5
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl, getActionName(), api.getIsDebug(state)) && !api.hasPickData(state, usedGirl)
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: animationNameType.Idle,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepUBBlockName()).getForceAnimationName()],
            nextAnimationName: getForceAnimationName(),
            noBlend: true
        },

        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, actionName.Death)
            },
            currentAnimationNames: [getForceAnimationName()],
            weight: 0.0,
            isOnlyPlayOnce: true,
            nextAnimationName: animationNameType.Death
        },
    ]
}

let _getRandomBigInsertSoundResourceId = (api: api, state: state, usedGirl) => {
    let excitementBuffSuperPositionCount = api.getExcitementBuffSuperPositionCount(api, state, usedGirl)

    let soundData = [
        getBigInsertSound1ResourceId(),
        getBigInsertSound2ResourceId(),
        getBigInsertSound3ResourceId(),
        getBigInsertSound4ResourceId(),
    ]

    return soundData[excitementBuffSuperPositionCount]
}

export let getBigInsertEventName = () => "getBigInsertEventName"

export let getSmallInsert1EventName = () => "getSmallInsert1EventName"

export let getSmallInsert2EventName = () => "getSmallInsert2EventName"

export let getSmallInsert3EventName = () => "getSmallInsert3EventName"

export let getSmallInsert4EventName = () => "getSmallInsert4EventName"

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
                collisionPart.RightHand,
                collisionPart.TrigoneAndButt,
            ],
            timeline: [
                {
                    frameIndex: api.getEarlyFrameIndex(),

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: _getRandomBigInsertSoundResourceId(api, state, usedGirl),
                            volume: api.getGiantessVolume(state, usedGirl, true),
                        })
                    }
                },
                {
                    frameIndex: api.getEarlyFrameIndex(),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getBigInsertEventName(),
                            eventData: { usedGirl }
                        }
                    }
                },

                {
                    frameIndex: 20,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getSmallInsertSound1ResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, true),
                        })
                    }
                },
                {
                    frameIndex: 20,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getSmallInsert1EventName(),
                            eventData: { usedGirl }
                        }
                    }
                },

                {
                    frameIndex: 35,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getSmallInsertSound2ResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, true),
                        })
                    }
                },
                {
                    frameIndex: 35,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getSmallInsert2EventName(),
                            eventData: { usedGirl }
                        }
                    }
                },

                {
                    frameIndex: 50,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getSmallInsertSound3ResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, true),
                        })
                    }
                },
                {
                    frameIndex: 50,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getSmallInsert3EventName(),
                            eventData: { usedGirl }
                        }
                    }
                },

                {
                    frameIndex: 65,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getSmallInsertSound4ResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, true),
                        })
                    }
                },
                {
                    frameIndex: 65,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getSmallInsert4EventName(),
                            eventData: { usedGirl }
                        }
                    }
                },


                {
                    frameIndex: 70,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getKeepSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, true),
                        })
                    }
                },
                {
                    frameIndex: 100,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: getKeepSoundResourceId(),
                            isStop: true,
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
                // [phase.BigInsert]: giantessForceSize.Low1,
                // [phase.SmallInsert1]: giantessForceSize.VeryLow,
                // [phase.SmallInsert2]: giantessForceSize.VeryLow,
                // [phase.SmallInsert3]: giantessForceSize.VeryLow1,
                // [phase.SmallInsert4]: giantessForceSize.VeryLow2,

                [phase.BigInsert]: giantessForceSize.VeryLow1,
                [phase.SmallInsert1]: giantessForceSize.VeryLow,
                [phase.SmallInsert2]: giantessForceSize.VeryLow,
                [phase.SmallInsert3]: giantessForceSize.VeryLow,
                [phase.SmallInsert4]: giantessForceSize.VeryLow,
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
                    phase: phase.BigInsert
                },
                {
                    frameIndexRange: [21, 35],
                    phase: phase.SmallInsert1
                },
                {
                    frameIndexRange: [36, 50],
                    phase: phase.SmallInsert2
                },
                {
                    frameIndexRange: [51, 65],
                    phase: phase.SmallInsert3
                },
                {
                    frameIndexRange: [66, 100],
                    phase: phase.SmallInsert4
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    let veryHighValue = skillStressingValue.VeryHigh1

    return [
        {
            name: getForceAnimationName(),
            value: veryHighValue
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
            excitement: skillExcitement.MostHigh
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
            _getVMDPath("insert")
        ],
    ]
}

let _getForceAnimationFrameCount = () => 120

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
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}