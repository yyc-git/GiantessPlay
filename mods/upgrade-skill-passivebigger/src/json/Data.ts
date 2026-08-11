import { createData, getBlockName, getBuffBossStatusBlockName, getBuffPlayerStatusBlockName, getBuffProtocolName, getData, getProtocolName, getSumIncreaseScale, hasData, removeData, setData, updateGirlScale } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data, variableData } from "frontend/src/scene3d_layer/internation/Data"
import { levelRequire, upgradeFuncData, upgradeType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { api } from "type-api/src/Type"
// import { biggerWay } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"


let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

// export let getSoundPath = (name) => _getPath(name, "mp3")

export let getImagePath = (name) => _getPath(name, "png")

// export let getName = () => `${giantessUpgradeName.ChangeToPassiveBigger}_Upgrade_Assistant_PassiveBigger`
export let getName = () => `Upgrade_Skill_PassiveBigger`

export enum languageKey {
    Title,
}

export enum languageVariableKey {
    Description,
}


let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Title]: "使用被动变大",
        },
        [language.English]: {
            [languageKey.Title]: "Change To Passive Bigger",
        },
    }
}

// export let computeValue = (level) => {
//     return level * 0.1
// }

let _getTextDataByVariable = (): variableData => {
    return {
        [language.Chinese]: {
            // [languageVariableKey.Description]: (value) => `最大变大上限为${value}米。注：兴奋度低于10时,每隔10s高度会下降20%(最少10M)`,
            [languageVariableKey.Description]: (value) => `累积变大的上限为${value}米。注：兴奋度低于10时,每隔10s高度会下降20%(最少10M)`,
        },
        [language.English]: {
            // [languageVariableKey.Description]: (value) => `The maximum increase limit is ${value} meters. Note: When the excitement level is below 10, the height will decrease by 20% (at least 10 meters) after 10 seconds`,
            [languageVariableKey.Description]: (value) => `The upper limit for cumulative bigger is ${value} meters. Note: When excitement is below 10, the height decreases by 20% every 10 seconds (minimum 10M)`,
        },
    }
}

let _getMaxLevel = () => 5

let _getPassiveMaxSumIncreaseScaleByLevel = (api: api, state: state, funcData, level) => {
    let factor
    if (level > _getMaxLevel()) {
        // factor = 2
        factor = 10
    }
    else {
        // factor = 1.2
        factor = 1
    }

    // return api.NumberUtils.lessThan(api.NumberUtils.getDecimal(Math.round(funcData.getGirlValue(state, usedGirl).scaleIncrease * (level * factor)) + funcData.getGirlValue(state, usedGirl).initialScale, 1), funcData.getGirlMaxScale(state, funcData.getGirlValue(state, usedGirl)))

    return level * factor * 20
}

export let getUpgradeData = (api: api, state: state): upgradeFuncData => {
    return {
        name: getName(),
        title: api.getLanguageDataByData(state, _getTextData(), languageKey.Title),

        type: upgradeType.Skill,
        imageSrc: getImageSrc(),

        level: 0,
        maxLevel: _getMaxLevel(),

        conditionFunc: (state, funcData, d) => {
            if (d.characterLevel <= levelRequire.Low) {
                return false
            }

            // if (d.level == 1) {
            //     return funcData.getBiggerWay(state) == biggerWay.None
            // }

            // return funcData.getBiggerWay(state) == biggerWay.Passive
            return true
        },
        getDescriptionFunc: (state, funcData, level) => {
            return api.getLanguageDataByData(state, _getTextDataByVariable(), languageVariableKey.Description)(api.getHeightByScale(_getPassiveMaxSumIncreaseScaleByLevel(api, state, funcData, level)))
        },
        upgradeFunc: (state, funcData, level, usedGirl) => {
            if (!hasData(api, state, usedGirl)) {
                state = setData(api, state, usedGirl, createData(api))
            }

            if (api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                state = setData(api, state, usedGirl, {
                    ...getData(api, state, usedGirl),
                    maxSumIncreaseScale: _getPassiveMaxSumIncreaseScaleByLevel(api, state, funcData, level)
                    // maxSumIncreaseScale: 10000
                })
            }

            if (api.getIsApplying(state)
                && api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)
            ) {
                state = updateGirlScale(api, state, usedGirl, getSumIncreaseScale(api, state, usedGirl), false)
                state = api.setOriginPlayerGirlScale(state, api.getGirlScale(state, usedGirl) + api.getScaleIncrease(state))
            }

            let giantessBuffService
            if (api.isLevelGiantess(state, usedGirl)) {
                giantessBuffService = api.blockAPI.getBlockService(state, getBuffProtocolName(), getBuffBossStatusBlockName())
            }
            else if (api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                giantessBuffService = api.blockAPI.getBlockService(state, getBuffProtocolName(), getBuffPlayerStatusBlockName())
            }
            else {
                // throw new Error("err")
                return Promise.resolve(state)
            }

            return giantessBuffService.addBuff(api, state, api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirl))
        },
        removeFunc: (state, funcData, usedGirl) => {
            // if (!hasData(api, state, usedGirl)) {
            //     state = setData(api, state, usedGirl, createData(api))
            // }

            if (api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
                // state = api.setBiggerWay(state, biggerWay.Passive)

                // state = setData(api, state, usedGirl, {
                //     ...getData(api, state, usedGirl),
                //     maxScale: _getPassiveMaxSumIncreaseScaleByLevel(api, state, funcData, level)
                // })
                throw new Error("err")
            }

            if (api.getIsApplying(state)) {
                // state = updateGirlScale(api, state)
                // state = setData(api, state, usedGirl, {
                //     ...getData(api, state, usedGirl),
                //     originPlayerGirlScale: api.NullableUtils.return_(api.getGirlScale(state, usedGirl))
                // })
                throw new Error("err")
            }

            let giantessBuffService
            if (api.isLevelGiantess(state, usedGirl)) {
                giantessBuffService = api.blockAPI.getBlockService(state, getBuffProtocolName(), getBuffBossStatusBlockName())
            }
            else {
                throw new Error("err")
            }

            return api.removeBuff(state, giantessBuffService.getName(), api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirl)).then(state => {
                return removeData(api, state, usedGirl)
            })
        },
    }
}

export let getCharacterType = () => characterType.Giantess

export let getGirlTypes = () => [
    girlType.PlayerGirl,
    girlType.PlayerGoddess,
    girlType.LevelGiantess,
    // girlType.LevelGiantessHard,
    // girlType.BossGiantess,
]

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let getImageSrc = () => getImagePath("upgrade")
