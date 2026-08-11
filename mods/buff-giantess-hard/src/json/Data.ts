import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, createState } from "../script/Utils"
import { characterType, girlType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { damageType, secondUnit, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_Giantess_Hard"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "认真了"
        },
        [language.English]: {
            [languageKey.Description]: "Seriously"
        },
    }
}

let _deapplyFunc = (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
    let api = funcData.getModAPI(state)
    let ratio = api.blockAPI.getBlockState(state, getProtocolName(), getBlockName()).oldValue

    state = funcData.GiantessBuildUtils.setAttackFactor(state, funcData, (state, value) => value / ratio, usedGirl)
    state = funcData.GiantessBuildUtils.setDefenseFactor(state, funcData, (state, value) => value / ratio, usedGirl)


    return funcData.removeUpgradeFuncs(state, funcData.getUpgradeFuncs(state, usedGirl), usedGirl).then(state => {
        return funcData.setUpgradeFuncs(state, usedGirl, [])
    })
}

export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        maxSuperPositionCount: 1,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            let api = funcData.getModAPI(state)
            let autoDifficulty = api.getEnhenceAutoDifficulty(state, api.getEnhenceLevelGiantessLevel(state))

            let ratio = api.NumberUtils.clamp((1 + 0.5 * autoDifficulty / 3), 1, 3)

            state = funcData.GiantessBuildUtils.setAttackFactor(state, funcData, (state, value) => value * ratio, usedGirl)
            state = funcData.GiantessBuildUtils.setDefenseFactor(state, funcData, (state, value) => value * ratio, usedGirl)

            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: funcData.NullableUtils.return_(ratio)
                }
            )



            let upgradeFuncCount = api.NumberUtils.clamp(Math.round(autoDifficulty / 3), 1, 3)
            let upgradeFuncs = funcData.getUpgradeFuncsMod(state, girlType.LevelGiantessHard)

            let funcs = funcData.NumberUtils.randomSelectCount(
                upgradeFuncs, upgradeFuncCount
            )

            state = funcData.setUpgradeFuncs(state, usedGirl, funcs)

            return funcData.applyUpgradeFuncsByRandomLevel(
                state,
                funcs,
                usedGirl
            )
        },
        deapplyFunc: _deapplyFunc,
        removeFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            return _deapplyFunc(state, funcData, name, usedGirl, superPositionCount, sumValue).then(state => {
                let api = funcData.getModAPI(state)

                return api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
                    createState(api)
                )
            })
        },
    }
}

export let getCharacterType = () => characterType.None

// export let getLastTime = (): secondUnit => 30
export let getLastTime = (): secondUnit => 60

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getTargetName = (api: api, usedGirl) => {
    return api.girl.buildNameByUsedGirl(usedGirl)
}

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let addBuff = (api: api, state: state, usedGirl) => {
    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            // startTime: api.getNow(state),
            startTime: api.MutableRecordUtils.set(api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()).startTime, usedGirl, api.getNow(state)),
            customData: {
                lastTime: getLastTime(),
            }
        }
    )

    return api.addBuff(state, getName(), getTargetName(api, usedGirl), api.NullableUtils.return_(usedGirl), getLastTime(), 1, getCharacterType())
}