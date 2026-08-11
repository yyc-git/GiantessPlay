import { api, resourceType } from "type-api/src/Type"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { getAllModelQueues, getBlockName, getProtocolName, setState } from "./Utils"
import { getDeathData, getDeathHeadshotData, getIdleData, getKickLightData, getLieData, getMagicAttack1Data, getPickedControlledData, getShakeData, getSoundPath, getStandupFromLieData, getStompHeavyData, getStompLightData, getWalkData, getWalkResourceId } from "../json/Data"
import { createState } from "./State"
import { state } from "frontend/src/scene3d_layer/type/StateType"

let _loadSceneResourceHandler = (api: api, state, _) => {
    state = api.load.addResourceData(state,
        [
            {
                id: getWalkResourceId(),
                path: [getSoundPath(getWalkResourceId())],
                type: resourceType.Audio
            },
        ]
    )

    state = api.load.addResourceData(state,
        [
            getIdleData(),
            getDeathData(),
            getDeathHeadshotData(),
            getWalkData(),
            getShakeData(),
            getStompLightData(),
            getStompHeavyData(),
            getKickLightData(),
            getMagicAttack1Data(),
            getPickedControlledData(),
            getLieData(),
            getStandupFromLieData(),
        ].map(([animationName, animationPath]) => {
            return {
                id: animationName,
                path: animationPath,
                type: resourceType.ArrayBuffer
            }
        })
    )

    return Promise.resolve(state)
}

let _initWhenImportSceneHandler = (api: api, state, _) => {
    state = api.buildBloodDecalQueue(state, [state => {
        return api.blockAPI.getBlockState(state,
            getProtocolName(),
            getBlockName()
        )
    }, (state, eliteGiantessState) => {
        return api.blockAPI.setBlockState(state,
            getProtocolName(),
            getBlockName(),
            eliteGiantessState
        )
    }])

    return Promise.resolve(state)
}

let _disposeHandler = (api: api, state: state, _) => {
    getAllModelQueues(api, state).forEach(queue => {
        queue.dispose()
    })

    state = setState(api, state, {
        ...createState(api),
    })

    return Promise.resolve(state)
}

export let bindEvent = (api: api, state) => {
    state = api.event.on(state, api.event.getLoadSceneResourceEventName(), _loadSceneResourceHandler)
    state = api.event.on(state, api.event.getInitWhenImportSceneEventName(), _initWhenImportSceneHandler)
    state = api.event.on(state, api.event.getDisposeEventName(), _disposeHandler)

    return state
}

export let unbindEvent = (api: api, state) => {
    state = api.event.offAll(state, api.event.getLoadSceneResourceEventName())
    state = api.event.offAll(state, api.event.getInitWhenImportSceneEventName())
    state = api.event.offAll(state, api.event.getDisposeEventName())

    return state
}
