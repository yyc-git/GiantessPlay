import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName, createState } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

export let getName = () => "Buff_Tired_Girl"

export enum languageKey {
    Description,
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "疲劳"
        },
        [language.English]: {
            [languageKey.Description]: "Tired"
        },
    }
}


let _deapplyFunc = (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
    // switch (name) {
    //     case funcData.getGirlName():
    if (funcData.isGirl(name)) {
        state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => funcData.dividValue(factor, 1), usedGirl)

        state = funcData.GiantessBuildUtils.setDefenseFactor(state, funcData, (_, factor) => funcData.multiplyValue(factor, 0.5), usedGirl)
        state = funcData.GiantessBuildUtils.setAttackFactor(state, funcData, (_, factor) => funcData.multiplyValue(factor, 1), usedGirl)


        state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            {
                ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                oldValue: funcData.NullableUtils.getEmpty()
            }
        )
    }
    //         break
    //     default:
    //         throw new Error("err")
    // }

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

        applyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            // switch (name) {
            //     case funcData.getGirlName():
            if (funcData.isGirl(name)) {
                state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => funcData.multiplyValue(factor, 1), usedGirl)

                state = funcData.GiantessBuildUtils.setDefenseFactor(state, funcData, (_, factor) => funcData.dividValue(factor, 0.5), usedGirl)
                state = funcData.GiantessBuildUtils.setAttackFactor(state, funcData, (_, factor) => funcData.dividValue(factor, 1), usedGirl)

                // state = funcData.GiantessBuildUtils.setFullHp(state, funcData, (_, factor) => funcData.dividValue(factor,  1), false, usedGirl)
                state = funcData.setFullHp(state, usedGirl, Math.round(funcData.getBodyHp(state, usedGirl) * 0.66))

                state = funcData.subExcitement(state, usedGirl, 50)

                state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
                    {
                        ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
                        oldValue: funcData.NullableUtils.return_(superPositionCount)
                    }
                )
            }
            //         break
            //     default:
            //         throw new Error("err")
            // }

            return Promise.resolve(state)
        },
        deapplyFunc: _deapplyFunc,
        removeFunc: (state, funcData, name, usedGirl, superPositionCount: number, value: number) => {
            let api = funcData.getModAPI(state)
            state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
                createState(api)
            )

            return _deapplyFunc(state, funcData, name, usedGirl, superPositionCount, value)
        },
    }
}

export let getLastTime = (): secondUnit => 30

export let getCharacterType = () => characterType.Giantess

export let isPositive = () => false

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let getTargetName = (api, usedGirl) => api.girl.buildNameByUsedGirl(usedGirl)

export let addBuff = (api: api, state: state, usedGirl) => {
    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            startTime: api.getNow(state)
        }
    )

    return api.addBuff(state, getName(), getTargetName(api, usedGirl), usedGirl, getLastTime(), 1, getCharacterType())
}