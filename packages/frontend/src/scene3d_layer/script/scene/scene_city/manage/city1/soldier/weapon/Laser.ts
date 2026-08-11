import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { getLaserBulletGunHitSoundResourceId } from "../../../../CityScene"
import { getIsDebug } from "../../../../../Scene"
import { getVolume } from "../../../../utils/SoundUtils"
import { Vector3 } from "three"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { getValue } from "../../../../weapon/LaserGun"
import { handleHitArmy } from "../../../../utils/ArmyUtils2"
import { TupleUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();

export let handleLaserHitStatic = (state: state, handleFunc, position) => {
    let { emitterVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getLaserBulletGunHitSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume, _v1.fromArray(position), 0))
    ))

    state = setAbstractState(state, ParticleManager.emitLaserBulletHit(getAbstractState(state), {
        speed: 1,
        life: 500,
        size: 3,
        // size: 6,
        position: position
    }))


    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleLaserHitGirl = (state: state, handleFunc, usedGirl, position) => {
    let { emitterVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getLaserBulletGunHitSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume, _v1.fromArray(position), 0))
    ))

    state = setAbstractState(state, ParticleManager.emitLaserBulletHit(getAbstractState(state), {
        speed: 1,
        life: 500,
        size: 3,
        // size: 6,
        position: position
    }))


    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleLaserHitArmy = handleHitArmy(handleLaserHitStatic)

export let handleLaserHitLittleMan = handleLaserHitStatic