import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, setLevel } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { service } from "upgrade-protocol/src/service/ServiceType"
import { service as skillService } from "skill-giantess-protocol/src/service/ServiceType"
// import { getTextData } from "scene-protect/src/json/Data"

export let getName = () => "Upgrade_Skill_Enhence_Run_Repel"

export enum languageKey {
    Title,
    Description,
}

let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "跑：增加范围击退",
            [languageKey.Description]: "",
        },
        [language.English]: {
            [languageKey.Title]: "Run: add Range Repel",
            [languageKey.Description]: "",
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
            return funcData.GiantessBuildUtils.hasStudyAction(state, funcData, actionName.Run)
        },
        getDescriptionFunc: (state, funcData, level) => {
            return funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)
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

// export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/upgrade.png`

// export let getTargetName = (funcData) => funcData.getLittleManName()

// export let addBuff = (funcData, state: state) => {
//     return funcData.addBuff(state, getName(), getTargetName(funcData), funcData.NullableUtils.getEmpty(), getLastTime(), 1, getCharacterType())
// }