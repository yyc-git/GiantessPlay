import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getModalUIData, getPageUIData } from "../json/UIData"
import { getBuyResourceId, getBuyResourcePath, getScene } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { service } from "mmd-character-protocol/src/service/ServiceType"
import { createState, getMMDProtocolName, setState } from "./Utils"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getBuyResourceId(),
                path: [getBuyResourcePath()],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}

let _updateUIHandler = (api: api, state, data) => {
    // if (!api.isSceneChapter(state, getScene())
    if (api.sceneUI.hasOpenedModal(state)) {
        return Promise.resolve(state)
    }

    return api.sceneUI.show(
        state, getPageUIData(api, state)
    )
}

// let _removeGirlHandler = (api: api, state: state, { userData }) => {
//     let { usedMMDData } = api.NullableUtils.getExn(userData)

//     // state = _disposeData(state)

//     // if (!api.isGiantessCharacterType(state)) {
//         // state = api.resetCloth(state, usedGirl, usedMMDData, api.blockAPI.getAllBlockServiceFuncWithDefault<service>(state, service => service.getCollisionShapeData(api, state), getMMDProtocolName(), []))
//     // }

//     return Promise.resolve(state)
// }

let _keydownHandler = (api: api, state: state, { userData }) => {
    let { code } = api.NullableUtils.getExn(userData)

    switch (code) {
        // case "KeyV":
        case "KeyC":
            return api.sceneUI.showModal(state, getModalUIData(api, state))
        default:
            return Promise.resolve(state)
    }
}

let _disposeHandler = (api: api, state: state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getUpdateUIEventName(), _updateUIHandler)
    // state = api.event.on(state, api.event.getAfterRemoveGirlEventName(), _removeGirlHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getUpdateUIEventName())
    // state = api.event.offAll(state, api.event.getAfterRemoveGirlEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
