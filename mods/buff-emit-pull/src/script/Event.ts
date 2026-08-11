import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, setState } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { getName } from "../json/Data"
import { weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getSoundResourceId, getSoundResourcePath } from "../json/Data"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getSoundResourceId(),
                path: [getSoundResourcePath()],
                type: resourceType.Audio
            },
        ]
    )

    return Promise.resolve(state)
}


let _computeValue = (level) => {
    // if (api.isGiantessCharacterType(state)) {
    //     return level * 0.3
    // }

    return level * 0.1
}

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    // let buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.return_(usedGirl))
    let buff
    if (api.girl.isGirl(userData.fromName)) {
        buff = api.findBuff(state, getName(), userData.fromName, api.girl.getUsedGirlByName(userData.fromName))
    }
    else {
        buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.getEmpty())
    }


    if (!api.NullableUtils.isNullable(buff)
        && !api.isEffect(userData.weaponValue.type)
        && userData.damageType == damageType.Range
    ) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let value = _computeValue(level)
        // let value = 1

        if (level > 0
            && api.getHeightByBox(userData.box) <= 50
            && api.isRandomRate(api.computeRateForBuff(state, userData.fromName, value, 1, 3))) {
            let position = userData.damagePosition
            position = api.vector3.setY(
                api.vector3.clone(position),
                api.getPositionY(state, position.x, position.z)
            )


            let offset
            if (api.isRangeWeapon(userData.weaponValue)) {
                offset = 1
            }
            else {
                offset = 3
            }


            let targetPosition = api.addRandomOffset(position, api.vector3.create(offset, 0, offset))
            if (api.isNotInMovableRanges(state, api.girl.getUsedGirlByName(userData.name), targetPosition)) {
                // targetPosition = position
                return Promise.resolve([state, userData])
            }

            state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
            ))

            let name = userData.name

            let promise
            if (api.girl.isGirl(name)) {
                promise = api.girl.updatePosition(state, api.girl.getUsedGirlByName(userData.name), targetPosition)
            }
            else if (name == api.getLittleManName()) {
                promise = Promise.resolve(api.littleMan.updatePosition(state, targetPosition))
            }
            else {
                promise = api.updateArmyPositionByName(state, name, targetPosition)
            }

            return promise.then(state => [state, userData])
        }
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
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageArmyEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageGiantessEventName(), _handleDamageHandler)
    state = api.event.onWithUserData(state, api.event.getHandleDamageLittleManEventName(), _handleDamageHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getHandleDamageLittleManEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
