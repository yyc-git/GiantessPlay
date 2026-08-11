import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getPutToBreastEventName } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getBuffProtocolName, getCharmBlockName, getEnhenceBlockName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"

let _keydownHandler = (api: api, state: state, { userData }) => {
    let { code } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.Giantess:
            switch (code) {
                case "KeyB":
                    return api.triggerGirlAction(state, usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _putToBreastHander = (api: api, state: state, { userData }) => {
    // return _isFull(api, state) ? Promise.resolve(state) : api.event.trigger(state, api.getAbstractState, api.event.getInsertEventName(), api.buildInsertEventData(
    //     getPickObjectData(api, state).toArray().map(data => {
    //         return [
    //             data.queue,
    //             data.index,
    //             data.name,
    //             data.originTransform
    //         ]
    //     })
    // )).then(state => {
    //     let pickObjectData = getPickObjectData(api, state)
    //     let count = pickObjectData.size

    //     if (count == 0) {
    //         return Promise.resolve(state)
    //     }

    //     state = _addExcitement(api, state, count, false)
    //     return _damageGiantess(api, state, _computeForce(api, state, count, 1), pickObjectData)
    // })

    let { usedGirl } = userData

    if (api.isCarryFull(api, state, usedGirl, api.getPutToBreastObjectData(state, usedGirl), api.getPutToBreastBox(state, usedGirl), 0.4)) {
        return api.handleHandFall(state, usedGirl)
    }

    let level = api.getGiantessLevel(api, state, usedGirl, getEnhenceBlockName())

    let promise
    if (level > 0) {
        promise = api.ArrayUtils.reducePromise(
            api.getPickObjectData(state, usedGirl).toArray(),
            (state, data) => {
                let { getBoxFunc, queue, index, name } = data

                return api.NullableUtils.getWithDefault(
                    api.NullableUtils.map(box => {
                        return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getCharmBlockName()).addBuff(api, state, name, api.NullableUtils.getEmpty(), level, 60, api.box3.getBoxTopPoint(box, 0.2, api.vector3.createEmpty()))
                    }, getBoxFunc(state, queue, index, name)),
                    Promise.resolve(state)
                )
            },
            state
        )
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise.then(state => {
        return api.event.trigger(state, api.getAbstractState, api.event.getPutToBreastEventName(), api.buildPutToBreastEventData(
            api.getPickObjectData(state, usedGirl).toArray().map(data => {
                return [
                    data.queue,
                    data.index,
                    data.name,
                    data.originTransform,
                    data.originBox
                ]
            }),
            usedGirl
        ))
    })
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getPutToBreastEventName(), _putToBreastHander)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getPutToBreastEventName())

    return state
}
