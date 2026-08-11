import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, setLevel } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
// import { getTextData } from "scene-protect/src/json/Data"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Upgrade_Defense_LimitDamage"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "伤害限制",
        },
        [language.English]: {
            [languageKey.Title]: "Limit Damage",
        },
    }
}

export let computeValue = (level) => {
    return [0.21 - 0.03 * level, 0.1 * level]
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: ([value1, value2]) => `受到的伤害增加${value2}%，但是限制总的受到的伤害不能超过自己最大血量的${value1}%`,
        },
        [language.English]: {
            [languageVariableKey.Description]: ([value1, value2]) => `The damage received increases by ${value2}%, but the total damage received is limited to no more than ${value1}% of your maximum health`,
        },
    }
}

export let getUpgradeData = (api: api, state: state): upgradeFuncData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        type: upgradeType.Defense,
        imageSrc: getImageSrc(),

        level: 0,
        maxLevel: 3,

        conditionFunc: (state, funcData, d) => {
            return true
        },
        getDescriptionFunc: (state, funcData, level) => {
            let [v1, v2] = computeValue(level)

            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)([Math.round(v1 * 100), Math.round(v2 * 100)])
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            // if (api.isUseGirl(state, usedGirl)) {
            //     state = setGiantessLevel(api, state, level)
            // }
            // else if (api.isLittleCharacterType(state)) {
            //     state = setLittleManLevel(api, state, level)
            // }
            state = setLevel(api, state, usedGirl, level)

            return Promise.resolve(state)
        },
        removeFunc: (state, funcData, usedGirl) => {
            // state = setGiantessLevel(api, state, 0)
            state = setLevel(api, state, usedGirl, 0)

            return Promise.resolve(state)
        },
    }
}

export let getCharacterType = () => characterType.Both

export let getGirlTypes = () => [
    girlType.PlayerGirl,
    girlType.PlayerGoddess,
    girlType.LevelGiantess,
    girlType.BossGiantess,
]

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
