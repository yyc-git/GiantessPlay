import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, getSkillGiantessBlockName, getSkillGiantessProtocolName, setLevel } from "../script/Utils"
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

export let getName = () => "Upgrade_Skill_Enhence_JumpStomp_Crippled"

export enum languageKey {
    Title,
}


export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "跳踩：残废",
        },
        [language.English]: {
            [languageKey.Title]: "Stomp: crippled",
        },
    }
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `受影响的单位会${value}级残废`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `Affected units will be Level ${value} Crippled`,
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
            return funcData.GiantessBuildUtils.hasStudyAction(state, funcData, api.blockAPI.getBlockService<skillService>(state, getSkillGiantessProtocolName(), getSkillGiantessBlockName()).getActionName())
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(level)
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
    girlType.LevelGiantessHard,
    girlType.BossGiantess,
]


// export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/upgrade.png`

// export let getTargetName = (funcData) => funcData.getLittleManName()

// export let addBuff = (funcData, state: state) => {
//     return funcData.addBuff(state, getName(), getTargetName(funcData), funcData.NullableUtils.getEmpty(), getLastTime(), 1, getCharacterType())
// }