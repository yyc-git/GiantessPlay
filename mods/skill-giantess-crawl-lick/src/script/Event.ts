import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getCrawlLickEventName, getLickResourceId, getLickResourcePath } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getBuffProtocolName, getBlurBlockName, getEnhenceBlurBlockName, getEnhenceEatBlockName } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getLickResourceId(),
                path: [getLickResourcePath()],
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
                case "KeyT":
                    return api.triggerGirlAction(state, usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _lickHandler1 = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let level = api.getGiantessLevel(api, state, usedGirl, getEnhenceBlurBlockName())

    if (level > 0) {
        return api.ArrayUtils.reducePromise(
            api.queryOBBShapeCollision(
                // api.obb.expandOBB(api.obb.makeOBBHeightMax(api.getCollisionPartOBB(state, usedGirl,  collisionPart.Head)), 0.7),
                // api.obb.expandOBB(api.getCollisionPartOBB(state, usedGirl,  collisionPart.Head), 0.7),
                api.getCollisionPartOBB(state, usedGirl, collisionPart.Head),
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
                        return api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBlurBlockName()).addBuff(api, state, name, api.NullableUtils.getEmpty(), level, 20, api.box3.getBoxTopPoint(boxes[i], 0.2, api.vector3.createEmpty()))
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

let _computeEatData = (api: api, state, [transforms, boxes, names], rate) => {
    return names.reduce(([transforms_, boxes_, names_], name, i) => {
        if (
            !api.isStatic(state, name)
            && api.NumberUtils.isRandomRate(rate)
        ) {
            return [
                api.ArrayUtils.push(transforms_, transforms[i]),
                api.ArrayUtils.push(boxes_, boxes[i]),
                api.ArrayUtils.push(names_, name),
            ]
        }

        return [transforms_, boxes_, names_]
    }, [[], [], []])
}

let _lickHandler2 = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData
    let level = api.getGiantessLevel(api, state, usedGirl, getEnhenceEatBlockName())

    if (level > 0) {
        return api.ArrayUtils.reducePromise(
            api.queryOBBShapeCollision(
                // api.obb.expandOBB(api.obb.makeOBBHeightMax(api.getCollisionPartOBB(state, usedGirl,  collisionPart.Head)), 0.7),
                // api.obb.expandOBB(api.getCollisionPartOBB(state, usedGirl,  collisionPart.Head), 0.7),
                api.getCollisionPartOBB(state, usedGirl, collisionPart.Head),
                state, usedGirl
            ),
            (state, data) => {
                if (api.NullableUtils.isNullable(data)) {
                    return Promise.resolve(state)
                }

                let rate = _computeValue(level)
                // let rate = 1

                let [transforms, boxes, names] = _computeEatData(api, state, api.NullableUtils.getExn(data), rate)

                return api.damageWithMultipleData(state, [
                    [api.getMaxForce(), api.buildRandomDirectionInXZ()],
                    [
                        damageType.Direct, weaponType.Body
                    ]
                ],
                    api.buildFakeGirlWeaponValue(state, usedGirl, api.getMaxForce()),
                    api.girl.buildNameByUsedGirl(usedGirl),
                    api.getGirlPosition(state, usedGirl),
                    [transforms, boxes, names]
                ).then(api.TupleUtils.getTuple2First)
                    .then(state => {
                        return api.handleEat(
                            state, usedGirl, names, boxes
                        )
                    })
            },
            state
        )
    }

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getCrawlLickEventName(), _lickHandler1)
    state = api.event.on(state, getCrawlLickEventName(), _lickHandler2)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getCrawlLickEventName())

    return state
}
