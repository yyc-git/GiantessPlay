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
    Thrust
}


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getSound11ResourcePath = () => _getPath("thrust_1_1", "mp3")

export let getSound11ResourceId = getSound11ResourcePath

export let getSound12ResourcePath = () => _getPath("thrust_1_2", "mp3")

export let getSound12ResourceId = getSound12ResourcePath

export let getSound21ResourcePath = () => _getPath("thrust_2_1", "mp3")

export let getSound21ResourceId = getSound21ResourcePath

export let getSound22ResourcePath = () => _getPath("thrust_2_2", "mp3")

export let getSound22ResourceId = getSound22ResourcePath

export let getSound31ResourcePath = () => _getPath("thrust_3_1", "mp3")

export let getSound31ResourceId = getSound31ResourcePath

export let getSound32ResourcePath = () => _getPath("thrust_3_2", "mp3")

export let getSound32ResourceId = getSound32ResourcePath

export let getSound41ResourcePath = () => _getPath("thrust_4_1", "mp3")

export let getSound41ResourceId = getSound41ResourcePath

export let getSound42ResourcePath = () => _getPath("thrust_4_2", "mp3")

export let getSound42ResourceId = getSound42ResourcePath

export let getSound43ResourcePath = () => _getPath("thrust_4_3", "mp3")

export let getSound43ResourceId = getSound43ResourcePath


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
export let getActionName = () => "Skill_Giantess_Thrust"

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
                key: "E",
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
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepUBBlockName()).getForceAnimationName(),
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isEndFunc(state, usedGirl, getActionName(), api.getIsDebug(state)) && !api.hasPickData(state, usedGirl)
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: animationNameType.Idle,
            weight: 0.5
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

let _getRandomSoundResourceId = (api: api, state: state, usedGirl) => {
    let excitementBuffSuperPositionCount = api.getExcitementBuffSuperPositionCount(api, state, usedGirl)

    let soundData = [
        [
            getSound11ResourceId(),
            getSound12ResourceId(),
        ],
        [
            getSound21ResourceId(),
            getSound22ResourceId(),
        ],
        [
            getSound31ResourceId(),
            getSound32ResourceId(),
        ],
        [
            getSound41ResourceId(),
            getSound42ResourceId(),
            getSound43ResourceId(),
        ],
    ]

    return api.NumberUtils.randomSelect(soundData[excitementBuffSuperPositionCount])
}

export let getThrustEventName = () => "getThrustEventName"

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
                    frameIndex: 10,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        return api.NullableUtils.return_({
                            id: _getRandomSoundResourceId(api, state, usedGirl),
                            volume: api.getGiantessVolume(state, usedGirl, true),
                        })
                    }
                },
                {
                    frameIndex: 10,

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getThrustEventName(),
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
                [phase.Thrust]: giantessForceSize.VeryLow,
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
                    frameIndexRange: [10, 15],
                    phase: phase.Thrust
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    // let highValue = skillStressingValue.High
    let veryHighValue = skillStressingValue.VeryHigh

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
            excitement: skillExcitement.High2
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
            _getVMDPath("thrust")
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