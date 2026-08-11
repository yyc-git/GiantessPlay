import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, createState } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_Giantess_Ice_Overwrite"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "冰霜覆盖"
        },
        [language.English]: {
            [languageKey.Description]: "Frost Covered",
        },
    }
}

let _deapplyFunc = (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
    // switch (name) {
    //     case funcData.getLittleManName():
    //         state = funcData.LittleManBuildUtils.setStressingRateFactor(state, funcData, (_, value) => funcData.NullableUtils.getExn(funcData.block.getBlockState(state, getProtocolName(), getBlockName()).oldValue))

    //         state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(), {
    //             ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
    //             oldValue: funcData.NullableUtils.getEmpty()
    //         }
    //         )
    //         break
    //     default:
    //         throw new Error("err")
    // }

    // state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => funcData.dividValue(factor,  value), usedGirl_)
    state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor / (1 / (1 - sumValue)), usedGirl_)
    // state = funcData.GiantessBuildUtils.setAllColor(state, funcData, [
    //     0, 0, -1
    // ], sumValue, usedGirl_
    // )


    return Promise.resolve(state)
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
            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(), {
            //     ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //     oldValue: funcData.NullableUtils.return_(funcData.getLittleManValue(state).stressingRateFactor
            //     )
            // })

            // state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => funcData.multiplyValue(factor,  value), usedGirl_)
            state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor * (1 / (1 - sumValue)), usedGirl_)
            // state = funcData.GiantessBuildUtils.setAllColor(state, funcData, [
            //     0, 0, 1
            // ], sumValue, usedGirl_
            // )

            return Promise.resolve(state)
        },
        deapplyFunc: _deapplyFunc,
        removeFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let api = funcData.getModAPI(state)
            state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
                createState(api)
            )

            return _deapplyFunc(state, funcData, name, usedGirl_, superPositionCount, sumValue)
        },
    }
}

// export let getLastTime = (): secondUnit => 3

export let getCharacterType = () => characterType.None

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

// export let getTargetName = (api) => api.getLittleManName()

export let addBuff = (api: api, state: state, targetName, usedGirl, lastTime, value) => {
    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            startTime: api.MutableRecordUtils.set(api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()).startTime, usedGirl, api.getNow(state)),
            customData: {
                lastTime: lastTime,
            }
        }
    )

    return api.addBuff(state, getName(), targetName, usedGirl, lastTime, 1, getCharacterType(), value)
}