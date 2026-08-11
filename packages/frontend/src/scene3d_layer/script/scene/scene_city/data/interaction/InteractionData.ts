import { NumberUtils } from "meta3d-jiehuo-abstract"
import { interactionName, propName, secondUnit } from "../../type/StateType"
import { buffName } from "../buff/BuffData"
import { eventName } from "../director/GameEventDirectorData"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { readState } from "../../../../../state/State"
import { getCountFunc, getRateFunc } from "../reward/RewardDataType"
import { getWeaponBiggerBulletBlockService, getWeaponShotBulletBlockService, getWeaponSmallerBulletBlockService, getWeaponSubMachineBulletBlockService } from "../../../../../mod/PropBulletMod"
import { state } from "../../../../../type/StateType"
import { buildAllArtifactTradeData, getCaptureBlockService, getRunBlockService, getSmallerWaterBlockService } from "../../../../../mod/PropOtherMod"


export enum otherRewardName {
    // Coin = "金币",
    Coin = "1",
}

export type rewardName = propName | otherRewardName
export const rewardName = {
    ...propName,
    ...otherRewardName,
}


export type chestBoxSingleData = {
    name: rewardName,
    title?: string,
    count: getCountFunc,
    rate: getRateFunc,
}


export type tradeName = propName
export const tradeName = {
    ...propName,
}


export type tradeSingleData = {
    name: tradeName,
    count: number,
    coin: number,
    // rate: rate,
}


export type warSingleData = {
    name: buffName,
    time: secondUnit,
    count: number,
}

export type blessSingleData = warSingleData

export type fateSingleData = {
    name: eventName
}

export let getChestBoxData = (state): Array<chestBoxSingleData> => {
    return [
        {
            name: rewardName.Coin,
            title: getLanguageTextData(readState(), languageKey.Coin),
            // count: state => NumberUtils.getRandomInteger(1, 10),
            // count: state => NumberUtils.getRandomInteger(10, 1000),
            // count: state => NumberUtils.getRandomInteger(10, 500),
            count: state => NumberUtils.getRandomInteger(1, 500),
            rate: state => 0.3
        },

        {
            name: rewardName.AddHp1,
            // title: getLanguageTextData(readState(), languageKey.AddHp1Title),
            count: state => NumberUtils.getRandomInteger(1, 2),
            rate: state => 0.2
        },
        {
            name: rewardName.AddExcitement1,
            // title: getLanguageTextData(readState(), languageKey.AddExcitement1Title),
            count: state => NumberUtils.getRandomInteger(1, 2),
            rate: state => 0.2
        },

        {
            name: rewardName.LaserBullet,
            // title: getLanguageTextData(readState(), languageKey.LaserBulletTitle),
            // count: state => NumberUtils.getRandomInteger(3, 10),
            count: state => NumberUtils.getRandomInteger(5, 30),
            rate: state => 0.2
        },
        {
            name: rewardName.RocketBullet,
            // title: getLanguageTextData(readState(), languageKey.RocketBulletTitle),
            // count: state => NumberUtils.getRandomInteger(2, 8),
            count: state => NumberUtils.getRandomInteger(5, 30),
            rate: state => 0.2
        },
        {
            name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),
            count: state => NumberUtils.getRandomInteger(10, 50),
            rate: state => 0.1,
        },
        {
            name: getWeaponShotBulletBlockService(state).getWeaponName(),
            count: state => NumberUtils.getRandomInteger(3, 20),
            rate: state => 0.1,
        },


        {
            name: getWeaponBiggerBulletBlockService(state).getWeaponName(),
            // title: getLanguageTextData(readState(), languageKey.BiggerBulletTitle),
            count: state => NumberUtils.getRandomInteger(1, 2),
            rate: state => 0.1,
        },
        {
            name: getWeaponSmallerBulletBlockService(state).getWeaponName(),
            // title: getLanguageTextData(readState(), languageKey.SmallerToLastBiggerCountBulletTitle),
            // count: state => NumberUtils.getRandomInteger(1, 2),
            count: state => 1,
            rate: state => 0.05,
        },

        {
            name: rewardName.ClearHatred,
            // title: getLanguageTextData(readState(), languageKey.ClearHatredTitle),
            count: state => NumberUtils.getRandomInteger(1, 2),
            // rate: state => 0.02,
            rate: state => 0.05,
        },
        {
            name: rewardName.CallGiantess,
            // title: getLanguageTextData(readState(), languageKey.CallGiantessTitle),
            count: state => 1,
            // rate: state => 0.02,
            rate: state => 0.05,
        },
        {
            name: getRunBlockService(state).getName(),
            count: state => NumberUtils.getRandomInteger(1, 2),
            // rate: state => 0.02,
            rate: state => 0.05,
        },
        {
            name: getSmallerWaterBlockService(state).getName(),
            count: state => NumberUtils.getRandomInteger(1, 2),
            // rate: state => 0.02,
            rate: state => 0.05,
        },
    ]
}

