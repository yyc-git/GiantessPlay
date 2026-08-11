import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { getMagicAttack1Data, getFireballHitSoundResourceId } from "../json/Data";
import { service as particleShareService } from "particle-share-protocol/src/service/ServiceType"
import { service as particleService } from "particle-protocol/src/service/ServiceType"
import { getParticleBulletEmitBlockName, getParticleBulletHitBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName } from "./Utils";
import { TupleUtils } from "meta3d-jiehuo-abstract";

let _emitMagicAttack1Hit = (api: api, state: state, position: [number, number, number], weaponValue) => {
    // let { emitterVolume, emitterSize } = getMagicAttack1Data(api, state)
    let { emitterVolume, emitterSize } = weaponValue

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getFireballHitSoundResourceId(), api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
    ))

    return api.blockAPI.getBlockService<particleShareService>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
        [
            api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletHitBlockName()),
            state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBulletHitBlockName()),
            (state, blockState) => {
                return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBulletHitBlockName(), blockState)
            }
        ],
        api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletHitBlockName()).getParticleType(),
        {
            speed: 1,
            life: 800,
            size: 12 * emitterSize / getMagicAttack1Data(api, state).emitterSize,
            position: position
        })
}

export let handleMagicAttack1HitGirl = (api: api) => (
    state: state, handleFunc, usedGirl,
    position, _, _d, weaponValue) => {
    state = _emitMagicAttack1Hit(api, state, position, weaponValue)

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleMagicAttack1HitStatic = (api: api) => (
    state: state, handleFunc,
    position, _, _d, weaponValue) => {
    state = _emitMagicAttack1Hit(api, state, position, weaponValue)

    return handleFunc(state).then(TupleUtils.getTuple2First)
}


export let emitParticleEmit = (api: api, state: state, param, needCollisionCheckLoopCount: number) => {
    return api.blockAPI.getBlockService<particleShareService>(state, getParticleShareProtocolName(), getParticleShareBlockName()).emit(state,
        [
            api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletEmitBlockName()),
            state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBulletEmitBlockName()),
            (state, blockState) => {
                return api.blockAPI.setBlockState(state, getParticleProtocolName(), getParticleBulletEmitBlockName(), blockState)
            }
        ],
        api.blockAPI.getBlockService<particleService>(state, getParticleProtocolName(), getParticleBulletEmitBlockName()).getParticleType(),
        param, needCollisionCheckLoopCount)
}

export let getAllParticlesForCollisionCheck = (api: api) => (_, state: state) => {
    return api.blockAPI.getBlockService<particleShareService>(state, getParticleShareProtocolName(), getParticleShareBlockName()).getAllParticlesForCollisionCheck(state,
        state => api.blockAPI.getBlockState<any>(state, getParticleProtocolName(), getParticleBulletEmitBlockName())
    )
}