import { propName } from "../../../../type/StateType"
import { getBossDestroyProp } from "../../../reward/RewardData"
import { coin, count, experienceValue, gem, rewardData } from "../../../reward/RewardDataType"

export let buildStressingName = () => "boss_stressing"

export let buildDestroyedName = () => "buildDestroyedName"

export let getRewardData = (state): rewardData => {
    return {
        // [buildStressingName()]: {
        //     gem: state => 5,
        //     prop: [],
        //     experienceValue: experienceValue.High,
        // },

        // [buildDestroyedName()]: {
        //     gem: state => 10,
        //     prop: [
        //         {
        //             name: propName.BiggerBullet,

        //             getCountFunc: state => 10,
        //             getRateFunc: state => 0.5,
        //         },
        //         {
        //             name: propName.SmallerToLastBiggerCount,

        //             getCountFunc: state => 10,
        //             getRateFunc: state => 0.1,
        //         }
        //     ],
        //     experienceValue: experienceValue.VeryHigh,
        // },
        [buildStressingName()]: {
            gem: state => gem.VeryHigh,
            coin: state => coin.VeryHigh,
            prop: [],
            experienceValue: experienceValue.High,
        },

        [buildDestroyedName()]: {
            gem: state => gem.MostHigh,
            coin: state => coin.MostHigh,
            prop: getBossDestroyProp(state),
            experienceValue: experienceValue.VeryHigh2,
        },

    }
}