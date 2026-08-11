import { singleBuffData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData"
import { getBlockName, getProtocolName } from "../script/Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { api } from "type-api/src/Type"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "buff-protocol/src/state/StateType"

// let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let computeValue = (level) => {
    // return [0.1 * level, 0.25 * level]
    return [0.05 * level, 0.15 * level]
    // return [0.2 * level, 0.25 * level]
}


// export let getSoundPath = (name) => _getPath(name, "mp3")


export let getName = () => "Buff_Emit_Defense_DoorShield"

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

        maxSuperPositionCount: 3,

        getDescriptionFunc: (state, funcData, superPositionCount: number, value: number) => funcData.getLanguageDataByData(state, _getTextData(), languageKey.Description),

        applyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let d = computeValue(superPositionCount)
            sumValue = d[0]

            switch (name) {
                case funcData.getLittleManName():
                    state = funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, moveSpeed) => moveSpeed * (1 - sumValue), name)
                    break
                // case funcData.getGirlName():
                //     break
                default:
                    if (funcData.isGirl(name)) {
                        state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor * (1 / (1 - sumValue)), usedGirl_)
                    }
                    else {
                        state = funcData.ArmyBuildUtils.setMoveSpeed(state, funcData, (_, moveSpeed) => moveSpeed * (1 - sumValue), name)
                    }
                    break
            }

            // state = funcData.block.setBlockState(state, getProtocolName(), getBlockName(),
            //     {
            //         ...funcData.block.getBlockState(state, getProtocolName(), getBlockName()),
            //         oldValue: funcData.NullableUtils.return_(superPositionCount)
            //     }
            // )

            return Promise.resolve(state)
        },
        deapplyFunc: (state, funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
            let d = computeValue(superPositionCount)
            sumValue = d[0]

            switch (name) {
                case funcData.getLittleManName():
                    state = funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, moveSpeed) => moveSpeed / (1 - sumValue), name)
                    break
                // case funcData.getGirlName():
                // break
                default:
                    if (funcData.isGirl(name)) {
                        state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => factor / (1 / (1 - sumValue)), usedGirl_)
                    }
                    else {
                        state = funcData.ArmyBuildUtils.setMoveSpeed(state, funcData, (_, moveSpeed) => moveSpeed / (1 - sumValue), name)
                    }
                    break
            }

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

export let getLastTime = (): secondUnit => +Infinity

export let getCharacterType = () => characterType.BothOrNone

export let isPositive = () => true

export let getImageSrc = () => `./${getBlockName()}/src/asset/buff.png`

// export let getSoundResourcePath = () => getSoundPath("sound")

// export let getSoundResourceId = getSoundResourcePath

export let addBuff = (api: api, state: state, targetName, usedGirl, count) => {
    // state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
    //     {
    //         ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
    //         startTime: api.getNow(state),
    //         customData: {
    //             lastTime: lastTime,
    //         }
    //     }
    // )

    return api.addBuff(state, getName(), targetName, usedGirl, getLastTime(), count, getCharacterType())
}