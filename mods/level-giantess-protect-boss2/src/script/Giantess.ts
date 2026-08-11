import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api, vector3 } from "type-api/src/Type"
import { getUsedGirl } from "../json/Data"
import { camp } from "meta3d-jiehuo-abstract/src/type/StateType"
import { buildGiantessDestroyedName, buildGiantessStressingName } from "../json/RewardData"
import { collisionPart, result } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { actionName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"

export let addGiantess = (api: api, state: state, worldPosition, worldQuaternion) => {
    return api.addLevelGiantess(state, getUsedGirl(), camp.Giantess, worldPosition, worldQuaternion)
}

export let removeGiantess = (api: api) => (state: state) => {
    let usedGirl = getUsedGirl()

    return api.removeLevelGiantess(state, state => {
        state = api.generateReward(state, api.getPlayerName(state), buildGiantessDestroyedName(), api.girl.buildNameByUsedGirl(usedGirl), api.getGirlPosition(state, usedGirl), api.getGirlPosition(state, usedGirl), 3)

        // return api.event.trigger(state, getAbstractState, getModAPI(state).event.getEnemyGiantessDestoyedEventName(), NullableUtils.return_({
        //     targetName: getName(),
        //     gemAndCoinPosition: getGirlPosition(state, usedGirl),
        //     propPosition: getGirlPosition(state, usedGirl),
        // }))
        return Promise.resolve(state)
    }, usedGirl)
}


export let createStressingState = (api: api, state: state) => api.createStressingStateUtils(buildGiantessStressingName)

export let createDestroyedState = (api: api, state: state) => api.createDestroyedStateUtils([removeGiantess(api), api.disposeLevelGiantessBuffData], getUsedGirl())

export let createDestroyingState = (api: api, state: state) => api.createDestroyingStateUtils(createDestroyedState(api, state))

export let update = (api: api, state: state, usedGirl) => {
    return api.updateLevelGiantess(state, usedGirl, createDestroyingState(api, state))
}

export let damage = (api: api, state: state, usedGirl, [force, damageType, weaponType], fromName, collisionPart_: collisionPart, damagePosition: nullable<vector3>, weaponValue_,
) => {
    return api.damageLevelGiantess(state,
        createStressingState(api, state),
        usedGirl,
        [force, damageType, weaponType], fromName, collisionPart_, damagePosition, weaponValue_,
    )
}


// export let updateStatus = (state: state) => {
//     return updateStatusUtils(state, getBiggerCount)
// }

// export let dispose = (state) => {
//     // return createData()
//     return state
// }

// export let createData = (): wildGiantessData => {
//     return {
//         biggerCount: 0,
//     }
// }

// export let updateFSMState = (state: state) => {
//     return GirlFSMState.update(state, createDestroyingState)
// }


export let triggerAction = (api: api, state, usedGirl, name: actionName): Promise<[state, result]> => {
    return api.triggerLevelGiantessAction(state, usedGirl, name)
}