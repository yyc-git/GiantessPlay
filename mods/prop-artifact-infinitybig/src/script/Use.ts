import { state } from "frontend/src/scene3d_layer/type/StateType";
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { api } from "type-api/src/Type";
import { getBlockName, getProtocolName, getUpgradeDamageBiggerBlockName, getUpgradePassiveBiggerBlockName, getUpgradeProtocolName } from "./Utils";
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";
import { giantessUpgradeName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/BuildData";
import { getSoundResourceId } from "../json/Data";
import { getUsedGirl } from "frontend/src/scene3d_layer/mod/LevelGiantessMod";
import { service } from "upgrade-protocol/src/service/ServiceType";

// export let updateMaxScale = (api, state) => {
//     return [
//         usedGirlEnum.WildGiantess,
//         usedGirlEnum.EnemyGiantess,
//         usedGirlEnum.PlayerGoddess,
//         usedGirlEnum.PlayerGirl,
//         ...getUsedGirl(state)
//     ].reduce((state, usedGirl_) => {
//         return api.GiantessBuildUtils.setAttribute(state, api.buildFuncData(state), (girlValue) => {
//             return {
//                 ...girlValue,
//                 maxScale: Infinity,
//             }
//         }, usedGirl_)
//     }, state)
// }

export let increaseMaxLevels = (api: api, state) => {
    return api.updateGiantessItem(state, (data) => {
        switch (data.name) {
            case giantessUpgradeName.LearnBigger:
                return {
                    ...data,
                    maxLevel: 15
                }
            case api.blockAPI.getBlockService<service>(state, getUpgradeProtocolName(), getUpgradePassiveBiggerBlockName()).getName():
                return {
                    ...data,
                    // maxLevel: 100
                    maxLevel: 20
                }
            case api.blockAPI.getBlockService<service>(state, getUpgradeProtocolName(), getUpgradeDamageBiggerBlockName()).getName():
                return {
                    ...data,
                    // maxLevel: 100
                    maxLevel: 20
                }
            case giantessUpgradeName.EnhanceBigger:
                return {
                    ...data,
                    // maxLevel: data.maxLevel * 10
                    maxLevel: 30
                }

            default:
                return data
        }
    })
}

export let use = (api: api, state: state, name: string) => {
    state = api.subPropCount(state, name, 1)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(
            getSoundResourceId(), api.getIsDebug(state), api.getOriginSystemVolume(state))
    ))


    // state = updateMaxScale(api, state)
    state = increaseMaxLevels(api, state)

    state = api.blockAPI.setBlockState<blockState>(state, getProtocolName(), getBlockName(),
        {
            ...api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()),
            isWork: true
        }
    )

    return Promise.resolve(state)
}