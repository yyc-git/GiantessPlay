import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, getSkillGiantessBlockName, getSkillGiantessProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
// import { getTextData } from "scene-protect/src/json/Data"

export let getName = () => "Upgrade_StompRub"

export enum languageKey {
    Title,
    Description,
}

let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "碾脚（站姿势）",
            // [languageKey.Description]: "踩踏后，可碾脚",
            [languageKey.Description]: "踩踏右脚落地后，可使用该技能",
        },
        [language.English]: {
            [languageKey.Title]: "Foot Grind(Stand Pose)",
            // [languageKey.Description]: "After stomp, can rub",
            [languageKey.Description]: "After stomping on the right foot and landing, this skill can be used",
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
            return d.characterLevel >= levelRequire.Low
        },
        getDescriptionFunc: (state, funcData, level) => {
            return funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [api.blockAPI.getBlockService<service>(state, getSkillGiantessProtocolName(), getSkillGiantessBlockName()).getActionName()]))
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