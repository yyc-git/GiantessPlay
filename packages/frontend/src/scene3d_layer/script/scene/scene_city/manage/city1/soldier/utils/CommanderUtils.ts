import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../type/StateType"
import * as Soldier from "../Soldier"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { commander, xzRange } from "../../../../type/StateType"
import { Map } from "immutable"
import { Vector3 } from "three"
import { armyValue } from "../../../../data/ValueType"

let _getState = (state: state) => {
    return NullableUtils.getExn(Soldier.getState(state).commander)
}

let _setState = (state: state, value: commander) => {
    return Soldier.setState(state, {
        ...Soldier.getState(state),
        commander: NullableUtils.return_(value)
    })
}


export let createState = (): commander => {
    return {
        pointingRangeMap: Map()
    }
}

let _getAllPointingRanges = (state: state) => {
    return Array.from(_getState(state).pointingRangeMap.values())
}

export let isInXZRange = (position: Vector3, xzRange: xzRange) => {
    return position.x > xzRange.minX && position.x < xzRange.maxX && position.z > xzRange.minZ && position.z < xzRange.maxZ
}

let _getIncreaseArmyValueForAttack = (armyValue: armyValue) => {
    return {
        ...armyValue,
        // defenseFactor: armyValue.defenseFactor * 1.2,
        // moveSpeed: armyValue.moveSpeed * 1.2,
        emitSpeed: Math.floor(armyValue.emitSpeed / 1.5),
        emitPrecision: armyValue.emitPrecision / 1.5,
    }
}

export let getArmyValueForAttack = (state: state, armyValue: armyValue, soldierPosition: Vector3) => {
    let isInRange = _getAllPointingRanges(state).reduce((isInRange, xzRange) => {
        if (isInRange) {
            return isInRange
        }

        return isInXZRange(soldierPosition, xzRange)
    }, false)


    if (isInRange) {
        return _getIncreaseArmyValueForAttack(armyValue)
    }

    return armyValue
}

export let setPointingRange = (state: state, name, soldierPosition) => {
    const range = 30

    return _setState(state, {
        ..._getState(state),
        pointingRangeMap: _getState(state).pointingRangeMap.set(name,
            {
                minX: soldierPosition.x - range,
                maxX: soldierPosition.x + range,
                minZ: soldierPosition.z - range,
                maxZ: soldierPosition.z + range,
            }
        )
    })
}

export let removePointingRange = (state: state, name) => {
    return _setState(state, {
        ..._getState(state),
        pointingRangeMap: _getState(state).pointingRangeMap.remove(name)
    })
}
