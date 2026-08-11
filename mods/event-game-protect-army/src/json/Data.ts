import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/GameEventDirectorData"
import { singleData as singleGameEventData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/GameEventData"
import { command_, data as scenarioData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ScenarioData"
import { rate } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { command, getCommand } from "../script/Command"
// import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/Gameve"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

// let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

// export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Event_Game_Protect_Army"

export enum languageKey {
    Title,
    Description,
    // GoddessName,
}

// export let getTextData = (): data => {
//     return {
//         [language.Chinese]: {
//             [languageKey.Title]: "精英魔法巨大娘出现",
//             [languageKey.Description]: "精英魔法巨大娘出现",
//         },
//         [language.English]: {
//             [languageKey.Title]: "Elite Magic Giantess Appear",
//             [languageKey.Description]: "Elite Magic Giantess Appear",
//         },
//     }
// }

let _getMaxCount = () => 100
// let _getMaxCount = () => 150


export let getGameEventDirectorData = (api: api, state: state): singleGameEventDirectorData => {
    return {
        eventName: getName(),
        gameEventName: getName(),
        // title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),
        title: "",
        // selectRate: rate.Zero,
        selectRate: rate.Must,
        isOnlyTriggerOnce: false,
        isInstant: true,
        directCondition: (state: state) => {
            return api.isCanGenerateMax(state, api.getAllAliveArmyExceptEliteGiantessCount(state, api.getPlayerCamp()), _getMaxCount())
        },
        directorCondition: (state: state) => {
            return true
        },
        func: (state: state, eventName, gameEventName, title) => {
            state = api.addInstantGameEventData(state, {
                eventName,
                gameEventName,
                title,
                description: api.NullableUtils.getEmpty()
            })

            return Promise.resolve(state)
        },
    }
}


export let getGameEventData = (api: api, state: state): singleGameEventData<string> => {
    return {
        eventName: getName(),
        scenarioName: getName(),
        // getCommandFunc: api.getCommand,
        getCommandFunc: getCommand(api)
    }
}

export let getCommandName = () => "Protect_Army Appear"

export let getScenarioData = (api: api, state: state): scenarioData<string, command | string> => {
    return {
        [getName()]: [
            {
                command: command.markBegin,
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