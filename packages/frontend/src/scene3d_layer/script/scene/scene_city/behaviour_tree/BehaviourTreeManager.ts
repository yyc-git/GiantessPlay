import { state } from "../../../../type/StateType";
import { behaviourTreeData as behaviourTreeDataFromState, actionNode as actionNodeFromState, controlNode as controlNodeFromState, behaviourTree, behaviourTreeNodeExecuteResult, behaviourTreeNodeResult, actionNodeFunc, targetData, targetType, giantessStrength, biggerFrequency, behaviourTreeKey } from "../type/StateType";
import { actionNode, getKey as getKeyBehaviourTreeData } from "../data/behaviour_tree_data/BehaviourTreeData";
import { getConfigData, getLittleManSetting, getScene, getState, isGiantessRoad, isLittleRoad, setState } from "../CityScene";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { parrel, selector, sequence } from "./ControlNode";
import { getIsDebug } from "../../Scene";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { generateId } from "meta3d-jiehuo-abstract/src/particle/IDUtils";
import { id } from "meta3d-jiehuo-abstract/src/type/StateType";
import { rest } from "./action_node/Rest";
import { stomp } from "./action_node/Stomp";
import { walkToTarget } from "./action_node/WalkToTarget";
import { selectTarget, getAllAliveSoldierData, visibleData, getAllAliveMilltaryVehicleData, getAllAliveMilltaryBuildingData } from "./action_node/SelectTarget";
import { breastPress } from "./action_node/BreastPress";
import { pickup } from "./action_node/Pickup";
import { pickdown } from "./action_node/Pickdown";
import { pinch } from "./action_node/Pinch";
import { eat } from "./action_node/Eat";
// import { isDestoryRelatedStates, isStressingState } from "../utils/FSMStateUtils";
// import { getStateMachine } from "../girl/FSMState";
import { getPickObjectName, hasPickData } from "../girl/PickPose";
import { bigger } from "./action_node/Bigger";
import * as ClearTarget from "./action_node/ClearTarget";
import { changePose } from "./action_node/ChangePose";
import { Box3 } from "three";
import { getPivotWorldPosition } from "../girl/Utils";
import { isNearGirl } from "../utils/CollisionUtils";
import { behaviourTreeData, controlNode } from "../data/behaviour_tree_data/BehaviourTreeDataType";
import { Map } from "immutable";
import { Event } from "meta3d-jiehuo-abstract";
import { getAbeResourceId } from "../little_man_data/Const";
import { getAbstractState } from "../../../../state/State";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { getBehaviourTreeState, setBehaviourTreeState } from "../utils/BehaviourManagerUtils";

export let isRunning = (state: state, key) => {
    // return NullableUtils.getExn(getBehaviourTreeState(state).isRunningMap.get(key))
    return NullableUtils.getWithDefault(getBehaviourTreeState(state).isRunningMap.get(key), false)
}

export let markFinish = (state: state, id: id, result: behaviourTreeNodeExecuteResult, key = getKey()) => {
    state = setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        isRunningMap: getBehaviourTreeState(state).isRunningMap.set(key, false),
        finishedDataMap: getBehaviourTreeState(state).finishedDataMap.set(key, [id, result]),
    })

    // return Event.trigger(state, getAbstractState, getActioNodeFinishEventName(), buildActionNodeFinishEventNameEventData(id, result))
    return Promise.resolve(state)
}

// export let getFinishedId = (state: state) => {
//     return NullableUtils.getExn(getBehaviourTreeState(state).finishedData)
// }

export let isNeedJumpToFinishedNode = (state: state, key) => {
    return getBehaviourTreeState(state).finishedDataMap.has(key)
}

export let isFinishedId = (state: state, key, id) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(finishedData => {
            return finishedData[0] == id
        }, getBehaviourTreeState(state).finishedDataMap.get(key)),
        false)
}

export let getFinishedResult = (state: state, key) => {
    return NullableUtils.getExn(getBehaviourTreeState(state).finishedDataMap.get(key))[1]
}

export let resetFinish = (state: state, key) => {
    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        isRunningMap: getBehaviourTreeState(state).isRunningMap.set(key, false),
        finishedDataMap: getBehaviourTreeState(state).finishedDataMap.remove(key)
    })
}

export let markWhetherNotExecuteGiantessAI = (state: state, value: boolean) => {
    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        isNotExecuteGiantessAI: value
    })
}

