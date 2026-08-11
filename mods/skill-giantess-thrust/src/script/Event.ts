import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getSound11ResourceId, getSound11ResourcePath, getSound12ResourceId, getSound12ResourcePath, getSound21ResourceId, getSound21ResourcePath, getSound22ResourceId, getSound22ResourcePath, getSound31ResourceId, getSound31ResourcePath, getSound32ResourceId, getSound32ResourcePath, getSound41ResourceId, getSound41ResourcePath, getSound42ResourceId, getSound42ResourcePath, getSound43ResourceId, getSound43ResourcePath, getThrustEventName } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { excitement, skillExcitement } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"
import { getEnhenceBlockName, getBuffProtocolName, getExcitementBlockName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getSound11ResourceId(),
                path: [getSound11ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound12ResourceId(),
                path: [getSound12ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound21ResourceId(),
                path: [getSound21ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound22ResourceId(),
                path: [getSound22ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound31ResourceId(),
                path: [getSound31ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound32ResourceId(),
                path: [getSound32ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound41ResourceId(),
                path: [getSound41ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound42ResourceId(),
                path: [getSound42ResourcePath()],
                type: resourceType.Audio
            },
            {
                id: getSound43ResourceId(),
                path: [getSound43ResourcePath()],
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
                case "KeyE":
                    return api.triggerGirlAction(state, usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _thrustHandler = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let pickObjectData = api.getPickObjectData(state, usedGirl)
    let count = pickObjectData.size

    if (count == 0) {
        return Promise.resolve(state)
    }

    state = api.addExcitement(state, usedGirl,
        api.NumberUtils.clamp(
            count * 0.5,
            // excitement.High + excitement.Middle,
            // excitement.High + excitement.High,
            skillExcitement.Low,
            skillExcitement.High2
        )
    )




    // let force = api.NumberUtils.clamp(
    //     count * 3 * api.box3.getBoxVolumn(api.getPickObjectBox(state, usedGirl)) * (api.getExcitementBuffSuperPositionCount(api, state, usedGirl) + 1),
    //     api.girl.getFullHp(state, usedGirl) * 0.01,
    //     api.girl.getFullHp(state, usedGirl) * 0.08
    // )
    let force = api.NumberUtils.lessThan(
        // count * 3 * api.box3.getBoxVolumn(api.getPickObjectBox(state, usedGirl)) * (api.getExcitementBuffSuperPositionCount(api, state, usedGirl) + 1),
        api.getPickObjectTotalBoxVolume(state, usedGirl) * (api.getExcitementBuffSuperPositionCount(api, state, usedGirl) + 1),
        // api.girl.getFullHp(state, usedGirl) * 0.01,
        // api.girl.getFullHp(state, usedGirl) * 0.05
        api.girl.getFullHp(state, usedGirl) * 0.025
    )
    let damageType_ = damageType.Global
    let weaponType_ = weaponType.EffectSelf

    let level = api.getGiantessLevel(api, state, usedGirl, getEnhenceBlockName())

    let promise
    if (level > 0) {
        promise = api.ArrayUtils.reducePromise(
            api.getPickObjectData(state, usedGirl).toArray(),
            (state, data) => {
                let { getBoxFunc, queue, index, name } = data

                return api.NullableUtils.getWithDefault(
                    api.NullableUtils.map(box => {
                        return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getExcitementBlockName()).addBuff(api, state, name, api.NullableUtils.getEmpty(), level, 60, api.box3.getBoxTopPoint(box, 0.2, api.vector3.createEmpty()))
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
    })
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getThrustEventName(), _thrustHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getThrustEventName())

    return state
}
