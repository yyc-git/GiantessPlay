import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { createState, getParticleBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName, setState, getBuffProtocolName, getBuffArmyIceSingleBlockName, getBuffGiantessIceSingleBlockName, getBuffLittleManIceSingleBlockName } from "./Utils"
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
    return api.hitEffect(api, getParticleBlockName(), state, position)
}

let _handleDamageHandler = (api: api, state: state, data) => {
    let userData = api.NullableUtils.getExn(data.userData)

    let buff = api.findBuff(state, getName(), userData.fromName, api.NullableUtils.getEmpty())

    if (!api.NullableUtils.isNullable(buff)
        && !api.isEffect(userData.weaponValue.type)
    ) {
        let { superPositionCount } = api.NullableUtils.getExn(buff)
        let level = superPositionCount

        let rate = 0.1
        // let rate = 1

        let armyValue = computeValue(level)
        // let armyValue = level * 0.8

        let position = userData.damagePosition

        if (level > 0 && api.isRandomRate(api.computeRateForBuff(state, userData.fromName, rate))) {
            state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
                api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
            ))

            let name = userData.name

            let promise
            if (api.girl.isGirl(name)) {
                state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
                    return _hitEffect(api, state, damagePosition)
                })

                let giantessBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffGiantessIceSingleBlockName())

                let giantessValue = api.girl.computeAttenuationByHeightForEffect(armyValue, state, api.girl.getUsedGirlByName(name), userData.damagePartByJudge)

                // promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), life / 1000, giantessValue, {
                //     damagePart: userData.damagePartByJudge,
                //     actuallyDamageParts: userData.actuallyDamagePartsByJudge
                // })
                promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(api.girl.getUsedGirlByName(name)), giantessValue)
            }
            else if (name == api.getLittleManName()) {
                let littleManBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffLittleManIceSingleBlockName())

                promise = littleManBuffService.addBuff(api, state, name, armyValue)
            }
            else {
                state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
                    return _hitEffect(api, state, damagePosition)
                })

                let armyBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffArmyIceSingleBlockName())

                promise = armyBuffService.addBuff(api, state, name, api.NullableUtils.getEmpty(), armyValue)
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
