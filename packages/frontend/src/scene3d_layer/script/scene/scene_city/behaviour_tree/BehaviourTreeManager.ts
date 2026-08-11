import { state } from "../../../../type/StateType";
import { behaviourTreeData as behaviourTreeDataFromState, actionNode as actionNodeFromState, controlNode as controlNodeFromState, behaviourTree, behaviourTreeNodeExecuteResult, behaviourTreeNodeResult, actionNodeFunc, targetData, targetType, giantessStrength, biggerFrequency, behaviourTreeKey, autoDifficulty, attackAction, personality, usedGirl, singleBehaviourTreeData } from "../type/StateType";
import { getKey as getKeyBehaviourTreeData } from "../data/behaviour_tree_data/utils/BehaviourTreeDataUtils";
import { getConfigData, getScene, getState, isGiantessCharacterType, isLittleCharacterType, setState } from "../CityScene";
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
import * as WalkToTarget from "./action_node/WalkToTarget";
import { getAllAliveSoldierData, visibleData, getAllAliveMilltaryVehicleData, getAllAliveMilltaryBuildingData, getAllAliveEliteGiantessData } from "./action_node/utils/GiantessSelectTargetUtils";
import { Box3 } from "three";
import { getPivotWorldPosition } from "../girl/Utils";
import { isNearGirl, isVeryNearGirl } from "../utils/CollisionUtils";
import { behaviourTreeData, controlNode } from "../data/behaviour_tree_data/BehaviourTreeDataType";
import { Map } from "immutable";
import { Event } from "meta3d-jiehuo-abstract";
import { getAbeResourceId } from "../little_man_data/Const";
import { getAbstractState } from "../../../../state/State";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { getBehaviourTreeState, setBehaviourTreeState } from "../utils/BehaviourManagerUtils";
import { getAutoDifficulty } from "../difficulty/Difficulty";
import * as StompRub from "./action_node/StompRub";
import * as Stomp from "./action_node/Stomp";
import * as LeftStomp from "./action_node/LeftStomp";
import * as BreastPress from "./action_node/BreastPress";
import * as BreastPressRub from "./action_node/BreastPressRub";
import { getAllAliveArmyData, getAllFlattenAliveArmyData } from "../utils/ArmyUtils";
import { getNow } from "../Time";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getCurrentUsedGirls } from "../girl/Girl";

export let getUsedGirlData = (state: state, usedGirl: usedGirl) => {
    return MutableRecordUtils.getExn(getBehaviourTreeState(state).data, usedGirl)
}

export let setUsedGirlData = (state: state, usedGirl, data: singleBehaviourTreeData) => {
    return setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        data: MutableRecordUtils.set(getBehaviourTreeState(state).data, usedGirl, data)
    })
}

export let initUsedGirlData = (state, usedGirl) => {
    return setUsedGirlData(state, usedGirl, _createUsedGirlData())
}

export let isRunning = (state: state, usedGirl: usedGirl, key) => {
    return NullableUtils.getWithDefault(getUsedGirlData(state, usedGirl).isRunningMap.get(key), false)
}

export let markFinish = (state: state, usedGirl: usedGirl, id: id, result: behaviourTreeNodeExecuteResult, key = getKey()) => {
    state = setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isRunningMap: getUsedGirlData(state, usedGirl).isRunningMap.set(key, false),
        finishedDataMap: getUsedGirlData(state, usedGirl).finishedDataMap.set(key, [id, result]),
    })

    // return Event.trigger(state, getAbstractState, getActioNodeFinishEventName(), buildActionNodeFinishEventNameEventData(id, result))
    return Promise.resolve(state)
}

// export let getFinishedId = (state: state) => {
//     return NullableUtils.getExn(getUsedGirlData(state ,usedGirl).finishedData)
// }

export let isNeedJumpToFinishedNode = (state: state, usedGirl: usedGirl, key) => {
    return getUsedGirlData(state, usedGirl).finishedDataMap.has(key)
}

export let isFinishedId = (state: state, usedGirl: usedGirl, key, id) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(finishedData => {
            return finishedData[0] == id
        }, getUsedGirlData(state, usedGirl).finishedDataMap.get(key)),
        false)
}

