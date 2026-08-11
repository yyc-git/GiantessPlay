import { api } from "type-api/src/Type"
import { state } from "../../../../type/StateType"
import { getState, setState } from "../CityScene"
import { clearTarget, getKey, getTarget, getUsedGirlData, setUsedGirlData } from "../behaviour_tree/BehaviourTreeManager"
import { behaviourTree, usedGirl } from "../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"

export let getBehaviourTreeState = (state: state): behaviourTree => {
    return getState(state).behaviourTree
}

export let setBehaviourTreeState = (state: state, behaviourTreeState: behaviourTree) => {
    return setState(state, {
        ...getState(state),
        behaviourTree: behaviourTreeState
    })
}

export let markIsRunning = (state: state, usedGirl: usedGirl, isRunning: boolean, key = getKey()) => {
    return setUsedGirlData(state, usedGirl, {
        ...getUsedGirlData(state, usedGirl),
        isRunningMap: getUsedGirlData(state, usedGirl).isRunningMap.set(key, isRunning)
    })
}


export let selectOneIndexByWeight = (api: api, weightArr: Array<number>) => {
    return selectOneByWeight(api, api.ArrayUtils.range(0, weightArr.length - 1), weightArr)
}


export let selectOneByWeight = (api: api, arr: Array<any>, weightArr: Array<number>) => {
    // return api.NumberUtils.randomSelectMaxCountByRate(arr, 1, weightArr, 1)[0]
    return api.NumberUtils.randomSelectMaxCountByWeight(arr, 1, weightArr, 1)[0]
}

export let selectOneByTwoLayerWeights = (api: api, arr: Array<Array<any>>, firstWeightArr: Array<number>, secondLayerWeightArr: Array<Array<number>>) => {
    let index = selectOneIndexByWeight(api, firstWeightArr)

    return selectOneByWeight(
        api, arr[index], secondLayerWeightArr[index]
    )
}

export let isInGirlAttackRangeWithTarget = (api: api, state, usedGirl, attackRange, actionName = api.NullableUtils.getEmpty()) => {
    return api.hasTarget(state, usedGirl) && api.isInGirlAttackRange(state, usedGirl, api.getTarget(state, usedGirl).getPositionFunc(state), attackRange, actionName)
}

export let clearTargetByName = (state, usedGirl, name) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            targetData => {
                if (targetData.name == name) {
                    state = clearTarget(state, usedGirl)
                }

                return state
            }, getTarget(state, usedGirl)
        ),
        state
    )
}