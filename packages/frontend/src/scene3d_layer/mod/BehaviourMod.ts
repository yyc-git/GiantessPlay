import { service } from "behaviour-protocol/src/service/ServiceType"
import { state } from "../type/StateType"
import { getBlockServiceExn } from "./Mod"
import { modProtocolName } from "./data/ModData"
import { api } from "type-api/src/Type"
import { actionNode as actionNodeFromState } from "../script/scene/scene_city/type/StateType"
import { nullable } from "block/src/Type"
import { actionNode } from "../script/scene/scene_city/data/behaviour_tree_data/BehaviourTreeDataType"
import { selectAttackAction } from "../script/scene/scene_city/behaviour_tree/action_node/SelectAttackAction"
// import { hard } from "../script/scene/scene_city/behaviour_tree/action_node/Hard"

export let getBalanceBlockService = (state: state) => {
    return getBlockServiceExn<service>(state, modProtocolName.BehaviourProtocol, "behaviour-balance")
}


export let buildActionNodeForBalance = (api: api, selectTargetFunc) => (node: actionNode): nullable<actionNodeFromState> => {
    switch (node) {
        case actionNode.SelectTarget:
            return api.NullableUtils.return_(
                api.wrapActionNode(selectTargetFunc, api.generateId())
            )
        case actionNode.SelectAttackAction:
            return api.NullableUtils.return_(
                api.wrapActionNode(selectAttackAction, api.generateId())
            )
        case actionNode.WalkToTarget:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.walkToTarget, api.generateId())
            )
        case actionNode.Rest:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.rest, api.generateId())
            )
        case actionNode.Stomp:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.stomp, api.generateId())
            )
        case actionNode.StompRub:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.stompRub, api.generateId())
            )
        case actionNode.LeftStomp:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.leftStomp, api.generateId())
            )
        case actionNode.JumpStomp:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.jumpStomp, api.generateId())
            )

        case actionNode.SprayMilk:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.sprayMilk, api.generateId())
            )

        case actionNode.FreeUB:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.freeUB, api.generateId())
            )
        case actionNode.FreeBreast:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.freeBreast, api.generateId())
            )
        case actionNode.FreeShoe:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.freeShoe, api.generateId())
            )


        case actionNode.BreastPress:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.breastPress, api.generateId())
            )
        case actionNode.BreastPressRub:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.breastPressRub, api.generateId())
            )
        case actionNode.CrawlLick:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.crawlLick, api.generateId())
            )
        case actionNode.CrawlBeat:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.crawlBeat, api.generateId())
            )

        case actionNode.SitRub:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.sitRub, api.generateId())
            )
        case actionNode.TightenLeg:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.tightenLeg, api.generateId())
            )





        case actionNode.Pickup:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.pickup, api.generateId())
            )
        case actionNode.Pickdown:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.pickdown, api.generateId())
            )
        // case actionNode.FallByQTE:
        //     return api.NullableUtils.return_(
        //         api.wrapActionNode(api.pickdownByQTE, api.generateId())
        //     )

        case actionNode.Pinch:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.pinch, api.generateId())
            )
        case actionNode.Eat:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.eat, api.generateId())
            )

        case actionNode.PutToBreast:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.putToBreast, api.generateId())
            )
        case actionNode.PutToShoe:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.putToShoe, api.generateId())
            )



        case actionNode.Thrust:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.thrust, api.generateId())
            )
        case actionNode.Insert:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.insert, api.generateId())
            )


        case actionNode.ChangePose:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.changePose, api.generateId())
            )


        case actionNode.Bigger:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.bigger, api.generateId())
            )


        case actionNode.ClearTarget:
            return api.NullableUtils.return_(
                api.wrapActionNode(api.clearTargetAction, api.generateId())
            )



        // case actionNode.Hard:
        //     return api.NullableUtils.return_(
        //         api.wrapActionNode(hard, api.generateId())
        //     )


        default:
            return api.NullableUtils.getEmpty()
    }
}