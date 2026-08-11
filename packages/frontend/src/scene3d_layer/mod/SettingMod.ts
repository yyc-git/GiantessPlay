import { service } from "setting-protocol/src/service/ServiceType";
import { state } from "../type/StateType";
import { getBlockServiceExn } from "./Mod";
import { renderAccuracyLevel, renderSetting } from "setting-default/src/Type";
// import { isUseInfinityBig } from "./PropOtherMod";
import { isGiantessCharacterType } from "../script/scene/scene_city/CityScene";
import { getScale } from "../script/scene/scene_city/girl/Utils";
import { getModAPI, setCameraFar } from "../script/scene/scene_city/Mod";
import { RenderSetting } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../business_layer/State";
import { setAbstractState } from "../state/State";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getSettingCache, setSettingCache } from "meta3d-jiehuo-abstract/src/storage/Storage";
import { soundSetting } from "setting-sound/src/Type";
import { getCurrentUsedGirls, isUseGirl } from "../script/scene/scene_city/girl/Girl";
import { cameraFarLevel, usedGirlEnum } from "../script/scene/scene_city/type/StateType";
import { updateCameraFar } from "../script/scene/scene_city/utils/CameraUtils";
// import { getGirlScale } from "../../business_layer/CityScene3D";

type settingBackend = {
    render: renderSetting,
    sound: soundSetting,
}

export let getDefaultRenderSetting = (state: state) => {
    return getBlockServiceExn<service>(state, "setting-protocol", "setting-default").getDefaultSetting<renderSetting>(getModAPI(state))
}

export let getRenderSetting = (state: state) => {
    return getBlockServiceExn<service>(state, "setting-protocol", "setting-default").getSetting<renderSetting>(getModAPI(state), state)
}

// export let getCameraRotateSpeedRatio = (state: state) => {
//     return getRenderSetting(state).cameraRotateSpeed / cameraRotateSpeed.Middle
// }

export let setRenderSettingKey = (state: state, key, value) => {
    return getBlockServiceExn<service>(state, "setting-protocol", "setting-default").setSettingKey(getModAPI(state), state, key, value)
}

export let setPhysics = (state: state, physicsLevel) => {
    return setRenderSettingKey(state, "physics", physicsLevel)
}

// let _getRenderAccuracy = (state: state): [boolean, renderAccuracyLevel] => {
//     let renderAccuracy = getRenderSetting(state).renderAccuracy
//     let resultRenderAccuracy

//     if (isUseGirl(state, usedGirl)) {
//         let scale = getScale(state, usedGirl)

//         let level
//         // if (isGiantessCharacterType(state)) {
//         //     // if (isUseGirl(state, usedGirl)) {

//         //     if (scale <= 100) {
//         //         resultRenderAccuracy = renderAccuracy
//         //     }

//         //     if (scale <= 400) {
//         //         level = renderAccuracyLevel.High
//         //     }
//         //     else if (scale <= 800) {
//         //         level = renderAccuracyLevel.VeryHigh
//         //     }
//         //     else if (scale <= 2000) {
//         //         level = renderAccuracyLevel.MostHigh
//         //     }
//         //     else {
//         //         level = renderAccuracyLevel.MostHigh2
//         //     }

//         //     // if (renderAccuracy <= level) {
//         //     //     resultRenderAccuracy = renderAccuracy
//         //     // }
//         //     // else {
//         //     //     resultRenderAccuracy = level
//         //     // }
//         // }
//         // else {
//         //     if (scale <= 100) {
//         //         resultRenderAccuracy = renderAccuracy
//         //     }

//         //     if (scale <= 400) {
//         //         level = renderAccuracyLevel.High
//         //     }
//         //     else {
//         //         level = renderAccuracyLevel.VeryHigh
//         //     }
//         // }
//         if (scale <= 100) {
//             resultRenderAccuracy = renderAccuracy
//         }

//         if (scale <= 400) {
//             // level = renderAccuracyLevel.High
//             level = renderAccuracyLevel.MostHigh
//         }
//         else if (scale <= 800) {
//             level = renderAccuracyLevel.VeryHigh
//         }
//         else if (scale <= 2000) {
//             level = renderAccuracyLevel.MostHigh
//         }
//         else {
//             level = renderAccuracyLevel.MostHigh2
//         }

//         // if (renderAccuracy <= level) {
//         //     resultRenderAccuracy = renderAccuracy
//         // }
//         // else {
//         //     resultRenderAccuracy = level
//         // }


