import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { getWalkCharacterSoundResourceId, getWalkData, getWalkVehicleResourceId } from "../json/Data";

let _isCollisionWithRigidBody = (api: api, state, damageNames) => {
    return damageNames.reduce((result, name) => {
        if (result) {
            return result
        }

        return api.isRigidBody(state, name)
    }, false)
}

let _isCollisionWithCharacter = (api: api, state, damageNames) => {
    return damageNames.reduce((result, name) => {
        if (result) {
            return result
        }

        return api.isCharacter(state, name)
    }, false)
}

export let handleWalkHitLittleMan = (api: api) => (
    state: state, handleFunc,
    position,
) => {
    let { emitterVolume } = getWalkData(api, state)

    return handleFunc(state).then(([state, damageNames]) => {
        let soundResourceId = getWalkCharacterSoundResourceId()

        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
            api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
        ))

        return state
    })
}

// export let handleWalkHitGirl = handleWalkHitLittleMan

// export let handleWalkHitStatic = handleWalkHitLittleMan

export let handleWalkHitArmy = (api: api) => api.handleHitArmy((
    state: state, handleFunc,
    position,
) => {
    let { emitterVolume } = getWalkData(api, state)

    return handleFunc(state).then(([state, damageNames]) => {
        let soundResourceId
        if (_isCollisionWithCharacter(api, state, damageNames)) {
            soundResourceId = getWalkCharacterSoundResourceId()
        }
        else if (_isCollisionWithRigidBody(api, state, damageNames)) {
            soundResourceId = getWalkVehicleResourceId()
        }
        else {
            // soundResourceId = getWalkResourceId()
        return state
        }

        state = api.setAbstractState(state, api.SoundManager.addNeedToPlaySound(api.getAbstractState(state),
            api.SoundManager.buildNeedToPlaySoundData(soundResourceId, api.getIsDebug(state), api.getVolume(state, emitterVolume, api.vector3.fromArray(api.vector3.getTempVector1(), position), 0))
        ))

        return state
    })
})
