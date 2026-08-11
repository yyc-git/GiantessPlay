import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { Vector3 } from "three"
import { getVolume } from "../../../../utils/SoundUtils"
import { getIsDebug } from "../../../../../Scene"
import { getShellGunBarretHitSoundResourceId } from "../../../../CityScene"
import { explodeSize } from "../../../../data/ValueType"
import { handleHitArmy } from "../../../../utils/ArmyUtils2"
import { TupleUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();

export let handleFlameHitStatic = (state: state, handleFunc, position) => {
    // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
    //     SoundManager.buildNeedToPlaySoundData(getShellGunBarretHitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
    //         _v1.fromArray(position), 0
    //     ))
    // ))

    // state = emitShellEmitOrExplode(state, position, explodeSize.Big)

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleFlameHitGirl = (state: state, handleFunc, usedGirl, position) => {
    // state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
    //     SoundManager.buildNeedToPlaySoundData(getShellGunBarretHitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
    //         _v1.fromArray(position), 0
    //     ))
    // ))

    // state = emitShellEmitOrExplode(state, position, explodeSize.Big)

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleFlameHitArmy = handleHitArmy(handleFlameHitStatic)

export let handleFlameHitLittleMan = handleFlameHitStatic