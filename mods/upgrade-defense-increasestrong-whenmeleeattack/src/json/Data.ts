import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getSkillBlockName, getSkillProtocolName, setLittleManLevel } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/little_man_data/DataType"
import { service } from "skill-little-man-protocol/src/service/ServiceType"
// import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
// import { getTextData } from "scene-protect/src/json/Data"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Upgrade_Defense_IncreaseStrong_WhenMeleeAttack"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "近战霸体",
        },
        [language.English]: {
            [languageKey.Title]: "Melee Strong",
        },
    }
}

export let computeValue = (level) => {
    return level * 0.3
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `近战攻击时，增加${value}% 霸体`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `increase ${value}% strong when melee attack `,
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
            return funcData.LittleManBuildUtils.hasStudyAction(state, funcData, api.blockAPI.getBlockService<service>(state, getSkillProtocolName(), getSkillBlockName()).getActionName())
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(level) * 100))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            state = setLittleManLevel(api, state, level)

            return Promise.resolve(state)
        },
    }
}

export let getCharacterType = () => characterType.LittleMan

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
