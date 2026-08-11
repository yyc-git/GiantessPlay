import { state as blockState } from "scene-protocol/src/state/StateType"
import { service as levelGiantessService } from "level-giantess-protocol/src/service/ServiceType"
import { service as eventGameService } from "event-game-protocol/src/service/ServiceType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { camp } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export let getProtocolName = () => "scene-protocol"

export let getBlockName = () => "scene-protect"


export let getMMDProtocolName = () => "mmd-character-protocol"


export let getLevelGiantessProtocolName = () => "level-giantess-protocol"

export let getLevelGiantessBoss1BlockName = () => "level-giantess-protect-boss1"

export let getLevelGiantessBoss2BlockName = () => "level-giantess-protect-boss2"


export let getInteractionProtocolName = () => "interaction-protocol"

let _getAllInteractionBlockNames = () => [
    "interaction-weapongirl"
]

export let getAllInteractionServices = (api: api, state: state): Array<eventGameService> => {
    return _getAllInteractionBlockNames().map(blockName => {
        return api.blockAPI.getBlockService(state, getInteractionProtocolName(), blockName)
    })
}


export let getEventGameProtocolName = () => "event-game-protocol"

export let getEventGameProtectEliteBlockName = () => "event-game-protect-elite-giantess"

export let getAllGameEventBlockNames = () => {
    return [
        "event-game-hard",

        getEventGameProtectEliteBlockName(),
        "event-game-protect-army",
        "event-game-protect-level-giantess1",
        "event-game-protect-level-giantess2",
        "event-game-protect-callgiantess",
        "event-game-protect-callgoddess",
    ]
}

export let getAllGameEventServices = (api: api, state: state): Array<eventGameService> => {
    return getAllGameEventBlockNames().map(blockName => {
        return api.blockAPI.getBlockService(state, getEventGameProtocolName(), blockName)
    })
}

export let findGameEventBlockName = (api: api, blockPartName) => {
    return api.NullableUtils.getExn(getAllGameEventBlockNames().find(name => name.includes(blockPartName)))
}

let _getAllLevelGiantessBlockNames = () => {
    return [
        getLevelGiantessBoss1BlockName(),
        getLevelGiantessBoss2BlockName(),
    ]
}

export let getAllLevelGiantessService = (api: api, state: state): Array<levelGiantessService> => {
    return _getAllLevelGiantessBlockNames().map(blockName => {
        return api.blockAPI.getBlockService(state, getLevelGiantessProtocolName(), blockName)
    })
}

export let getAllLevelGiantessServiceExceptPlayer = (api: api, state: state): Array<levelGiantessService> => {
    return _getAllLevelGiantessBlockNames().map(blockName => {
        return api.blockAPI.getBlockService<levelGiantessService>(state, getLevelGiantessProtocolName(), blockName)
    }).filter(service => {
        return service.getCamp() != camp.Player
    })
}

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<blockState>(state,
        getProtocolName(),
        getBlockName()
    )
}

export let setState = (api: api, state, s) => {
    return api.blockAPI.setBlockState(state,
        getProtocolName(),
        getBlockName(),
        s
    )
}

export let getIsMissionFinish = (api: api, state) => {
    return getState(api, state).isMissionFinish
}

export let setIsMissionFinish = (api: api, state, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            isMissionFinish: value
        }
    )
}

export let createState = (api: api): blockState => {
    return {
        isMissionFinish: false
    }
}