export let getFinishedResult = (state: state, usedGirl: usedGirl, key) => {
    return NullableUtils.getExn(getUsedGirlData(state, usedGirl).finishedDataMap.get(key))[1]
}

export let resetFinish = (state: state, usedGirl: usedGirl, key) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isRunningMap: getUsedGirlData(state, usedGirl).isRunningMap.set(key, false),
        finishedDataMap: getUsedGirlData(state, usedGirl).finishedDataMap.remove(key)
    })
}

export let resetAllFinish = (state: state, usedGirl: usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isRunningMap: getUsedGirlData(state, usedGirl).isRunningMap.map(value => false),
        finishedDataMap: Map()
    })
}

export let markWhetherNotExecuteGiantessAI = (state: state, usedGirl: usedGirl, value: boolean, key = getKey()) => {
    if (value) {
        state = resetFinish(state, usedGirl, key)
    }

    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isNotExecuteGiantessAI: value
    })
}

let _execute = (state: state, usedGirl: usedGirl, key): Promise<state> => {
    if (
        getUsedGirlData(state, usedGirl).isNotExecuteGiantessAI
        ||
        state.config.littleManConfig.isNotExecuteGiantessAI
        ||
        (
            // isGiantessCharacterType(state)
            // || 
            isRunning(state, usedGirl, key)
            // || isDestoryRelatedStates(getStateMachine(state))
        )
        // || isControlledState(state, getStateMachine(state))

        || !getUsedGirlData(state, usedGirl).dataMap.has(key)
    ) {
        return Promise.resolve(state)
    }



    let data = NullableUtils.getExn(getUsedGirlData(state, usedGirl).dataMap.get(key))

    if (
        !data.conditionReturnSuccess(state)
        || !data.conditionReturnFail(state)
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

let _buildControlNode = (usedGirl, node: controlNode): nullable<controlNodeFromState> => {
    switch (node) {
        case controlNode.Selector:
            return NullableUtils.return_(
                // wrapActionNode(selector, generateId())
                selector(usedGirl)
            )
        case controlNode.Sequence:
            return NullableUtils.return_(
                sequence(usedGirl)
            )
        case controlNode.Parrel:
            return NullableUtils.return_(
                parrel(usedGirl)
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

let _build = (buildActionNodeFunc, usedGirl, data: behaviourTreeData<any>) => {
    return {
        name: data.name,
        config: data.config,
        conditionReturnSuccess: _buildCondition(data.conditionReturnSuccess),
        conditionReturnFail: _buildCondition(data.conditionReturnFail),
        actionNode: buildActionNodeFunc(data.node as any),
        controlNode: _buildControlNode(usedGirl, data.node as controlNode),
        children: data.children.map(child => {
            return _build(buildActionNodeFunc, usedGirl, child)
        })
    }
}

export let getKey = getKeyBehaviourTreeData

export let buildTree = (state: state, usedGirl: usedGirl, key: behaviourTreeKey, buildActionNodeFunc): state => {
    let data = NullableUtils.getExn(getConfigData(state).behaviourTreeDataMap.get(key))

    let result: behaviourTreeDataFromState = _build(buildActionNodeFunc, usedGirl, data)

    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        dataMap: getUsedGirlData(state, usedGirl).dataMap.set(key, result)
    })
}

export let removeTree = (state: state, usedGirl: usedGirl, key: behaviourTreeKey): state => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        dataMap: getUsedGirlData(state, usedGirl).dataMap.remove(key)
    })
}

let _createUsedGirlData = (): singleBehaviourTreeData => {
    return {
        dataMap: Map(),
        isRunningMap: Map(),
        finishedDataMap: Map(),

        targetData: NullableUtils.getEmpty(),
        attackAction: NullableUtils.getEmpty(),
        lastChangePoseTime: NullableUtils.getEmpty(),
        lastSetTargetTime: NullableUtils.getEmpty(),
        // lastHardTime: NullableUtils.getEmpty(),

        // lastGirlPosition: NullableUtils.getEmpty(),
        idMap: Map(),
        // customDataMap: Map(),
        isNotExecuteGiantessAI: false,

        personality: personality.Strategic,
    }
}

