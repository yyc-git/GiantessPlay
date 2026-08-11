import { state } from "frontend/src/scene3d_layer/type/StateType";
import { api } from "type-api/src/Type";
import { update as updateMission } from "./Mission"

export let update = (api: api, state: state, usedGirl) => {
    // let promise = api.ArrayUtils.reducePromise(api.girl.getCurrentUsedGirls(state), (state, usedGirl) => {
    //     return api.girl.update(state, usedGirl).then(state => api.updateHeadLookatTarget(state, usedGirl))
    // }, state)

    // promise = promise.then(api.littleMan.update).then(api.camera.update)

    // return promise
    //     .then(updateMission(api))
    //     .then(api.updatePlayLevel)

    return updateMission(api)(state)
        .then(api.updatePlayLevel)
        .then(state => {
            let promise = api.ArrayUtils.reducePromise(api.girl.getCurrentUsedGirls(state), (state, usedGirl) => {
                return api.girl.update(state, usedGirl).then(state => api.updateHeadLookatTarget(state, usedGirl))
            }, state)

            promise = promise.then(api.littleMan.update).then(api.camera.update)

            return promise
        })
}