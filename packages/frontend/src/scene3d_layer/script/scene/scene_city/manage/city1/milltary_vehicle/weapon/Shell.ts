import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { emitShellEmitOrExplode } from "../../../../utils/ArmyUtils"
import { Vector3 } from "three"
import { getVolume } from "../../../../utils/SoundUtils"
import { getIsDebug } from "../../../../../Scene"
import { getShellGunBarretHitSoundResourceId } from "../../../../CityScene"
import { explodeSize } from "../../../../data/ValueType"
import { getValue } from "../../../../weapon/ShellGunBarrel"
import { handleHitArmy } from "../../../../utils/ArmyUtils2"
import { TupleUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();

export let handleShellHitStatic = (state: state, handleFunc, position: [number, number, number]) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getShellGunBarretHitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
            _v1.fromArray(position), 0
        ))
    ))

    state = emitShellEmitOrExplode(state, position, explodeSize.Middle)

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleShellHitGirl = (state: state, handleFunc, usedGirl, position: [number, number, number]) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getShellGunBarretHitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
            _v1.fromArray(position), 0
        ))
    ))

    state = emitShellEmitOrExplode(state, position, explodeSize.Middle)

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleShellHitArmy = handleHitArmy(handleShellHitStatic)

export let handleShellHitLittleMan = handleShellHitStatic