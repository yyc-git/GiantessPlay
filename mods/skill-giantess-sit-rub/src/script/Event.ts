import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getInsertSoundResourceId, getInsertSoundResourcePath, getRubSoundResourceId, getRubSoundResourcePath, getSitRubEventName } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getBuffProtocolName, getCharmBlockName, getEnhenceBlockName, getEnhenceInsertBlockName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getRubSoundResourceId(),
                path: [getRubSoundResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getInsertSoundResourceId(),
                path: [getInsertSoundResourcePath()],
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

let _rubHandler = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let level = api.getGiantessLevel(api, state, usedGirl, getEnhenceBlockName())

    if (level > 0) {
        return api.ArrayUtils.reducePromise(
            api.queryOBBShapeCollision(
                // api.obb.expandOBB(api.obb.makeOBBHeightMax(api.getCollisionPartOBB(state, usedGirl,  collisionPart.TrigoneAndButt)), 1.2),
                api.obb.expandOBB(api.getCollisionPartOBB(state, usedGirl, collisionPart.TrigoneAndButt), 1.2),
                state, usedGirl
            ),
            (state, data) => {
                if (api.NullableUtils.isNullable(data)) {
                    return Promise.resolve(state)
                }

                let [transforms, boxes, names] = api.NullableUtils.getExn(data)

                return api.ArrayUtils.reducePromise(
                    names,
                    (state, name, i) => {
                        return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getCharmBlockName()).addBuff(api, state, name, api.NullableUtils.getEmpty(), level, 20, api.box3.getBoxTopPoint(boxes[i], 0.2, api.vector3.createEmpty()))
                    },
                    state
                )
            },
            state
        )
    }

    return Promise.resolve(state)
}

let _computeValue = (level) => {
    return 0.2 * level
}

let _rubHandler2 = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let level = api.getGiantessLevel(api, state, usedGirl, getEnhenceInsertBlockName())

    if (level > 0) {
        if (api.isCarryFull(api, state, usedGirl, api.getUBObjectData(state, usedGirl), api.getUBBox(state, usedGirl), 0.3 / (1 + api.getUBCapacityFactor(state)))) {
            return Promise.resolve(state)
        }

        let rate = _computeValue(level)

        let data = api.queryPutDataByBox(state, usedGirl,
            api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.TrigoneAndButt)),
            rate,
            api.getUBObjectData(state, usedGirl).map(data => data.name)
        )

        if (data.length > 0) {
            state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                api.SoundManager.buildNeedToPlaySoundData(getInsertSoundResourceId(), api.getIsDebug(state),
                    api.getGiantessVolume(state, usedGirl, true)
                )
            ))
        }

        return api.event.trigger(state, api.getAbstractState, api.event.getInsertEventName(), api.buildInsertEventData(
            data,
            usedGirl
        ))
    }

    return Promise.resolve(state)
}


export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getSitRubEventName(), _rubHandler)
    state = api.event.on(state, getSitRubEventName(), _rubHandler2)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getSitRubEventName())

    return state
}