let _execute = (state: state, key): Promise<state> => {
    if (
        getBehaviourTreeState(state).isNotExecuteGiantessAI
        ||
        state.config.littleManConfig.isNotExecuteGiantessAI
        ||
        (
            isGiantessRoad(state)
            || isRunning(state, key)
            // || isDestoryRelatedStates(getStateMachine(state))
        )
        // || isStressingState(getStateMachine(state))
    ) {
        return Promise.resolve(state)
    }


    state = NullableUtils.getWithDefault(
        NullableUtils.map(({ isAliveFunc }) => {
            if (!isAliveFunc(state)) {
                state = clearTarget(state)
            }

            return state
        }, getBehaviourTreeState(state).targetData), state)


    let data = NullableUtils.getExn(getBehaviourTreeState(state).dataMap.get(key))

    if (
        !data.returnSuccessCondition(state)
        || !data.returnFailCondition(state)
    ) {
        return Promise.resolve(state)
    }

    let controlNode = NullableUtils.getExn(data.controlNode)

    return controlNode(state, key, data.children).then(TupleUtils.getTuple2First)
}

export let wrapActionNode = (node: actionNodeFunc, id) => {
    return {
        id: id,
        func: node
    }
}

export let getActionNodeId = (node: actionNodeFromState) => {
    return node.id
}

export let getActionNodeFunc = (node: actionNodeFromState) => {
    return node.func
}

export let buildActionNode = (node: actionNode): nullable<actionNodeFromState> => {
    switch (node) {
        // case actionNode.SelectLittleMan:
        //     return NullableUtils.return_(
        //         wrapActionNode(selectLittleMan, generateId())
        //     )
        // case actionNode.SelectNearestBuilding:
        //     return NullableUtils.return_(
        //         wrapActionNode(selectNearestBuilding, generateId())
        //     )
        // case actionNode.SelectNearestCityzen:
        //     return NullableUtils.return_(
        //         wrapActionNode(selectNearestCityzen, generateId())
        //     )
        // case actionNode.SelectNearestSoldier:
        //     return NullableUtils.return_(
        //         wrapActionNode(selectNearestSoldier, generateId())
        //     )
        // case actionNode.SelectNearestTank:
        //     return NullableUtils.return_(
        //         wrapActionNode(selectNearestTank, generateId())
        //     )
        case actionNode.SelectTarget:
            return NullableUtils.return_(
                wrapActionNode(selectTarget, generateId())
            )
        case actionNode.WalkToTarget:
            return NullableUtils.return_(
                wrapActionNode(walkToTarget, generateId())
            )
        case actionNode.Rest:
            return NullableUtils.return_(
                wrapActionNode(rest, generateId())
            )
        case actionNode.Stomp:
            return NullableUtils.return_(
                wrapActionNode(stomp, generateId())
            )
        case actionNode.BreastPress:
            return NullableUtils.return_(
                wrapActionNode(breastPress, generateId())
            )


        case actionNode.Pickup:
            return NullableUtils.return_(
                wrapActionNode(pickup, generateId())
            )
        case actionNode.Pickdown:
            return NullableUtils.return_(
                wrapActionNode(pickdown, generateId())
            )

        case actionNode.Pinch:
            return NullableUtils.return_(
                wrapActionNode(pinch, generateId())
            )

        case actionNode.Eat:
            return NullableUtils.return_(
                wrapActionNode(eat, generateId())
            )

        case actionNode.Pickup:
            return NullableUtils.return_(
                wrapActionNode(pickup, generateId())
            )


        case actionNode.ChangePose:
            return NullableUtils.return_(
                wrapActionNode(changePose, generateId())
            )


        case actionNode.Bigger:
            return NullableUtils.return_(
                wrapActionNode(bigger, generateId())
            )


        case actionNode.ClearTarget:
            return NullableUtils.return_(
                wrapActionNode(ClearTarget.clearTarget, generateId())
            )

        default:
            return NullableUtils.getEmpty()
    }
}

let _buildControlNode = (node: controlNode): nullable<controlNodeFromState> => {
    switch (node) {
        case controlNode.Selector:
            return NullableUtils.return_(
                // wrapActionNode(selector, generateId())
                selector
            )
        case controlNode.Sequence:
            return NullableUtils.return_(
                sequence
            )
        case controlNode.Parrel:
            return NullableUtils.return_(
                parrel
            )
        default:
            return NullableUtils.getEmpty()
    }
}

let _buildCondition = (condition) => {
    return NullableUtils.getWithDefault(
        condition,
        (state) => true
    )
}

