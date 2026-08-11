import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { damageType, secondUnit, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export let getName = () => "Buff_Army_Sadism"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "TODO"
        },
        [language.English]: {
            [languageKey.Description]: "TODO"
        },
    }
}

export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        // value: 0.2,

        maxSuperPositionCount: +Infinity,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: funcData.NullableUtils.return_(superPositionCount)
                }
            )

            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: funcData.NullableUtils.getEmpty()
                }
            )

            return Promise.resolve(state)
        },
    }
}

export let getCharacterType = () => characterType.None

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let addBuff = (api: api, state: state, targetName, lastTime, value) => {
    return api.addBuff(state, getName(), targetName, api.NullableUtils.getEmpty(), lastTime, 1, getCharacterType(), value)
}