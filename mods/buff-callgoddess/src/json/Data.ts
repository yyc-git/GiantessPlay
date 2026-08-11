import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, createState } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { stressingRateFactor } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data } from "frontend/src/scene3d_layer/internation/Data"

export let getName = () => "Buff_CallGoddess"

export enum languageKey {
    Description,
}

let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "召唤女神"
        },
        [language.English]: {
            [languageKey.Description]: "Call Goddess"
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

        // maxSuperPositionCount: 1,
        maxSuperPositionCount: Infinity,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            // switch (name) {
            //     case funcData.getGirlName():
            //         state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(), {
            //             ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //             startTime: -Infinity,
            //         })

            //         return funcData.destroyGiantess(state)
            //     default:
            //         throw new Error("err")
            // }
            return Promise.resolve(state)
        },
        removeFunc: (state, funcData, name, usedGirl_, superPositionCount: number, value: number) => {
            // switch (name) {
            //     case funcData.getGirlName():
            //         state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(), {
            //             ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //             startTime: -Infinity,
            //         })

            //         return funcData.destroyGiantess(state)
            //     default:
            //         throw new Error("err")
            // }

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(), {
            //     ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //     startTime: -Infinity,
            // })
            let api = funcData.getModAPI(state)
            state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
                createState(api)
            )

            return funcData.destroyGiantess(state, usedGirl_)
        },
    }
}

// export let getLastTime = (): secondUnit => 120
export let getLastTime = (): secondUnit => 240
// export let getLastTime = (): secondUnit => 20
// export let getLastTime = (): secondUnit => 5

export let getCharacterType = () => characterType.None

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let getTargetName = (api, usedGirl) => api.girl.buildNameByUsedGirl(usedGirl)

// export let getSuperPositionCount = (api, state) => {
//     api.NullableUtils.getWithDefault(
//         api.NullableUtils.map(({ superPositionCount }) => {
//             return superPositionCount
//         }, api.findBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)),
//         0
//     )
// }

let _getCurrentBuffSuperPositionCountFactor = (api, state, usedGirl, isAddOne) => {
    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(({ superPositionCount }) => {
            if (isAddOne) {
                return superPositionCount + 1
            }

            return superPositionCount
        }, api.findBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)),
        1
    )
}

export let getComputedLastTime = (api, state, usedGirl, isAddOne) => {
    // return getLastTime() * _getCurrentBuffSuperPositionCountFactor(api, state, isAddOne)
    return getLastTime() * Math.pow(
        2, _getCurrentBuffSuperPositionCountFactor(api, state, usedGirl, isAddOne) - 1
    )
}

export let addBuff = (api: api, state: state, usedGirl) => {
    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            startTime: api.MutableRecordUtils.set(api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()).startTime, usedGirl, api.getNow(state)),
        }
    )

    return api.addBuff(state, getName(), api.girl.buildNameByUsedGirl(usedGirl), api.NullableUtils.return_(usedGirlEnum.PlayerGoddess),
        getComputedLastTime(
            api, state, usedGirl, true
        ),
        1, getCharacterType())
}