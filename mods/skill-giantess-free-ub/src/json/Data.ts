import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { state as blockState } from "skill-giantess-protocol/src/state/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { actionData, actionName, animationBlendData, effect, excitement, experienceFactor, particle, phaseData, skillExcitement, skillStressingFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName as animationNameType, track } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { operateRenderData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/PoseData"
import { collisionPart, damageType, pose, rangePhase, stompPhase } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { animationData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { service as buffService } from "buff-protocol/src/service/ServiceType"

// export enum phase {
//     Thrust
// }


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// let _getVMDPath = (name) => `./${getBlockName()}/src/asset/vmd/${name}.vmd`

export let getImagePath = (name) => _getPath(name, "png")


export let getSound1ResourcePath = () => _getPath("free_1", "mp3")

export let getSound1ResourceId = getSound1ResourcePath

export let getSound2ResourcePath = () => _getPath("free_2", "mp3")

export let getSound2ResourceId = getSound2ResourcePath


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
export let getActionName = () => "Skill_Giantess_FreeUB"

// export let getAnimationName = getActionName

export let getForceAnimationName = () => null
// export let getForceAnimationName = getActionName


export let getAllAnimationNames = () => [
    // getForceAnimationName(),
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
        ],
        operateData: [
            {
                name: getActionName(),
                imageSrc: getImagePath("skill"),
                key: "L",
                rowIndex: 3,
            },
        ]
    }
}

export let getAnimationBlendData = (
    api: api,
    [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, getFrameIndexFunc, isSpecificFrameIndexFunc, isEndFunc, isPreviousAnimationFunc, hasPickDataFunc]
): animationBlendData<animationNameType> => {
    return [
    ]
}

// export let getFreeEventName = () => "getFreeEventName"

export let getAnimationCollisionData = (api: api, [isCollisionWithRigidBodyFunc, isCollisionWithCharacterFunc, isSmallGiantessOrBiggerFunc, isMiddleGiantessOrBiggerFunc,
    getShapeFunc,
    getScaleFunc,
    getHeightFunc,
    isLittleCharacterTypeFunc
]): Array<animationCollisionData<string>> => {
    return [
    ]
}

export let getActionData = (): actionData<string> => {
    return [
    ]
}

export let getPhase = (): phaseData<string> => {
    return [
    ]
}

export let getSkillStressingFactor = (): skillStressingFactor => {
    return [
    ]

}

export let getAnimationData = (): Partial<Record<animationNameType, animationData>> => {
    return {
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
    ]
}

export let getAnimationFrameCount = () => {
    return {
    }
}

export let isSkillState = (api: api, state: state, usedGirl) => {
    // switch (api.girl.getCurrentAnimationName(state, usedGirl)) {
    //     case getForceAnimationName():
    //         return true
    //     default:
    //         return false
    // }
    return false
}

export let computeForceDirectionDefault = (api: api, velocity, phase) => {
    throw new Error("error")
}

export let computeDamageTypeDefault = (phase) => {
    throw new Error("error")
}