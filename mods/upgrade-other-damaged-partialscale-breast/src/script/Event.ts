import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, getGiantessLevel, setState } from "./Utils"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)
    let { usedGirl } = userData

    let level = getGiantessLevel(api, state, usedGirl)

    if (level > 0
        && (
            userData.collisionPart == collisionPart.LeftBreast
            || userData.collisionPart == collisionPart.RightBreast
        )
    ) {
        state = api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(state, usedGirl, api.getBreastPartialScaleRatio(state, usedGirl) + api.getForceFactor(api.girl.getFullHp(state, usedGirl), userData.damage, 0.3 / level, 0.2, 0.005)))
    }

    return Promise.resolve([state, userData])
}

let _disposeHandler = (api: api, state, _) => {
    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}


export let bindEvent = (api: api, state) => {
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
