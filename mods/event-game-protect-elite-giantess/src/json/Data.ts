import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { addTriggerCount, getBlockName, getProtocolName, getState, getTriggerCount, setState, setTriggerCount } from "../script/Utils"
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

export let getName = () => "Event_Game_Protect_Elite_Giantess"

export enum languageKey {
    Title,
    Description,
    // GoddessName,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "精英巨大娘出现",
            [languageKey.Description]: "精英巨大娘出现",
        },
        [language.English]: {
            [languageKey.Title]: "Elite Giantess Appear",
            [languageKey.Description]: "Elite Giantess Appear",
        },
    }
}

let _getMaxCount = () => 25
// let _getMaxCount = () => 5
// let _getMaxCount = () => 40

export let getGameEventDirectorData = (api: api, state: state): singleGameEventDirectorData => {
    return {
        eventName: getName(),
        gameEventName: getName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),
        // selectRate: rate.Zero,
        selectRate: rate.Must,
        isOnlyTriggerOnce: false,
        // isOnlyTriggerOnce: true,
        isInstant: true,
        directCondition: (state: state) => {
            return api.isCanGenerateMax(state, api.getAllAliveEliteGiantessCount(state, api.getPlayerCamp()), _getMaxCount()) && !api.isNotGenerateEliteArmy(state)
        },
        directorCondition: (state: state) => {
            let count = api.getAllAliveEliteGiantessCount(state, api.getPlayerCamp())

            let rate
            if (count <= 1) {
                rate = 1
            }
            else if (count <= 3) {
                rate = 0.5
            }
            else if (count <= 6) {
                rate = 0.3
            }
            else if (count <= 15) {
                rate = 0.1
            }
            else {
                rate = 2 / count
            }

            return api.NumberUtils.isRandomRate(rate)
        },
        func: (state: state, eventName, gameEventName, title) => {
            state = addTriggerCount(api, state)

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
        // getCommandFunc: api.getCommand,
        getCommandFunc: getCommand(api)
    }
}

export let getCommandName = () => "Protect_Elite Giantess Appear"

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