import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { getSwipingData, getSwipingEmmitGirlSoundResourceId, getSwipingEmmitOtherSoundResourceId } from "../json/Data";

let _emitHit = (api: api, state, position, box) => {
    state = api.setAbstractState(state, api.ParticleManager.emitSwipingHit(api.getAbstractState(state), {
        speed: 1,
        life: 500,
        size: api.vector3.getLength(api.box3.getSize(box, api.vector3.getTempVector1())) * 2,
        // position: api.vector3.toArray(position, [])
        position: position
    }))

    return state
}

let _handleSwipingHit = (api: api, state: state, handleFunc, soundResourceId, position: [number, number, number], box) => {
    let { emitterVolume } = getSwipingData(api, state)

    state = _emitHit(api, state, position, box)

    state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
        api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
    ))

    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleSwipHitStatic = (api: api) => (state: state, handleFunc, position, box) => {
    return _handleSwipingHit(api, state, handleFunc, getSwipingEmmitOtherSoundResourceId(), position, box)
}

export let handleSwipHitGirl = (api: api) => (state: state, handleFunc, usedGirl, position, box) => {
    return _handleSwipingHit(api, state, handleFunc, getSwipingEmmitGirlSoundResourceId(), position, box)
}

let _handleSwipHitArmy = (api: api) => (state: state, handleFunc, position, box,
    particleDirection,
    data,
) => {
    // return api.ArrayUtils.reducePromise(
    //     data,
    //     (state, d) => {
    //         return api.handleRepel(
    //             state,
    //             particleDirection, 10, 1000,
    //             d
    //         )
    //     },
    //     state
    // ).then(state => {
    //     return _handleSwipingHit(api, state, handleFunc, getSwipingEmmitOtherSoundResourceId(), position, box)
    // })
    return _handleSwipingHit(api, state, handleFunc, getSwipingEmmitOtherSoundResourceId(), position, box)
}


// export let handleSwipHitArmy = (api: api) => api.handleHitArmy(handleSwipHitStatic(api))
export let handleSwipHitArmy = (api: api) => api.handleHitArmy(_handleSwipHitArmy(api))

// export let handleSwipHitLittleMan = handleSwipHitStatic