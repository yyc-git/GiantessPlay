import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getKeepSitBlockName, getProtocolName } from "../script/Utils"
import { actionData, animationBlendData, effect, excitement, experienceFactor, giantessForceSize, particle, phaseData, skillExcitement, skillStressingFactor, skillStressingValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
// import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

export enum sitToStandPhase {
    Up,
    Stand,
    BentLeg,
}


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


// export let getSoundResourcePath = () => _getPath("sound", "mp3")

// export let getSoundResourceId = getSoundResourcePath



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
export let getActionName = () => "Skill_Giantess_Sit_To_Stand"

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
                key: "N",
                rowIndex: 2,
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
                return isEndFunc(state, usedGirl,getForceAnimationName(), api.getIsDebug(state))
            },
            currentAnimationNames: [getForceAnimationName()],
            nextAnimationName: animationNameType.Idle,
            noBlend: true
        },
        {
            condition: (state, usedGirl) => {
                return isTriggerActionFunc(state, usedGirl, getActionName())
            },
            currentAnimationNames: [api.blockAPI.getBlockService<service>(api.readState(), getProtocolName(), getKeepSitBlockName()).getForceAnimationName()],
            weight: 0.5,
            nextAnimationName: getForceAnimationName(),
        },

    ]
}

export let getSitToStandEventName = () => "getSitToStandEventName"

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
                collisionPart.LeftShank, collisionPart.RightShank,
                collisionPart.LeftThigh, collisionPart.RightThigh,
                collisionPart.LeftFoot, collisionPart.RightFoot,
                collisionPart.LeftHand, collisionPart.RightHand,
                collisionPart.LeftLowerArm, collisionPart.RightLowerArm,
                // collisionPart.Torso,
                collisionPart.TrigoneAndButt,
            ],
            timeline: [
                {
                    frameIndex: api.getLateFrameIndex(_getForceAnimationFrameCount()),

                    track: track.Event,
                    value: (state, usedGirl, {
                        force
                    }): any => {
                        return {
                            eventName: getSitToStandEventName(),
                            eventData: {usedGirl}
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
                [sitToStandPhase.Up]: giantessForceSize.Middle,
                [sitToStandPhase.Stand]: giantessForceSize.Middle,
                [sitToStandPhase.BentLeg]: giantessForceSize.Low3,
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
                    phase: sitToStandPhase.BentLeg
                },
                {
                    frameIndexRange: [21, 40],
                    phase: sitToStandPhase.Stand
                },
                {
                    frameIndexRange: [41, 60],
                    phase: sitToStandPhase.Up
                },
            ]
        },
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
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
            experienceFactor: experienceFactor.Middle
        },
    }
}

export let getAllSkillDataForPlayer = () => {
    return [
        {
            name: getActionName(),
            excitement: skillExcitement.Zero
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
            _getVMDPath("sit_to_stand")
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
    return true
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    let direction
    switch (phase) {
        case sitToStandPhase.Up:
            direction = api.buildUpDirection()
            break
        case sitToStandPhase.Stand:
            direction = api.buildRandomDirectionInXZ()
            break
        case sitToStandPhase.BentLeg:
            direction = api.buildDownDirection()
            break
    }

    return direction
}

export let computeDamageTypeDefault = (phase) => {
    return damageType.Direct
}

// export let createFSMStateByChangeAnimationName = (api: api, state: state, nextBlendingAnimationName: animationNameType) => {
//     let fsmState = null
//     switch (nextBlendingAnimationName) {
//         case getForceAnimationName():
//             state = api.changePose_(state,usedGIrl, pose.Stand)
//             break
//     }

//     return [state, fsmState]
// }