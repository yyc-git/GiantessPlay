// import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
// import { getBlockName, getProtocolName } from "../script/Utils"
// import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
// import { api } from "type-api/src/Type"
// import { language, state } from "frontend/src/scene3d_layer/type/StateType"
// import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { state as blockState } from "buff-protocol/src/state/StateType"

// export let getName = () => "Buff_Giantess_Ice_Single"

// export enum languageKey {
//     Description,
// }

// let _getTextData = () => {
//     return {
//         [language.Chinese]: {
//             [languageKey.Description]: "TODO"
//         },
//         [language.English]: {
//             [languageKey.Description]: "TODO"
//         },
//     }
// }


// export let getBuffData = (): singleBuffData => {
//     return {
//         name: getName(),
//         imageSrc: getImageSrc(),

//         isPositive: isPositive(),

//         characterType: getCharacterType(),

//         // sumValue: 0.2,

//         maxSuperPositionCount: 99,

//         getDescriptionFunc: (state, funcData, superPositionCount: number, sumValue: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

//         applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
//             let v = funcData.limitValueNotExceedOne(sumValue * superPositionCount)
//             let { damagePart, actuallyDamageParts } = funcData.block.getBlockState(state, getProtocolName(), getBlockName()).customData

//             state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor * (1 / (1 - v)), usedGirl_)
//             state = funcData.GiantessBuildUtils.setPartColor(state, funcData, damagePart, actuallyDamageParts, [
//                 0, 0, 1
//             ], v
//             )

//             let blockState = funcData.block.getBlockState(state, getProtocolName(), getBlockName())
//             state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
//                 {
//                     ...blockState,
//                     oldValue: {
//                         ...blockState.oldValue,
//                         damagePart,
//                         actuallyDamageParts
//                     },
//                     customData: {
//                         ...blockState.customData,
//                         superPositionCount
//                     }
//                 }
//             )


//             return Promise.resolve(state)
//         },
//         deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
//             let v = funcData.limitValueNotExceedOne(sumValue * superPositionCount)
//             let blockState = funcData.block.getBlockState(state, getProtocolName(), getBlockName())
//             let { damagePart, actuallyDamageParts } = blockState.oldValue

//             state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor / (1 / (1 - v)), usedGirl_)
//             state = funcData.GiantessBuildUtils.setPartColor(state, funcData, damagePart, actuallyDamageParts, [
//                 0, 0, -1
//             ], v
//             )

//             state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
//                 {
//                     ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
//                     oldValue: {
//                         ...blockState,
//                         damagePart: funcData.NullableUtils.getEmpty(),
//                         actuallyDamageParts: []
//                     }
//                 }
//             )


//             return Promise.resolve(state)
//         },
//     }
// }

// // export let getLastTime = (): secondUnit => 3

// export let getCharacterType = () => characterType.None

// export let isPositive = () => false

// export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

// // export let getTargetName = (api) => api.getLittleManName()

// export let addBuff = (api: api, state: state, targetName, usedGirl, lastTime, sumValue, customData) => {
//     let blockState = api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName())
//     state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
//         {
//             ...blockState,
//             customData: {
//                 ...blockState.customData,
//                 damagePart: customData.damagePart,
//                 actuallyDamageParts: customData.actuallyDamageParts,
//             }
//         }
//     )

//     return api.addBuff(state, getName(), targetName, usedGirl, lastTime, 1, getCharacterType(), sumValue)
// }
import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, createState } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_Giantess_Ice_Single"

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

        // maxSuperPositionCount: 99,
        maxSuperPositionCount: 1,

        getDescriptionFunc: (state, funcData, superPositionCount: number, sumValue: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            // let v = funcData.limitValueNotExceedOne(sumValue * superPositionCount)
            let v = funcData.limitValueNotExceedOne(sumValue)

            state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor * (1 / (1 - v)), usedGirl_)
            // state = funcData.GiantessBuildUtils.setAllColor(state, funcData, [
            //     0, 0, 1
            // ], v, usedGirl_
            // )

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.return_(superPositionCount)
            //     }
            // )


            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let v = funcData.limitValueNotExceedOne(sumValue)

            state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor / (1 / (1 - v)), usedGirl_)
            // state = funcData.GiantessBuildUtils.setAllColor(state, funcData, [
            //     0, 0, -1
            // ], v, usedGirl_
            // )

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.getEmpty()
            //     }
            // )
            state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                createState(funcData.getModAPI(state))
            )

            return Promise.resolve(state)
        },
    }
}

export let getLastTime = (): secondUnit => 3
// export let getLastTime = (): secondUnit => 3000

export let getCharacterType = () => characterType.GiantessOrNone

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

// export let getTargetName = (api) => api.getLittleManName()

export let addBuff = (api: api, state: state, targetName, usedGirl, sumValue) => {
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


    return api.addBuff(state, getName(), targetName, usedGirl, getLastTime(), 1, getCharacterType(), sumValue)
}