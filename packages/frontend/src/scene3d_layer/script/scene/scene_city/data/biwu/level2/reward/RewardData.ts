import { propName } from "../../../../type/StateType"
import { getBossDestroyProp } from "../../../reward/RewardData"
import { coin, count, experienceValue, gem, rewardData } from "../../../reward/RewardDataType"

export let buildStressingName = () => "buildStressingName"

// export let buildClothDestroyedName = () => "buildClothDestroyedName"

export let buildDestroyedName = () => "buildDestroyedName"

export let getRewardData = (state): rewardData => {
    return {
        [buildStressingName()]: {
            gem: state => gem.VeryHigh,
            coin: state => coin.VeryHigh,
            prop: [],
            experienceValue: experienceValue.High,
        },

        [buildDestroyedName()]: {
            gem: state => gem.MostHigh2,
            coin: state => coin.MostHigh2,
            prop: getBossDestroyProp(state),
            experienceValue: experienceValue.VeryHigh2,
        },
    }
}