export let initWhenImportScene = (state: state) => {
    state = StompRub.initWhenImportScene(state)
    state = Stomp.initWhenImportScene(state)
    state = LeftStomp.initWhenImportScene(state)
    state = BreastPress.initWhenImportScene(state)
    state = BreastPressRub.initWhenImportScene(state)

    return Promise.resolve(state)
}

export let update = (state: state, key: behaviourTreeKey = getKey()) => {
    return ArrayUtils.reducePromise(getCurrentUsedGirls(state), (state, usedGirl) => {
        state = NullableUtils.getWithDefault(
            NullableUtils.map(({ isAliveFunc }) => {
                if (!isAliveFunc(state)) {
                    state = clearTarget(state, usedGirl)
                }

                return state
            }, getUsedGirlData(state, usedGirl).targetData), state)

        return _execute(state, usedGirl, key)
    }, state)
}

export let createState = (): behaviourTree => {
    return {
        data: MutableRecordUtils.create()
    }
}

export let stop = (state: state, usedGirl: usedGirl) => {
    state = markWhetherNotExecuteGiantessAI(state, usedGirl, true)

    return Promise.resolve(state)
}

export let remove = (state: state, usedGirl: usedGirl) => {
    state = setUsedGirlData(state, usedGirl, _createUsedGirlData())

    state = WalkToTarget.remove(state, usedGirl)

    return Promise.resolve(state)
}

export let dispose = (state: state) => {
    // state = setUsedGirlData(state, usedGirl, createState())
    state = setBehaviourTreeState(state, {
        ...getBehaviourTreeState(state),
        data: MutableRecordUtils.map(getBehaviourTreeState(state).data, (data, usedGirl) => {
            return _createUsedGirlData()
        })
    })

    state = WalkToTarget.dispose(state)

    state = StompRub.dispose(state)
    state = Stomp.dispose(state)
    state = LeftStomp.dispose(state)
    state = BreastPress.dispose(state)
    state = BreastPressRub.dispose(state)

    return Promise.resolve(state)
}

// export let isPickTarget = (state: state) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(({ name }) => {
//             return hasPickData(state, usedGirl) && name == getPickObjectName(state)
//         }, getUsedGirlData(state ,usedGirl).targetData),
//         false
//     )
// }

export let hasTarget = (state: state, usedGirl: usedGirl) => {
    // return !NullableUtils.isNullable(getUsedGirlData(state ,usedGirl).targetData)
    return NullableUtils.getWithDefault(
        NullableUtils.map(targetData => {
            return targetData.isAliveFunc(state)
        }, getTarget(state, usedGirl)),
        false
    )
}

export let clearTarget = (state: state, usedGirl: usedGirl) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        targetData: NullableUtils.getEmpty()
    })
}

export let setTarget = (state: state, usedGirl: usedGirl, target: targetData, box: Box3) => {
    // if (getIsDebug(state)) {
    //     addCubeHelper(state, getScene(state), box.clone(), 0xfff000)
    //     // addBox3Helper(getAbstractState(state), getScene(state), box.clone().expandByScalar(10), 0x1fff00)
    // }

    state = setLastSetTargetTime(state, usedGirl, getNow(state))

    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        targetData: NullableUtils.return_(
            target
        )
    })
}

export let getTarget = (state: state, usedGirl: usedGirl) => {
    return getUsedGirlData(state, usedGirl).targetData
}

export let isBuildingTarget = (state: state, usedGirl: usedGirl) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            targetData => {
                return targetData.type == targetType.Building
            }, getTarget(state, usedGirl)
        ),
        false
    )
}

export let isLittleManTarget = (state: state, usedGirl: usedGirl) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            targetData => {
                return targetData.type == targetType.LittleMan
            }, getTarget(state, usedGirl)
        ),
        false
    )
}

export let getNearTargets = (state: state, position, distance) => {
    let squar = distance * distance

    return getAllFlattenAliveArmyData(state).filter(data => {
        return data.position.distanceToSquared(position) < squar
    })
}

