import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_LittleMan_Ice_Single"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "冰霜之触"
        },
        [language.English]: {
            [languageKey.Description]: "Frost Touch"
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

        // maxSuperPositionCount: 99,
        maxSuperPositionCount: 1,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let v = funcData.limitValueNotExceedOne(sumValue)

            state = funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, moveSpeed) => moveSpeed * (1 - v), name)
            state = funcData.LittleManBuildUtils.setColor(state, [
                0, 0, 1
            ], v
            )

            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                {
                    ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                    oldValue: funcData.NullableUtils.return_(superPositionCount)
                }
            )

            return Promise.resolve(state)

        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let v = funcData.limitValueNotExceedOne(sumValue)

            state = funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, moveSpeed) => moveSpeed / (1 - v), name)
            state = funcData.LittleManBuildUtils.setColor(state, [
                0, 0, -1
            ], v
            )

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

export let getLastTime = (): secondUnit => 3

export let getCharacterType = () => characterType.LittleMan

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

// export let getTargetName = (api) => api.getLittleManName()

export let addBuff = (api: api, state: state, targetName, value) => {
    // state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
    //     {
    //         ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
    //         startTime: api.getNow(state),
    //         customData: {
    //             lastTime: getLastTime(),
    //         }
    //     }
    // )

    return api.addBuff(state, getName(), targetName, api.NullableUtils.getEmpty(), getLastTime(), 1, getCharacterType(), value)
}