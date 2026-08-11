import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_Army_Crippled"

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

let _computeValue = (superPositionCount) => {
    return [0.2 * superPositionCount, 0.3 * superPositionCount, 0.3 * superPositionCount, 0.15 * superPositionCount]
}


export let getBuffData = (): singleBuffData => {
    return {
        name: getName(),
        imageSrc: getImageSrc(),

        isPositive: isPositive(),

        characterType: getCharacterType(),

        // value: 0.2,

        maxSuperPositionCount: 3,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let [colorValue, moveSpeedValue, attackFactorValue, critRatioFactorValue] = _computeValue(superPositionCount)

            // let v = funcData.limitValueNotExceedOne(sumValue)

            state = funcData.ArmyBuildUtils.setMoveSpeed(state, funcData, (_, value) => value * (1 - moveSpeedValue), name)
            state = funcData.ArmyBuildUtils.setAttackFactor(state, funcData, (_, value) => value * (1 - attackFactorValue), name)
            state = funcData.ArmyBuildUtils.setCritRatioFactor(state, funcData, (_, value) => value * (1 - critRatioFactorValue), name)

            state = funcData.ArmyBuildUtils.setInstanceColor(state, funcData, name, [
                1, 1, 0
            ], colorValue
            )

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.return_(superPositionCount)
            //     }
            // )

            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let [colorValue, moveSpeedValue, attackFactorValue, critRatioFactorValue] = _computeValue(superPositionCount)

            // let v = funcData.limitValueNotExceedOne(sumValue)

            state = funcData.ArmyBuildUtils.setMoveSpeed(state, funcData, (_, value) => value / (1 - moveSpeedValue), name)
            state = funcData.ArmyBuildUtils.setAttackFactor(state, funcData, (_, value) => value / (1 - attackFactorValue), name)
            state = funcData.ArmyBuildUtils.setCritRatioFactor(state, funcData, (_, value) => value / (1 - critRatioFactorValue), name)


            state = funcData.ArmyBuildUtils.setInstanceColor(state, funcData, name, [
                -1, -1, 0
            ], colorValue
            )

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.getEmpty()
            //     }
            // )

            return Promise.resolve(state)
        },
    }
}

// export let getLastTime = (): secondUnit => 3

export let getCharacterType = () => characterType.None

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

// export let getTargetName = (api) => api.getLittleManName()

// export let addBuff = (api: api, state: state, targetName, usedGirl, value) => {
export let addBuff = (api: api, state: state, targetName, usedGirl, count, lastTime) => {
    // state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
    //     {
    //         ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
    //         startTime: api.getNow(state),
    //         customData: {
    //             lastTime: getLastTime(),
    //         }
    //     }
    // )

    return api.addBuff(state, getName(), targetName, usedGirl, lastTime, count, getCharacterType())
}