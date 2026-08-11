import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getName, getTargetName } from "../json/Data"
import { getBlockName, getProtocolName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { setState, createState } from "./Utils"

let _hasFirstExcitementBuff = (api: api, state, usedGirl) => {
    let { getName, getTargetName } = api.blockAPI.getBlockService<service>(state, getProtocolName(), getBlockName())

    return api.NullableUtils.getWithDefault(
        api.NullableUtils.map(buff => {
            return buff.superPositionCount == 1
        }, api.findBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)),
        false
    )
}

let _updateHandler = (api: api, state, _) => {
    return api.ArrayUtils.reducePromise(
        api.girl.getCurrentUsedGirls(state),
        (state, usedGirl) => {
            if (!api.isLevelGiantessExceptPlayer(state, usedGirl)) {
                return Promise.resolve(state)
            }

            if (!api.hasBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)) {
                return Promise.resolve(state)
            }

            let value = _hasFirstExcitementBuff(api, state, usedGirl) ? 5 : 20
            if (api.getExcitement(state, usedGirl) <= value) {
                return api.removeBuff(state, getName(), getTargetName(api, usedGirl), usedGirl)
            }

            state = api.subExcitement(state, usedGirl, api.getDelta(api.getAbstractState(state)) * api.getDeltaFactor() * 0.02)

            return Promise.resolve(state)
        },
        state
    )

}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getUpdateEventName(), _updateHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getUpdateEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
