import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { emitShellEmitOrExplode, handleHitArmy } from "../../../../utils/ArmyUtils"
import { Box3, Vector3 } from "three"
import { getVolume } from "../../../../utils/SoundUtils"
import { getIsDebug } from "../../../../../Scene"
import { getShellGunBarretHitSoundResourceId } from "../../../../CityScene"
import { getValue } from "../MissileVehicle"
import { explodeSize } from "../../../../data/ValueType"
import { computeHitPosition } from "../../../../utils/WeaponUtils"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export let handleMissileHitStatic = (state: state, handleFunc, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    let hitPositionVec = computeHitPosition(position, pointBox, direction, 0.8)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getShellGunBarretHitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
            hitPositionVec,
            0
        ))
    ))

    state = emitShellEmitOrExplode(state,
        hitPositionVec.toArray(),
        explodeSize.Big)

    return handleFunc(state)
}

export let handleMissileHitGirl = handleMissileHitStatic

// export let handleMissileHitArmy = handleHitArmy(handleMissileHitStatic)

export let handleMissileHitLittleMan = handleMissileHitStatic