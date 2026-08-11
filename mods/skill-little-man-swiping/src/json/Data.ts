import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "skill-little-man-protocol/src/state/StateType"
import { getBlockName } from "../script/Utils"
import { littleManOperateData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/OperateData"
import { get } from "../asset/ImageBase64"
import { animationBlendData, animationCollisionData, animationName, track } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/DataType"
import { littleManActionState, objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { skillData } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/SkillData"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

let _getFBXPath = (name) => _getPath(name, "fbx")


// export let getImagePath = (name) => _getPath(name, "png")

// export let getName = () => "Skill_LittleMan_Swiping"

export enum languageKey {
    OperateSwipingKey,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.OperateSwipingKey]: "右键",
        },
        [language.English]: {
            [languageKey.OperateSwipingKey]: "RMB",
        },
    }
}

// export let getActionName = () => "Skill_LittleMan_Action_Swiping"

// export let getAnimationName = () => "Skill_LittleMan_Animation_Swiping"
export let getActionName = () => "Skill_LittleMan_Swiping"

export let getAnimationName = getActionName

export let getAnimationFrameCountMap = () => {
    return {
        [getAnimationName()]: 81,
    }
}


export let getOperateData = (api: api, state: state): littleManOperateData => [
    {
        name: getActionName(),
        imageBase64: get(),
        key: api.getLanguageDataByData(state, getTextData(), languageKey.OperateSwipingKey),

        // textWidth: "4rem",
        textWidth: "2rem",
        rowIndex: 1,
    },
]

export let getAnimationBlendData = (
    api: api,
    [{ isMoveFunc, isTriggerActionFunc, isActionStateFunc }, isEndFunc, isPreviousStateFunc]
): animationBlendData<animationName> => {
    return [
        {
            condition: (state) => {
                return isTriggerActionFunc(state, getActionName())
            },
            currentAnimationNames: [animationName.Idle],
            nextAnimationName: getAnimationName(),
            // weight: 0.5,
            weight: 0.1,
            // noBlend: true,
        },
        {
            condition: (state) => {
                return isTriggerActionFunc(state, getActionName())
            },
            currentAnimationNames: [animationName.Run],
            nextAnimationName: getAnimationName(),
            weight: 0.5,
            // noBlend: true,
        },
        {
            condition: (state) => {
                return isActionStateFunc(state, littleManActionState.Initial)
            },
            currentAnimationNames: [getAnimationName()],
            nextAnimationName: animationName.Idle,
            weight: 0.5,
            // noBlend: true
        },


        {
            condition: (state) => {
                return isEndFunc(state, animationName.Shake, api.getIsDebug(state)) && isPreviousStateFunc(state, objectStateName.MeleeAttack)
            },
            currentAnimationNames: [animationName.Shake],
            nextAnimationName: getAnimationName(),
            noBlend: true
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


export let getLittleManSwipingStartEventName = () => "getLittleManSwipingStartEventName"

// export let getLittleManSwipingEndEventName = () => "getLittleManSwipingEndEventName"

export let getLittleManSwipingEmitEventName = () => "getLittleManSwipingEmitEventName"

export let getAnimationCollisionData = (api: api): Array<animationCollisionData> => {
    return [
        {
            name: getAnimationName(),

            timeline: [
                {
                    frameIndex: api.getEarlyFrameIndex(),
                    frameRange: 20,

                    track: track.Event,
                    value: (state, {
                    }): any => {
                        return {
                            eventName: getLittleManSwipingStartEventName(),
                            eventData: { }
                        }
                    }

                },
                {
                    frameIndex: 39,
                    frameRange: 20,


                    track: track.Event,
                    value: (state, {
                    }): any => {
                        return {
                            eventName: getLittleManSwipingEmitEventName(),
                            eventData: { }
                        }
                    }

                },
                // {
                //     frameIndex: api.getLateFrameIndex(81),

                //     track: track.Event,
                //     value: (state, {
                //     }): any => {
                //         return {
                //             eventName: getLittleManSwipingEndEventName(),
                //             eventData: {usedGirl}
                //         }
                //     }

                // },
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

export let getLoadData = () => [getAnimationName(), _getFBXPath("Swiping")]

