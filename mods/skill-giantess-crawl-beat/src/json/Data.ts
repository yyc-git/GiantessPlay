import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"

export enum phase {
    Up,
    Down,
    Back,
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
export let getActionName = () => "Skill_Giantess_Crawl_Beat"

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
                key: "B",
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
            nextAnimationName: animationNameType.KeepCrawl,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [animationNameType.KeepCrawl],
            nextAnimationName: getForceAnimationName(),
            noBlend: true
        },

    ]
}

// let _computeRepelDirection = (api: api, rangeBox) => (state: state, box) => {
//     return api.computeDirectionInXZ(
//         api.box3.getCenter(rangeBox, api.vector3.getTempVector1()),
//         api.box3.getCenter(box, api.vector3.getTempVector2()),
//     )
// }

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
                collisionPart.RightLowerArm,
                collisionPart.RightUpperArm,
            ],
            timeline: [
                {
                    frameIndex: 20,

                    track: track.Audio,
                    value: (state, usedGirl, _): any => {
                        if (!isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            return api.NullableUtils.getEmpty()
                        }

                        return api.NullableUtils.return_({
                            id: getSoundResourceId(),
                            volume: api.getGiantessVolume(state, usedGirl, false),
                        })
                    }
                },
                {
                    frameIndex: 20,

                    track: track.Particle,
                    value: (state, usedGirl, _): any => {
                        if (isMiddleGiantessOrBiggerFunc(state, usedGirl)) {
                            let point = api.obb.getCenter(getShapeFunc(state, usedGirl, collisionPart.RightHand))

                            return api.NullableUtils.return_([[
                                particle.StompDust,
                                {
                                    speed: 10 * Math.max(getScaleFunc(state, usedGirl) / 10, 1) / 1.5,
                                    changeLife: 500,
                                    life: 3000,
                                    size: getScaleFunc(state, usedGirl),
                                    position: point.toArray()
                                }
                            ]])
                        }

                        return api.NullableUtils.getEmpty()
                    }
                },
                {
                    frameIndex: 20,

                    track: track.RangeRepel,
                    value: (state, usedGirl, _) => {
                        let box = api.obb.toBox3(getShapeFunc(state, usedGirl, collisionPart.RightHand))
                        box = api.box3.expandByScalar(box, 2)

						return api.NullableUtils.return_([
							api.computeRepelDirection(api, box),
							box
						]) as any
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
                [phase.Up]: giantessForceSize.VeryLow,
                [phase.Down]: giantessForceSize.Middle2,
                [phase.Back]: giantessForceSize.Low,
                [rangePhase.Range]: giantessForceSize.VeryLow1,
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
                    phase: phase.Up
                },
                {
                    frameIndexRange: [11, 20],
                    phase: phase.Down
                },
                {
                    frameIndexRange: [30, 50],
                    phase: phase.Back
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
            _getVMDPath("crawl_beat")
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

export let computeForceDirectionDefault = (api: api, velocity, phase_) => {
    let direction
    switch (phase_) {
        case phase.Up:
            direction = api.buildUpDirection()
            break
        case phase.Down:
        case phase.Back:
            direction = api.buildDownDirection()
            break
        case rangePhase.Range:
            throw new Error("error")
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    return phase == rangePhase.Range ? damageType.Normal : damageType.Direct
}
