import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"

export enum languageKey {
    EnterNextLevel,
    LevelName,
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.EnterNextLevel]: "防御城市关卡",
            [languageKey.LevelName]: "防御城市",
        },
        [language.English]: {
            [languageKey.EnterNextLevel]: "Protect City Level",
            [languageKey.LevelName]: "Protect City",
        },
    }
}

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getBuyResourcePath = () => getSoundPath("buy")

export let getBuyResourceId = getBuyResourcePath


export let getScene = () => "Scene_Protect"


export let getSceneData = (api, state): [string, string] => {
    return [
        getScene(),
        api.getLanguageDataByData(state, getTextData(), languageKey.LevelName)
    ]
}

export let getNextLevelData = (api: api, state: state) => {
    return {
        name: api.getLanguageDataByData(state, getTextData(), languageKey.EnterNextLevel),
        scene: getScene(),
        levelNumber: 1
    }
}