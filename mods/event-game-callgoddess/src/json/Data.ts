import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/GameEventDirectorData"
import { singleData as singleGameEventData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/GameEventData"
import { command, command_, data as scenarioData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ScenarioData"
import { rate } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
// import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/Gameve"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Event_Game_CallGoddess"

export enum languageKey {
    Title,
    Description,
    GoddessName,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "召唤女神",
            [languageKey.Description]: "召唤女神为玩家作战",
            [languageKey.GoddessName]: "玩家女神",
        },
        [language.English]: {
            [languageKey.Title]: "Call Goddess",
            [languageKey.Description]: "Call goddess for player",
            [languageKey.GoddessName]: "Player Goddess",
        },
    }
}


export let getGameEventDirectorData = (api: api, state: state): singleGameEventDirectorData => {
    return {
        eventName: getName(),
        gameEventName: getName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),
        selectRate: rate.Zero,
        isOnlyTriggerOnce: false,
        directCondition: (state: state) => {
            return api.isLittleCharacterType(state)
                // && !api.isLevelGiantess(state, usedGirl)
        },
        directorCondition: (state: state) => {
            return true
        },
        func: (state: state, eventName, gameEventName, title) => {
            state = api.addInstantGameEventData(state, {
                eventName,
                gameEventName,
                title,
                description: api.getLanguageDataByData(state, getTextData(), languageKey.Description)
            })

            return Promise.resolve(state)
        },
    }
}

export let getGameEventData = (api: api, state: state): singleGameEventData<string> => {
    return {
        eventName: getName(),
        scenarioName: getName(),
        getCommandFunc: api.getCommand,
    }
}

export let getCommandName = () => "appearPlayerGoddess"

export let getScenarioData = (api: api, state: state): scenarioData<string, command_> => {
    return {
        [getName()]: [
            {
                command: command.markBegin,
            },
            {
                command: getCommandName(),
            },
            // TODO restore
            // {
            //     command: command.realtimeSay,
            //     data: {
            //         name: "AppearPlayerGoddessName",
            //         contents: [
            //             {
            //                 content: "AppearPlayerGoddessNameSay1",
            //             },
            //         ],
            //         time: 1000,
            //     },
            // },
            {
                command: command.markFinish,
            },
        ]
    }
}