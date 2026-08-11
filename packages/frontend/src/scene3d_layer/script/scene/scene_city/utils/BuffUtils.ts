import { api } from "type-api/src/Type"
import { state } from "../../../../type/StateType"
import { service } from "buff-protocol/src/service/ServiceType"
import { isArmy } from "./ArmyUtils"

export let getParticleProtocolName = () => "particle-protocol"

export let getParticleShareProtocolName = () => "particle-share-protocol"

export let getParticleShareBlockName = () => "particle-share-default"

export let getBuffProtocolName = () => "buff-protocol"

export let hitEffect = (api: api, particleBlockName, state, position, emitParam = {
    speed: 1,
    life: 600,
    size: 10,
    position: position.toArray(),
}) => {
    return api.blockAPI.getBlockService<any>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
        [
            api.blockAPI.getBlockService(state, getParticleProtocolName(), particleBlockName),
            state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), particleBlockName),
            (state, blockState) => {
                return api.blockAPI.setBlockState(state, getParticleProtocolName(), particleBlockName, blockState)
            }
        ],
        api.blockAPI.getBlockService<any>(state, getParticleProtocolName(), particleBlockName).getParticleType(),
        emitParam
    )
}

export let addBuff = (api: api, state: state,
    targetName, usedGirl, count, lastTime, damagePosition,
    soundResourceId,
    buffLittleManBlockName,
    buffArmyBlockName,
    particleBlockName,
    emitParam = {
        speed: 1,
        life: 600,
        size: 10,
        position: damagePosition.toArray(),
    }
) => {
    // return api.addBuff(state, getName(), targetName, usedGirl, getLastTime(), count, getCharacterType())

    // let { superPositionCount } = api.NullableUtils.getExn(buff)
    // let level = superPositionCount

    // let rate = 0.1
    // // let rate = 1

    // let armyValue = computeValue(level)
    // // let armyValue = level * 0.8

    // let position = userData.damagePosition

    // if (!api.NullableUtils.isNullable(damagePosition)) {
    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, 0.7, damagePosition, 0))
    ))
    // }


    let name = targetName

    let promise
    // if (api.girl.isGirl(name)) {
    //     state = api.setGiantessAddHitEffectFunc(state, (state: state, fromName, damagePosition, damageType_, armorType_) => {
    //         return _hitEffect(api, state, damagePosition)
    //     })

    //     let giantessBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), getBuffGiantessExcitementBlockName())

    //     let giantessValue = api.girl.computeAttenuationByHeightForEffect(armyValue, state, userData.damagePartByJudge)

    //     // promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), life / 1000, giantessValue, {
    //     //     damagePart: userData.damagePartByJudge,
    //     //     actuallyDamageParts: userData.actuallyDamagePartsByJudge
    //     // })
    //     promise = giantessBuffService.addBuff(api, state, name, api.NullableUtils.return_(usedGirl), giantessValue)
    // }
    if (name == api.getLittleManName()) {
        let littleManBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), buffLittleManBlockName)

        promise = littleManBuffService.addBuff(api, state, name, count, lastTime)
    }
    else if (isArmy(state, name)) {
        // state = api.setArmyAddHitEffectFunc(state, (state: state, fromName, targetName, damagePosition, damageType_, weaponValue_, armorType_) => {
        //     return _hitEffect(api, state, damagePosition)
        // })

        let armyBuffService = api.blockAPI.getBlockService<service>(state, getBuffProtocolName(), buffArmyBlockName)

        promise = armyBuffService.addBuff(api, state, name, api.NullableUtils.getEmpty(), count, lastTime)
            .then(state => {
                return hitEffect(api, particleBlockName, state, damagePosition, emitParam)
            })
    }
    else {
        promise = Promise.resolve(state)
    }

    return promise
}