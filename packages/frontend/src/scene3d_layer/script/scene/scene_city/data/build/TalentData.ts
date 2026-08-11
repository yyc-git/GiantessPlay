import { modelName } from "../../little_man_data/ModelData"
import { mmdCharacter } from "../mmd/MMDData"
import { state } from "../../../../../type/StateType"
import { funcData } from "../FuncData"
import { characterType, usedGirl } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { TupleUtils } from "meta3d-jiehuo-abstract"

export enum giantessTalentName {
    // AddHp = "增加生命上限",
    // AddDefenseFactor = "增加防御力",
    // AddAttackFactor = "增加攻击力",
    // // AddCritRatioFactor = "增加暴击率",
    // // AddMissRatio = "增加闪避率",

    // AddLife = "可满血复活",

    // AddBiggerScale = "增加变大倍数",

    // AddActiveBiggerTime = "增加主动变大的持续时间",

    // AddPassiveBiggerIncreaseScale = "增加被动变大增加的倍数",

    // AddInitialScale = "增加初始倍数",

    AddHp = "Giantess_AddHp",
    AddDefenseFactor = "Giantess_AddDefenseFactor",
    AddAttackFactor = "Giantess_AddAttackFactor",
    // AddCritRatioFactor ,
    // AddMissRatio ,
    AddCritRatioFactor = "Giantess_AddCritRatioFactor",
    AddLuck = "Giantess_AddLuck",
    SubRestoreHpTime = "Giantess_SubRestoreHpTime",
    AddRestoreHpSpeedRate = "Giantess_AddRestoreHpSpeedRate",

    AddLife = "Giantess_AddLife",

    AddBiggerScale = "Giantess_AddBiggerScale",

    AddActiveBiggerTime = "Giantess_AddActiveBiggerTime",

    AddPassiveBiggerIncreaseScale = "Giantess_AddPassiveBiggerIncreaseScale",

    AddDamageBiggerIncreaseScale = "Giantess_AddDamageBiggerIncreaseScale",

    AddInitialScale = "Giantess_AddInitialScale",

    SubDurationFactor = "Giantess_SubDurationFactor",

    Strong = "Giantess_Strong",
    AddArmor = "Giantess_AddArmor",
}

export enum littleManTalentName {
    // AddHp = "增加生命上限",
    // AddDefenseFactor = "增加防御力",
    // AddArmor = "加强盔甲",
    // AddAttackFactor = "增加攻击力",
    // // AddCritRatioFactor = "增加暴击率",
    // // AddMissRatio = "增加闪避率",

    // // AddEmitSpeedFactor = "增加射速",
    // // AddMoveSpeed = "增加移动速度",
    // AddEmitterLifeFactor = "增加射程",

    // AddLife = "可满血复活",
    // Strong = "霸体",


    AddHp = "LittleMan_AddHp",
    AddDefenseFactor = "LittleMan_AddDefenseFactor",
    AddArmor = "LittleMan_AddArmor",
    AddAttackFactor = "LittleMan_AddAttackFactor",
    AddCritRatioFactor = "LittleMan_AddCritRatioFactor",
    AddLuck = "LittleMan_AddLuck",
    SubRestoreHpTime = "LittleMan_SubRestoreHpTime",
    AddRestoreHpSpeedRate = "LittleMan_AddRestoreHpSpeedRate",
    // AddMissRatio ,

    // AddEmitSpeedFactor ,
    AddMoveSpeed = "LittleMan_AddMoveSpeed",
    AddEmitterLifeFactor = "LittleMan_AddEmitterLifeFactor",

    AddLife = "LittleMan_AddLife",
    Strong = "LittleMan_Strong",

}


export type singleTalentData = {
    name: giantessTalentName | littleManTalentName,
    title: string,

    characterType: characterType,
    imageSrc: string,

    character?: modelName | mmdCharacter,

    phase: number,

    // description: string,

    // ratioOfOneLevel: nullable<number>,
    // numberOfOneLevel: nullable<number>,

    level: number,
    maxLevel: number,

    base: number,

    getGemFunc: (level: number, maxLevel: number, base: number, characterType: characterType) => number,
    getDescriptionFunc: (state: state, funcData: funcData, level: number) => string,
    applyFunc: (state: state, funcData: funcData, usedGirl: usedGirl, level: number) => Promise<state>,
}


