import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { emitShellEmitOrExplode, handleHitArmy } from "../../../../utils/ArmyUtils"
import { getLaserBulletGunHitSoundResourceId } from "../../../../CityScene"
import { getIsDebug } from "../../../../../Scene"
import { getVolume } from "../../../../utils/SoundUtils"
import { getValue } from "../Laserer"
import { Vector3 } from "three"
import { ParticleManager } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();

export let handleLaserHitStatic = (state: state, handleFunc, position) => {
    let { emitVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getLaserBulletGunHitSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, _v1.fromArray(position), 0))
    ))

    state = setAbstractState(state, ParticleManager.emitLaserBulletHit(getAbstractState(state), {
        speed: 1,
        life: 500,
        // size: 2,
        size: 6,
        position: position
    }))


    return handleFunc(state)
}

export let handleLaserHitGirl = handleLaserHitStatic

export let handleLaserHitArmy = handleHitArmy(handleLaserHitStatic)

export let handleLaserHitLittleMan = handleLaserHitStatic