export let getTradeData = (state: state): Array<tradeSingleData> => {
    return [
        {
            name: tradeName.AddHp1,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 30,
        },
        {
            name: tradeName.AddHp2,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 45,
        },
        {
            name: tradeName.AddHp3,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 60,
            // rate: rate.VeryHigh,
        },
        {
            name: tradeName.AddHp4,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 100,
            // rate: rate.High,
        },

        {
            name: tradeName.AddExcitement1,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 10,
        },
        {
            name: tradeName.AddExcitement2,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 15,
        },
        {
            name: tradeName.AddExcitement3,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 20,
            // rate: rate.VeryHigh,
        },
        {
            name: tradeName.AddExcitement4,
            count: NumberUtils.getRandomInteger(1, 3),
            coin: 30,
            // rate: rate.High,
        },


        {
            name: rewardName.LaserBullet,
            // count: NumberUtils.getRandomInteger(5, 20),
            count: NumberUtils.getRandomInteger(10, 50),
            coin: 30,
            // rate: rate.Middle2,
        },
        {
            name: rewardName.RocketBullet,
            // count: NumberUtils.getRandomInteger(2, 10),
            count: NumberUtils.getRandomInteger(10, 30),
            coin: 40,
            // rate: rate.Middle2,
        },
        {
            name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),
            count: NumberUtils.getRandomInteger(10, 50),
            coin: 20,
        },
        {
            name: getWeaponShotBulletBlockService(state).getWeaponName(),
            count: NumberUtils.getRandomInteger(10, 30),
            coin: 60,
        },



        {
            // name: rewardName.BiggerBullet,
            name: getWeaponBiggerBulletBlockService(state).getWeaponName(),
            // count: NumberUtils.getRandomInteger(1, 2),
            count: NumberUtils.getRandomInteger(1, 5),
            coin: 200,
            // rate: rate.Low,
        },
        {
            // name: rewardName.SmallerToLastBiggerCount,
            name: getWeaponSmallerBulletBlockService(state).getWeaponName(),
            // count: NumberUtils.getRandomInteger(1, 2),
            count: NumberUtils.getRandomInteger(1, 2),
            // count: 1,
            coin: 500,
            // rate: rate.Low,
        },


        {
            name: rewardName.ClearHatred,
            // count: NumberUtils.getRandomInteger(1, 2),
            count: NumberUtils.getRandomInteger(1, 5),
            coin: 500,
            // rate: rate.Low,
        },
        {
            name: rewardName.CallGiantess,
            // count: 1,
            // count: NumberUtils.getRandomInteger(1, 2),
            count: 1,
            // count: NumberUtils.getRandomInteger(1, 2),
            coin: 2000,
            // coin: 3000,
            // rate: rate.Low,
        },
        {
            name: getRunBlockService(state).getName(),
            // count: NumberUtils.getRandomInteger(1, 2),
            count: NumberUtils.getRandomInteger(1, 4),
            coin: 500,
            // rate: rate.VeryLow,
        },
        {
            name: getSmallerWaterBlockService(state).getName(),
            // count: NumberUtils.getRandomInteger(1, 2),
            count: NumberUtils.getRandomInteger(1, 4),
            coin: 500,
            // rate: rate.VeryLow,
        },

        {
            name: getCaptureBlockService(state).getName(),
            // count: NumberUtils.getRandomInteger(1, 2),
            count: 1,
            // coin: 2000,
            // coin: 3000,
            // coin: 5000,
            coin: 4000,
            // rate: rate.VeryLow,
        },

        {
            name: rewardName.Revive,
            count: 1,
            // coin: 20000,
            // coin: 12000,
            coin: 8000,
            // rate: rate.VeryLow,
        },
    ].concat(
        buildAllArtifactTradeData(state)
    )
}

// export let getWarData = (): Array<warSingleData> => {
//     return [
//         {
//             name: buffName.IncreaseDefenseFactor,
//             time: 30,
//             // time: 5,
//             count: NumberUtils.getRandomInteger(1, 2),
//         },
//     ]
// }

// export let getBlessData = (): Array<blessSingleData> => {
//     return [
//         {
//             name: buffName.IncreaseMoveSpeed,
//             // time: 30,
//             time: 60,
//             // time: 5,
//             // time: 60,
//             // count: NumberUtils.getRandomInteger(1, 2),
//             count: NumberUtils.getRandomInteger(3, 8),
//             // count: 10
//         },
//         {
//             name: buffName.IncreaseActionSpeed,
//             // time: 30,
//             time: 60,
//             // time: 5,
//             // time: 60,
//             // count: NumberUtils.getRandomInteger(1, 2),
//             // count: NumberUtils.getRandomInteger(2, 5),
//             count: NumberUtils.getRandomInteger(2, 4),
//             // count: 10
//         },
//     ]
// }

export let getFateData = (): Array<fateSingleData> => {
    return [
        {
            name: eventName.WildGiantessAppear
        },
        {
            name: eventName.EnemyGiantessAppear
        },
        // {
        //     name: eventName.CallGiantess
        // },

        {
            name: eventName.EnemyReinforceReach
        },
        {
            name: eventName.EnemyFireSupport
        },
    ]
}