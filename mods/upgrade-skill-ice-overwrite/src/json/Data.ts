import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, setLittleManLevel } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
// import { getTextData } from "scene-protect/src/json/Data"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Upgrade_Ice_Overwrite"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "冰霜覆盖",
        },
        [language.English]: {
            [languageKey.Title]: "Frost Covered",
        },
    }
}

export let computeValue = (level) => {
    return level * 0.2
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `攻击5%概率在目标点地面生成冰霜区域,进入该区域的所有单位减移动速度${value}%`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `Attack with a 5% probability to generate a frost area on the ground of the target point, and all units entering this area will slow down move speed ${value}%`,
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
            // return api.getLanguageTextVariableData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(level) * 100))
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
