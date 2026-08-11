import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, createState } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { stressingRateFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_LittleMan_StressProtect"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "应激防护"
        },
        [language.English]: {
            [languageKey.Description]: "Stress Protect"
        },
    }
}

let _deapplyFunc = (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
    return Promise.resolve(state)
}

export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        // value: 0,

        maxSuperPositionCount: 1,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            return Promise.resolve(state)

        },
        deapplyFunc: _deapplyFunc,
        removeFunc: (state, funcData, name, usedGirl_, superPositionCount: number, value: number) => {
            let api = funcData.getModAPI(state)
            state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
                createState(api)
            )

            return _deapplyFunc(state, funcData, name, usedGirl_, superPositionCount, value)
        },
    }
}

// export let getLastTime = (): secondUnit => 30
// export let getLastTime = (): secondUnit => 10

export let getCharacterType = () => characterType.LittleMan

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let getTargetName = (api) => api.getLittleManName()

export let addBuff = (api: api, state: state, lastTime) => {
    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            startTime: api.getNow(state),
            customData: {
                lastTime: lastTime,
            }
        }
    )

    return api.addBuff(state, getName(), getTargetName(api), api.NullableUtils.getEmpty(), lastTime, 1, getCharacterType())
}