import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data } from "frontend/src/scene3d_layer/internation/Data"
import { api } from "type-api/src/Type"

export let getName = () => "Buff_HolyWater"

export enum languageKey {
    Description,
}

let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "圣水"
        },
        [language.English]: {
            [languageKey.Description]: "Holy Water"
        },
    }
}

export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        value: 0,

        maxSuperPositionCount: +Infinity,

        isWorkInContinueLevels: true,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            switch (name) {
                case funcData.getLittleManName():
                    state = funcData.LittleManBuildUtils.setAttackFactor(state, funcData, (_, factor) => funcData.addValue(factor, 0.3 * superPositionCount))

                    state = funcData.LittleManBuildUtils.setHp(state, funcData, (_, factor) => funcData.addValue(factor, 100 * superPositionCount), true)

                    state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                        {
                            ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                            oldValue: funcData.NullableUtils.return_(superPositionCount)
                        }
                    )
                    break
                default:
                    throw new Error("err")
            }

            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            switch (name) {
                case funcData.getLittleManName():
                    state = funcData.LittleManBuildUtils.setAttackFactor(state, funcData, (_, factor) => funcData.subValue(factor, 0.3 * superPositionCount))

                    state = funcData.LittleManBuildUtils.setHp(state, funcData, (_, factor) => funcData.subValue(factor, 100 * superPositionCount), false)

                    state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                        {
                            ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                            oldValue: funcData.NullableUtils.getEmpty()
                        }
                    )
                    break
                default:
                    throw new Error("err")
            }

            return Promise.resolve(state)
        },
    }
}

export let getLastTime = (): secondUnit => +Infinity

export let getCharacterType = () => characterType.LittleMan

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let getTargetName = (api: api) => api.getLittleManName()

export let addBuff = (api, state: state) => {
    return api.addBuff(state, getName(), getTargetName(api), api.NullableUtils.getEmpty(), getLastTime(), 1, getCharacterType())
}