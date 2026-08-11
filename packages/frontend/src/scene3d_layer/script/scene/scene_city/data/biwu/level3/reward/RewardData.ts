import { getNamePrefixMissileTurret, getNamePrefixShellTurret } from "../../../../manage/city1/milltary_building/MilltaryBuildingUtils"
import { propName } from "../../../../type/StateType"
import { getBossDestroyProp } from "../../../reward/RewardData"
import { coin, count, experienceValue, gem, rewardData } from "../../../reward/RewardDataType"

export let buildStressingName = () => "buildStressingName"

export let buildNippleStressingName = () => "buildNippleStressingName"

// export let buildClothDestroyedName = () => "buildClothDestroyedName"

export let buildDestroyedName = () => "buildDestroyedName"

export let getRewardData = (state): rewardData => {
    return {
        [getNamePrefixShellTurret()]: {
            gem: state => gem.High,
            coin: state => coin.Zero,
            prop: [
            ],
            experienceValue: experienceValue.High,
        },
        [getNamePrefixMissileTurret()]: {
            gem: state => gem.High,
            coin: state => coin.Zero,
            prop: [
            ],
            experienceValue: experienceValue.High,
        },


        [buildStressingName()]: {
            gem: state => gem.VeryHigh,
            coin: state => coin.VeryHigh,
            prop: [],
            experienceValue: experienceValue.High,
        },
        [buildNippleStressingName()]: {
            gem: state => gem.VeryHigh2,
            coin: state => coin.VeryHigh2,
            prop: [],
            experienceValue: experienceValue.High,
        },
        // [buildClothDestroyedName()]: {
        //     gem: state => gem.Middle2,
        //     prop: [],
        //     experienceValue: experienceValue.Middle3,
        // },

        [buildDestroyedName()]: {
            gem: state => gem.MostHigh2,
            coin: state => coin.MostHigh2,
            prop: getBossDestroyProp(state),
            experienceValue: experienceValue.VeryHigh2,
        },
    }
}