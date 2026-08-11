import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getName, getPropImageResourcePath, getSoundResourceId, getSoundResourcePath } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState } from "./State"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { buildBossGiantessRewardName, buildLevelGiantessRewardName } from "../json/RewardData"
import { getBlockName, getBuffBlockName, getBuffProtocolName, getProtocolName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { collisionPart } from "frontend/src/scene3d_layer/script/scene/scene_city/data/biwu/level3/CollisionShapeData"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getName(),
                path: getPropImageResourcePath(),
                type: resourceType.Texture
            },
            {
                id: getSoundResourceId(),
                path: [getSoundResourcePath()],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}

let _levelGiantessDestoyedHandler = (api: api, state: state, data) => {
    let { targetName, gemAndCoinPosition, propPosition } = api.NullableUtils.getExn(data.userData)

    return Promise.resolve(api.generateReward(state, api.getLittleManName(), buildLevelGiantessRewardName(), targetName, gemAndCoinPosition, propPosition))
}

// let _enemyGiantessDestoyedHandler = (api: api, state: state, data) => {
//     return _levelGiantessDestoyedHandler(api, state, data)
// }

let _bossDestoyedHandler = (api: api, state: state, data) => {
    let { targetName, gemAndCoinPosition, propPosition } = api.NullableUtils.getExn(data.userData)

    return Promise.resolve(api.generateReward(state, api.getLittleManName(), buildBossGiantessRewardName(), targetName, gemAndCoinPosition, propPosition))
}

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let usedGirl = userData.usedGirl

    let service = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffBlockName())

    if (
        api.hasBuff(state, service.getName(), service.getTargetName(api), api.NullableUtils.getEmpty())
        && userData.damageType == damageType.Weakness
    ) {
        let newDamage = userData.damage * 3

        if ([collisionPart.RightBreast, collisionPart.LeftBreast].includes(userData.collisionPart)) {
            // state = api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(state, usedGirl,api.getBreastPartialScaleRatio(state, usedGirl) + api.NumberUtils.clamp((newDamage / api.girl.getFullHp(state, usedGirl)) * 5, 0, 0.1)))
            state = api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(state, usedGirl, api.getBreastPartialScaleRatio(state, usedGirl) + api.NumberUtils.clamp((newDamage / api.girl.getFullHp(state, usedGirl)) * 10, 0.01, 0.2)))
            // state = api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(api.getBreastPartialScaleRatio(state, usedGirl) + 0.1))
        }

        return Promise.resolve([state,
            {
                ...userData,
                damage: newDamage
            }])
    }

    return Promise.resolve([state, userData])
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getLevelGiantessDestoyedEventName(), _levelGiantessDestoyedHandler)
    // state = api.event.on(state, api.event.getEnemyGiantessDestoyedEventName(), _enemyGiantessDestoyedHandler)
    state = api.event.on(state, api.event.getBossDestroyedEventName(), _bossDestoyedHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getLevelGiantessDestoyedEventName())
    // state = api.event.offAll(state, api.event.getEnemyGiantessDestoyedEventName())
    state = api.event.offAll(state, api.event.getBossDestroyedEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())

    return state
}
