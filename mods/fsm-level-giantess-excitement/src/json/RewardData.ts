import { coin, count, experienceValue, gem, rate, rewardData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { getName } from "../json/Data"


export let buildRewardName = () => `${getName()}_buildRewardName`

export let getRewardData = (api, state): rewardData => {
    return {
        [buildRewardName()]: {
            gem: state => gem.VeryHigh2,
            coin: state => coin.VeryHigh2,
            prop: [
            ],
            experienceValue: experienceValue.VeryHigh,
        },
    }
}