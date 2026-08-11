import { Box3, Vector3 } from "three"
import { state } from "../../../../../type/StateType"
import { isLittleCharacterType } from "../../CityScene";
import { isEnemyGiantess, isLevelGiantess, isPlayerGoddess, isPlayerGirl, isWildGiantess, isPlayerGiantess, getBodyHp, getFullHp, isPlayerGirlOrGiantess, hasCurrentUsedGirl, hasPlayerGirlOrGiantess, isUseGirl, hasLevelGiantessExceptPlayer } from "../../girl/Girl";
import { usedGirlEnum } from "meta3d-jiehuo-abstract/src/type/StateType";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { getGameTimeIncludeSpecialTimeMinutes } from "../../manage/mission/Mission";
import { getCustomData, triggerMainEvent } from "../../game_event/GameEvent";
import { eventName as gameEventName, eventName_ as gameEventName_ } from "../GameEventData";
import { convertMinuteToMs, convertSToMinute, convertSToMs, getNow, getPassTimeFromNow } from "../../Time";
import { getAutoDifficulty } from "../../difficulty/Difficulty";
import { autoDifficulty, secondUnit } from "../../type/StateType";
import { rate } from "../reward/RewardDataType";
import { addImpendingGameEventData, addInstantGameEventData } from "../../director/utils/GameEventDirectorUtils";
import { getLanguageTextData, languageKey } from "../../../../../internation/Data";
import { readState } from "../../../../../state/State";
import { getMaxCount, isCanGenerate, isCanGenerateMax } from "../../director/ArmyDirector";
import { getAllGameEventDirectorData } from "../../../../../mod/EventGameMod";
import { getAllAliveArmyCount, getAllAliveArmyCountExceptCamp } from "../../utils/ArmyUtils";
import { isNoValidCrowdPositions } from "../../manage/city1/generator/ArmyGenerator";
import { isExceedMaxMMDGiantessCountAfterAdd } from "../../difficulty/HeatImplementer";
import { getPlayerCamp } from "../../utils/PlayerUtils";
// import { getHardKey } from "../../scenario/Command";

const _v1 = new Vector3();
const _v2 = new Vector3();

export enum eventName {
    // WildGiantessAppear = "野生巨大娘出现",
    // EnemyGiantessAppear = "敌人巨大娘出现",

    // EnemyReinforceReach = "敌军增援",
    // EnemyFireSupport = "敌人火力支援",



    // CallGiantess = "召唤巨大娘",

    // EnemyAddRandomBuff = "敌人加随机Buff",

    WildGiantessAppear,
    EnemyGiantessAppear,

    EnemyReinforceReach,
    EnemyFireSupport,

    // Hard,



    // CallGiantess,

    // CallGoddess,

    // EnemyAddRandomBuff,
}

type eventName_ = eventName | string

// type func = (state: state, eventName: eventName_, gameEventName: gameEventName_, title: string) => Promise<state>
type func = (state: state, eventName: any, gameEventName: gameEventName_, title: string) => Promise<state>

export type singleData = {
    // eventName: eventName_,
    // gameEventName: gameEventName_,
    eventName: any,
    gameEventName: any,

    selectRate: rate,

    isOnlyTriggerOnce: boolean,

    isInstant?: boolean,

    title: string,

    directCondition: (state: state) => boolean,
    directorCondition: (state: state) => boolean,
    func: func,
}

export type data = Array<singleData>

// let _buildWildGiantessAppearKey = () => "_buildWildGiantessAppearKey"

let _getImpendingTime = (): secondUnit => {
    return 12
}

