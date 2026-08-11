import { state } from "frontend/src/scene3d_layer/type/StateType"
import { service } from "behaviour-protocol/src/service/ServiceType"
import { service as levelGiantessService } from "level-giantess-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"
import { getBehaviourBlockName, getBehaviourProtocolName, getLevelGiantessBlockName, getLevelGiantessProtocolName } from "./Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getCommandName, getTextData, languageKey } from "../json/Data"
import { actionNodeFunc, behaviourTreeNodeExecuteResult } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export enum command {
    // enterScenario,

    markBegin,
    markFinish,

    // exitScenario,
}

let _selectTarget = (api: api): actionNodeFunc => (state, usedGirl, id) => {
    return api.selectTargetByDefault(state, usedGirl).then(([state, result]) => {
        if (result == behaviourTreeNodeExecuteResult.Success) {
            return [state, result]
        }

        return api.selectTargetBySelectTargetPrior(state, usedGirl)
    }).then(([state, result]) => {
        if (result == behaviourTreeNodeExecuteResult.Success) {
            return [state, result]
        }

        return api.selectTarget(state, usedGirl,true, false)
    })
}


export let appear = (api: api) => (state: state, onCompleteFunc, data) => {
    // let pos = api.selectValidGTSPoint(state, 10, 30)
    // let pos = api.vector3.create(0, 0, 0)
    // let pos = api.findValidArmyPoint(state, api.vector3.create(100, 0, 100), 0, 50, false)
    let pos = api.findValidArmyPoint(state, api.vector3.create(50, 0, 50), 0, 20, false)

    let levelGiantessService = api.blockAPI.getBlockService<levelGiantessService>(state, getLevelGiantessProtocolName(), getLevelGiantessBlockName())

    let usedGirl = levelGiantessService.getUsedGirl()

    return levelGiantessService.addGiantess(
        api,
        state,
        pos,
        api.getLookatQuaternion(pos, api.getPlayerPosition(state)),
    ).then(state => {
        // state = api.setNeedUpdateStatusName(state, usedGirl, `${api.getLanguageDataByData(state, getTextData(), languageKey.Name)}${api.getCurrentMMDCharacterName(state, usedGirl)}`)
        state = api.setNeedUpdateStatusName(state, usedGirl, `${levelGiantessService.getName(api, state)} ${api.getMMDName(state, usedGirl)}`)

        state = api.setBehaviourTreeData(state, api.getBehaviourTreeManagerKey(),
            api.blockAPI.getBlockService<service>(state, getBehaviourProtocolName(), getBehaviourBlockName()).getData(api)

        )
        // state = api.buildTree(state, api.getBehaviourTreeManagerKey(),
        //     api.blockAPI.getBlockService<service>(state, getBehaviourProtocolName(), getBehaviourBlockName()).buildActionNode(api)
        // )
        state = api.buildTree(state,usedGirl, api.getBehaviourTreeManagerKey(),
            api.buildActionNodeForBalance(api, _selectTarget(api))
        )

        return state
    })
}

export let getCommand = (api: api) => (state: state, command_: command | string) => {
    switch (command_) {
        // case command.enterScenario:
        //     return enterScenario

        case command.markBegin:
            return api.markBegin
        case command.markFinish:
            return api.markFinish

        case getCommandName():
            return appear(api)

        default:
            throw new Error("err")
    }
}