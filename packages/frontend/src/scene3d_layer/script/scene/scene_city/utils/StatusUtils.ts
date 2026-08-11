import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { LOD } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../state/State"
import * as OctreeObjectUtils from "../utils/OctreeObjectUtils";
import * as LODQueueObjectUtils from "../utils/LODQueueObjectUtils";
import { add, addMark, buildDeferRemoveStatusByDamageName, getStatusKey, has, hasMark, remove } from "../Status";
import { getBoxTopPoint } from "../utils/Box3Utils";
import { secondUnit, shootTarget } from "../type/StateType"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { getAimTarget, getShootTargetBox } from "../little_man/Shoot"
import { getLittleManState } from "../little_man/LittleMan"
import { getLockTarget } from "../little_man/Lock"
import { isAliveInLODQueue } from "meta3d-jiehuo-abstract/src/lod/LOD"
import { Flow } from "meta3d-jiehuo-abstract"

// let _getName = (state: state, staticLODContainerIndex, lodQueueData): [name, string] => {
let _getName = (state: state, staticLODContainerIndex, lodQueueData): [name, nullable<string>] => {
    if (!NullableUtils.isNullable(staticLODContainerIndex)) {
        let name = LOD.getName(getAbstractState(state), NullableUtils.getExn(staticLODContainerIndex))
        return [name, OctreeObjectUtils.getNamePrefix(state, name)]
    }
    else if (!NullableUtils.isNullable(lodQueueData)) {
        let [box, name, index] = NullableUtils.getExn(lodQueueData)

        return [name, LODQueueObjectUtils.getNamePrefix(state, name)]
    }

    throw new Error("err")
}

let _getHpRatio = (state: state, name: name) => {
    return NullableUtils.getExn(NullableUtils.getWithDefaultFunc(
        OctreeObjectUtils.getHpRatio(state, name),
        () => LODQueueObjectUtils.getHpRatio(state, name)
    ))
}

let _isLodQueueDataEqual = (d1, d2) => {
    if (NullableUtils.isNullable(d1) && NullableUtils.isNullable(d2)) {
        return true
    }

    if (!NullableUtils.isNullable(d1) && !NullableUtils.isNullable(d2)) {
        let data1 = NullableUtils.getExn(d1)
        let data2 = NullableUtils.getExn(d2)

        return data1[1] == data2[1]
    }

    return false
}

export let isShootTargetNotEqual = (previousShootTarget: nullable<shootTarget>, afterShootTarget: nullable<shootTarget>) => {
    if (NullableUtils.isNullable(previousShootTarget) && NullableUtils.isNullable(afterShootTarget)) {
        return false
    }

    if (!NullableUtils.isNullable(previousShootTarget) && !NullableUtils.isNullable(afterShootTarget)) {
        let data1 = NullableUtils.getExn(previousShootTarget)
        let data2 = NullableUtils.getExn(afterShootTarget)

        return !(data1[1] == data2[1] && _isLodQueueDataEqual(data1[2], data2[2]) && data1[3] == data2[3])
    }

    return true
}


export let removeStatusFromShootTarget = (state: state, shootTarget,
    // currentAimTarget,
    // currentLockTarget
) => {
    if (!NullableUtils.isNullable(shootTarget)
    ) {
        let [_intersectPoint, staticLODContainerIndex, lodQueueData, _collisionPart_] = NullableUtils.getExn(shootTarget)

        let key = getStatusKey(state, staticLODContainerIndex, lodQueueData)

        if (
            !NullableUtils.isNullable(key)
            // && (
            //     isShootTargetNotEqual(
            //         shootTarget,
            //         getLockTarget(state)
            //     )
            //     &&
            //     isShootTargetNotEqual(
            //         shootTarget,
            //         getAimTarget(state)
            //     )
            // )
            && isCanRemove(state, NullableUtils.getExn(key))
        ) {

            state = remove(state, NullableUtils.getExn(key))
        }

    }

    return state
}

export let addStatusToShootTarget = (state: state, shootTarget: nullable<shootTarget>) => {
    let [intersectPoint, staticLODContainerIndex, lodQueueData, _collisionPart_] = NullableUtils.getExn(shootTarget)

    let key = getStatusKey(state, staticLODContainerIndex, lodQueueData)

    if (!NullableUtils.isNullable(key)
        && !has(state, NullableUtils.getExn(key))
    ) {
        let [name, internationName] = _getName(state, staticLODContainerIndex, lodQueueData)

        state = NullableUtils.getWithDefault(
            NullableUtils.map(internationName => {
                return add(state, NullableUtils.getExn(key),
                    state => {
                        return getShootTargetBox(state, [intersectPoint, staticLODContainerIndex, lodQueueData, NullableUtils.getEmpty()])
                    },
                    state => {
                        return _getHpRatio(state, name)
                    },
                    internationName
                )
            }, internationName),
            state
        )
    }

    return state
}

let _isAlive = (state: state, name) => {
    return NullableUtils.getWithDefaultFunc(
        OctreeObjectUtils.isAlive(state, name),
        () => LODQueueObjectUtils.isAlive(state, name)
    )
}

export let addStatusToName = (state: state, name: name) => {
    if (!has(state, name)
        && _isAlive(state, name)
    ) {
        return add(state, name,
            state => {
                return NullableUtils.getWithDefaultFunc(
                    OctreeObjectUtils.getBox(state, name),
                    () => {
                        return NullableUtils.getExn(LODQueueObjectUtils.getBox(state, name))
                    }
                )
            },
            state => {
                return _getHpRatio(state, name)
            },
            NullableUtils.getWithDefaultFunc(
                OctreeObjectUtils.getNamePrefix(state, name),
                () => LODQueueObjectUtils.getNamePrefix(state, name)
            )
        )
    }

    return state
}

export let addMarkStatusToName = (state: state, name: name, resourceId) => {
    if (!hasMark(state, name)
        && _isAlive(state, name)
    ) {
        return addMark(state, name,
            resourceId,
            state => {
                return NullableUtils.getWithDefaultFunc(
                    OctreeObjectUtils.getBox(state, name),
                    () => {
                        return NullableUtils.getExn(LODQueueObjectUtils.getBox(state, name))
                    }
                )
            },
        )
    }

    return state
}


export let addStatusToNameInTime = (state: state, name: name, time: secondUnit = 3) => {
    state = addStatusToName(state, name)

    return setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        if (isCanRemove(state, name)) {
            state = remove(state, name)
        }

        return Promise.resolve(state)
    }, time, buildDeferRemoveStatusByDamageName(name)))
}

let _isShootTargetEqualKey = (state: state, shootTarget: nullable<shootTarget>, key: name) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(([_, staticLODContainerIndex, lodQueueData, _collisionPart_]) => {
            return NullableUtils.getWithDefault(
                NullableUtils.map(shootTargetKey => {
                    return shootTargetKey == key
                }, getStatusKey(state, staticLODContainerIndex, lodQueueData)),
                false
            )
        }, shootTarget),
        false
    )
}

let _isKeyLockedOrAimmed = (state: state, key: name) => {
    return _isShootTargetEqualKey(state, getLockTarget(state), key) || _isShootTargetEqualKey(state, getAimTarget(state), key)
}

export let isCanRemove = (state: state, key: name) => {
    return !_isKeyLockedOrAimmed(state, key)
        && has(state, NullableUtils.getExn(key))
}

export let formatSecondUnit = (second: secondUnit) => {
    if (second > 60) {
        return `${Math.floor(second / 60)}m`
    }

    return second
}