import { getBlockName } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/DataType"
import { service } from "skill-little-man-protocol/src/service/ServiceType"
// import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
// import { getTextData } from "scene-protect/src/json/Data"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Upgrade_Assistant_AddMaxExcitement"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "增加最大兴奋",
        },
        [language.English]: {
            [languageKey.Title]: "Add Max Excitement",
        },
    }
}

export let computeValue = (level) => {
    return level * 20
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => ``,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => ``,
        },
    }
}

export let getUpgradeData = (api: api, state: state): upgradeFuncData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        type: upgradeType.Assistant,
        imageSrc: getImageSrc(),

        level: 0,
        maxLevel: 5,

        conditionFunc: (state, funcData, d) => {
            return d.characterLevel >= levelRequire.VeryHigh2
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(computeValue(level))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            state = api.GiantessBuildUtils.setMaxExcitement(state, funcData, (state, value) => value + computeValue(level), usedGirl)

            return Promise.resolve(state)
        },
        deupgradeFunc: (state, funcData, level, usedGirl) => {
            state = api.GiantessBuildUtils.setMaxExcitement(state, funcData, (state, value) => value - computeValue(level), usedGirl)

            return Promise.resolve(state)
        },
    }
}

export let getCharacterType = () => characterType.Giantess


// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
