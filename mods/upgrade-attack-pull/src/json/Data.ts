import { getBlockName, getBuffBlockName, getBuffProtocolName } from "../script/Utils"
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

export let getName = () => "Upgrade_Attack_Pull"

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "牵引黑洞",
        },
        [language.English]: {
            [languageKey.Title]: "Pull Blackhole",
        },
    }
}

export let computeValue = (api, state, level) => {
    if (api.isGiantessCharacterType(state)) {
        return level * 0.3
    }

    return level * 0.1
}

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            [languageVariableKey.Description]: (value) => `范围攻击有${value}%概率使将受影响单位牵引到命中点附近（对大于50米的单位无效）`,
        },
        [language.English]: {
            [languageVariableKey.Description]: (value) => `Range attack has ${value}% probability causes the affected units to be pulled near the hit point(not work for > 50M unit)`,
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
            return true
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(Math.round(computeValue(api, state, level) * 100))
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
    // girlType.LevelGiantess,
    girlType.LevelGiantessHard,
    girlType.BossGiantess,
]


// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
