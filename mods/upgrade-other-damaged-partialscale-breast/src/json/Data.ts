import { getBlockName, setLevel } from "../script/Utils"
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

export let getName = () => "Upgrade_Other_Damaged_PartialScaleBreast"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "胸部受击会局部变大",
        },
        [language.English]: {
            [languageKey.Title]: "Breast damaged will partial scale",
        },
    }
}

// export let computeValue = (level) => {
//     return level 
// }

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            // [languageVariableKey.Description]: (value) => `增加变大速度${value}%`,
            [languageVariableKey.Description]: (value) => `变大速度为${value}级`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `Bigger speed is level ${value}`,
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
        maxLevel: 3,

        conditionFunc: (state, funcData, d) => {
            return d.characterLevel >= levelRequire.Middle
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(level)
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            state = setLevel(api, state, usedGirl, level)

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
