import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getName, getPropImageResourcePath, getSoundResourceId, getSoundResourcePath } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName, getProtocolName, setState } from "./Utils"
import { createState } from "./State"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { buildBossGiantessRewardName, buildLevelGiantessRewardName } from "../json/RewardData"
import { getUIData } from "../json/UIData"

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

let _handleAfterUsePropHandler = (api: api, state, data) => {
    let { name, dispatchEvent } = api.NullableUtils.getExn(data.userData)

    if (name != getName()) {
        return Promise.resolve(state)
    }

    state = api.ui.deferShow(dispatchEvent, state, getUIData(api, state))

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getLevelGiantessDestoyedEventName(), _levelGiantessDestoyedHandler)
    // state = api.event.on(state, api.event.getEnemyGiantessDestoyedEventName(), _enemyGiantessDestoyedHandler)
    state = api.event.on(state, api.event.getBossDestroyedEventName(), _bossDestoyedHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)
    state = api.event.on(state, api.event.getHandleAfterUsePropEventName(), _handleAfterUsePropHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getLevelGiantessDestoyedEventName())
    // state = api.event.offAll(state, api.event.getEnemyGiantessDestoyedEventName())
    state = api.event.offAll(state, api.event.getBossDestroyedEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())
    state = api.event.offAll(state, api.event.getHandleAfterUsePropEventName())

    return state
}
