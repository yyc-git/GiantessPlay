import { getBlockName, getProtocolName, getDamagedBlockName } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/DataType"
import { service } from "upgrade-protocol/src/service/ServiceType"
// import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
// import { getTextData } from "scene-protect/src/json/Data"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Upgrade_Other_PartialScaleBreast"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            // [languageKey.Title]: "增加胸部局部变大",
            [languageKey.Title]: "额外提升‘巨乳’指数",
        },
        [language.English]: {
            [languageKey.Title]: "Increase Breast Partial Scale",
        },
    }
}

export let computeValue = (level) => {
    return level * 0.5
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `增加${value}%最大值`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `Increase ${value}% max scale`,
        },
    }
}

export let getUpgradeData = (api: api, state: state): upgradeFuncData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        type: upgradeType.Other,
        imageSrc: getImageSrc(),

        level: 0,
        maxLevel: 4,

        conditionFunc: (state, funcData, d) => {
            return api.isStudy(state,
                api.blockAPI.getBlockService<service>(state, getProtocolName(), getDamagedBlockName()).getName()
            ) && d.characterLevel >= levelRequire.High
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(level) * 100))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            state = api.setBreastPartialScaleMaxFactor(state, usedGirl, computeValue(level))

            return Promise.resolve(state)
        },
    }
}

export let getCharacterType = () => characterType.Giantess

export let getGirlTypes = () => [
    girlType.PlayerGirl,
    girlType.PlayerGoddess,
    girlType.LevelGiantess,
    // girlType.BossGiantess,
]

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
