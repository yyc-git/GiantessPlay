import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { getIsDebug } from "../../../../../Scene"
import { getVolume } from "../../../../utils/SoundUtils"
import { Vector3 } from "three"
import { getSwipingEmmitGirlSoundResourceId, getSwipingEmmitOtherSoundResourceId } from "../../../../CityScene"
import { getValue } from "../../../../weapon/SwipingWeapon"
import { handleHitArmy } from "../../../../utils/ArmyUtils2"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { handleRepel } from "../../../../little_man/LittleMan"

const _v1 = new Vector3();

let _handleSwipHit = (state: state, handleFunc, soundResourceId, position: [number, number, number]) => {
    let { emitterVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(soundResourceId, getIsDebug(state), getVolume(state, emitterVolume, _v1.fromArray(position), 0))
    ))

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleSwipHitStatic = (state: state, handleFunc, position) => {
    return _handleSwipHit(state, handleFunc, getSwipingEmmitOtherSoundResourceId(), position)
}

export let handleSwipHitGirl = (state: state, handleFunc, usedGirl, position) => {
    return _handleSwipHit(state, handleFunc, getSwipingEmmitGirlSoundResourceId(), position)
}

export let handleSwipHitArmy = handleHitArmy(handleSwipHitGirl)

export let handleSwipHitLittleMan = (state: state, handleFunc, position, box, forceDirection: Vector3) => {
    return _handleSwipHit(state, handleFunc, getSwipingEmmitGirlSoundResourceId(), position)
        // .then(state => {
        //     return handleRepel(state, forceDirection, 10, 1000)
        // })
}