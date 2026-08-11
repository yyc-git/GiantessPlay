import { propName } from "../../../../type/StateType"
import { getBossDestroyProp, getLevelGirlDestroyProp } from "../../../reward/RewardData"
import { coin, count, experienceValue, gem, rewardData } from "../../../reward/RewardDataType"

// export let buildGiantessClothDestroyedName = () => "buildGiantessClothDestroyedName"

export let buildWildGiantessStressingName = () => "buildWildGiantessStressingName"

export let buildEnemyGiantessStressingName = () => "buildEnemyGiantessStressingName"

export let buildWildGiantessDestroyedName = () => "buildWildGiantessDestroyedName"

export let buildEnemyGiantessDestroyedName = () => "buildEnemyGiantessDestroyedName"

export let getRewardData = (state): rewardData => {
    return {
        // [buildGiantessClothDestroyedName()]: {
        //     gem: state => gem.High,
        //     coin: state => coin.High,
        //     prop: [
        //     ],
        //     experienceValue: experienceValue.Middle3,
        // },

        [buildWildGiantessStressingName()]: {
            gem: state => gem.VeryHigh,
            coin: state => coin.VeryHigh,
            prop: [
            ],
            experienceValue: experienceValue.High,
        },
        [buildEnemyGiantessStressingName()]: {
            gem: state => gem.VeryHigh,
            coin: state => coin.VeryHigh,
            prop: [
            ],
            experienceValue: experienceValue.High,
        },

        [buildWildGiantessDestroyedName()]: {
            gem: state => gem.MostHigh,
            coin: state => coin.MostHigh,
            // prop: getBossDestroyProp(state),
            prop: getLevelGirlDestroyProp(state),
            experienceValue: experienceValue.VeryHigh,
        },
        [buildEnemyGiantessDestroyedName()]: {
            gem: state => gem.MostHigh,
            coin: state => coin.MostHigh,
            prop: getLevelGirlDestroyProp(state),
            experienceValue: experienceValue.VeryHigh,
        },
    }
}