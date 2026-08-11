import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_Elite_Giantess_DamageBigger"

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

        maxSuperPositionCount: 1,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            return Promise.resolve(state)
        },
    }
}

export let getLastTime = (): secondUnit => +Infinity

export let getCharacterType = () => characterType.None

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let addBuff = (api: api, state: state, targetName, count) => {
    return api.addBuff(state, getName(), targetName, api.NullableUtils.getEmpty(), getLastTime(), count, getCharacterType())
}