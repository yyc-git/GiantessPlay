import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"
import { data } from "frontend/src/scene3d_layer/internation/Data"

export let getName = () => "Buff_Excitement_Level_Giantess"

export enum languageKey {
    Description,
}

let _getTextData = (): data => {
    return {
        [language.Chinese]: {
            [languageKey.Description]: "兴奋"
        },
        [language.English]: {
            [languageKey.Description]: "Excitement"
        },
    }
}

let _computeSumValue = (superPositionCount) => {
    return 0.2 * superPositionCount
}

let _computeChangedScale = (state, funcData, usedGirl, superPositionCount) => {
    return funcData.NumberUtils.greaterThan(funcData.getGirlScale(state, usedGirl) * 0.2, 10) * superPositionCount
}


let _func = (state, handleRestoreScaleFunc, funcData, name, usedGirl, superPositionCount: number) => {
    // switch (name) {
    // case funcData.getGirlName():
    if (funcData.isGirl(name)) {
        // state = funcData.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
        //     return initialScale - 10 * superPositionCount
        // }, funcData.setGirlScale)


        state = handleRestoreScaleFunc(state, funcData, name, usedGirl, superPositionCount)

        let sumValue = _computeSumValue(superPositionCount)

        // state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => 1, usedGirl)
        state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => funcData.multiplyValue(factor, sumValue), usedGirl)

        state = funcData.GiantessBuildUtils.setDefenseFactor(state, funcData, (_, factor) => funcData.multiplyValue(factor, sumValue), usedGirl)
        state = funcData.GiantessBuildUtils.setAttackFactor(state, funcData, (_, factor) => funcData.dividValue(factor, sumValue), usedGirl)


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

        maxSuperPositionCount: 3,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            // switch (name) {
            //     case funcData.getGirlName():
            if (funcData.isGirl(name)) {
                state = funcData.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
                    // return initialScale + 10 * superPositionCount
                    return funcData.limitScale(state, usedGirl, initialScale + _computeChangedScale(state, funcData, usedGirl, superPositionCount))
                }, usedGirl, funcData.setGirlScale)


                sumValue = _computeSumValue(superPositionCount)

                state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => funcData.dividValue(factor, sumValue), usedGirl)

                state = funcData.GiantessBuildUtils.setDefenseFactor(state, funcData, (_, factor) => funcData.dividValue(factor, sumValue), usedGirl)
                state = funcData.GiantessBuildUtils.setAttackFactor(state, funcData, (_, factor) => funcData.multiplyValue(factor, sumValue), usedGirl)

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
        deapplyFunc: (state, funcData, name, usedGirl, superPositionCount: number, sumValue: number) => {
            return _func(state, (state, funcData, name, usedGirl, superPositionCount) => {
                state = funcData.GiantessBuildUtils.setInitialScaleAndUpdateScale(state, funcData, (state, initialScale) => {
                    // return initialScale - 10 * superPositionCount
                    return funcData.limitScale(state, usedGirl, initialScale - _computeChangedScale(state, funcData, usedGirl, superPositionCount))
                }, usedGirl, funcData.setGirlScale)

                return state
            }, funcData, name, usedGirl, superPositionCount)
        },
        removeFunc: (state, funcData, name, usedGirl, superPositionCount: number, value: number) => {
            return _func(state, (state, funcData, name, usedGirl, superPositionCount) => {
                state = funcData.GiantessBuildUtils.setAttribute(state, funcData, (girlValue) => {
                    return {
                        ...girlValue,
                        // initialScale: girlValue.initialScale - 10 * superPositionCount
                        initialScale: funcData.limitScale(state, usedGirl, girlValue.initialScale - _computeChangedScale(state, funcData, usedGirl, superPositionCount))
                    }
                }, usedGirl)


                state = funcData.refreshBiggerTime(state, usedGirl)

                state = funcData.playSmallerAnimation(state, (state) => {
                    state = funcData.refreshBiggerTime(state, usedGirl)

                    return Promise.resolve(state)
                }, usedGirl,
                    funcData.getGirlScale(state, usedGirl) - 10 * superPositionCount
                )

                return state
            }, funcData, name, usedGirl, superPositionCount)
        },
    }
}

export let getLastTime = (): secondUnit => +Infinity

export let getCharacterType = () => characterType.None

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

export let getDescription = (state, funcData) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description)

export let getTargetName = (api, usedGirl) => api.girl.buildNameByUsedGirl(usedGirl)

export let addBuff = (api: api, state: state, usedGirl) => {
    return api.addBuff(state, getName(), getTargetName(api, usedGirl), api.NullableUtils.return_(usedGirl), getLastTime(), 1, getCharacterType())
}