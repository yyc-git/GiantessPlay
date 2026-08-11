import { coin, count, experienceValue, gem, rate, rewardData } from "frontend/src/scene3d_layer/script/scene/scene_city/data/reward/RewardDataType"
import { propName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getPropBulletBiggerBlockName, getPropBulletProtocolName, getPropBulletSmallerBlockName, getPropOtherProtocolName, getPropStrongBiggerBlockName } from "../script/Utils"
import { service } from "prop-bullet-protocol/src/service/ServiceType"
import { service as propOtherService } from "prop-other-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"

export let getRewardData = (api: api, getNamePrefixEliteGiantessFunc, state): rewardData => {
    return {
        [getNamePrefixEliteGiantessFunc(api, state)]: {
            // gem: state => gem.VeryHigh,
            gem: state => gem.Middle3,
            coin: state => coin.VeryHigh,
            prop: [
                {
                    name: propName.AddHp2,

                    getCountFunc: state => count.VeryLow,
                    getRateFunc: state => rate.Low,
                },

                {
                    // name: propName.BiggerBullet,
                    name: api.blockAPI.getBlockService<service>(state, getPropBulletProtocolName(), getPropBulletBiggerBlockName()).getWeaponName(),

                    getCountFunc: state => count.VeryLow,
                    getRateFunc: state => rate.VeryLow,
                },
                {
                    // name: propName.SmallerToLastBiggerCount,
                    name: api.blockAPI.getBlockService<service>(state, getPropBulletProtocolName(), getPropBulletSmallerBlockName()).getWeaponName(),

                    getCountFunc: state => count.VeryLow,
                    getRateFunc: state => rate.VeryLow2,
                },


                {
                    name: api.blockAPI.getBlockService<propOtherService>(state, getPropOtherProtocolName(), getPropStrongBiggerBlockName()).getName(),

                    getCountFunc: state => count.VeryLow,
                    getRateFunc: state => rate.Low,
                },
            ],
            experienceValue: experienceValue.VeryHigh,
        },
    }
}