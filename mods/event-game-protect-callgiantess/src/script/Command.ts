import { state } from "frontend/src/scene3d_layer/type/StateType"
import { service } from "behaviour-protocol/src/service/ServiceType"
import { service as levelGiantessService } from "level-giantess-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"
import { getBehaviourBlockName, getBehaviourProtocolName, getLevelGiantessBlockName, getLevelGiantessProtocolName } from "./Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getTextData, languageKey } from "../json/Data"
import { getCommandName } from "../json/Data"
import { actionNodeFunc, behaviourTreeNodeExecuteResult } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

export enum command {
    // enterScenario,

    markBegin,
    markFinish,

    // exitScenario,
}


// let _increaseGiantessAttribute = (api: api, state: state, level) => {
//     let funcData = api.buildFuncData(state)

//     let scaleIncrease = 0.5 * level

//     let usedGirl = api.blockAPI.getBlockService<levelGiantessService>(state, getLevelGiantessProtocolName(), getLevelGiantessBlockName()).getUsedGirl()

//     state = funcData.GiantessBuildUtils.setFullHp(state, funcData, (state, hp) => {
//         return hp + 300 * level
//     }, false, usedGirl)
//     state = funcData.GiantessBuildUtils.setAttribute(state, funcData, (girlValue) => {
//         return {
//             ...girlValue,
//             scaleIncrease: girlValue.scaleIncrease + scaleIncrease,
//             initialScale: girlValue.initialScale + scaleIncrease,
//         }
//     }, usedGirl)

//     state = api.setGirlScale(state, api.getGirlScale(state, usedGirl) + scaleIncrease)

//     return state
// }

// let _getTextData = (api: api) => {
//     if (api.internation.isChinese()) {
//         return {
//             title: "霸体",
//             // description: "一段时间内霸体",
//         }
//     }

//     return {
//         title: "Strong",
//         // description: "strong for a period of time",
//     }
// }

let _selectTarget = (api: api): actionNodeFunc => (state, usedGirl, id) => {
    return api.selectTargetBySelectTargetPrior(state, usedGirl).then(([state, result]) => {
        if (result == behaviourTreeNodeExecuteResult.Success) {
            return [state, result]
        }

        return api.selectTarget(state, usedGirl, false, true, false)
    })
}

export let appearPlayerGiantess = (api: api) => (state: state, onCompleteFunc, data) => {
    let pos = api.selectValidGTSPoint(state, 10, 30)

    let levelGiantessService = api.blockAPI.getBlockService<levelGiantessService>(state, getLevelGiantessProtocolName(), getLevelGiantessBlockName())

    let usedGirl = levelGiantessService.getUsedGirl()

    return levelGiantessService.addGiantess(
        api,
        state,
        pos,
        api.getLookatQuaternion(pos, api.getPlayerPosition(state)),
    ).then(state => {
        state = api.setNeedUpdateStatusName(state, usedGirl, `${api.getLanguageDataByData(state, getTextData(), languageKey.Name)} ${api.getMMDName(state, usedGirl)}`)

        state = api.setBehaviourTreeData(state, api.getBehaviourTreeManagerKey(),

            api.blockAPI.getBlockService<service>(state, getBehaviourProtocolName(), getBehaviourBlockName()).getData(api)

        )
        // state = api.buildTree(state, api.getBehaviourTreeManagerKey(),
        //     api.blockAPI.getBlockService<service>(state, getBehaviourProtocolName(), getBehaviourBlockName()).buildActionNode(api)
        // )
        state = api.buildTree(state, usedGirl, api.getBehaviourTreeManagerKey(),
            api.buildActionNodeForBalance(api, _selectTarget(api))
        )

        return state
    }).then(state => {
        state = api.increaseGiantessAttribute(api, state, api.getLevelByCharacter(state, characterType.Giantess) - 1)

        state = api.GiantessBuildUtils.setFullHp(state, api.buildFuncData(state), (state, hp) => hp, true, usedGirl)

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
            return appearPlayerGiantess(api)

        default:
            throw new Error("err")
    }
}