import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { createState, getLittleManLevel, getParticleBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName, setState } from "./Utils"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { camp, damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { computeValue, getSoundResourceId, getSoundResourcePath } from "../json/Data"
import { armorPiercingForceRatio, critRatio, weaponType } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { collisionPart } from "mmd-character-protocol/src/service/ServiceType"

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

    let level = getLittleManLevel(api, state)

    // let life = 3000
    // let life = 500
    // let size = 10
    // let size = 30

    //// TODO restore
    let rate = 0.1
    // let rate = 0.3
    // let rate = 1

    //// TODO restore
    let value = computeValue(level)
    // let value = level * 0.8

    let position = userData.damagePosition

    if (userData.weaponValue.type == weaponType.Effect) {
        return Promise.resolve([state, userData])
    }

    if (level > 0 && userData.fromName == api.getLittleManName() && api.isRandomRate(rate)) {
        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
            api.SoundManager.buildNeedToPlaySoundData(getSoundResourceId(), api.getIsDebug(state), api.getVolume(state, 0.7, position, 0))
        ))


        if (api.girl.isGirl(userData.name)) {
            value = api.girl.computeAttenuationByHeightForEffect(value, state, api.girl.getUsedGirlByName(userData.name), userData.damagePartByJudge)
        }


        // let force = value * userData.damage
        let force = value * userData.forceSize
        let forceDirection = api.buildRandomDirectionInXZ()
        let damageType_ = damageType.Global
        let weaponType_ = weaponType.Effect
        let weaponValue_ = api.buildEffectWeaponValue(
            force,
            armorPiercingForceRatio.Middle,
            weaponType_,
            critRatio.Zero
        )

        if (api.girl.isGirl(userData.name)) {
            state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
                return _hitEffect(api, state, damagePosition)
            })

            let usedGirl = api.girl.getUsedGirlByName(userData.name)

            return api.damageGiantess(
                state,
                usedGirl,
                [force, damageType_, weaponType_],
                userData.fromName,
                // collisionPart.BoundingBox,
                userData.collisionPart,
                api.NullableUtils.return_(
                    position
                ),
                weaponValue_,
            ).then(state => [state, userData])
        }
        else {
            state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
                return _hitEffect(api, state, damagePosition)
            })

            return api.damageWithSingleData(
                state, [[force, forceDirection], [damageType_, weaponType_]],
                weaponValue_,
                userData.fromName,
                api.NullableUtils.return_(position),
                [
                    userData.transform,
                    userData.box,
                    userData.name
                ]
            ).then(([state, _]) => [state, userData])
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
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getHandleDamageArmyEventName())
    state = api.event.offAll(state, api.event.getHandleDamageGiantessEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