//         resultRenderAccuracy = Math.min(renderAccuracy, level)
//     }
//     else {
//         resultRenderAccuracy = renderAccuracy
//     }

//     // let level = renderAccuracy
//     // if (isUseInfinityBig(state)) {
//     //     level = renderAccuracyLevel.MostHigh
//     // }

//     // if (renderAccuracy <= level) {
//     //     resultRenderAccuracy = renderAccuracy
//     // }
//     // else {
//     //     resultRenderAccuracy = level
//     // }

//     return [resultRenderAccuracy < renderAccuracy, resultRenderAccuracy]
// }
let _getCameraFarLevel = (state: state): cameraFarLevel => {
    let result

    let maxScale = getCurrentUsedGirls(state).reduce((maxScale, usedGirl) => {
        let scale = getScale(state, usedGirl)

        if (scale > maxScale) {
            return scale
        }

        return maxScale
    }, 0)


    if (maxScale > 0) {
        if (maxScale <= 100) {
            result = cameraFarLevel.Normal
        }

        if (maxScale <= 400) {
            result = cameraFarLevel.Low
        }
        else if (maxScale <= 800) {
            result = cameraFarLevel.Middle
        }
        else if (maxScale <= 2000) {
            result = cameraFarLevel.High
        }
        else {
            result = cameraFarLevel.VeryHigh
        }
    }
    else {
        result = cameraFarLevel.Normal
    }

    return result
}

// export let getNewestRenderAccuracy = (state: state) => {
//     return TupleUtils.getTuple2Last(_getRenderAccuracy(state))
// }

export let getRenderAccuracy = (state: state) => {
    // return getRenderAccuracyMod(state)
    return getRenderSetting(state).renderAccuracy
}

export let update = (state: state) => {
    // state = setAbstractState(state, RenderSetting.setIsRenderAccuracyIncrease(getAbstractState(state), isRenderAccuracyIncrease))

    state = setCameraFar(state, _getCameraFarLevel(state))

    // if (isRenderAccuracyIncrease) {
    state = updateCameraFar(state)
    // }

    // return Promise.resolve(setRenderAccuracy(state, renderAccuracy))
    return Promise.resolve(state)
}

let _buildKey = () => "renderSetting_cache"

export let setRenderSetting = (state: state, value) => {
    return getBlockServiceExn<service>(state, "setting-protocol", "setting-default").setSetting(getModAPI(state), state, value)
}




// export let getDefaultSoundSetting = (state: state) => {
//     return getBlockServiceExn<service>(state, "setting-protocol", "setting-sound").getDefaultSetting<soundSetting>(getModAPI(state))
// }

export let getSoundSetting = (state: state) => {
    return getBlockServiceExn<service>(state, "setting-protocol", "setting-sound").getSetting<soundSetting>(getModAPI(state), state)
}

export let setSoundSettingKey = (state: state, key, value) => {
    return getBlockServiceExn<service>(state, "setting-protocol", "setting-sound").setSettingKey(getModAPI(state), state, key, value)
}

export let setSoundSetting = (state: state, value) => {
    return getBlockServiceExn<service>(state, "setting-protocol", "setting-sound").setSetting(getModAPI(state), state, value)
}


let _handleSettingToBackend = (renderSetting: renderSetting, soundSeting: soundSetting): settingBackend => {
    return {
        render: renderSetting,
        sound: soundSeting
    }
}

// let _handleSettingFromBackend = (data:settingBackend) => {
//     return [
//         data.render,
//         data.sound
//     ]
// }


export let getSettingFromBackend = (state: state) => {
    return getSettingCache<settingBackend>(_buildKey()).then(cache => {
        if (NullableUtils.isNullable(cache)) {
            return state
        }

        let { render, sound } = NullableUtils.getExn(cache)

        state = setRenderSetting(state, render)
        state = setSoundSetting(state, sound)

        return state
    })
}

export let updateBackend = (state: state) => {
    return setSettingCache(_buildKey(),
        _handleSettingToBackend(
            getRenderSetting(state),
            getSoundSetting(state)
        )
    ).then(_ => state)
}

// export let clearSetting = (state: state) => {
//     return getSettingCache<settingBackend>(_buildKey()).then(cache => {
//         if (NullableUtils.isNullable(cache)) {
//             return state
//         }

//         let { render, sound } = NullableUtils.getExn(cache)

//         state = setRenderSetting(state, render)
//         state = setSoundSetting(state, sound)

//         return state
//     })
// }
