import { state as blockState } from "setting-protocol/src/state/StateType"
import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { getBlockName, getProtocolName } from "./Utils"

// export let createState = (api: api): renderSetting => {
//     return getDefaultRenderSetting(api)
// }

let _getSetting = (api, state: state) => {
    return api.NullableUtils.getExn(api.blockAPI.getBlockState(state, getProtocolName(), getBlockName()).setting)
}

let _setSetting = (api: api, state: state, setting) => {
    return api.blockAPI.setBlockState<blockState>(state,
        getProtocolName(),
        getBlockName(), {
        ...api.blockAPI.getBlockState(state, getProtocolName(), getBlockName()),
        // setting: api.blockAPI.getBlockState<blockState>(state, getProtocolName(), getBlockName()).setting.set(settingType, setting)
        setting: api.NullableUtils.return_(setting)
    })
}

export let getRenderSetting = _getSetting

export let setRenderSetting = _setSetting

export let setRenderSettingKey = (api, state, key, value) => {
    let setting = _getSetting(api, state)

    setting[key] = value

    return _setSetting(api, state, setting)
}

// export let setHD = (api: api, state: state, value) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         hd: value
//     })
// }

// export let setShadow = (api: api, state, value) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         shadow: value
//     })
// }

// export let setRenderAccuracy = (api: api, state, renderAccuracy) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         renderAccuracy
//     })
// }

// export let setIsShowBlood = (api: api, state, isShowBlood) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         isShowBlood
//     })
// }

// export let setCrowdSize = (api: api, state, value) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         maxUnitCount: value
//     })
// }

// export let setPhysics = (api: api, state, value) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         physics: value
//     })
// }

// export let setCameraRotateSpeed = (api: api, state, value) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         cameraRotateSpeed: value
//     })
// }

// export let getCameraRotateSpeedRatio = (api: api, state) => {
//     return _getSetting(api, state).cameraRotateSpeed / cameraRotateSpeed.Middle
// }

// export let setMapSize = (api: api, state, value) => {
//     return _setSetting(api, state, {
//         ..._getSetting(api, state),
//         mapSize: value
//     })
// }