import { getBlockName, getBuffBlockName, getBuffProtocolName, getProtocolName, getDirectBlockName } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { service } from "buff-protocol/src/service/ServiceType"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { getTextData } from "scene-protect/src/json/Data"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

export let getName = () => "Upgrade_Attack_Shoot_Distance_Inverse"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "射距反比",
        },
        [language.English]: {
            [languageKey.Title]: "Shoot Distance Inverse Ratio",
        },
    }
}

export let computeValue = (level) => {
    return 0.5 + 0.5 * level
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `射击距离越远，伤害越高；反之伤害越低。最高增加${value}%伤害`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `The further the shooting distance, the higher the damage; On the contrary, the lower the damage. Maximum increase in ${value}% damage`,
        },
    }
}

export let getUpgradeData = (api: api, state: state): upgradeFuncData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        type: upgradeType.Attack,
        imageSrc: getImageSrc(),

        level: 0,
        maxLevel: 3,

        conditionFunc: (state, funcData, d) => {
            return !api.isStudy(state,
                api.blockAPI.getBlockService<service>(state, getProtocolName(), getDirectBlockName()).getName()
            )
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(level) * 100))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).addBuff(
                api, state, api.getLittleManName(), api.NullableUtils.getEmpty(), 1
            )
        },
        removeFunc: (state, funcData, usedGirl) => {
            return api.removeBuff(
                state, api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).getName(),
                api.getLittleManName(),
                usedGirl
            )
        },
    }
}

export let getCharacterType = () => characterType.LittleMan

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
