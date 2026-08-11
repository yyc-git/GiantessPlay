import { Event } from "meta3d-jiehuo-abstract";
import { getSettingFromBackend } from "../../scene3d_layer/mod/SettingMod";
import { getCameraDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/Camera";
import { clearTalentData, getTalentDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/build/Talent";
// import { getUpgradeDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/build/Upgrade";
import { clearCharacterData, getCharacterDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/character/Character";
import { clearRewardData, getRewardDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator";
import { trigger } from "../../business_layer/Event";
import { buildErrorEventData, buildNetworkErrorEventData, getErrorEventName, getNetworkErrorEventName } from "../../scene3d_layer/utils/EventUtils";
import { getAbstractState, readState, setAbstractState, writeState } from "../../business_layer/State";
import { getOperateDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/Operate";
import { Version } from "meta3d-jiehuo-abstract";
import { getUIDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/UI";
import { clearUserData, getUserDataFromBackend } from "../../scene3d_layer/script/scene/scene_city/User";
import { getCareerNeedTotalGemFromBackend } from "../../scene3d_layer/script/scene/scene_city/build/Career";
import { state } from "../../scene3d_layer/type/StateType";
import { getMessage } from "./ErrorUtils";
// import { clearVersionData } from "meta3d-jiehuo-abstract/src/version/Version";

export let handleNetworkRequest = (func, afterFunc, restoreFunc = state => Promise.resolve(state)) => {
    return func(readState())
        .then(_ => {
            return afterFunc(readState())
        })
        .catch(e => {

            if (!getMessage(e).includes("network request error")
                && !getMessage(e).includes("网络出错了")) {
                // throw e
                return trigger(readState(), getErrorEventName(), buildErrorEventData(e))
            }

            return restoreFunc(readState()).then(state => {
                // return func(readState())
                //     .then(_ => {
                //         return afterFunc(readState())
                //     })
                //     .catch(e => {
                return trigger(state, getNetworkErrorEventName(), buildNetworkErrorEventData(e, () => {
                    return handleNetworkRequest(func, afterFunc, restoreFunc)
                }))
                // })
            })
        })
}

export let getBackendData = (state, setCharacterFunc) => {
    // return getTalentDataFromBackend(state).then(state => getCharacterDataFromBackend(state, setCharacterFunc)).then(getRewardDataFromBackend)
    //     .then(getSettingFromBackend)
    //     .then(getCameraDataFromBackend)
    //     .then(getUpgradeDataFromBackend)
    writeState(state)

    return handleNetworkRequest(state => {
        return Promise.all(
            [
                getTalentDataFromBackend(state),
                getCharacterDataFromBackend(state, setCharacterFunc),
                getRewardDataFromBackend(state),
                getUserDataFromBackend(state),
                // getSettingFromBackend(state),
                // getCameraDataFromBackend(state),
                // getUpgradeDataFromBackend(state),
            ]
        )
    }, (state) => {
        // return Promise.all(
        //     [
        //         getSettingFromBackend(state),
        //         getCameraDataFromBackend(state),
        //         getUpgradeDataFromBackend(state),
        //     ]
        // )
        return getSettingFromBackend(state)
            .then(getCameraDataFromBackend)
            .then(getUIDataFromBackend)
            // .then(getUpgradeDataFromBackend)
            .then(getOperateDataFromBackend)
            .then(state => Version.getIsVersionUpdateFromBackend(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState)))
            .then(getCareerNeedTotalGemFromBackend)

    })
}

export let clearData = (state: state, setCharacterFunc) => {
    state = clearTalentData(state)
    state = clearCharacterData(state, setCharacterFunc)
    state = clearRewardData(state)
    state = clearUserData(state)

    // state = setAbstractState(state, clearVersionData(getAbstractState(state)))

    return state
}
