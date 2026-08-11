import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { getRewardData } from "../json/RewardData"
import { getAllRandomUsedMMDData } from "../json/MMDUtils"
import { getAllGameEventServices, getAllLevelGiantessService } from "./Utils"
import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
// import { getInteractionLoadData } from "./MapData"

export let getLoadData = (api: api, state: state) => {
    return [].concat(
        // api.map.getRandomMapLoadData(state, getInteractionLoadData(state)) as any
        api.map.getRandomMapLoadData(state, api.getInteractionLoadData(state)) as any
    ).concat(
        api.getPropLoadData(state) as any
    )
}

export let handleBeforeLoadResource = (api: api, state: state, character) => {
    state = api.handleBeforeLoadResourcePlayLevel(state, character)

    // state = getAllLevelGiantessService(api, state).reduce((state, service) => {
    //     return api.configData.setGirlValue(state, service.getUsedGirl(),
    //         service.getValue(api, state)
    //     )
    // }, state)
    return api.initAllLevelGirlValue(state).then(state => {
        state = api.configData.setGameEventData(state,
            api.getAllGameEventData(state, getAllGameEventServices(api, state)))
        state = api.configData.mergeRewardData(state, getRewardData(api, state))

        let allUsedMMDData = getAllRandomUsedMMDData(api, state)

        state = api.setUsedMMDData(state, allUsedMMDData)

        state = api.setCurrentMMDCharacter(state, allUsedMMDData)

        state = api.setPlayerMMDValue(state)


        state = api.initClothHpData(state, api.getClothHpData, allUsedMMDData)

        // state = api.setUsedMMDData(state, allUsedMMDData)

        state = api.configData.setScenaryData(state,
            api.getAllScenarioData(state, getAllGameEventServices(api, state))
        )

        return state
    })
}