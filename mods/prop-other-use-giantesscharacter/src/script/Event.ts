import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getName, getPropImageResourcePath } from "../json/Data"
import { buildBossGiantessRewardName, buildLevelGiantessRewardName } from "../json/RewardData"
import { getRewardCount, setRewardCount, createState, setState, getState } from "./Utils"
// import { getRewardCount, getState } from "./Utils"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getName(),
                path: getPropImageResourcePath(),
                type: resourceType.Texture
            },
        ]
    )

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state: state, _) => {
    if (!api.isEnteringNextLevel(state)) {
        state = setState(api, state, createState(api))
    }

    return Promise.resolve(state)
}

let _isCanGenerateReward = (api: api, state: state) => {
    // return api.getWholeGameTimeMinutes(state) > 10 
    return api.getWholeGameTimeMinutes(state) > 5 && getRewardCount(api, state) < 3
}

let _levelGiantessDestoyedHandler = (api: api, state: state, data) => {
    let { targetName, gemAndCoinPosition, propPosition } = api.NullableUtils.getExn(data.userData)

    if (_isCanGenerateReward(api, state)) {
        state = api.generateReward(state, api.getLittleManName(), buildLevelGiantessRewardName(), targetName, gemAndCoinPosition, propPosition)
    }

    return Promise.resolve(state)
}

let _bossDestoyedHandler = (api: api, state: state, data) => {
    let { targetName, gemAndCoinPosition, propPosition } = api.NullableUtils.getExn(data.userData)

    if (_isCanGenerateReward(api, state)) {
        state = api.generateReward(state, api.getLittleManName(), buildBossGiantessRewardName(), targetName, gemAndCoinPosition, propPosition)
    }

    return Promise.resolve(state)
}

let _getPropHandler = (api: api, state: state, data) => {
    let { name } = api.NullableUtils.getExn(data.userData)

    if (name == getName()) {
        state = setRewardCount(api, state, getRewardCount(api, state) + 1)
    }

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getLevelGiantessDestoyedEventName(), _levelGiantessDestoyedHandler)
    state = api.event.on(state, api.event.getBossDestroyedEventName(), _bossDestoyedHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)
    state = api.event.on(state, api.event.getGetPropEventName(), _getPropHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getLevelGiantessDestoyedEventName())
    state = api.event.offAll(state, api.event.getBossDestroyedEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())
    state = api.event.offAll(state, api.event.getGetPropEventName())

    return state
}
