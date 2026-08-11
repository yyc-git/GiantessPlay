import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, vector3 } from "type-api/src/Type"
import { getCamp, getUsedGirl } from "../json/Data"
import { camp } from "meta3d-jiehuo-abstract/src/type/StateType"
// import { buildGiantessDestroyedName, buildGiantessStressingName } from "../json/RewardData"
import { collisionPart, result, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"

export let addGiantess = (api: api, state: state, worldPosition, worldQuaternion) => {
    return api.addLevelGiantess(state, getUsedGirl(), getCamp(), worldPosition, worldQuaternion).then(state => {
        state = api.updateHpData(state, getUsedGirl())

        return api.changeToInitialScale(state, getUsedGirl())
    })
}

export let removeGiantess = (api: api) => (state: state) => {
    let usedGirl = getUsedGirl()

    state = api.resetPose(state, usedGirl)

    return api.removeLevelGiantess(state, state => {
        return Promise.resolve(state)
    }, usedGirl)
}

export let createStressingState = (api: api, state: state) => api.createStressingStateUtils(api.NullableUtils.getEmpty())

export let createDestroyedState = (api: api, state: state) => api.createDestroyedStateUtils([removeGiantess(api), api.disposeLevelGiantessBuffData], getUsedGirl())

export let createDestroyingState = (api: api, state: state) => api.createDestroyingStateUtils(createDestroyedState(api, state))

export let update = (api: api, state: state, usedGirl) => {
    return api.updateLevelGiantess(state, usedGirl, createDestroyingState(api, state), usedGirl)
}

export let damage = (api: api, state: state, usedGirl, [force, damageType, weaponType], fromName, collisionPart_: collisionPart, damagePosition: nullable<vector3>, weaponValue_,
) => {
    return api.damageLevelGiantess(state,
        createStressingState(api, state),
        usedGirl,
        [force, damageType, weaponType], fromName, collisionPart_, damagePosition, weaponValue_,
    )
}

export let triggerAction = (api: api, state, usedGirl, name: actionName): Promise<[state, result]> => {
    return api.triggerLevelGiantessAction(state, usedGirl, name)
}