import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { getConfigData, setConfigData } from "../../CityScene"
import { usedGirlEnum } from "../../type/StateType"
import { actionName, defenseFactor } from "../DataType"
import { funcData } from "../FuncData"
import { actionName as littleManActionName } from "../../little_man_data/DataType"
import { characterType, usedGirl } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { getFastRunBlockService, getSwipBlockService } from "../../../../../mod/SkillLittleManMod"
import { addToUpgradeData } from "../../../../../mod/UpgradeMod"

type upgradeFunc = (state: state, funcData: funcData, level: number, usedGirl: usedGirl) => Promise<state>

type removeFunc = (state: state, funcData: funcData, usedGirl: usedGirl) => Promise<state>

export enum upgradeType {
    Skill,
    Attack,
    Defense,
    Assistant,
    Other,

    All,
}

export enum giantessUpgradeName {
    // LearnRun = "跑（站姿势）",
    // LearnBigger = "主动变大",
    // LearnStandToCrawlAndCrawlToStand = "趴",
    // // LearnCrawlMove = "爬行（趴姿势）",
    // LearnBreastPress = "胸压（趴姿势）",
    // LearnPickAndPickdown = "抓",
    // LearnPinch = "手握（抓姿势）",
    // LearnEat = "吃（抓姿势）",

    // ChangeToPassiveBigger = "使用被动变大",

    // EnhanceBigger = "增加变大倍数",


    // MoveAndStompDamageEnhance = "移动伤害加强",

    // OldSoldier_Giantess = "战场老兵（巨大娘）",

    // LuckDog_Giantess = "幸运儿（巨大娘）",

    // LearnRun,
    LearnBigger,
    LearnStandToCrawlAndCrawlToStand,
    // LearnCrawlMove ,
    // LearnBreastPress,
    LearnPickAndPickdown,
    LearnPinch,
    LearnEat,

    // ChangeToPassiveBigger,

    EnhanceBigger,


    // MoveAndStompDamageEnhance,

    OldSoldier_Giantess,

    LuckDog_Giantess,

}

export enum littleManUpgradeName {
    // // AddDefense = "加强防御",
    // LearnBlink = "闪烁",
    // LearnSwip = "重击",


    // ComboStorm = "连击风暴",
    // ClothDamageEnhance = "衣服伤害加强",


    // FragileGrowth = "脆弱生息",

    // OldSoldier_Little = "战场老兵（小人）",

    // LuckDog_Little = "幸运儿（小人）",

    // AddDefense ,
    LearnBlink,
    LearnSwip,
    LearnFastRun,


    ComboStorm,
    ClothDamageEnhance,


    FragileGrowth,
    Crazy,

    OldSoldier_Little,

    LuckDog_Little,
}


export type upgradeStoreData = {
    name: giantessUpgradeName | littleManUpgradeName,
    title: string,
    imageSrc: string,


    type: upgradeType,

    level: number,
    maxLevel: number,

    // characterLevel: number,

    description: string,

    // usedGirl: usedGirl,

    // getDescriptionFunc: (state: state, level: number) => string,
    // upgradeFunc: upgradeFunc,
    // conditionFunc: (state: state, { characterLevel }: any) => boolean,
}

export type upgradeName = giantessUpgradeName | littleManUpgradeName | string

export type upgradeFuncData = {
    name: upgradeName,
    title: string,
    imageSrc: string,


    type: upgradeType,

    level: number,
    maxLevel: number,

    getDescriptionFunc: (state: state, funcData: funcData, level: number) => string,
    upgradeFunc: upgradeFunc,
    deupgradeFunc?: upgradeFunc,
    removeFunc?: removeFunc,

    conditionFunc: (state: state, funcData: funcData, { level, characterLevel }: { level: number, characterLevel: number }) => boolean,
}

export type buildData = {
    littleManUpgradeFuncs: Array<upgradeFuncData>,
    giantessUpgradeFuncs: Array<upgradeFuncData>,
}

export enum levelRequire {
    Zero = 0,
    Low = 3,
    Middle2 = 5,
    Middle1 = 7,
    Middle = 10,
    High = 20,
    VeryHigh = 30,
    VeryHigh2 = 40,
}