let _build = (buildActionNodeFunc, data: behaviourTreeData<any>) => {
    return {
        name: data.name,
        config: data.config,
        returnSuccessCondition: _buildCondition(data.returnSuccessCondition),
        returnFailCondition: _buildCondition(data.returnFailCondition),
        actionNode: buildActionNodeFunc(data.node as actionNode),
        controlNode: _buildControlNode(data.node as controlNode),
        children: data.children.map(child => {
            return _build(buildActionNodeFunc, child)
        })
    }
}

export let getKey = getKeyBehaviourTreeData

export let buildTree = (state: state, key: behaviourTreeKey, buildActionNodeFunc): state => {
    let data = NullableUtils.getExn(getConfigData(state).behaviourTreeDataMap.get(key))

    let result: behaviourTreeDataFromState = _build(buildActionNodeFunc, data)

    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        dataMap: getBehaviourTreeState(state).dataMap.set(key, result)
    })
}

export let initWhenImportScene = (state: state) => {
    if (isGiantessRoad(state)) {
        return Promise.resolve(state)
    }

    state = buildTree(state, getKey(), buildActionNode)

    return Promise.resolve(state)
}

export let update = (state: state, key: behaviourTreeKey = getKey()) => {
    return _execute(state, key)
}

export let createState = (): behaviourTree => {
    return {
        dataMap: Map(),
        isRunningMap: Map(),
        finishedDataMap: Map(),

        targetData: NullableUtils.getEmpty(),

        // lastGirlPosition: NullableUtils.getEmpty(),
        idMap: Map(),
        // customDataMap: Map(),
        isNotExecuteGiantessAI: false,
    }
}

export let dispose = (state: state) => {
    state = setBehaviourTreeState(state, createState())

    return Promise.resolve(state)
}

// export let isPickTarget = (state: state) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(({ name }) => {
//             return hasPickData(state) && name == getPickObjectName(state)
//         }, getBehaviourTreeState(state).targetData),
//         false
//     )
// }

export let hasTarget = (state: state) => {
    return !NullableUtils.isNullable(getBehaviourTreeState(state).targetData)
}

export let clearTarget = (state: state) => {
    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        targetData: NullableUtils.getEmpty()
    })
}

export let setTarget = (state: state, target: targetData, box: Box3) => {
    // if (getIsDebug(state)) {
    //     addCubeHelper(state, getScene(state), box.clone(), 0xfff000)
    //     // addBox3Helper(getAbstractState(state), getScene(state), box.clone().expandByScalar(10), 0x1fff00)
    // }


    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        targetData: NullableUtils.return_(
            target
        )
    })
}

export let getTarget = (state: state) => {
    return getBehaviourTreeState(state).targetData
}

export let getNearestTargetCount = (state: state, type: targetType) => {
    let data: Array<visibleData>
    switch (type) {
        case targetType.Soldier:
            data = getAllAliveSoldierData(state)
            break
        case targetType.MilltaryVehicle:
            data = getAllAliveMilltaryVehicleData(state)
            break
        case targetType.MilltaryBuilding:
            data = getAllAliveMilltaryBuildingData(state)
            break
        default:
            throw new Error("err")
    }

    return data.reduce((result, d) => {
        if (isNearGirl(state, d.position)) {
            return result + 1
        }

        return result
    }, 0)
}

export let getSettingFactorAffectRate = (state: state) => {
    switch (getLittleManSetting(state).biggerFrequency) {
        case biggerFrequency.Low:
            return 1
        case biggerFrequency.Middle:
            return 2
        case biggerFrequency.High:
            return 3
        default:
            throw new Error("err")
    }
}

export let getIdExn = (state: state, key) => {
    return NullableUtils.getExn(getBehaviourTreeState(state).idMap.get(key))
}

export let setId = (state: state, key, value) => {
    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        idMap: getBehaviourTreeState(state).idMap.set(key, value)
    })
}


// export let getCustomData = <Data>(state: state, key): nullable<Data> => {
//     return getBehaviourTreeState(state).customDataMap.get(key)
// }

// export let getCustomDataExn = <Data>(state: state, key): Data => {
//     return NullableUtils.getExn(getCustomData(state, key))
// }

// export let setCustomData = (state: state, key, value) => {
//     return setBehaviourTreeState(state, {
//         ...getBehaviourTreeState(state),
//         customDataMap: getBehaviourTreeState(state).customDataMap.set(key, value)
//     })
// }

// export let removeCustomData = (state: state, key) => {
//     return setBehaviourTreeState(state, {
//         ...getBehaviourTreeState(state),
//         customDataMap: getBehaviourTreeState(state).customDataMap.remove(key)
//     })
// }