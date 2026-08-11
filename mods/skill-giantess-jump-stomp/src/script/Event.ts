import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getJumpStompHitTerrainEventName, getShoutSoundResourceId, getShoutSoundResourcePath, getStompSoundResourceId, getStompSoundResourcePath } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getEnhenceCrippledBlockName, getBuffProtocolName, getCrippledBlockName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getStompSoundResourceId(),
                path: [getStompSoundResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getShoutSoundResourceId(),
                path: [getShoutSoundResourcePath()],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}

let _keydownHandler = (api: api, state: state, { userData }) => {
    let { code } = api.NullableUtils.getExn(userData)

    switch (api.getCharacterType(api.getAbstractState(state))) {
        case characterType.Giantess:
            switch (code) {
                case "KeyJ":
                    return api.triggerGirlAction(state,  usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _hitTerrainHandler = (api: api, state: state, { userData }) => {
    let { stompRangeBox, usedGirl } = api.NullableUtils.getExn(userData)

    let level = api.getGiantessLevel(api, state, usedGirl, getEnhenceCrippledBlockName())

    if (level > 0) {
        return api.ArrayUtils.reducePromise(
            api.queryBoxShapeCollision(
                stompRangeBox,
                state,
                usedGirl
            ),
            (state, data) => {
                if (api.NullableUtils.isNullable(data)) {
                    return Promise.resolve(state)
                }

                let [transforms, boxes, names] = api.NullableUtils.getExn(data)

                return api.ArrayUtils.reducePromise(
                    names,
                    (state, name, i) => {
                        return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getCrippledBlockName()).addBuff(api, state, name, api.NullableUtils.getEmpty(), level, 20, api.box3.getBoxTopPoint(boxes[i], 0.2, api.vector3.createEmpty()))
                    },
                    state
                )
            },
            state
        )
    }

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getJumpStompHitTerrainEventName(), _hitTerrainHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getJumpStompHitTerrainEventName())

    return state
}
