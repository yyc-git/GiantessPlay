import { characterType, name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { secondUnit, usedGirl,usedGirlEnum } from "../../type/StateType"
import { state } from "../../../../../type/StateType"
import { setMoveSpeed } from "../../utils/build/LittleManBuildUtils"
import { funcData } from "../FuncData"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import * as LittleMan from "../../little_man/LittleMan"
// import * as LittleMan from "../../little_man/LittleMan"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import * as Girl from "../../girl/Girl"
import { getLanguageTextVariableData, languageVariableKey } from "../../../../../internation/Data"
import { addToBuffData } from "../../../../../mod/BuffMod"
import { buildPercentDescription, dividValue, multiplyValue } from "../utils/BufferUtils"

export enum buffName {
    IncreaseMoveSpeed = "Buff_IncreaseMoveSpeed",
    IncreaseActionSpeed = "Buff_IncreaseActionSpeed",
    DecreaseActionSpeed = "Buff_DecreaseActionSpeed",
    IncreaseDefenseFactor = "Buff_IncreaseDefenseFactor",

    ClearHatred = "Buff_ClearHatred",

    // Strong = "Buff_Strong",
}

// export enum target {
//     LittleMan = "LittleMan",
//     PlayerGirl = "PlayerGirl",

//     Army = "Army",

//     WildGiantess = "WildGiantess",
//     BossGiantess = "BossGiantess",

//     // OtherGirl,
// }

export type singleBuffData = {
    name: buffName | string,
    imageSrc: string,

    isPositive: boolean,

    characterType: characterType,
    // target: target,

    // superPositionCount: number,
    // time: secondUnit,
    maxSuperPositionCount: number,

    // sumValue?: number,
    value?: number,

    isWorkInContinueLevels?: boolean,

    // applyLittleManFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,
    // deapplyLittleManFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,

    // applyPlayerGirlFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,
    // deapplyPlayerGirlFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,

    // applyArmyFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,
    // deapplyArmyFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,

    // applyOtherGirlFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,
    // deapplyOtherGirlFunc?: (state: state, funcData: funcData, name: buffName, superPositionCount: number, time: secondUnit) => Promise<state>,

    getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => string,

    applyFunc: (state: state, funcData: funcData, name: name, usedGirl: nullable<usedGirl>, superPositionCount: number, sumValue: number) => Promise<state>,
    deapplyFunc: (state: state, funcData: funcData, name: name, usedGirl: nullable<usedGirl>, superPositionCount: number, sumValue: number) => Promise<state>,

    removeFunc?: (state: state, funcData: funcData, name: name, usedGirl: nullable<usedGirl>, superPositionCount: number, sumValue: number) => Promise<state>,

}

export type buffData = Array<singleBuffData>

export let getBuffData = (state): buffData => {
    return addToBuffData(state, [
        {
            name: buffName.IncreaseMoveSpeed,
            imageSrc: "./resource/ui/in_game/buff/increase_movespeed.png",

            isPositive: true,

            value: 0.1,

            characterType: characterType.LittleMan,

            // // target: target.LittleMan,

            // // superPositionCount: number,
            maxSuperPositionCount: 10,
            // time: 30,

            getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => getLanguageTextVariableData(state, languageVariableKey.IncreaseMoveSpeedBuffDescription)(buildPercentDescription(sumValue)),

            applyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                let func

                switch (name) {
                    case LittleMan.getName():
                        func = funcData.LittleManBuildUtils.setMoveSpeed
                        break
                    default:
                        if (funcData.isArmy(state, name)) {
                            func = funcData.ArmyBuildUtils.setMoveSpeed
                        }
                        else {
                            return Promise.resolve(state)
                        }

                        break
                }

                state = func(state, funcData, (_, moveSpeed) => {
                    return multiplyValue(moveSpeed, sumValue)
                }, name)

                return Promise.resolve(state)
            },
            deapplyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                let func
                switch (name) {
                    case LittleMan.getName():
                        func = funcData.LittleManBuildUtils.setMoveSpeed
                        break
                    default:
                        if (funcData.isArmy(state, name)) {
                            func = funcData.ArmyBuildUtils.setMoveSpeed
                        }
                        else {
                            return Promise.resolve(state)
                        }

                        break
                }


                state = func(state, funcData, (_, moveSpeed) => {
                    return dividValue(moveSpeed, sumValue)
                }, name)

                return Promise.resolve(state)
            },
        },

        {
            name: buffName.IncreaseDefenseFactor,
            imageSrc: "./resource/ui/in_game/buff/increase_defense.png",

            isPositive: true,

            characterType: characterType.None,

            value: 0.1,

            maxSuperPositionCount: 10,
            // maxSuperPositionCount: 3,

            // getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => `提升${buildPercentDescription( sumValue)}防御力`,
            getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => getLanguageTextVariableData(state, languageVariableKey.IncreaseDefenseFactorDescription)(buildPercentDescription(sumValue)),

            applyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                let func


                if (funcData.isArmy(state, name)) {
                    func = funcData.ArmyBuildUtils.setDefenseFactor
                }
                else {
                    throw new Error("err")
                }

                state = func(state, funcData, (_, defenseFactor) => {
                    return multiplyValue(defenseFactor, sumValue)
                }, name)
                // // state = func(state, funcData, (_, color) => {
                // //     return [
                // //         color.r + 1,
                // //         color.g,
                // //         color.b
                // //     ]
                // // }, name)
                // state = func(state, funcData, name, [1, 0, 0])

                return Promise.resolve(state)
            },
            deapplyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                let func

                if (funcData.isArmy(state, name)) {
                    func = funcData.ArmyBuildUtils.setDefenseFactor
                }
                else {
                    throw new Error("err")
                }

                state = func(state, funcData, (_, defenseFactor) => {
                    return dividValue(defenseFactor, sumValue)
                }, name)
                // // state = func(state, funcData, (_, color) => {
                // //     return [
                // //         color.r - 1,
                // //         color.g,
                // //         color.b
                // //     ]
                // // }, name)
                // state = func(state, funcData, name, [-1, 0, 0])

                return Promise.resolve(state)
            },
        },

        {
            name: buffName.ClearHatred,
            imageSrc: "./resource/ui/in_game/buff/clear_hatred.png",

            isPositive: true,

            characterType: characterType.LittleMan,

            value: 0,

            maxSuperPositionCount: 1,

            // getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => `清除仇恨，持续${superPositionCount}秒`,
            getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => getLanguageTextVariableData(state, languageVariableKey.ClearHatredDescription)(superPositionCount),

            applyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                switch (name) {
                    case LittleMan.getName():
                        state = funcData.setIsNotAttackLittleManTime(state, NullableUtils.return_(funcData.getNow(state)))
                        break
                    default:
                        throw new Error("err")
                }

                return Promise.resolve(state)
            },
            deapplyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                switch (name) {
                    case LittleMan.getName():
                        state = funcData.setIsNotAttackLittleManTime(state, NullableUtils.getEmpty())
                        break
                    default:
                        throw new Error("err")
                }

                return Promise.resolve(state)
            },
        },



        {
            name: buffName.IncreaseActionSpeed,
            // TODO update image
            imageSrc: "./resource/ui/in_game/buff/decrease_actionspeed.png",

            isPositive: true,

            characterType: characterType.Giantess,

            value: 0.2,

            maxSuperPositionCount: 10,

            // getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => `降低${buildPercentDescription( sumValue)}行动速度`,
            getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => getLanguageTextVariableData(state, languageVariableKey.IncreaseActionSpeedDescription)(buildPercentDescription(sumValue)),

            applyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                if (!NullableUtils.isNullable(usedGirl_)) {
                    // state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => multiplyValue(factor,  sumValue), NullableUtils.getExn(usedGirl_))
                    state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => dividValue(factor, sumValue), NullableUtils.getExn(usedGirl_))

                    return Promise.resolve(state)
                }

                return Promise.resolve(state)
            },
            deapplyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                if (!NullableUtils.isNullable(usedGirl_)) {
                    state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, _ => 1, NullableUtils.getExn(usedGirl_))

                    return Promise.resolve(state)
                }

                return Promise.resolve(state)
            },
        },
        {
            name: buffName.DecreaseActionSpeed,
            imageSrc: "./resource/ui/in_game/buff/decrease_actionspeed.png",

            isPositive: false,

            characterType: characterType.Giantess,

            value: 0.2,

            maxSuperPositionCount: 10,

            // getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => `降低${buildPercentDescription( sumValue)}行动速度`,
            getDescriptionFunc: (state: state, funcData: funcData, superPositionCount: number, sumValue: number) => getLanguageTextVariableData(state, languageVariableKey.DecreaseActionSpeedDescription)(buildPercentDescription(sumValue)),

            applyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                if (!NullableUtils.isNullable(usedGirl_)) {
                    state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, factor => multiplyValue(factor, sumValue), NullableUtils.getExn(usedGirl_))

                    return Promise.resolve(state)
                }

                return Promise.resolve(state)
            },
            deapplyFunc: (state: state, funcData: funcData, name, usedGirl_, superPositionCount: number, sumValue: number) => {
                if (!NullableUtils.isNullable(usedGirl_)) {
                    state = funcData.GiantessBuildUtils.setDurationFactor(state, funcData, _ => 1, NullableUtils.getExn(usedGirl_))

                    return Promise.resolve(state)
                }

                return Promise.resolve(state)
            },
        }

    ])
}