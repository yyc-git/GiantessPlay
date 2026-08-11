import { state } from "frontend/src/scene3d_layer/type/StateType"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { service } from "mmd-character-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"
import { getAllGameEventServices, getMMDProtocolName } from "./Utils"
import { buildBuildingAndTreeAndInteractionConfig, getAllMapData, getLoadResourceIdData } from "./MapData"

// let _destroyedHandler = (api: api) => (state: state, { userData }) => {
//     let { fromName, toName } = NullableUtils.getExn(userData)

//     if (isPicked(state, toName) && !isEatingFromPick(state)) {
//         state = removePickData(state, toName)
//     }

//     if (isStatic(state, toName)) {
//         state = disposeAllData(state, toName)

//         return Promise.resolve(state)
//     }

//     // TODO update
//     // if (
//     //     !hasLifeCount(state)
//     //     &&
//     //     (
//     //         LittleMan.isLittleMan(toName)
//     //         || (Girl.isGirl(toName) && isGiantessCharacterType(state))
//     //     )
//     // ) {
//     //     // return handlePickDataWhenExecuteDestroyed(state)
//     //     return MissionAll.handleMissionFail(state)
//     // }

//     return Promise.resolve(state)
// }


let _handleLevel = (api: api) => (state: state) => {
    // state = api.girl.setIsCanActiveSmallerFunc(state, state => {
    //     return getBiggerWay(state) != biggerWay.Passive
    //     // &&
    //     // /*! TODO if add action like LightStomp, need add it here(into arr) to avoid trigger smaller action after trigger these action(this can make these action not work)
    //     // * 
    //     // */
    //     // [].reduce((result, actionName) => {
    //     //     if (!result) {
    //     //         return result
    //     //     }

    //     //     return !Girl.isActionTriggering(state, actionName)
    //     // }, true)
    // })


    // // state = api.event.on(state, api.event.getDestroyedEventName(), _destroyedHandler(api))
    // state = api.event.on(state, api.event.getDestroyedEventName(), api.destroyedHandler)
    // state = setAbstractState(state, Event.on(getAbstractState(state), getPointerDownEventName(), api.pointdownHandle))

    // return api.switchToCharacterType(state, characterType.LittleMan,
    //     NullableUtils.getExn(LittleMan.getLittleManState(state).initialPosition),
    //     NullableUtils.getExn(LittleMan.getLittleManState(state).initialQuaternion)
    // )

    return api.handlePlayLevel(state)
}

export let initWhenImportScene = (api: api, state: state) => {
    state = api.configData.setGameEventDirectorData(state,
        api.getAllGameEventDirectorData(state, getAllGameEventServices(api, state))
    )

    return api.setCharacterType(state, characterType.LittleMan).then(state => {
        state = api.setAllCollisionParts(state, api.getDefaultAllCollisionParts())

        state = api.configData.setCollisionShapeData(
            state,
            state => api.blockAPI.getAllBlockServiceFuncWithDefault<service>(state, service => service.getCollisionShapeData(api, state), getMMDProtocolName(), [])
        )

        return api.initWhenImportScenePlayLevel(state)
    })
        .then(api.gameEventDirector.initWhenImportScene)
        .then(state => api.map.initWhenImportScene(state,
            buildBuildingAndTreeAndInteractionConfig(api, state),
            getLoadResourceIdData(api, state),
            getAllMapData(api, state)
        ))
        .then(api.behaviourTreeManagerInitWhenImportScenePlayLevel)
        .then(api.mission.initWhenImportScene)
        .then(api.girl.initWhenImportScene)
        .then(api.littleMan.initWhenImportScene)
        .then(state => {
            return api.registerBossStatusUpdateFunc(state, api.updateStatus)
        })
        .then(api.registerDamageDataPlayLevel)
        .then(_handleLevel(api))
}