import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { getShotBulletHitSoundResourceId, getWeaponValue } from "../json/Data";
import { service as particleService } from "particle-protocol/src/service/ServiceType"
import { service as particleShareService } from "particle-share-protocol/src/service/ServiceType"
import { getParticleBulletEmitBlockName, getParticleBulletHitBlockName, getParticleProtocolName, getParticleShareBlockName, getParticleShareProtocolName } from "./Utils";

let _emitShotBulletHit = (api: api, state: state, position: [number, number, number]) => {
    let { emitterVolume } = getWeaponValue(api, state)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(getShotBulletHitSoundResourceId(), api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
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
            life: 500,
            size: 3,
            position: position
        })
}

export let handleShotBulletHitStatic = (api: api) => (state: state, handleFunc, position) => {
    state = _emitShotBulletHit(api, state, position)

    return handleFunc(state).then(api.TupleUtils.getTuple2First)
}

export let handleShotBulletHitGirl = (api: api) => (state: state, handleFunc, usedGirl, position) => {
    state = _emitShotBulletHit(api, state, position)

    return handleFunc(state).then(api.TupleUtils.getTuple2First)
}

export let handleShotBulletHitArmy = (api: api) => api.handleHitArmy(handleShotBulletHitStatic(api))

export let handleShotBulletHitLittleMan = handleShotBulletHitStatic

export let emitParticleEmit = (api: api) => (state: state, param, needCollisionCheckLoopCount: number) => {
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