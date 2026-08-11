import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "skill-little-man-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"
import { littleManOperateData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/OperateData"
import { get } from "../asset/ImageBase64"
import { animationBlendData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { animationCollisionData, animationName, track } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/DataType"
import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getFBXPath = (name) => _getPath(name, "fbx")


// export let getImagePath = (name) => _getPath(name, "png")

// export let getName = () => "Skill_LittleMan_Swiping"

export enum languageKey {
    OperateFastRunKey,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.OperateFastRunKey]: "Shift",
        },
        [language.English]: {
            [languageKey.OperateFastRunKey]: "Shift",
        },
    }
}

// export let getActionName = () => "Skill_LittleMan_Action_Swiping"

// export let getAnimationName = () => "Skill_LittleMan_Animation_Swiping"
export let getActionName = () => "Skill_LittleMan_FastRun"

export let getAnimationName = getActionName

export let getAnimationFrameCountMap = () => {
    return {
        // [getAnimationName()]: 17,
        [getAnimationName()]: 22,
    }
}


export let getOperateData = (api: api, state: state): littleManOperateData => [
    {
        name: getActionName(),
        imageBase64: get(),
        key: api.getLanguageDataByData(state, getTextData(), languageKey.OperateFastRunKey),

        // textWidth: "4rem",
        textWidth: "2rem",
        rowIndex: 2,
    },
]

export let getAnimationBlendData = (
    api: api,
    [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, isEndFunc, isPreviousStateFunc]
): animationBlendData<animationName> => {
    return [
        {
            condition: (state, usedGirl) => {
                return isMoveFunc(state) && isActionStateFunc(state, littleManActionState.Run)
            },
            currentAnimationNames: [animationName.Idle],
            nextAnimationName: getAnimationName()
        },
        {
            condition: (state, usedGirl) => {
                return isMoveFunc(state) && isActionStateFunc(state, littleManActionState.Run)
            },
            currentAnimationNames: [animationName.Run],
            nextAnimationName: getAnimationName()
        },

        {
            condition: (state, usedGirl) => {
                return !isMoveFunc(state)
            },
            currentAnimationNames: [getAnimationName()],
            nextAnimationName: animationName.Idle
        },
        {
            condition: (state, usedGirl) => {
                return isMoveFunc(state) && isActionStateFunc(state, littleManActionState.Initial)
            },
            currentAnimationNames: [getAnimationName()],
            nextAnimationName: animationName.Run
        },
    ]
}

export let getAllAnimationNamesExceptDeathAnimations = () => {
    return [
        getAnimationName()
    ]
}

export let getAllAnimationNames = () => {
    return [
        getAnimationName()
    ]
}


export let getLittleManFastRunStartEventName = () => "getLittleManFastRunStartEventName"

// export let getLittleManSwipingEmitEventName = () => "getLittleManSwipingEmitEventName"

export let getAnimationCollisionData = (api: api): Array<animationCollisionData> => {
    return [
        {
            name: getAnimationName(),

            timeline: [
                {
                    frameIndex: api.getEarlyFrameIndex(),
                    frameRange: 5,

                    track: track.Event,
                    value: (state, {
                    }): any => {
                        return {
                            eventName: getLittleManFastRunStartEventName(),
                            eventData: {}
                        }
                    }

                },
            ]
        },
    ]
}

export let getSkillData = (): skillData => {
    return [
        {
            name: getActionName()
        },
    ]
}

export let getLoadData = () => [getAnimationName(), _getFBXPath("FastRun")]

