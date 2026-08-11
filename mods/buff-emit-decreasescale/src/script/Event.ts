import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, getParticleBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName, setState } from "./Utils"
import { service } from "buff-protocol/src/service/ServiceType"
import { computeValue, getName, getSoundResourceId, getSoundResourcePath } from "../json/Data"
import { weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"

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

let _hitEffect = (api: api, state, position) => {
    return api.hitEffect(api, getParticleBlockName(), state, position, {
        speed: 1,
        life: 600,
        size: 5,
        position: position.toArray(),
    })
}


let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buff
    if (api.girl.isGirl(userData.fromName)) {
        let usedGirl = api.girl.getUsedGirlByName(userData.fromName)
        buff = api.findBuff(state, getName(), userData.fromName, usedGirl)
    }
    else {
        buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.getEmpty())
    }

    if (!api.NullableUtils.isNullable(buff)
        && !api.isEffect(userData.weaponValue.type)
    ) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let value = computeValue(level)

        let name = userData.name

        let isGirl = api.girl.isGirl(name)
        let isEliteGiantess = api.isEliteGiantess(state, name)

        if (level > 0 && (isGirl || isEliteGiantess)
            && api.NumberUtils.isRandomRate(api.computeRateForBuff(state, userData.fromName, 0.05))
        ) {
            let position = userData.damagePosition

            if (isGirl
                && !api.isBossLevel(state)
            ) {
                let usedGirl = api.girl.getUsedGirlByName(userData.name)
                state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                    api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
                ))

                state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
                    return _hitEffect(api, state, damagePosition)
                })

                state = api.setGirlScaleAndKeepCamera(state,usedGirl, api.getGirlScale(state, usedGirl) * (1 - value))
                // state = api.girl.computeGirlBoxAndNotChangeCenterXY(state)
            }
            else if (isEliteGiantess) {
                state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                    api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
                ))

                state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
                    return _hitEffect(api, state, damagePosition)
                })

                let data = api.scaleEliteGiantess(api, state, sizeY => {
                    return sizeY * (1 - value)
                }, [api.getArmyTransformByName(state, name), api.getArmyBoxByName(state, name)], name)
                state = data[0]
            }

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
