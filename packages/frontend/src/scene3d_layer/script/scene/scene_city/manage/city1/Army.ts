import { Quaternion, Vector3 } from "three";
import { army, attackTargetObjectData, camp, usedGirlEnum } from "../../type/StateType";
import { Map } from "immutable";
import { state } from "../../../../../type/StateType";
import { getAbstractState, getCitySceneState, setCitySceneState } from "../../../../../state/State";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { lodQueueIndex, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { visibleData } from "../../behaviour_tree/action_node/utils/GiantessSelectTargetUtils";
import { TransformUtils } from "meta3d-jiehuo-abstract";
import { nullable } from "block/src/Type";
import { LOD } from "meta3d-jiehuo-abstract";
import { changeFsmStateIfAlive } from "../../utils/ArmyUtils";
import { createInitialState } from "../../utils/LODQueueObjectUtils";
import { isControlledStateExceptStressing, isNotDamageState } from "../../utils/FSMStateUtils";
import { StateMachine } from "meta3d-jiehuo-abstract";
import { MutableMapUtils } from "meta3d-jiehuo-abstract";

// const _q = new Quaternion();
// const _e = new Euler();
// const _m = new Matrix4();
// const _v1 = new Vector3();
// const _v2 = new Vector3();
// const _v1_1 = new Vector2();
// const _v1_2 = new Vector2();

export let createState = (): army => {
    return {
        campMap: MutableMapUtils.create(),
        attackTargetMap: MutableMapUtils.create(),
        attackTargetObjectDataMap: MutableMapUtils.create(),
        attackTargetUsedGirlMap: MutableMapUtils.create(),
        lastJudgeRayCastTimeMap: MutableMapUtils.create(),
        lastJudgeRayCastResultMap: MutableMapUtils.create(),
        crowdPositions: ArrayUtils.create(),
        validCrowdPositions: ArrayUtils.create(),
        isShowNoValidCrowdPositionsTip: false,
        deferDisposeDataNames: ArrayUtils.create(),
        isLightStressingMap: MutableMapUtils.create(),
        getPositionYFuncMap: MutableMapUtils.create(),

        isNotAttackLittleManTime: NullableUtils.getEmpty(),

        isEliteGiantessAttackingMap: MutableMapUtils.create(),

        isNeedRefindPathMap: MutableMapUtils.create(),

        lastAttackFrameMap: MutableMapUtils.create(),

        allArmyContainers: ArrayUtils.create(),

        updateLittleManWeaponFunc: (state, weaponName, weaponValue) => weaponValue,
        addHitEffectFunc: NullableUtils.getEmpty(),
    }
}

export let getState = (state: state) => {
    return NullableUtils.getExn(getCitySceneState(state).army)
}

export let setState = (state: state, value: army) => {
    // return setCitySceneState(state, {
    //     ...getCitySceneState(state),
    //     army: NullableUtils.return_(value)
    // })

    getCitySceneState(state).army = value

    return state
}


export let getCamp = (state: state, name: name) => {
    return MutableMapUtils.get(getState(state).campMap, name)
}

export let getCampExn = (state: state, name: name) => {
    return NullableUtils.getExn(getCamp(state, name))
}

export let getCampWithDefault = (state: state, name: name, defaultCamp: camp) => {
    return NullableUtils.getWithDefault(MutableMapUtils.get(getState(state).campMap, name), defaultCamp)
}

export let setCamp = (state: state, name, value) => {
    // return setState(state, {
    //     ...getState(state),
    //     campMap: MutableMapUtils.set(getState(state).campMap, name, value)
    // })
    MutableMapUtils.set(getState(state).campMap, name, value)
    return state
}

export let removeCamp = (state: state, name) => {
    MutableMapUtils.remove(getState(state).campMap, name)

    return state
}

export let getAttackTarget = (state: state, name: name) => {
    return MutableMapUtils.get(getState(state).attackTargetMap, name)
}

export let getAttackTargetExn = (state: state, name: name) => {
    return NullableUtils.getExn(getAttackTarget(state, name))
}

export let setAttackTarget = (state: state, name, value) => {
    // return setState(state, {
    //     ...getState(state),
    //     attackTargetMap: MutableMapUtils.set(getState(state).attackTargetMap, name, value)
    // })
    MutableMapUtils.set(getState(state).attackTargetMap, name, value)

    return state
}

export let getAttackTargetUsedGirl = (state: state, name: name) => {
    return MutableMapUtils.getWithDefault(getState(state).attackTargetUsedGirlMap, name, usedGirlEnum.None)
}

export let setAttackTargetUsedGirl = (state: state, name, value) => {
    MutableMapUtils.set(getState(state).attackTargetUsedGirlMap, name, value)

    return state
}

export let getAttackTargetObjectData = (state: state, name: name): nullable<attackTargetObjectData> => {
    return MutableMapUtils.get(getState(state).attackTargetObjectDataMap, name)
}

export let getAttackTargetObjectDataExn = (state: state, name: name): nullable<attackTargetObjectData> => {
    return getAttackTargetObjectData(state, name)
}


export let setAttackTargetObjectDataByVisibleData = (state: state, name, data: visibleData) => {
    MutableMapUtils.set(getState(state).attackTargetObjectDataMap, name, {
        name: data.name,
        getPositionFunc: (state) => TransformUtils.getPositionFromMatrix4(
            NullableUtils.getWithDefaultFunc(
                NullableUtils.map(queue => {
                    return queue.getTransform(data.index)
                }, data.queue
                ), () => LOD.getTransform(getAbstractState(state), data.index)
            )
        ),
        getBoxFunc: (state) => NullableUtils.getWithDefaultFunc(
            NullableUtils.map(queue => {
                return queue.getBox(data.index)
            }, data.queue
            ), () => LOD.getBox(getAbstractState(state), data.index)
        ),
    })

    return state
}

export let hasAttackTargetByName = (state: state, name) => {
    return MutableMapUtils.has(getState(state).attackTargetMap, name)
}

// export let isAttackTarget = (state, fromName, toName) => {
//     return NullableUtils.getWithDefault(
//         NullableUtils.map(
//             data => {
//                 return data.name == toName
//             }, getAttackTargetObjectData(state, fromName)
//         ),
//         false
//     )
// }

export let clearAttackTargetData = (state, name) => {
    MutableMapUtils.remove(getState(state).attackTargetMap, name)
    MutableMapUtils.remove(getState(state).attackTargetUsedGirlMap, name)
    MutableMapUtils.remove(getState(state).attackTargetObjectDataMap, name)

    return state
}

export let clearAttackTargetObjectOrBuilding = (state, toName) => {
    return MutableMapUtils.reduce(getState(state).attackTargetObjectDataMap, (state, data, fromName) => {
        if (data.name == toName) {
            // MutableMapUtils.remove(getState(state).attackTargetMap, fromName)
            // MutableMapUtils.remove(getState(state).attackTargetObjectDataMap, fromName)
            state = clearAttackTargetData(state, fromName)
        }

        return state
    }, state)
}

export let resetAttackUnits = (state: state, attackTarget_): Promise<state> => {
    // console.log("resetAttackUnits ")
    return MutableMapUtils.reducePromise(getState(state).attackTargetMap, (state, value, name) => {
        if (value == attackTarget_) {
            // console.log("clear: ", fromName, value)

            // MutableMapUtils.remove(getState(state).attackTargetMap, name)
            state = clearAttackTargetData(state, name)

            return changeFsmStateIfAlive(state, stateMachine => isControlledStateExceptStressing(state, stateMachine), name, createInitialState(state, name))
            // return changeFsmStateIfAlive(state, fromName, null as any)
        }

        return Promise.resolve(state)
    }, state) as any
}

export let getLastJudgeRayCastTime = (state: state, name: name) => {
    return NullableUtils.getWithDefault(MutableMapUtils.get(getState(state).lastJudgeRayCastTimeMap, name), 0)
}

export let setLastJudgeRayCastTime = (state: state, name, value) => {
    // return setState(state, {
    //     ...getState(state),
    //     lastJudgeRayCastTimeMap: getState(state).lastJudgeRayCastTimeMap.set(name, value)
    // })
    MutableMapUtils.set(getState(state).lastJudgeRayCastTimeMap, name, value)
    return state
}

export let getLastJudgeRayCastResult = (state: state, name: name) => {
    return MutableMapUtils.get(getState(state).lastJudgeRayCastResultMap, name)
}


export let getLastJudgeRayCastResultExn = (state: state, name: name) => {
    return NullableUtils.getExn(getLastJudgeRayCastResult(state, name))
}

export let setLastJudgeRayCastResult = (state: state, name, value) => {
    // return setState(state, {
    //     ...getState(state),
    //     lastJudgeRayCastResultMap: getState(state).lastJudgeRayCastResultMap.set(name, value)
    // })
    MutableMapUtils.set(getState(state).lastJudgeRayCastResultMap, name, value)
    return state
}

export let getAllArmyContainers = (state: state) => {
    return getState(state).allArmyContainers
}

export let setAllArmyContainers = (state: state, value) => {
    return setState(state, {
        ...getState(state),
        allArmyContainers: value
    })
}

// export let initWhenImportScene = (state: state) => {
//     return setAllArmyContainers(state, value)
// }

export let disposeData = (state: state, name: name) => {
    state = removeCamp(state, name)

    return setState(state, {
        ...getState(state),
        attackTargetObjectDataMap: MutableMapUtils.remove(getState(state).attackTargetObjectDataMap, name),
        attackTargetMap: MutableMapUtils.remove(getState(state).attackTargetMap, name),
        attackTargetUsedGirlMap: MutableMapUtils.remove(getState(state).attackTargetUsedGirlMap, name),
        // campMap: MutableMapUtils.remove(getState(state).campMap, name),
        isLightStressingMap: MutableMapUtils.remove(getState(state).isLightStressingMap, name),
        lastJudgeRayCastTimeMap: MutableMapUtils.remove(getState(state).lastJudgeRayCastTimeMap, name),
        lastJudgeRayCastResultMap: MutableMapUtils.remove(getState(state).lastJudgeRayCastResultMap, name),

        isEliteGiantessAttackingMap: MutableMapUtils.remove(getState(state).isEliteGiantessAttackingMap, name),
        isNeedRefindPathMap: MutableMapUtils.remove(getState(state).isNeedRefindPathMap, name),
        lastAttackFrameMap: MutableMapUtils.remove(getState(state).lastAttackFrameMap, name),
    })
}

export let dispose = (state: state) => {
    return setState(state, createState())
}

export let getGetPositionYFuncDefaultKey = () => "GetPositionYFuncDefaultKey"

// export let getPositionYWithoutKey = (state: state, name: name, x, z) => {
//     return 0
// }

export let getPositionY = (state: state, key: name, x, z) => {
    // return NullableUtils.getExn(getState(state).getPositionYFuncMap.get(key))(state, x, z)
    return NullableUtils.getWithDefault(
        NullableUtils.map(func => {
            return func(state, x, z)
        }, MutableMapUtils.get(getState(state).getPositionYFuncMap, key)),
        0
    )
}

export let setGetPositionYFunc = (state: state, key, func) => {
    // return setState(state, {
    //     ...getState(state),
    //     getPositionYFuncMap: getState(state).getPositionYFuncMap.set(key, func)
    // })
    MutableMapUtils.set(getState(state).getPositionYFuncMap, key, func)
    return state
}

export let getCrowdData = (state: state): Array<Vector3> => {
    return getState(state).crowdPositions
}

export let setCrowdData = (state: state, crowdPositions) => {
    return setState(state, {
        ...getState(state),
        crowdPositions
    })
}

export let setValidCrowdPositions = (state: state, value) => {
    return setState(state, {
        ...getState(state),
        validCrowdPositions: value
    })
}

export let getDeferDisposeDataNames = (state: state) => {
    return getState(state).deferDisposeDataNames
}

export let addToDeferDisposeDataNames = (state: state, name, lodQueueIndex) => {
    ArrayUtils.push(getState(state).deferDisposeDataNames, [name, lodQueueIndex])

    return state
}

export let clearDeferDisposeDataNames = (state: state) => {
    return setState(state, {
        ...getState(state),
        deferDisposeDataNames: ArrayUtils.create()
    })
}

export let getIsLightStressing = (state: state, name: name) => {
    return NullableUtils.getWithDefault(MutableMapUtils.get(getState(state).isLightStressingMap, name), false)
}

export let setIsLightStressing = (state: state, name, value) => {
    MutableMapUtils.set(getState(state).isLightStressingMap, name, value)

    return state
}

export let markNotLightStressing = (state: state, name) => {
    MutableMapUtils.remove(getState(state).isLightStressingMap, name)

    return state
}


export let getIsNotAttackLittleManTime = (state: state) => {
    return getState(state).isNotAttackLittleManTime
}

export let setIsNotAttackLittleManTime = (state: state, value) => {
    return setState(state, {
        ...getState(state),
        isNotAttackLittleManTime: value
    })
}

export let getIsEliteGiantessAttacking = (state: state, name) => {
    return NullableUtils.getWithDefault(MutableMapUtils.get(getState(state).isEliteGiantessAttackingMap, name), false)
}

export let setIsEliteGiantessAttacking = (state: state, name, value) => {
    return setState(state, {
        ...getState(state),
        isEliteGiantessAttackingMap: MutableMapUtils.set(getState(state).isEliteGiantessAttackingMap, name, value)
    })
}

export let getIsNeedRefindPath = (state: state, name) => {
    return NullableUtils.getWithDefault(MutableMapUtils.get(getState(state).isNeedRefindPathMap, name), false)
}

export let setIsNeedRefindPath = (state: state, name, value) => {
    return setState(state, {
        ...getState(state),
        isNeedRefindPathMap: MutableMapUtils.set(getState(state).isNeedRefindPathMap, name, value)
    })
}



export let getLastAttackFrame = (state: state, name: name) => {
    return NullableUtils.getWithDefault(MutableMapUtils.get(getState(state).lastAttackFrameMap, name), -Infinity)
}

export let setLastAttackFrame = (state: state, name, value) => {
    MutableMapUtils.set(getState(state).lastAttackFrameMap, name, value)
    return state
}

export let getUpdateLittleManWeaponFunc = (state: state) => {
    return getState(state).updateLittleManWeaponFunc
}

export let setUpdateLittleManWeaponFunc = (state: state, func) => {
    return setState(state, {
        ...getState(state),
        updateLittleManWeaponFunc: func
    })
}

export let getAddHitEffectFunc = (state: state) => {
    return getState(state).addHitEffectFunc
}

export let setAddHitEffectFunc = (state: state, func) => {
    return setState(state, {
        ...getState(state),
        addHitEffectFunc: NullableUtils.return_(func)
    })
}

export let removeAddHitEffectFunc = (state: state) => {
    return setState(state, {
        ...getState(state),
        addHitEffectFunc: NullableUtils.getEmpty()
    })
}

