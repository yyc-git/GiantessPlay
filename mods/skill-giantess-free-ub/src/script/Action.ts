import { actionName, animationName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, box3 } from "type-api/src/Type"
import { getActionName, getSound1ResourceId, getSound2ResourceId } from "../json/Data"
import { actionState, result } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getBlockName, getProtocolName } from "../script/Utils"
import { service } from "skill-giantess-protocol/src/service/ServiceType"
import { pose } from "frontend/src/scene3d_layer/script/scene/scene_city/data/biwu/level3/CollisionShapeData"

let _getRandomSoundResourceId = (api: api) => {
    let soundData = [
        getSound1ResourceId(),
        getSound2ResourceId(),
    ]

    return api.NumberUtils.randomSelect(soundData)
}

export let isActionValid = (api: api, state: state, usedGirl, name: actionName) => {
    switch (name) {
        case getActionName():
            // return api.girl.getCurrentAnimationName(state, usedGirl) == animationName.Idle
            // return api.getCurrentPose(state, usedGirl) == pose.Stand
            //     && api.getUBObjectData(state, usedGirl).size > 0
            return api.getUBObjectData(state, usedGirl).size > 0
        default:
            return false
    }
}

export let triggerAction = (api: api, state, usedGirl, name: actionName) => {
    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(_getRandomSoundResourceId(api), api.getIsDebug(state), api.getGiantessVolume(state, usedGirl, true))
    ))

    state = api.setAbstractState(state, api.Flow.addDeferExecFuncDataByTime(api.getAbstractState(state), (state) => {
        state = api.girl.resetAction(state, usedGirl)

        return Promise.resolve(state)
    }, 0.5))


    return api.event.trigger(state, api.getAbstractState, api.event.getFreeUBEventName(), api.buildFreeEventData(
        api.getUBObjectData(state, usedGirl)
    ))
        .then(state => api.handleUBFall(state, usedGirl))
        .then(state => [state, result.Success])
}