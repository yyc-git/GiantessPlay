import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, setLevel, getSkillGiantessBlockName, getSkillGiantessProtocolName } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { service } from "upgrade-protocol/src/service/ServiceType"
import { service as skillService } from "skill-giantess-protocol/src/service/ServiceType"
// import { getTextData } from "scene-protect/src/json/Data"

export let getName = () => "Upgrade_Skill_Enhence_StompRub_PutToShoe"

export enum languageKey {
    Title,
}


export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "脚碾：放入鞋",
        },
        [language.English]: {
            [languageKey.Title]: "Stomp Rub: Put To Shoe",
        },
    }
}

export let computeValue = (level) => {
    return 0.2 * level
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `受影响的单位有${value}%的概率被放入鞋`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `Affected Unit has ${value}% probability to be put to shoe`,
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
        maxLevel: 5,

        conditionFunc: (state, funcData, d) => {
            return funcData.GiantessBuildUtils.hasStudyAction(state, funcData, api.blockAPI.getBlockService<skillService>(state, getSkillGiantessProtocolName(), getSkillGiantessBlockName()).getActionName())
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(level) * 100))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            state = setLevel(api, state, usedGirl, level)

            return Promise.resolve(state)
        },
        removeFunc: (state, funcData, usedGirl) => {
            state = setLevel(api, state, usedGirl, 0)

            return Promise.resolve(state)
        },
    }
}

// export let getLastTime = (): secondUnit => +Infinity

export let getCharacterType = () => characterType.Giantess

export let getGirlTypes = () => [
    girlType.PlayerGirl,
    girlType.PlayerGoddess,
    girlType.LevelGiantess,
    // girlType.BossGiantess,
]


// export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/upgrade.png`

// export let getTargetName = (funcData) => funcData.getLittleManName()

// export let addBuff = (funcData, state: state) => {
//     return funcData.addBuff(state, getName(), getTargetName(funcData), funcData.NullableUtils.getEmpty(), getLastTime(), 1, getCharacterType())
// }