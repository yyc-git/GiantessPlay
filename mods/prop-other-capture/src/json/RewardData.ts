import { coin, count, experienceValue, gem, rate, rewardData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { getName } from "../json/Data"
import { api } from "type-api/src/Type"

export let buildLevelGiantessRewardName = () => `${getName()}_buildLevelGiantessRewardName`

export let buildBossGiantessRewardName = () => `${getName()}_buildBossGiantessRewardName`

export let getRewardData = (api: api, state): rewardData => {
    return {
        [buildLevelGiantessRewardName()]: {
            gem: state => gem.Zero,
            coin: state => coin.Zero,
            prop: [
                {
                    name: getName(),

                    getCountFunc: state => count.VeryLow,
                    // getRateFunc: state => rate.Middle3,
                    // getRateFunc: state => rate.Middle2,
                    getRateFunc: state => {
                        return api.getRateByHasCount(state, getName(),
                            [2, rate.Middle1],
                            [6, rate.VeryLow],
                            rate.Low
                        )
                    }
                    // getRateFunc: state => rate.High,
                },
            ],
            experienceValue: experienceValue.Zero,
        },
        [buildBossGiantessRewardName()]: {
            gem: state => gem.Zero,
            coin: state => coin.Zero,
            prop: [
                {
                    name: getName(),

                    getCountFunc: state => count.VeryLow,
                    // getCountFunc: state => count.Low,
                    // getRateFunc: state => rate.Middle2,
                    // getRateFunc: state => rate.VeryHigh,
                    // getRateFunc: state => rate.Middle3,
                    getRateFunc: state => {
                        return api.getRateByHasCount(state, getName(),
                            [2, rate.Middle2],
                            [6, rate.Low],
                            rate.Middle1
                        )
                    }
                },
            ],
            experienceValue: experienceValue.Zero,
        },
    }
}