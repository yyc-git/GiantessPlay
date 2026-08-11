import { actionNodeFunc, behaviourTreeNodeExecuteResult, command, usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { service } from "behaviour-protocol/src/service/ServiceType"
import { api } from "type-api/src/Type"
import { getBehaviourBlockName, getBehaviourProtocolName } from "./Utils"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getTextData, languageKey } from "../json/Data"

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
    return api.selectTargetByDefault(state, usedGirl).then(([state, result]) => {
        if (result == behaviourTreeNodeExecuteResult.Success) {
            return [state, result]
        }

        return api.selectTargetBySelectTargetPrior(state, usedGirl)
    }).then(([state, result]) => {
        if (result == behaviourTreeNodeExecuteResult.Success) {
            return [state, result]
        }

        return api.selectTarget(state, usedGirl, false, true, false)
    })
}


export let appearPlayerGoddess = (api: api): command<null> => (state: state, onCompleteFunc, data) => {
    let pos = api.selectValidGTSPoint(state, 10, 30)

    let usedGirl = usedGirlEnum.PlayerGoddess

    return api.addPlayerGoddess(state,
        pos,
        api.getLookatQuaternion(pos, api.getPlayerPosition(state)),
    ).then(state => {
        state = api.setNeedUpdateStatusName(state, usedGirl, `${api.getLanguageDataByData(state, getTextData(), languageKey.GoddessName)} ${api.getMMDName(state, usedGirl)}`)

        state = api.setBehaviourTreeData(state, api.getBehaviourTreeManagerKey(),

            api.blockAPI.getBlockService<service>(state, getBehaviourProtocolName(), getBehaviourBlockName()).getData(api)
            // PlayerGoddessBehaviourTreeData.getData(
            //     [
            //         BehaviourTreeManager.getSettingFactorAffectBiggerRate,
            //         NumberUtils.isRandomRate, hasPickData, BehaviourTreeManager.hasTarget,
            //         state => {
            //             return getPlayerGoddessBiggerCount(state) == 0
            //         },
            //         
            //         () => getValue(state),
            //         isChangeScaling,
            //         isPose,
            //         BehaviourTreeManager.getVeryNearestTargetCount
            //     ]
            // )

        )
        // state = api.buildTree(state, api.getBehaviourTreeManagerKey(),
        //     // PlayerGoddessBehaviourTreeManager.buildActionNode
        //     api.blockAPI.getBlockService<service>(state, getBehaviourProtocolName(), getBehaviourBlockName()).buildActionNode(api)
        // )
        state = api.buildTree(state, usedGirl, api.getBehaviourTreeManagerKey(),
            api.buildActionNodeForBalance(api, _selectTarget(api))
        )

        return state
    }).then(state => {
        state = api.increaseGoddessAttribute(api, state, api.getLevelByCharacter(state, characterType.Giantess) - 1)

        state = api.GiantessBuildUtils.setFullHp(state, api.buildFuncData(state), (state, hp) => hp, true, usedGirl)

        return state
    })
}