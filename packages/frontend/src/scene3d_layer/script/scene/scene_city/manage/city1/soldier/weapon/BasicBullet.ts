import { ParticleManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { handleHitArmy } from "../../../../utils/ArmyUtils"

let _emitBasicBulletHit = (state: state, position: [number, number, number]) => {
    return setAbstractState(state, ParticleManager.emitBulletHit(getAbstractState(state), {
        speed: 1,
        life: 500,
        size: 4,
        position: position
    }))
}

export let handleBasicBulletHitStatic = (state: state, handleFunc, position) => {
    state = _emitBasicBulletHit(state, position)

    return handleFunc(state)
}

export let handleBasicBulletHitGirl = handleBasicBulletHitStatic

export let handleBasicBulletHitArmy = handleHitArmy(handleBasicBulletHitStatic)

export let handleBasicBulletHitLittleMan = handleBasicBulletHitStatic