export type singleTalentDataBackend = {
    name: giantessTalentName | littleManTalentName,

    level: number,
    character: modelName | mmdCharacter,
}

export type talentData = Array<singleTalentData>

export type talentDataBackend = Array<singleTalentDataBackend>

let _getGem = (level: number, maxLevel: number, base: number, characterType_) => {
    // const step = 0.2

    // let factor
    // if (level <= maxLevel * step) {
    //     factor = 1
    // }
    // else if (level <= maxLevel * step * 2) {
    //     // factor = 2
    //     factor = 1.5
    // }
    // else if (level <= maxLevel * step * 3) {
    //     // factor = 4
    //     factor = 2.5
    // }
    // else if (level <= maxLevel * step * 4) {
    //     // factor = 10
    //     factor = 5
    // }
    // else {
    //     // factor = 20
    //     factor = 10
    // }

    // TODO remove
    // factor = NumberUtils.greaterThan(factor / 5, 1)
    // factor = Math.max(factor / 5, 1)
    // factor = 1

    // return Math.round(base * factor * level)

    // if (characterType_ == characterType.Giantess) {
    //     base = Math.round(base * 0.8)
    // }


    const data = {
        // step: 0.2,
        step: 0.1,
        // factor: [1, 1.5, 2.5, 5, 8]
        // factor: [1, 2, 4, 7, 11]
        // factor: [1, 2, 3.5, 5.5, 8]
        // factor: [1, 2, 4, 6.5, 10]
        // factor: [1, 2, 3, 4, 5]
        // factor: [1, 1.5, 2, 2.5, 3]
        // factor: [1, 1.2, 1.4, 1.6, 1.8]
        // factor: [1, 1.1, 1.2, 1.3, 1.4]
        // factor: [1, 1, 1, 1, 1]
        // factor: [0.6, 0.7, 0.8, 0.9, 1]
        // factor: [0.7, 0.8, 0.9, 1]
        // factor: [1, 1, 1.1, 1.2]
        factor: [1, 1, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.3]
        // factor: [1, 1.3, 1.6, 2]
    }

    // if (level <= maxLevel * 0.2) {
    if (level <= maxLevel * data.step) {
        return base
    }

    // let maxFactor = NumberUtils.greaterThan(maxLevel / 2, 20)
    // let maxFactor = NumberUtils.greaterThan(maxLevel / 1.8, 20)
    let maxFactor = NumberUtils.greaterThan(maxLevel / 1.3, 20)

    return Math.round(NumberUtils.lessThan(
        Math.round(TupleUtils.getTuple2First(data.factor.reduce<[number, boolean]>(([result, isEnd], factor, i) => {
            if (isEnd) {
                return [result, isEnd]
            }

            i += 1

            let step = data.step

            let f = maxLevel * step

            if (level >= f * (i + 1)) {
                return [result + base * f * factor, false]
            }

            return [result + base * (level - f * i) * factor, true]
        }, [0, false])))
        , base * maxFactor))
}

