import { coin, count, experienceValue, gem, rate, rewardData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { getName } from "../json/Data"
import { api } from "type-api/src/Type"
import { service } from "prop-other-protocol/src/service/ServiceType"
import {  getHolyWaterBlockName, getPropOtherProtocolName  } from "../script/Utils"


export let buildRewardName = () => `${getName()}_buildRewardName`

export let getRewardData = (api: api, state): rewardData => {
    return {
        [buildRewardName()]: {
            gem: state => gem.MostHigh,
            coin: state => coin.MostHigh,
            prop: [
                {
                    name: api.blockAPI.getBlockService<service>(state, getPropOtherProtocolName(), getHolyWaterBlockName()).getName(),

                    getCountFunc: state => count.VeryLow,
                    getRateFunc: state => rate.Must,
                },
            ],
            experienceValue: experienceValue.VeryHigh2,
        },
    }
}