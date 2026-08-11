import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getProtocolName, getKeepSitBlockName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum tightenPhase {
    Tighten,
    Spread,
}


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getSoundResourcePath = () => _getPath("sound", "mp3")

export let getSoundResourceId = getSoundResourcePath


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
export let getActionName = () => "Skill_Giantess_Sit_TightenLeg"

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
                pose: pose.Sit,
                names: [
                    getActionName()
                ],
            },
        ],
        operateData: [
            {
                name: getActionName(),
                imageSrc: getImagePath("skill"),
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
                return isEndFunc(state, usedGirl,getActionName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepSitBlockName()).getForceAnimationName(),
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepSitBlockName()).getForceAnimationName()],
            nextAnimationName: getForceAnimationName(),
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
                collisionPart.TrigoneAndButt,
                collisionPart.LeftFoot,
                collisionPart.RightFoot,
                collisionPart.LeftShank,
                collisionPart.RightShank,
                collisionPart.LeftThigh,
                collisionPart.RightThigh,
            ],
            timeline: [
                {
                    frameIndex: api.getFirstFrameIndex(),

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false),
                            isLoop: true,
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
                            id: getSoundResourceId(),
                            isStop: true,
                        })
                    }
                },
                {
                    frameIndex: 45,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false),
                            isLoop: true,
                        })
                    }
                },
                {
                    frameIndex: api.getLastFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getSoundResourceId(),
                            isStop: true,
                        })
                    }
                },
                // {
                //     frameIndex: 30,

                //     track: track.Particle,
                //     value: (state, usedGirl, _): any => {
                //         let point1 = api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart.RightShank))
                //         let point2 = api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart.LeftShank))

                //         let point = api.vector3.add(
                //             point1,
                //             api.vector3.multiplyScalar(
                //                 api.vector3.sub(
                //                     point2, point1
                //                 ),
                //                 0.5
                //             )
                //         )

                //         if (isSmallGiantessOrBiggerFunc(state)) {
                //             return api.NullableUtils.return_([[
                //                 particle.StompDust,
                //                 {
                //                     // speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1),
                //                     speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1) / 1.5,
                //                     changeLife: 500,
                //                     life: 3000,
                //                     size: getScaleFunc(state, usedGirl),
                //                     position: point.toArray()
                //                     // position: getPositionParrelToObj(point, 3).toArray()
                //                 }
                //             ]])
                //         }

                //         return api.NullableUtils.getEmpty()
                //     }
                // },
            ]
        },

    ]
}

export let getActionData = (): actionData<string> => {
    return [
        {
            name: getForceAnimationName(),
            force: {
                [tightenPhase.Tighten]: giantessForceSize.High2,
                [tightenPhase.Spread]: giantessForceSize.Middle2,
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
                    frameIndexRange: [0, 30],
                    phase: tightenPhase.Tighten
                },
                {
                    frameIndexRange: [45, 75],
                    phase: tightenPhase.Spread
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    // let zeroValue = 0
    let lowValue = skillStressingValue.Low
    // let middleValue = skillStressingValue.Middle
    // let highValue = skillStressingValue.High

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
            experienceFactor: experienceFactor.Middle3
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
            _getVMDPath("tighten_leg")
        ],
    ]
}

let _getForceAnimationFrameCount = () => 75

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
        case tightenPhase.Tighten:
        case tightenPhase.Spread:
            direction = api.buildDownDirection()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}

export let handleChangeAnimationName = (api: api, state: state, usedGirl, nextBlendingAnimationName: animationNameType, currentAnimationName: animationNameType) => {
    switch (currentAnimationName) {
        case getForceAnimationName():
            state = api.setAbstractState(state, api.SoundManager.stop(api.getAbstractState(state), getSoundResourceId()))
            break
    }

    return state
}