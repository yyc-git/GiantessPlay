import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { addTriggerCount, getBlockName, getProtocolName, getBehaviourBlockName, getBehaviourProtocolName, getLevelGiantessBlockName, getLevelGiantessProtocolName } from "../script/Utils"
import { singleData as singleGameEventDirectorData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/director/GameEventDirectorData"
import { singleData as singleGameEventData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/GameEventData"
import { command_, data as scenarioData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ScenarioData"
import { rate } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { command, getCommand } from "../script/Command"
import { service as levelGiantessService } from "level-giantess-protocol/src/service/ServiceType"
import { autoDifficulty } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

// export let getSubMachineBulletHitSoundResourceId = () => "submachine_bullet_gun_hit"

// export let getSubMachineBulletEmmitSoundResourceId = () => "submachine_bullet_gun_emit"

// let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

// export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Event_Game_Protect_Level_Giantess2"

export enum languageKey {
    Title,
    Description,
    // Name,
}

export let getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "巨大娘Boss2",
            [languageKey.Description]: "巨大娘Boss2即将出现",
            // [languageKey.Name]: "巨大娘",
        },
        [language.English]: {
            [languageKey.Title]: "Giantess Boss2",
            [languageKey.Description]: "Giantess Boss2 Will Appear",
            // [languageKey.Name]: "Giantess",
        },
    }
}


export let getGameEventDirectorData = (api: api, state: state): singleGameEventDirectorData => {
    return {
        eventName: getName(),
        gameEventName: getName(),
        title: api.getLanguageDataByData(state, getTextData(), languageKey.Title),
        selectRate: rate.Must,
        isOnlyTriggerOnce: false,
        isInstant: false,
        directCondition: (state: state) => {
            let levelGiantessService = api.blockAPI.getBlockService<levelGiantessService>(state, getLevelGiantessProtocolName(), getLevelGiantessBlockName())

            if (api.getAutoDifficulty(state) <= autoDifficulty.Middle && api.hasLevelGiantessExceptPlayer(state)) {
                return false
            }

            // return api.isLittleCharacterType(state)
            // && !api.isLevelGiantess(state, usedGirl)
            return !api.isExceedMaxMMDGiantessCountAfterAdd(state)
                && !api.isUseGirl(state, levelGiantessService.getUsedGirl())
        },
        directorCondition: (state: state) => {
            return api.NumberUtils.isRandomRate(0.3)
        },
        func: (state: state, eventName, gameEventName, title) => {
            state = addTriggerCount(api, state)

            state = api.addImpendingGameEventData(state, {
                eventName,
                gameEventName,
                title,
                description: api.getLanguageDataByData(state, getTextData(), languageKey.Description),
                time: api.getNow(state) + api.convertSToMs(6),
                isAlreadyShowedUIInfo: false,
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

export let getCommandName = () => "Protect_Giantess2 Appear"

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