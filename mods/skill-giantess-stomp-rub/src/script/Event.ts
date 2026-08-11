import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getLaughSoundResourceId, getLaughSoundResourcePath, getStompRubEventName, getStompRubSoundResourceId, getStompRubSoundResourcePath } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getEnhencePutToShoeBlockName } from "./Utils"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getStompRubSoundResourceId(),
                path: [getStompRubSoundResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getLaughSoundResourceId(),
                path: [getLaughSoundResourcePath()],
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
                case "KeyR":
                    return api.triggerGirlAction(state, usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _computeValue = (level) => {
    return 0.2 * level
}

let _rubHandler = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let level = api.getGiantessLevel(api, state, usedGirl, getEnhencePutToShoeBlockName())

    if (level > 0) {
        if (api.isCarryFull(api, state, usedGirl, api.getPutToBreastObjectData(state, usedGirl), api.getPutToBreastBox(state, usedGirl), 0.2)) {
            return Promise.resolve(state)
        }

        let rate = _computeValue(level)

        let data = api.queryPutDataByBox(state, usedGirl,
            api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.RightFoot)),
            rate,
            api.getPutToShoeObjectData(state, usedGirl).map(data => data.name)
        )

        if (data.length > 0) {
            state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                api.SoundManager.buildNeedToPlaySoundData(getLaughSoundResourceId(), api.getIsDebug(state),
                    api.getGiantessVolume(state, usedGirl, true)
                )
            ))
        }

        return api.event.trigger(state, api.getAbstractState, api.event.getPutToShoeEventName(), api.buildPutToShoeEventData(
            data,
            usedGirl
        ))
    }

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getStompRubEventName(), _rubHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getStompRubEventName())

    return state
}