export let getVeryNearestTargetCount = (state: state, [allAliveSoldierData, allAliveMilltaryVehicleData, allAliveMilltaryBuildingData, allAliveEliteGiantessData], type: targetType) => {
    let data: Array<visibleData>
    switch (type) {
        case targetType.Soldier:
            data = allAliveSoldierData
            break
        case targetType.MilltaryVehicle:
            data = allAliveMilltaryVehicleData
            break
        case targetType.MilltaryBuilding:
            data = allAliveMilltaryBuildingData
            break
        case targetType.EliteGiantess:
            data = allAliveEliteGiantessData
            break
        default:
            throw new Error("err")
    }

    return data.reduce((result, d) => {
        if (isVeryNearGirl(state, d.position)) {
            return result + 1
        }

        return result
    }, 0)
}

export let getSettingFactorAffectBiggerRate = (state: state) => {
    switch (getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
            return 1
        case autoDifficulty.Easy:
            return 1.5
        case autoDifficulty.Middle:
            return 2
        case autoDifficulty.Hard:
        case autoDifficulty.VeryHard:
            return 2.5
        case autoDifficulty.VeryHard1:
        case autoDifficulty.VeryHard2:
            return 3
        case autoDifficulty.VeryHard3:
        case autoDifficulty.VeryHard4:
            return 3.5
        case autoDifficulty.VeryHard5:
            return 4
    }
}

export let getId = (state: state, usedGirl: usedGirl, key) => {
    return getUsedGirlData(state, usedGirl).idMap.get(key)
}


export let getIdExn = (state: state, usedGirl: usedGirl, key) => {
    return NullableUtils.getExn(getId(state, usedGirl, key))
}

export let setId = (state: state, usedGirl: usedGirl, key, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        idMap: getUsedGirlData(state, usedGirl).idMap.set(key, value)
    })
}

export let removeId = (state: state, usedGirl: usedGirl, key) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        idMap: getUsedGirlData(state, usedGirl).idMap.remove(key)
    })
}


// export let getCustomData = <Data>(state: state, key): nullable<Data> => {
//     return getUsedGirlData(state ,usedGirl).customDataMap.get(key)
// }

// export let getCustomDataExn = <Data>(state: state, key): Data => {
//     return NullableUtils.getExn(getCustomData(state, key))
// }

// export let setCustomData = (state: state, key, value) => {
//     return setUsedGirlData(state, usedGirl, {
//         ...getUsedGirlData(state, usedGirl),
//         customDataMap: getUsedGirlData(state ,usedGirl).customDataMap.set(key, value)
//     })
// }

// export let removeCustomData = (state: state, key) => {
//     return setUsedGirlData(state, usedGirl, {
//         ...getUsedGirlData(state, usedGirl),
//         customDataMap: getUsedGirlData(state ,usedGirl).customDataMap.remove(key)
//     })
// }


export let setAttackAction = (state: state, usedGirl: usedGirl, action: attackAction) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        attackAction: NullableUtils.return_(
            action
        )
    })
}

export let getAttackAction = (state: state, usedGirl: usedGirl) => {
    return getUsedGirlData(state, usedGirl).attackAction
}

export let getLastChangePoseTime = (state: state, usedGirl: usedGirl) => {
    return getUsedGirlData(state, usedGirl).lastChangePoseTime
}

export let setLastChangePoseTime = (state: state, usedGirl: usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        lastChangePoseTime: NullableUtils.return_(
            value
        )
    })
}

export let getLastSetTargetTime = (state: state, usedGirl: usedGirl) => {
    return getUsedGirlData(state, usedGirl).lastSetTargetTime
}

export let setLastSetTargetTime = (state: state, usedGirl: usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        lastSetTargetTime: NullableUtils.return_(
            value
        )
    })
}


// export let setLastHardTime = (state: state, value) => {
//     return setUsedGirlData(state, usedGirl, {
//         ...getUsedGirlData(state, usedGirl),
//         lastHardTime: NullableUtils.return_(
//             value
//         )
//     })
// }

// export let getLastHardTime = (state: state) => {
//     return getUsedGirlData(state ,usedGirl).lastHardTime
// }

export let getPersonality = (state: state, usedGirl: usedGirl) => {
    return getUsedGirlData(state, usedGirl).personality
}

export let setPersonality = (state: state, usedGirl: usedGirl, value) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        personality: value
    })
}

export let getAllPersonalities = () => [
    personality.Strategic,
    personality.Aggressive,
    personality.Defensive,
    personality.Playful,
]
