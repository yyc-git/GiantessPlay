import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getPickShoeEventName } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

let _keydownHandler = (api: api, state: state, { userData }) => {
    let { code } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.Giantess:
            switch (code) {
                case "KeyN":
                    return api.triggerGirlAction(state, usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _pickHander = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData

    return api.event.trigger(state, api.getAbstractState, api.event.getPickupEventName(), api.buildPickupEventData(
        api.getCollisionPartOBB(state, usedGirl, collisionPart.RightHand).toBox3(),
        usedGirl
    )).then(state => {
        return api.event.trigger(state, api.getAbstractState, api.event.getFreeShoeEventName(), api.buildFreeEventData(
            api.getPickObjectData(state, usedGirl)
        ))
    })
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, getPickShoeEventName(), _pickHander)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, getPickShoeEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())

    return state
}
