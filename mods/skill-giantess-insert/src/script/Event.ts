import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import {
    getActionName,
    getBigInsertSound1ResourceId, getBigInsertSound1ResourcePath,
    getBigInsertSound2ResourceId, getBigInsertSound2ResourcePath,
    getBigInsertSound3ResourceId, getBigInsertSound3ResourcePath,
    getBigInsertSound4ResourceId, getBigInsertSound4ResourcePath, getSmallInsertSound1ResourceId, getSmallInsertSound1ResourcePath, getSmallInsertSound2ResourceId, getSmallInsertSound2ResourcePath, getSmallInsertSound3ResourceId, getSmallInsertSound3ResourcePath, getSmallInsertSound4ResourceId, getSmallInsertSound4ResourcePath, getKeepSoundResourceId, getKeepSoundResourcePath, getBigInsertEventName, getSmallInsert1EventName, getSmallInsert2EventName, getSmallInsert3EventName, getSmallInsert4EventName,
} from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { excitement, skillExcitement } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"
import { createState, getPickObjectData, getState, setPickObjectData, setState } from "./Utils"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getBigInsertSound1ResourceId(),
                path: [getBigInsertSound1ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getBigInsertSound2ResourceId(),
                path: [getBigInsertSound2ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getBigInsertSound3ResourceId(),
                path: [getBigInsertSound3ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getBigInsertSound4ResourceId(),
                path: [getBigInsertSound4ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSmallInsertSound1ResourceId(),
                path: [getSmallInsertSound1ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSmallInsertSound2ResourceId(),
                path: [getSmallInsertSound2ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSmallInsertSound3ResourceId(),
                path: [getSmallInsertSound3ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSmallInsertSound4ResourceId(),
                path: [getSmallInsertSound4ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getKeepSoundResourceId(),
                path: [getKeepSoundResourcePath()],
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

let _addExcitement = (api, state, usedGirl, count, isAdd) => {
    // let e
    // if (isAdd) {
    //     e = skillExcitement.VeryHigh
    // }
    // else {
    //     e = excitement.Zero
    // }

    return api.addExcitement(state, usedGirl,
        api.NumberUtils.clamp(
            count * 0.5,
            // e + excitement.Middle,
            // e + excitement.VeryHigh,
            skillExcitement.Middle,
            skillExcitement.MostHigh
        )
    )
}

let _computeForce = (api, state, usedGirl, factor) => {
    let totalBoxVolume = getPickObjectData(api, state).reduce((volume, { getBoxFunc, queue, index, name }) => {
        return volume + api.NullableUtils.getWithDefault(
            api.NullableUtils.map(api.box3.getBoxVolumn, getBoxFunc(state, queue, index, name)),
            0
        )
    }, 0)

    return api.NumberUtils.lessThan(
        // count * 3 * api.box3.getBoxVolumn(api.getPickObjectBox(state, usedGirl)) * (api.getExcitementBuffSuperPositionCount(api, state, usedGirl) + 1) * factor,
        totalBoxVolume * (api.getExcitementBuffSuperPositionCount(api, state, usedGirl) + 1) * factor,
        // api.girl.getFullHp(state, usedGirl) * 0.01,
        // api.girl.getFullHp(state, usedGirl) * 0.08
        // api.girl.getFullHp(state, usedGirl) * 0.05
        api.girl.getFullHp(state, usedGirl) * 0.025
    )
}

let _damageGiantess = (api, state, usedGirl, force, pickObjectData) => {
    let damageType_ = damageType.Global
    let weaponType_ = weaponType.EffectSelf

    return api.damageGiantess(
        state,
        usedGirl,
        [
            force,
            // damageType.Direct,
            // weaponType.Body
            damageType_,
            weaponType_
        ],
        // api.buildEmptyEnemyName(),
        // pickObjectData.first().name,
        api.girl.buildNameByUsedGirl(usedGirl),

        collisionPart.TrigoneAndButt,
        api.NullableUtils.return_(
            api.getCollisionPartCenter(state, usedGirl, collisionPart.TrigoneAndButt)
        ),
        api.buildGirlWeaponValue(
            force,
            armorPiercingForceRatio.VeryHigh2,
            critRatio.Zero,
        ),
    )
}


let _bigInsertHander = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    // let pickObjectData = api.getPickObjectData(state, usedGirl)
    let pickObjectData = getPickObjectData(api, state)
    let count = pickObjectData.size

    if (count == 0) {
        return Promise.resolve(state)
    }

    state = setState(api, state, {
        ...getState(api, state),
        pickObjectData
    })

    state = _addExcitement(api, state, usedGirl, count, true)
    return _damageGiantess(api, state, usedGirl, _computeForce(api, state, usedGirl, 2), pickObjectData)
}

let _smallInsert1Hander = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData

    state = setPickObjectData(api, state, api.getPickObjectData(state, usedGirl))

    return api.isCarryFull(api, state, usedGirl, api.getUBObjectData(state, usedGirl), api.getUBBox(state, usedGirl), 0.3 / (1 + api.getUBCapacityFactor(state))) ? Promise.resolve(state) : api.event.trigger(state, api.getAbstractState, api.event.getInsertEventName(), api.buildInsertEventData(
        getPickObjectData(api, state).toArray().map(data => {
            return [
                data.queue,
                data.index,
                data.name,
                data.originTransform,
                data.originBox
            ]
        }),
        usedGirl
    )).then(state => {
        let pickObjectData = getPickObjectData(api, state)
        let count = pickObjectData.size

        if (count == 0) {
            return Promise.resolve(state)
        }

        state = _addExcitement(api, state, usedGirl, count, false)
        return _damageGiantess(api, state, usedGirl, _computeForce(api, state, usedGirl, 1), pickObjectData)
    })
}

let _smallInsert2Hander = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let pickObjectData = getPickObjectData(api, state)
    let count = pickObjectData.size

    if (count == 0) {
        return Promise.resolve(state)
    }

    state = _addExcitement(api, state, usedGirl, count, false)
    return _damageGiantess(api, state, usedGirl, _computeForce(api, state, usedGirl, 1), pickObjectData)
}


let _smallInsert3Hander = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let pickObjectData = getPickObjectData(api, state)
    let count = pickObjectData.size

    if (count == 0) {
        return Promise.resolve(state)
    }

    state = _addExcitement(api, state, usedGirl, count, false)
    return _damageGiantess(api, state, usedGirl, _computeForce(api, state, usedGirl, 1), pickObjectData)
}

let _smallInsert4Hander = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let pickObjectData = getPickObjectData(api, state)
    let count = pickObjectData.size

    if (count == 0) {
        return Promise.resolve(state)
    }

    state = _addExcitement(api, state, usedGirl, count, false)
    return _damageGiantess(api, state, usedGirl, _computeForce(api, state, usedGirl, 1), pickObjectData)
}

let _disposeHandler = (api: api, state: state, _) => {
    state = setState(api, state, createState(api))

    state = api.setAbstractState(state, api.SoundManager.stop(api.getAbstractState(state), getKeepSoundResourceId()))

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getBigInsertEventName(), _bigInsertHander)
    state = api.event.on(state, getSmallInsert1EventName(), _smallInsert1Hander)
    state = api.event.on(state, getSmallInsert2EventName(), _smallInsert2Hander)
    state = api.event.on(state, getSmallInsert3EventName(), _smallInsert3Hander)
    state = api.event.on(state, getSmallInsert4EventName(), _smallInsert4Hander)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getBigInsertEventName())
    state = api.event.offAll(state, getSmallInsert1EventName())
    state = api.event.offAll(state, getSmallInsert2EventName())
    state = api.event.offAll(state, getSmallInsert3EventName())
    state = api.event.offAll(state, getSmallInsert4EventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
