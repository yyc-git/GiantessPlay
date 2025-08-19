import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { getIsDebug } from "../../../../../Scene"
import { getVolume } from "../../../../utils/SoundUtils"
import { getValue } from "../Laserer"
import { Vector3 } from "three"
import { getSwipingEmmitGirlSoundResourceId, getSwipingEmmitOtherSoundResourceId } from "../../../../CityScene"

const _v1 = new Vector3();

let _handleSwipHit = (state: state, handleFunc, soundResourceId, position: [number, number, number]) => {
    let { emitVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getVolume(state, emitVolume, _v1.fromArray(position), 0))
    ))

    return handleFunc(state)
}

export let handleSwipHitStatic = (state: state, handleFunc, position) => {
    return _handleSwipHit(state, handleFunc, getSwipingEmmitOtherSoundResourceId(), position)
}

export let handleSwipHitGirl = (state: state, handleFunc, position) => {
    return _handleSwipHit(state, handleFunc, getSwipingEmmitGirlSoundResourceId(), position)
}

// export let handleSwipHitArmy = handleSwipHitGirl

export let handleSwipHitLittleMan = handleSwipHitGirl