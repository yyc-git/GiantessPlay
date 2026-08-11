import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getActionName, getShoutSoundResourceId, getShoutSoundResourcePath, getSprayMilkEventName } from "../json/Data"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType, fontType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
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
                case "KeyH":
                    return api.triggerGirlAction(state, usedGirlEnum.PlayerGirl, getActionName()).then(api.TupleUtils.getTuple2First)
                default:
                    return Promise.resolve(state)
            }
            break
    }

    return Promise.resolve(state)
}

let _sprayMilkHandler = (api: api, state: state, { userData }) => {
    let { usedGirl } = userData

    let breastScaleFactor = api.getBreastVolumnFactor(state, usedGirl, 0.25, 5)

    // const distance = api.box3.getBoxMaxSize(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl,  collisionPart.RightBreast))) * 2
    const distance = api.box3.getBoxMaxSize(api.obb.toBox3(api.getCollisionPartOBB(state, usedGirl, collisionPart.RightBreast))) * 4
    const addHpRatio = 0.25 * breastScaleFactor

    let position = api.getGirlPosition(state, usedGirl)
    // let force = api.NumberUtils.greaterThan(api.girl.getBodyHp(state, usedGirl) * 0.2, 50)
    let force = api.NumberUtils.greaterThan(api.girl.getBodyHp(state, usedGirl) * 0.05, 50)
    let collisionPart_ = collisionPart.BoundingBox
    let damageType_ = damageType.Global
    let weaponType_ = weaponType.EffectSelf



    state = api.partialScaleBreast(state, usedGirl, api.limitBreastRatio(state, usedGirl, api.getBreastPartialScaleRatio(state, usedGirl) - 0.3))


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
        api.girl.buildNameByUsedGirl(usedGirl),

        collisionPart_,
        // api.NullableUtils.return_(
        //     api.getCollisionPartCenter(state,usedGirl,  collisionPart_)
        // ),
        position,
        api.buildGirlWeaponValue(
            force,
            armorPiercingForceRatio.VeryHigh2,
            critRatio.Zero,
        ),
    ).then(state => {
        state = api.getNearTargets(state, position, distance).reduce((state, { name, index, queue }) => {
            return api.TupleUtils.getTuple2First(api.healArmy(api, state, addHpRatio, name, api.NullableUtils.getExn(queue).getBox(index)))
        }, state)

        if (api.vector3.distanceTo(
            api.getLittleManWorldPosition(state),
            position
        ) < distance) {
            state = api.addLittleManHp(
                state,
                Math.round(api.getLittleManFullHp(state) * addHpRatio)
            )
        }

        return state
    })
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getKeydownEventName(), _keydownHandler)
    state = api.event.on(state, getSprayMilkEventName(), _sprayMilkHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getKeydownEventName())
    state = api.event.offAll(state, getSprayMilkEventName())

    return state
}
