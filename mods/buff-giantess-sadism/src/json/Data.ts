import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { damageType, secondUnit, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export let getName = () => "Buff_Giantess_Sadism"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "施虐狂"
        },
        [language.English]: {
            [languageKey.Description]: "Sadism"
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

        applyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            let api = funcData.getModAPI(state)

            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: api.MutableRecordUtils.set(funcData.block.getBlockState(state, getProtocolName(), getBlockName()), usedGirl, superPositionCount)
                }
            )

            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            let api = funcData.getModAPI(state)

            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: api.MutableRecordUtils.remove(funcData.block.getBlockState(state, getProtocolName(), getBlockName()), usedGirl)
                }
            )

            return Promise.resolve(state)
        },
    }
}

export let getCharacterType = () => characterType.Giantess

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let addBuff = (api: api, state: state, usedGirl, lastTime, value) => {
    return api.addBuff(state, getName(), api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirl), lastTime, 1, getCharacterType(), value)
}