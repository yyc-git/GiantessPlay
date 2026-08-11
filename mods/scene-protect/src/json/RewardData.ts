import { coin, experienceValue, gem, rewardData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { api } from "type-api/src/Type"
import { getAllLevelGiantessService } from "../script/Utils"

export let getRewardData = (api: api, state): rewardData => {
    return api.mergeAllRewardData(
        {},
        getAllLevelGiantessService(api, state).map(service => service.getRewardData(api, state))
    )
}