export let getBuildData = (state: state): buildData => {
    return addToUpgradeData(state, {
        littleManUpgradeFuncs: [
            // {
            //     name: littleManUpgradeName.AddDefense,
            //     type: upgradeType.Defense,
            //     imageSrc: "./resource/ui/not_in_game/new.png",

            //     level: 0,
            //     maxLevel: 3,

            //     conditionFunc: (state, funcData, d) => {
            //         return true
            //     },
            //     getDescriptionFunc: (state, funcData, level) => {
            //         return `提升${level * 100}%防御力`
            //     },
            //     upgradeFunc: (state, funcData, level, usedGirl) => {
            //         return funcData.LittleManBuildUtils.setDefenseFactor(state, funcData, (_, defenseFactor) => {
            //             return defenseFactor * (1 + level)
            //         })
            //     },
            //     deupgradeFunc: (state, funcData, level, usedGirl) => {
            //         return funcData.LittleManBuildUtils.setDefenseFactor(state, funcData, (_, defenseFactor) => {
            //             return defenseFactor / (1 + level)
            //         })
            //     },
            // },
            {
                name: littleManUpgradeName.LearnBlink,
                title: getLanguageTextData(state, languageKey.LearnBlink),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return true
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `学习“闪烁”技能`
                    return ``
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    return Promise.resolve(funcData.LittleManBuildUtils.studyActions(state, funcData, [littleManActionName.Blink]))
                },
            },
            {
                name: littleManUpgradeName.LearnSwip,
                title: getLanguageTextData(state, languageKey.LearnSwip),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return true
                },
                getDescriptionFunc: (state, funcData, level) => {
                    return ``
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    // return Promise.resolve(funcData.LittleManBuildUtils.studyActions(state, funcData, [littleManActionName.Swiping]))
                    return Promise.resolve(funcData.LittleManBuildUtils.studyActions(state, funcData, [
                        getSwipBlockService(state).getActionName()
                    ]))
                },
            },
            {
                name: littleManUpgradeName.LearnFastRun,
                title: getLanguageTextData(state, languageKey.LearnFastRun),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return true
                },
                getDescriptionFunc: (state, funcData, level) => {
                    return ``
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    // return Promise.resolve(funcData.LittleManBuildUtils.studyActions(state, funcData, [littleManActionName.Swiping]))
                    return Promise.resolve(funcData.LittleManBuildUtils.studyActions(state, funcData, [
                        getFastRunBlockService(state).getActionName()
                    ]))
                },
            },

            {
                name: littleManUpgradeName.ComboStorm,
                title: getLanguageTextData(state, languageKey.ComboStorm),

                type: upgradeType.Attack,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    // return true
                    return d.characterLevel >= levelRequire.High
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `每击中一次敌人,伤害增加10%,持续1秒,最多可以叠加99层`
                    // return funcData.getLanguageTextData(state, funcData.languageKey.ComboStorm)
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.ComboStorm)()
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setIsEnableComboStorm(state, true)

                    return Promise.resolve(state)
                },
                // deupgradeFunc: (state, funcData, level, usedGirl) => {
                //     state = funcData.setIsEnableComboStorm(state, false)

                //     return Promise.resolve(state)
                // },
            },

            {
                name: littleManUpgradeName.ClothDamageEnhance,
                title: getLanguageTextData(state, languageKey.ClothDamageEnhance),

                type: upgradeType.Attack,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 3,

                conditionFunc: (state, funcData, d) => {
                    return true
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `增加对巨大娘衣服的伤害${Math.round(funcData.getClothDamageEnhanceRatio(level) * 100)}%`
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.ClothDamageEnhance)(Math.round(funcData.getClothDamageEnhanceRatio(level) * 100))
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setClothDamageEnhanceLevel(state, level)

                    return Promise.resolve(state)
                },
                // deupgradeFunc: (state, funcData, level, usedGirl) => {
                //     state = funcData.setClothDamageEnhanceLevel(state, 0)

                //     return Promise.resolve(state)
                // },
            },


            // {
            //     name: littleManUpgradeName.FragileGrowth,
            //     title: getLanguageTextData(state, languageKey.FragileGrowth),

            //     type: upgradeType.Defense,
            //     imageSrc: "./resource/ui/not_in_game/new.png",

            //     level: 0,
            //     maxLevel: 3,

            //     conditionFunc: (state, funcData, d) => {
            //         // return d.characterLevel >= 3
            //         return d.characterLevel >= levelRequire.Low
            //     },
            //     getDescriptionFunc: (state, funcData, level) => {
            //         // return `获得伤害的${Math.round(funcData.getGetHpRatio(level) * 100)}%的生命汲取,但受到的伤害增加50%`
            //         return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.FragileGrowth)(Math.round(funcData.getGetHpRatio(level) * 100))
            //     },
            //     upgradeFunc: (state, funcData, level, usedGirl) => {
            //         state = funcData.setFragileGrowthLevel(state, level)

            //         return Promise.resolve(state)
            //     },
            // },
            {
                name: littleManUpgradeName.Crazy,
                title: getLanguageTextData(state, languageKey.Crazy),

                type: upgradeType.Attack,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                // maxLevel: 15,
                // maxLevel: 10,
                maxLevel: 8,
                // maxLevel: 5,

                conditionFunc: (state, funcData, d) => {
                    // return d.characterLevel >= levelRequire.Middle
                    return d.characterLevel >= levelRequire.Middle2
                },
                getDescriptionFunc: (state, funcData, level) => {
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.Crazy)([
                        Math.round(funcData.getDamageIncreaseRatio(level) * 100),
                        Math.round(funcData.getEmitSpeedIncreaseRatio(level) * 100)
                    ])
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setCrazyLevel(state, level)

                    return Promise.resolve(state)
                },
            },

            {
                name: littleManUpgradeName.OldSoldier_Little,
                title: getLanguageTextData(state, languageKey.OldSoldier_Little),

                type: upgradeType.Assistant,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 3,

                conditionFunc: (state, funcData, d) => {
                    // return true
                    // return d.characterLevel >= 3
                    return d.characterLevel >= levelRequire.Middle
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `每击败一个敌人生命上限增加1点`
                    // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.OldSoldier_Little)(level)
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.OldSoldier_Little)(level * 2)

                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setOldSoldierLevel(state, level, characterType.LittleMan)

                    if (funcData.getIsApplying(state)) {
                        state = funcData.LittleManBuildUtils.setHp(state, funcData, (state, hp) => {
                            return hp
                        }, true)
                    }


                    return Promise.resolve(state)
                },
            },

            {
                name: littleManUpgradeName.LuckDog_Little,
                title: getLanguageTextData(state, languageKey.LuckDog_Little),

                type: upgradeType.Assistant,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return d.characterLevel >= levelRequire.VeryHigh
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `被击败的敌人有20%概率会掉落双倍的基础奖励`
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.LuckDog_Little)()
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setIsEnableLuckDog(state, true, characterType.LittleMan)

                    return Promise.resolve(state)
                },
            },


        ],
        giantessUpgradeFuncs: [
            // {
            //     name: giantessUpgradeName.LearnRun,
            //     title: getLanguageTextData(state, languageKey.LearnRun),

            //     type: upgradeType.Skill,
            //     imageSrc: "./resource/ui/not_in_game/new.png",

            //     level: 0,
            //     maxLevel: 1,

            //     conditionFunc: (state, funcData, d) => {
            //         return true
            //     },
            //     getDescriptionFunc: (state, funcData, level) => {
            //         return ``
            //     },
            //     upgradeFunc: (state, funcData, level, usedGirl) => {
            //         return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [actionName.Run]))
            //     },
            // },

            {
                name: giantessUpgradeName.LearnBigger,
                title: getLanguageTextData(state, languageKey.LearnBigger),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/in_game/common_pose/bigger.png",

                level: 0,
                // maxLevel: 3,

                // maxLevel: 10,
                maxLevel: 3,

                conditionFunc: (state, funcData, d) => {
                    if (d.characterLevel <= levelRequire.Low) {
                        return false
                    }

                    // if (d.level == 1) {
                    //     // return funcData.getBiggerWay(state) != biggerWay.Active
                    //     return funcData.getBiggerWay(state) == biggerWay.None
                    // }

                    // return funcData.getBiggerWay(state) == biggerWay.Active

                    return true
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `最多变大${level}次`
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.LearnBigger)(level)

                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    // state = funcData.setMaxBiggerCount(state, level)

                    // switch (level) {
                    //     case 1:
                    //         return funcData.switchBiggerWay(state, biggerWay.Active)
                    //     default:
                    //         return Promise.resolve(state)
                    // }
                    // return funcData.switchBiggerWay(state, biggerWay.Active, level)
                    state = funcData.studyActiveBigger(state, level)

                    return Promise.resolve(state)
                },
                deupgradeFunc: (state, funcData, level, usedGirl) => {
                    return Promise.resolve(state)
                },
            },
            // {
            //     name: giantessUpgradeName.ChangeToPassiveBigger,
            //     title: getLanguageTextData(state, languageKey.ChangeToPassiveBigger),

            //     type: upgradeType.Skill,
            //     imageSrc: "./resource/ui/not_in_game/new.png",

            //     level: 0,
            //     // maxLevel: 3,
            //     maxLevel: 5,
            //     // maxLevel: 15,

            //     conditionFunc: (state, funcData, d) => {
            //         // if (d.characterLevel <= levelRequire.Middle) {
            //         if (d.characterLevel <= levelRequire.Low) {
            //             return false
            //         }

            //         if (d.level == 1) {
            //             // return funcData.getBiggerWay(state) != biggerWay.Passive
            //             return funcData.getBiggerWay(state) == biggerWay.None
            //         }

            //         return funcData.getBiggerWay(state) == biggerWay.Passive
            //     },
            //     getDescriptionFunc: (state, funcData, level) => {
            //         // return `最大变大上限为${funcData.GiantessBuildUtils.getPassiveMaxBiggerScaleByLevel(state, funcData, level)}倍。注：兴奋度低于10时,每隔20s高度会下降20%(最少10M)`
            //         return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.ChangeToPassiveBigger)(funcData.GiantessBuildUtils.getPassiveMaxBiggerScaleByLevel(state, funcData, level))

            //     },
            //     upgradeFunc: (state, funcData, level, usedGirl) => {
            //         // state = funcData.setMaxScale(
            //         //     state,
            //         //     funcData.GiantessBuildUtils.getPassiveMaxBiggerScaleByLevel(state, funcData, level)
            //         // )

            //         // switch (level) {
            //         //     case 1:
            //         //         return funcData.switchBiggerWay(state, biggerWay.Passive)
            //         //     default:
            //         //         return Promise.resolve(state)
            //         // }
            //         return funcData.switchBiggerWay(state, biggerWay.Passive, level)
            //     },
            //     deupgradeFunc: (state, funcData, level, usedGirl) => {
            //         return Promise.resolve(state)
            //     },
            // },
            {
                name: giantessUpgradeName.EnhanceBigger,
                title: getLanguageTextData(state, languageKey.EnhanceBigger),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 3,

                conditionFunc: (state, funcData, d) => {
                    if (d.characterLevel <= levelRequire.Middle) {
                        return false
                    }

                    // return funcData.getBiggerWay(state) == biggerWay.Active
                    return funcData.GiantessBuildUtils.hasStudyAction(state, funcData, actionName.Bigger)
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `变大倍数将为默认的${funcData.getEnhanceIncreaseScale(state, 10, level) / 10}倍，但持续时间将为默认的${funcData.getEnhanceBiggerFullTime(state, 100, level) / 100}倍`
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.EnhanceBigger)([funcData.getEnhanceIncreaseScale(state, 10, level) / 10, funcData.getEnhanceBiggerFullTime(state, 100, level) / 100])
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setBiggerEnhanceLevel(
                        state,
                        level
                    )

                    return Promise.resolve(state)
                },
                deupgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setBiggerEnhanceLevel(
                        state,
                        0
                    )

                    return Promise.resolve(state)
                },
            },



            {
                name: giantessUpgradeName.LearnStandToCrawlAndCrawlToStand,
                title: getLanguageTextData(state, languageKey.LearnStandToCrawlAndCrawlToStand),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/in_game/stand/standToCrawl.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return true
                },
                getDescriptionFunc: (state, funcData, level) => {
                    return getLanguageTextData(state, languageKey.LearnStandToCrawlAndCrawlToStandDescription)
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [actionName.StandToCrawl, actionName.CrawlToStand]))
                },
            },
            // {
            //     name: giantessUpgradeName.LearnBreastPress,
            //     title: getLanguageTextData(state, languageKey.LearnBreastPress),

            //     type: upgradeType.Skill,
            //     imageSrc: "./resource/ui/in_game/crawl/breastPress.png",

            //     level: 0,
            //     maxLevel: 1,

            //     conditionFunc: (state, funcData, d) => {
            //         return funcData.GiantessBuildUtils.hasStudyAction(state, funcData, actionName.StandToCrawl)
            //     },
            //     getDescriptionFunc: (state, funcData, level) => {
            //         return ``
            //     },
            //     upgradeFunc: (state, funcData, level, usedGirl) => {
            //         return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [actionName.BreastPress]))
            //     },
            // },
            {
                name: giantessUpgradeName.LearnPickAndPickdown,
                title: getLanguageTextData(state, languageKey.LearnPickAndPickdown),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/in_game/stand/pickup.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return true
                },
                getDescriptionFunc: (state, funcData, level) => {
                    return getLanguageTextData(state, languageKey.LearnPickAndPickdownDescription)
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [actionName.Pickup, actionName.Pickdown]))
                },
            },
            {
                name: giantessUpgradeName.LearnPinch,
                title: getLanguageTextData(state, languageKey.LearnPinch),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/in_game/pick/pinch.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return funcData.GiantessBuildUtils.hasStudyAction(state, funcData, actionName.Pickup)
                },
                getDescriptionFunc: (state, funcData, level) => {
                    return ``
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [actionName.Pinch]))
                },
            },
            {
                name: giantessUpgradeName.LearnEat,
                title: getLanguageTextData(state, languageKey.LearnEat),

                type: upgradeType.Skill,
                imageSrc: "./resource/ui/in_game/pick/eat.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return funcData.GiantessBuildUtils.hasStudyAction(state, funcData, actionName.Pickup)
                },
                getDescriptionFunc: (state, funcData, level) => {
                    return ``
                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    return Promise.resolve(funcData.GiantessBuildUtils.studyActions(state, funcData, [actionName.Eat]))
                },
            },



            // {
            //     name: giantessUpgradeName.MoveAndStompDamageEnhance,
            //     title: getLanguageTextData(state, languageKey.MoveAndStompDamageEnhance),

            //     type: upgradeType.Attack,
            //     imageSrc: "./resource/ui/not_in_game/new.png",

            //     level: 0,
            //     maxLevel: 3,

            //     conditionFunc: (state, funcData, d) => {
            //         return true
            //     },
            //     getDescriptionFunc: (state, funcData, level) => {
            //         // return `移动时造成的伤害增加${Math.round(funcData.getMoveAndStompDamageEnhanceRatio(level) * 100)}%`
            //         return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.MoveAndStompDamageEnhance)(Math.round(funcData.getMoveAndStompDamageEnhanceRatio(level) * 100))

            //     },
            //     upgradeFunc: (state, funcData, level, usedGirl) => {
            //         state = funcData.setMoveAndStompDamageEnhanceLevel(state, level)

            //         return Promise.resolve(state)
            //     },
            // },


            {
                name: giantessUpgradeName.OldSoldier_Giantess,
                title: getLanguageTextData(state, languageKey.OldSoldier_Giantess),

                type: upgradeType.Assistant,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 3,

                conditionFunc: (state, funcData, d) => {
                    // return true
                    return d.characterLevel >= levelRequire.Middle
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `每击败一个敌人生命上限增加10点`
                    // return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.OldSoldier_Giantess)(level * 3)
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.OldSoldier_Giantess)(level)

                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setOldSoldierLevel(state, level, characterType.Giantess)

                    if (funcData.getIsApplying(state)) {
                        state = funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
                            return hp
                        }, true, usedGirlEnum.PlayerGirl)
                    }

                    return Promise.resolve(state)
                },
            },

            {
                name: giantessUpgradeName.LuckDog_Giantess,
                title: getLanguageTextData(state, languageKey.LuckDog_Giantess),

                type: upgradeType.Assistant,
                imageSrc: "./resource/ui/not_in_game/new.png",

                level: 0,
                maxLevel: 1,

                conditionFunc: (state, funcData, d) => {
                    return d.characterLevel >= levelRequire.VeryHigh
                },
                getDescriptionFunc: (state, funcData, level) => {
                    // return `被击败的敌人有20%概率会掉落双倍的基础奖励`
                    return funcData.getLanguageTextVariableData(state, funcData.languageVariableKey.LuckDog_Giantess)()

                },
                upgradeFunc: (state, funcData, level, usedGirl) => {
                    state = funcData.setIsEnableLuckDog(state, true, characterType.Giantess)

                    return Promise.resolve(state)
                },
            },
        ],
    })
}