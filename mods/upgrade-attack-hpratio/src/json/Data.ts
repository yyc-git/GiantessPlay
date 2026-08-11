import { getBlockName, getBuffBlockName, getBuffProtocolName, getProtocolName, getInverseBlockName } from "../script/Utils"
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

export let getName = () => "Upgrade_Attack_HpRatio"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "血多伤高",
        },
        [language.English]: {
            [languageKey.Title]: "High hp, high damage",
        },
    }
}

export let computeValue = (level) => {
    // return 1.5 + 0.5 * level
    return 0.5 + 0.5 * level
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            // [languageVariableKey.Description]: (value) => `您的血量比例越高，伤害增加${value}%`,
            [languageVariableKey.Description]: (value) => `您的血量百分比越高，伤害越高；反之伤害越低。伤害最多增加${value}%`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `The higher your HP percentage, the higher the damage; On the contrary, the lower the damage. damage can be increased by up to ${value}%`,
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
                api.blockAPI.getBlockService<service>(state, getProtocolName(), getInverseBlockName()).getName()
            )
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(level) * 100))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            if (usedGirl == usedGirlEnum.None) {
                return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).addBuff(
                    api, state, api.getLittleManName(), api.NullableUtils.getEmpty(), 1
                )
            }

            return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).addBuff(
                api, state, api.girl.buildNameByUsedGirl(usedGirl), usedGirl, 1
            )

            // state = setLevel(api, state, usedGirl, level)


            // return Promise.resolve(state)

        },
        removeFunc: (state, funcData, usedGirl) => {
            if (usedGirl == usedGirlEnum.None) {
                return api.removeBuff(
                    state, api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).getName(),
                    api.getLittleManName(),
                    usedGirl
                )
            }

            return api.removeBuff(
                state, api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName()).getName(),
                api.girl.buildNameByUsedGirl(usedGirl),
                usedGirl
            )

            // state = setLevel(api, state, usedGirl, level)


            // return Promise.resolve(state)

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