export let getTalentData = (state: state): talentData => {
    return [
        {
            name: giantessTalentName.AddHp,
            title: getLanguageTextData(state, languageKey.AddGiantessHp),
            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 30,
            // maxLevel: 100,
            // maxLevel: 80,
            maxLevel: 60,

            // base: 25,
            // base: 50,
            base: 70,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加${level * 10}%生命上限`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessHp)(NumberUtils.convertDecimalToPercent(level / 20))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
                    return hp * (1 + level / 20)
                    // }, true, usedGirl))
                }, true, usedGirl))
                // return Promise.resolve(funcData.GiantessBuildUtils.setGiantessAttributes(state, funcData,
                //     (state, usedGirl_) => {
                //         return funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
                //             return hp * (1 + level / 20)
                //         }, true, usedGirl_)
                //     }
                // ))
            }
        },
        {
            name: giantessTalentName.AddDefenseFactor,
            title: getLanguageTextData(state, languageKey.AddGiantessDefenseFactor),
            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 10,
            // maxLevel: 20,
            // maxLevel: 100,
            maxLevel: 75,
            // base: 50,
            base: 75,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加${level / 50}点防御力`
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessDefenseFactor)(level / 50)
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessDefenseFactor)(NumberUtils.convertDecimalToPercent(level / 50))
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessDefenseFactor)(NumberUtils.convertDecimalToPercent(level / 10))
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessDefenseFactor)(NumberUtils.convertDecimalToPercent(level / 25))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setDefenseFactor(state, funcData, (state, defenseFactor) => {
                    // return defenseFactor + level / 50
                    // return defenseFactor * (1 + level / 10)
                    return defenseFactor * (1 + level / 25)
                }, usedGirl))
            }
        },
        {
            name: giantessTalentName.AddAttackFactor,
            title: getLanguageTextData(state, languageKey.AddGiantessAttackFactor),
            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 10,
            // maxLevel: 20,
            maxLevel: 50,
            // maxLevel: 100,
            // base: 50,
            // base: 40,
            base: 75,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加${level / 10}点攻击力`
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessAttackFactor)(level / 10)
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessAttackFactor)(NumberUtils.convertDecimalToPercent(level / 10))
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessAttackFactor)(NumberUtils.convertDecimalToPercent(level / 25))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setAttackFactor(state, funcData, (state, attackFactor) => {
                    // return attackFactor * (1 + level / 10)
                    return attackFactor * (1 + level / 25)
                }, usedGirl))
            }
        },
        {
            name: giantessTalentName.AddCritRatioFactor,
            title: getLanguageTextData(state, languageKey.AddGiantessCritRatioFactor),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 20,
            maxLevel: 50,
            base: 50,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessCritRatioFactor)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setCritRatioFactor(state, funcData, (state, value) => {
                    return value * (1 + level / 10)
                }, usedGirl))
            }
        },

        {
            name: giantessTalentName.AddActiveBiggerTime,
            title: getLanguageTextData(state, languageKey.AddActiveBiggerTime),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 20,
            maxLevel: 50,
            base: 100,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加主动变大的持续时间${Math.round(funcData.getBiggerTimeRatio(level) * 100)}%`
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddActiveBiggerTime)(Math.round(funcData.getBiggerTimeRatio(level) * 100))
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddActiveBiggerTime)(Math.round(funcData.getBiggerTimeRatio(level / 2.5) * 100))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.addBiggerTime(state, level / 2.5, usedGirl))
            }
        },

        {
            name: giantessTalentName.AddPassiveBiggerIncreaseScale,
            title: getLanguageTextData(state, languageKey.AddPassiveBiggerIncreaseScale),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 10,
            maxLevel: 50,
            base: 100,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加被动变大增加的倍数${Math.round(funcData.getScaleRatio(level) * 100)}%`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddPassiveBiggerIncreaseScale)(Math.round(funcData.getScaleRatio(level / 5) * 100))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.setExcitementFactorLevel(state, level / 5))
            }
        },
        {
            name: giantessTalentName.AddDamageBiggerIncreaseScale,
            title: getLanguageTextData(state, languageKey.AddDamageBiggerIncreaseScale),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 10,
            maxLevel: 50,
            base: 100,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加被动变大增加的倍数${Math.round(funcData.getScaleRatio(level) * 100)}%`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddDamageBiggerIncreaseScale)(Math.round(funcData.getScaleRatio(level / 5) * 100))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.setDamageBiggerFactorLevel(state, level / 5))
            }
        },

        {
            name: giantessTalentName.AddBiggerScale,
            title: getLanguageTextData(state, languageKey.AddBiggerScale),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 20,
            maxLevel: 50,
            // base: 150,
            base: 200,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加变大倍数${Math.round(funcData.getScaleRatio(level) * 100)}%`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddBiggerScale)(Math.round(funcData.getScaleRatio(level / 2.5) * 100))

            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.addScaleIncrease(state, level / 2.5, usedGirl))
            }
        },
        {
            name: giantessTalentName.AddInitialScale,
            title: getLanguageTextData(state, languageKey.AddInitialScale),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 10,
            maxLevel: 50,
            base: 150,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加初始倍数${Math.round(funcData.getScaleRatio(level) * 100)}%`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddInitialScale)(Math.round(funcData.getScaleRatio(level / 5) * 100))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.addInitialScale(state, level / 5, usedGirl))
            }
        },
        {
            name: giantessTalentName.Strong,
            title: getLanguageTextData(state, languageKey.GiantessStrong),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            maxLevel: 50,
            base: 100,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.GiantessStrong)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setStressingRateFactor(state, funcData, (_, value) => {
                    return value / (1 + level / 10)
                }, usedGirl))
            }
        },
        {
            name: giantessTalentName.AddArmor,
            title: getLanguageTextData(state, languageKey.AddGiantessArmor),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 5,
            maxLevel: 30,
            // base: 200,
            base: 150,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessArmor)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.increaseArmor(state, funcData, level, usedGirl))
            }
        },
        {
            name: giantessTalentName.SubRestoreHpTime,
            title: getLanguageTextData(state, languageKey.SubPlayerRestoreHp),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            maxLevel: 50,
            base: 150,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.SubGiantessRestoreHpTime)(NumberUtils.convertDecimalToPercent(level / 80))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setRestoreHpTime(state, funcData, (state, value) => {
                    return value * (1 - level / 80)
                }, usedGirl))
            }
        },
        {
            name: giantessTalentName.AddRestoreHpSpeedRate,
            title: getLanguageTextData(state, languageKey.AddGiantessRestoreHpSpeedRate),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            maxLevel: 50,
            base: 150,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessRestoreHpSpeedRate)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setRestoreHpSpeedRate(state, funcData, (state, value) => {
                    return value * (1 + level / 10)
                }, usedGirl))
            }
        },

        {
            name: giantessTalentName.AddLife,
            title: getLanguageTextData(state, languageKey.AddGiantessLife),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 3,

            level: 0,
            // maxLevel: 3,
            maxLevel: 2,
            // base: 500,
            base: 50000,
            // base: 30000,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `可满血复活${level}次`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessLife)(level)
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.setLifeCount(state, level, funcData.characterType.Giantess))
            }
        },
        {
            name: giantessTalentName.SubDurationFactor,
            title: getLanguageTextData(state, languageKey.SubDurationFactor),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 3,

            level: 0,
            // maxLevel: 30,
            // maxLevel: 50,
            maxLevel: 75,
            // base: 200,
            base: 500,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.SubDurationFactor)(NumberUtils.convertDecimalToPercent(level / 50))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setDurationFactor(state, funcData, value => {
                    return value / (1 + level / 50)
                }, usedGirl))
            }
        },
        {
            name: giantessTalentName.AddLuck,
            title: getLanguageTextData(state, languageKey.AddGiantessLuck),

            characterType: characterType.Giantess,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 3,

            level: 0,
            // maxLevel: 10,
            maxLevel: 50,
            base: 300,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessLuck)(NumberUtils.convertDecimalToPercent(level / 10))
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessLuck)(NumberUtils.convertDecimalToPercent(level / 50))
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddGiantessLuck)(NumberUtils.convertDecimalToPercent(level / 100))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.GiantessBuildUtils.setLuck(state, funcData, (state, value) => {
                    // return value * (1 + level / 50)
                    return value * (1 + level / 100)
                }, usedGirl))
            }
        },




        {
            name: littleManTalentName.AddHp,
            title: getLanguageTextData(state, languageKey.AddLittleManHp),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 100,
            maxLevel: 80,
            // base: 25,
            // base: 50,
            base: 70,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加${level * 20}%生命上限`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManHp)(NumberUtils.convertDecimalToPercent(level / 20))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setHp(state, funcData, (state, hp) => {
                    // return hp * (1 + level / 5)
                    return hp * (1 + level / 20)
                }, true))
            }
        },
        {
            name: littleManTalentName.AddEmitterLifeFactor,
            title: getLanguageTextData(state, languageKey.AddEmitterLifeFactor),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 10,
            maxLevel: 50,
            base: 50,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加${level * 10}%射程`
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddEmitterLifeFactor)(level * 10)
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddEmitterLifeFactor)(NumberUtils.convertDecimalToPercent(level / 50))

            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setEmitterLifeFactor(state, funcData, (_, value) => {
                    return value * (1 + level / 50)
                }))
            }
        },
        {
            name: littleManTalentName.AddDefenseFactor,
            title: getLanguageTextData(state, languageKey.AddLittleManDefenseFactor),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 10,
            // maxLevel: 20,
            // maxLevel: 100,
            maxLevel: 75,
            // base: 50,
            // base: 100,
            base: 75,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加${level / 50}点防御力`
                // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManDefenseFactor)(NumberUtils.convertDecimalToPercent(level / 10))
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManDefenseFactor)(NumberUtils.convertDecimalToPercent(level / 25))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setDefenseFactor(state, funcData, (state, defenseFactor) => {
                    // return defenseFactor * (1 + level / 10)
                    return defenseFactor * (1 + level / 25)
                }))
            }
        },
        {
            name: littleManTalentName.AddAttackFactor,
            title: getLanguageTextData(state, languageKey.AddLittleManAttackFactor),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 10,
            // maxLevel: 100,
            // maxLevel: 100,
            maxLevel: 50,
            // base: 40,
            // base: 80,
            base: 75,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `增加${level / 50}点攻击力`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManAttackFactor)(NumberUtils.convertDecimalToPercent(level / 25))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setAttackFactor(state, funcData, (state, attackFactor) => {
                    // return attackFactor + level / 50
                    return attackFactor * (1 + level / 25)
                }))
            }
        },
        {
            name: littleManTalentName.AddCritRatioFactor,
            title: getLanguageTextData(state, languageKey.AddLittleManCritRatioFactor),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 1,

            level: 0,
            // maxLevel: 10,
            // maxLevel: 20,
            maxLevel: 50,
            base: 50,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManCritRatioFactor)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setCritRatioFactor(state, funcData, (state, value) => {
                    return value * (1 + level / 10)
                }))
            }
        },

        {
            name: littleManTalentName.Strong,
            title: getLanguageTextData(state, languageKey.LittleManStrong),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 50,
            maxLevel: 100,
            base: 100,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.LittleManStrong)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setStressingRateFactor(state, funcData, (_, value) => {
                    return value / (1 + level / 10)
                }))
            }
        },
        {
            name: littleManTalentName.AddArmor,
            title: getLanguageTextData(state, languageKey.AddLittleManArmor),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            // maxLevel: 5,
            maxLevel: 30,
            // base: 200,
            base: 150,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManArmor)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.increaseArmor(state, funcData, level))
            }
        },
        {
            name: littleManTalentName.SubRestoreHpTime,
            title: getLanguageTextData(state, languageKey.SubLittleManRestoreHpTime),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            maxLevel: 50,
            base: 150,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.SubLittleManRestoreHpTime)(NumberUtils.convertDecimalToPercent(level / 80))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setRestoreHpTime(state, funcData, (state, value) => {
                    return value * (1 - level / 80)
                }))
            }
        },
        {
            name: littleManTalentName.AddRestoreHpSpeedRate,
            title: getLanguageTextData(state, languageKey.AddLittleManRestoreHpSpeedRate),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 2,

            level: 0,
            maxLevel: 50,
            base: 150,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManRestoreHpSpeedRate)(NumberUtils.convertDecimalToPercent(level / 10))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setRestoreHpSpeedRate(state, funcData, (state, value) => {
                    return value * (1 + level / 10)
                }))
            }
        },

        {
            name: littleManTalentName.AddLife,
            title: getLanguageTextData(state, languageKey.AddLittleManLife),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 3,

            level: 0,
            // maxLevel: 5,
            maxLevel: 3,
            // base: 500,
            base: 50000,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                // return `可满血复活${level}次`
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManLife)(level)
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.setLifeCount(state, level, funcData.characterType.LittleMan))
            }
        },
        {
            name: littleManTalentName.AddMoveSpeed,
            title: getLanguageTextData(state, languageKey.AddMoveSpeed),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 3,

            level: 0,
            // maxLevel: 10,
            // maxLevel: 50,
            maxLevel: 60,
            // base: 200,
            base: 300,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddMoveSpeed)(NumberUtils.convertDecimalToPercent(level / 30))

            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setMoveSpeed(state, funcData, (_, value) => {
                    return value * (1 + level / 30)
                }))
            }
        },
        {
            name: littleManTalentName.AddLuck,
            title: getLanguageTextData(state, languageKey.AddLittleManLuck),

            characterType: characterType.LittleMan,

            imageSrc: "./resource/ui/not_in_game/new.png",

            phase: 3,

            level: 0,
            // maxLevel: 10,
            maxLevel: 50,
            base: 300,

            getGemFunc: _getGem,
            getDescriptionFunc: (state: state, funcData, level: number) => {
                return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.AddLittleManLuck)(NumberUtils.convertDecimalToPercent(level / 100))
            },
            applyFunc: (state, funcData, usedGirl, level) => {
                return Promise.resolve(funcData.LittleManBuildUtils.setLuck(state, funcData, (state, value) => {
                    return value * (1 + level / 100)
                }))
            }
        },
    ]
}