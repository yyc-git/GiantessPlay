import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, createState } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { stressingRateFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_Run"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "疾跑"
        },
        [language.English]: {
            [languageKey.Description]: "Run"
        },
    }
}


let _deapplyFunc = (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
    switch (name) {
        case funcData.getLittleManName():
            // state = funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, value) => funcData.NullableUtils.getExn(funcData.block.getBlockState(state, getProtocolName(), getBlockName()).oldValue))
            state = funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, value) => value / 10)

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(), {
            //     ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //     oldValue: funcData.NullableUtils.getEmpty()
            // }
            // )

            break
        default:
            throw new Error("err")
    }

    return Promise.resolve(state)
}

export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        value: 0,

        maxSuperPositionCount: 1,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            switch (name) {
                case funcData.getLittleManName():
                    // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(), {
                    //     ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    //     oldValue: funcData.NullableUtils.return_(funcData.getLittleManValue(state).moveSpeed
                    //     )
                    // })

                    state = funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, value) => value * 10)
                    break
                default:
                    throw new Error("err")
            }

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

export let getLastTime = (): secondUnit => 30

export let getCharacterType = () => characterType.LittleMan

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let getTargetName = (api) => api.getLittleManName()

export let addBuff = (api: api, state: state) => {
    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            startTime: api.getNow(state)
        }
    )

    return api.addBuff(state, getName(), getTargetName(api), api.NullableUtils.getEmpty(), getLastTime(), 1, getCharacterType())
}