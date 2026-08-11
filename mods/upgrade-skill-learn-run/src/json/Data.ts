import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
// import { getTextData } from "scene-protect/src/json/Data"

export let getName = () => "Upgrade_LearnRun"

export enum languageKey {
    Title,
    Description,
}

let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "跑（站姿势）",
            [languageKey.Description]: "",
        },
        [language.English]: {
            [languageKey.Title]: "Run(Stand Pose)",
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
        maxLevel: 1,

        conditionFunc: (state, funcData, d) => {
            return true
        },
        getDescriptionFunc: (state, funcData, level) => {
            return funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [actionName.Run]))
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