let _directorCondition = (state: state, rate: number, isSetStartMinute, maxRateFactor) => {
    // let levelGameTime = getGameTime(state).asMinutes()
    let levelGameTime = getGameTimeIncludeSpecialTimeMinutes(state)

    let startMinute = 0
    if (isSetStartMinute) {
        switch (getAutoDifficulty(state)) {
            case autoDifficulty.VeryEasy:
                // startMinute = 3
                startMinute = 2
            // break
            case autoDifficulty.Easy:
                // startMinute = 2
                startMinute = 1.5
                break
            case autoDifficulty.Middle:
                startMinute = 1
                break
            case autoDifficulty.Hard:
            // startMinute = 1
            // break
            case autoDifficulty.VeryHard:
            case autoDifficulty.VeryHard1:
            case autoDifficulty.VeryHard2:
            case autoDifficulty.VeryHard3:
            case autoDifficulty.VeryHard4:
            case autoDifficulty.VeryHard5:
                startMinute = 0
                break
        }
    }
    else {
        startMinute = 0
    }

    return levelGameTime >= startMinute
        && NumberUtils.isRandomRate(
            NumberUtils.clamp(Math.sqrt(levelGameTime - startMinute), 1, maxRateFactor) * rate
        )
}

let _getEnemyReinforceReachRate = (state: state) => {
    let rate = 0.02

    let factor
    // if (isEnemyGiantess(state, usedGirl)) {
    if (hasCurrentUsedGirl(state, usedGirlEnum.EnemyGiantess)) {
        factor = 1 / 6
    }
    // else if (isPlayerGirlOrGiantess(state, usedGirl)) {
    else if (hasPlayerGirlOrGiantess(state)) {
        factor = 2
    }
    else {
        factor = 1
    }

    return rate * factor
}

