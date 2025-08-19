import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { emitShellEmitOrExplode, handleHitArmy } from "../../../../utils/ArmyUtils"
import { Vector3 } from "three"
import { getVolume } from "../../../../utils/SoundUtils"
import { getValue } from "../Tank"
import { getIsDebug } from "../../../../../Scene"
import { getShellGunBarretHitSoundResourceId } from "../../../../CityScene"
import { explodeSize } from "../../../../data/ValueType"

const _v1 = new Vector3();

export let handleShellHitStatic = (state: state, handleFunc, position: [number, number, number]) => {
    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getShellGunBarretHitSoundResourceId(), getIsDebug(state), getVolume(state, getValue(state).emitterVolume,
            _v1.fromArray(position), 0
        ))
    ))

    state = emitShellEmitOrExplode(state, position, explodeSize.Middle)

    return handleFunc(state)
}

export let handleShellHitGirl = handleShellHitStatic

// export let handleShellHitArmy = handleHitArmy(handleShellHitStatic)

export let handleShellHitLittleMan = handleShellHitStatic