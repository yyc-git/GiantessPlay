import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, setLittleManLevel } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Upgrade_Explode_Range"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "烈焰冲击",
        },
        [language.English]: {
            [languageKey.Title]: "Flame Strike",
        },
    }
}

export let computeValue = (level) => {
    // return 1 + level * 0.5
    return 0.2 + level * 0.2
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `攻击5%概率生成一道烈焰,造成${value}%伤害`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `Attack 5% probability to generate a flame, cause ${value}% damage`,
        },
    }
}

export let getUpgradeData = (api: api, state: state): upgradeFuncData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        type: upgradeType.Skill,
        imageSrc: getImageSrc(),

        level: 0,
        maxLevel: 3,

        conditionFunc: (state, funcData, d) => {
            return d.characterLevel >= levelRequire.VeryHigh
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(level) * 100))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            return Promise.resolve(setLittleManLevel(
                funcData.getModAPI(state),
                state,
                level
            ))
        },
    }
}

export let getCharacterType = () => characterType.LittleMan

export let getSoundResourcePath = () => getSoundPath("sound")

export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