export let getData = (state: state): data => {
    return [
        {
            eventName: eventName.WildGiantessAppear,
            gameEventName: gameEventName.WildGiantessAppear,
            title: getLanguageTextData(readState(), languageKey.WildGiantessAppear),
            selectRate: rate.Must,
            // isOnlyTriggerOnce: true,
            isOnlyTriggerOnce: false,
            directCondition: (state: state) => {
                // return isLittleCharacterType(state)
                // && !isLevelGiantess(state, usedGirl)

                if (getAutoDifficulty(state) <= autoDifficulty.Middle && hasLevelGiantessExceptPlayer(state)) {
                    return false
                }

                return !isExceedMaxMMDGiantessCountAfterAdd(state)
                    && !isUseGirl(state, usedGirlEnum.WildGiantess)
                    && isLittleCharacterType(state)
            },
            directorCondition: (state: state) => {
                // return true
                return _directorCondition(state, 0.1, true, 1)
            },
            func: (state: state, eventName, gameEventName, title) => {
                // state = setCustomData(state, _buildWildGiantessAppearKey(), getCustomData<number>(state, _buildWildGiantessAppearKey(), 0) + 1)
                // state = setCustomData(state, _buildWildGiantessAppearKey(), getNow(state))

                state = addImpendingGameEventData(state, {
                    // conditionFunc: _condition,
                    // eventName: eventName.WildGiantessAppear,
                    // gameEventName: gameEventName.WildGiantessAppear,
                    eventName,
                    gameEventName,
                    title,
                    description: getLanguageTextData(readState(), languageKey.WildGiantessAppearDescription),
                    time: getNow(state) + convertSToMs(_getImpendingTime()),
                    isAlreadyShowedUIInfo: false,
                })

                // return triggerMainEvent(state, gameEventName.WildGiantessAppear)
                return Promise.resolve(state)
            },
        },
        {
            eventName: eventName.EnemyGiantessAppear,
            gameEventName: gameEventName.EnemyGiantessAppear,
            title: getLanguageTextData(readState(), languageKey.EnemyGiantessAppear),
            selectRate: rate.Must,
            isOnlyTriggerOnce: true,
            directCondition: (state: state) => {
                // return isLittleCharacterType(state)
                // && !isLevelGiantess(state, usedGirl)

                if (getAutoDifficulty(state) <= autoDifficulty.Middle && hasLevelGiantessExceptPlayer(state)) {
                    return false
                }

                return !isExceedMaxMMDGiantessCountAfterAdd(state)
                    && !isUseGirl(state, usedGirlEnum.EnemyGiantess)
                    && isLittleCharacterType(state)
            },
            directorCondition: (state: state) => {
                // return true
                // return _directorCondition(state, 0.1, true, 1)
                return _directorCondition(state, 0.06, true, 1)
            },
            func: (state: state, eventName, gameEventName, title) => {
                // state = setCustomData(state, _buildWildGiantessAppearKey(), getCustomData<number>(state, _buildWildGiantessAppearKey(), 0) + 1)
                // state = setCustomData(state, _buildWildGiantessAppearKey(), getNow(state))

                state = addImpendingGameEventData(state, {
                    // conditionFunc: _condition,
                    // eventName: eventName.WildGiantessAppear,
                    // gameEventName: gameEventName.WildGiantessAppear,
                    eventName,
                    gameEventName,
                    title,
                    description: getLanguageTextData(readState(), languageKey.EnemyGiantessAppearDescription),
                    time: getNow(state) + convertSToMs(_getImpendingTime()),
                    isAlreadyShowedUIInfo: false,
                })

                // return triggerMainEvent(state, gameEventName.WildGiantessAppear)
                return Promise.resolve(state)
            },
        },

        {
            eventName: eventName.EnemyReinforceReach,
            gameEventName: gameEventName.EnemyReinforceReach,
            title: getLanguageTextData(readState(), languageKey.EnemyReinforceReach),
            selectRate: rate.Must,
            isOnlyTriggerOnce: false,
            directCondition: (state: state) => {
                // return isCanGenerate(state)
                return getAutoDifficulty(state) >= autoDifficulty.Easy
                    && isCanGenerateMax(state, getAllAliveArmyCountExceptCamp(state, getPlayerCamp()), getMaxCount())
                    && !isNoValidCrowdPositions(state)
            },
            directorCondition: (state: state) => {
                // let rate
                // switch (getAutoDifficulty(state)) {
                //     case autoDifficulty.VeryEasy:
                //         rate = 0.05
                //         break
                //     case autoDifficulty.Easy:
                //         rate = 0.07
                //         break
                //     case autoDifficulty.Middle:
                //         rate = 0.08
                //         break
                //     case autoDifficulty.Hard:
                //     case autoDifficulty.VeryHard:
                //         rate = 0.09
                //         break
                // }

                // return _directorCondition(state, NumberUtils.getRandomFloat(0.05, 0.1), false, 2)
                return _directorCondition(state, _getEnemyReinforceReachRate(state), false, 3)
            },
            func: (state: state, eventName, gameEventName, title) => {
                state = addImpendingGameEventData(state, {
                    eventName,
                    gameEventName,
                    title,
                    description: getLanguageTextData(readState(), languageKey.EnemyReinforceReachDescription),
                    // description: "敌军出现",
                    time: getNow(state) + convertSToMs(_getImpendingTime()),
                    // time: getNow(state),
                    isAlreadyShowedUIInfo: false,
                })

                return Promise.resolve(state)
            },
        },
        {
            eventName: eventName.EnemyFireSupport,
            gameEventName: gameEventName.EnemyFireSupport,
            title: getLanguageTextData(readState(), languageKey.EnemyFireSupport),
            selectRate: rate.Must,
            isOnlyTriggerOnce: false,
            directCondition: (state: state) => {
                return getAutoDifficulty(state) >= autoDifficulty.Easy
            },
            directorCondition: (state: state) => {
                // return _directorCondition(state, NumberUtils.getRandomFloat(0.05, 0.1), false, 2)
                return _directorCondition(state, 0.05, false, 1.5)
                // return true
            },
            func: (state: state, eventName, gameEventName, title) => {
                state = addInstantGameEventData(state, {
                    eventName,
                    gameEventName,
                    title,
                    description: getLanguageTextData(readState(), languageKey.EnemyFireSupport),
                })

                return Promise.resolve(state)
            },
        },

        // {
        //     eventName: eventName.EnemyAddRandomBuff,
        //     gameEventName: gameEventName.EnemyAddRandomBuff,
        //     title: getLanguageTextData(readState(), languageKey.EnemyAddRandomBuff),
        //     selectRate: rate.Must,
        //     isOnlyTriggerOnce: false,
        //     directCondition: (state: state) => {
        //         return true
        //     },
        //     directorCondition: (state: state) => {
        //         // return true
        //         // return _directorCondition(state, NumberUtils.getRandomFloat(0.05, 0.1), false, 2)
        //         // return _directorCondition(state, 0.04, false, 2)
        //         return _directorCondition(state, 0.02, false, 3)
        //     },
        //     func: (state: state, eventName, gameEventName, title) => {
        //         state = addInstantGameEventData(state, {
        //             eventName,
        //             gameEventName,
        //             title,
        //             description: getLanguageTextData(readState(), languageKey.EnemyAddRandomBuff),
        //         })

        //         return Promise.resolve(state)
        //     },
        // },



        // {
        //     eventName: eventName.CallGiantess,
        //     gameEventName: gameEventName.CallGiantess,
        //     title: getLanguageTextData(readState(), languageKey.CallGiantess),
        //     selectRate: rate.Zero,
        //     isOnlyTriggerOnce: false,
        //     directCondition: (state: state) => {
        //         return isLittleCharacterType(state)
        //             && !isLevelGiantess(state, usedGirl)
        //     },
        //     directorCondition: (state: state) => {
        //         return true
        //     },
        //     func: (state: state, eventName, gameEventName, title) => {
        //         state = addInstantGameEventData(state, {
        //             eventName,
        //             gameEventName,
        //             title,
        //             description: getLanguageTextData(readState(), languageKey.CallGiantess),
        //         })

        //         return Promise.resolve(state)
        //     },
        // },


        // {
        //     eventName: eventName.CallGoddess,
        //     gameEventName: gameEventName.CallGoddess,
        //     title: getLanguageTextData(readState(), languageKey.CallGiantess),
        //     selectRate: rate.Zero,
        //     isOnlyTriggerOnce: false,
        //     directCondition: (state: state) => {
        //         return isLittleCharacterType(state)
        //             && !isLevelGiantess(state, usedGirl)
        //     },
        //     directorCondition: (state: state) => {
        //         return true
        //     },
        //     func: (state: state, eventName, gameEventName, title) => {
        //         state = addInstantGameEventData(state, {
        //             eventName,
        //             gameEventName,
        //             title,
        //             description: getLanguageTextData(readState(), languageKey.CallGiantess),
        //         })

        //         return Promise.resolve(state)
        //     },
        // },

        // {
        //     eventName: eventName.Hard,
        //     gameEventName: gameEventName.Hard,
        //     title: getLanguageTextData(readState(), languageKey.LevelGiantessHardSay1),
        //     selectRate: rate.Must,
        //     isOnlyTriggerOnce: false,
        //     isInstant: true,
        //     directCondition: (state: state) => {
        //         return isLevelGiantess(state, usedGirl)
        //     },
        //     directorCondition: (state: state) => {
        //         if (getPassTimeFromNow(state, getCustomData(state, getHardKey())) < 60000) {
        //             return false
        //         }

        //         let ratio = NumberUtils.clamp(1 - getBodyHp(state, usedGirl) / getFullHp(state), 0.1, 1)

        //         return NumberUtils.isRandomRate(ratio * 0.4)
        //     },
        //     func: (state: state, eventName, gameEventName, title) => {
        //         state = addInstantGameEventData(state, {
        //             eventName,
        //             gameEventName,
        //             title,
        //             description: ""
        //         })

        //         return Promise.resolve(state)
        //     },
        // },
    ]
        .concat(
            getAllGameEventDirectorData(state) as any
        )
}