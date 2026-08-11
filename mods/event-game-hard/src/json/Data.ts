import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/GameEventDirectorData"
import { singleData as singleGameEventData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/GameEventData"
import { command_, data as scenarioData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ScenarioData"
import { rate } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { command, getCommand } from "../script/Command"
import { findNeedHardUsedGirl, getLastHardTime } from "../script/Utils"
import { autoDifficulty, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export let getName = () => "Event_Game_Hard"

export enum languageKey {
    // Title,
    // Description,
    // GoddessName,

    LevelGiantessHardName,
    LevelGiantessHardSay1,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            // [languageKey.LevelGiantessHardName]: "关卡巨大娘",
            [languageKey.LevelGiantessHardName]: "巨大娘",
            [languageKey.LevelGiantessHardSay1]: "要认真点啦~",
        },
        [language.English]: {
            // [languageKey.LevelGiantessHardName]: "Level Giantess",
            [languageKey.LevelGiantessHardName]: "Giantess",
            [languageKey.LevelGiantessHardSay1]: "I need to be a little more serious~",
        },
    }
}

export let getGameEventDirectorData = (api: api, state: state): singleGameEventDirectorData => {
    return {
        eventName: getName(),
        gameEventName: getName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.LevelGiantessHardSay1),
        selectRate: rate.Must,
        isOnlyTriggerOnce: false,
        isInstant: true,
        directCondition: (state: state) => {
            return findNeedHardUsedGirl(api, state) != usedGirlEnum.None
        },
        directorCondition: (state: state) => {
            // if (api.getPassTimeFromNow(state, getLastHardTime(api, state)) < 60000) {
            if (api.getPassTimeFromNow(state, getLastHardTime(api, state)) < 120000) {
                return false
            }

            // let ratio = api.NumberUtils.clamp(1 - api.girl.getBodyHp(state, usedGirl) / api.girl.getFullHp(state, usedGirl), 0.1, 1)

            // return api.NumberUtils.isRandomRate(ratio * 0.4)
            let ratio = 0.3

            return api.NumberUtils.isRandomRate(ratio * 0.4)
        },
        func: (state: state, eventName, gameEventName, title) => {
            state = api.addInstantGameEventData(state, {
                eventName,
                gameEventName,
                title,
                description: ""
            })

            return Promise.resolve(state)
        },
    }
}


export let getGameEventData = (api: api, state: state): singleGameEventData<string> => {
    return {
        eventName: getName(),
        scenarioName: getName(),
        getCommandFunc: getCommand(api)
    }
}

export let getCommandName = () => "Hard"

export let getScenarioData = (api: api, state: state): scenarioData<string, command | string> => {
    return {
        [getName()]: [
            {
                command: command.markBegin,
            },
            {
                command: command.realtimeSay,
                data: {
                    name: api.getLanguageDataByData(state, getTextData(), languageKey.LevelGiantessHardName),
                    contents: [
                        {
                            content: api.getLanguageDataByData(state, getTextData(), languageKey.LevelGiantessHardSay1),
                            // soundId: getSayHardSoundResourceId()
                        },
                    ],
                    time: 2000,
                    isInMiddle: true,
                },
            },
            {
                command: getCommandName(),
            },
            {
                command: command.markFinish,
            },
        ]
    }
}