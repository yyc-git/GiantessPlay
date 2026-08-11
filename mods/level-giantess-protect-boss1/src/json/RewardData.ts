import { coin, experienceValue, gem, rewardData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { getUsedGirl } from "./Data"
import { api } from "type-api/src/Type"

export let buildGiantessStressingName = () => `buildGiantessStressingName_${getUsedGirl()}`

export let buildGiantessDestroyedName = () => `buildGiantessDestroyedName_${getUsedGirl()}`

export let getRewardData = (api: api, state): rewardData => {
    return {
        [buildGiantessStressingName()]: {
            gem: state => gem.VeryHigh,
            coin: state => coin.VeryHigh,
            prop: [],
            experienceValue: experienceValue.High,
        },
        [buildGiantessDestroyedName()]: {
            gem: state => gem.MostHigh,
            coin: state => coin.MostHigh,
            prop: api.getLevelGirlDestroyProp(state),
            experienceValue: experienceValue.VeryHigh,
        },
    }
}