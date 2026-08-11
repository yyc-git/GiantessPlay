import { api } from "type-api/src/Type"
import { getModelQueueIndex, getState, getStateMachine, setState, setStateMachine } from "./Utils"
import { createLieState } from "./FSMState";
import { damageType } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { labelAnimation, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { armyValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType";

export let getHp = api => (state, name) => {
    // return api.MutableMapUtils.getExn(getState(api, state).hpMap, name)
    // return api.NullableUtils.getExn(getState(api, state).hpMap.get(name))
    return api.NullableUtils.getWithDefault(getState(api, state).hpMap.get(name), 0)
}

export let updateHp = api => (state, name, hp) => {
    return setState(api, state, {
        ...getState(api, state),
        hpMap: getState(api, state).hpMap.set(name, hp)
    })
}

let _isGirlScaleVeryBiggerThanSelf = (api: api, state, usedGirl, selfBox) => {
    if (!api.isUseGirl(state, usedGirl)) {
        return false
    }

    return api.box3.getSize(api.girl.getGirlBox(state, usedGirl), api.vector3.getTempVector1()).y >= (api.box3.getSize(selfBox, api.vector3.getTempVector2()).y * 3)
}

let _isStressing = (api: api, state, name, damage, damageType_: damageType) => {
    let damageTypeFactor = api.getDamageTypeFactor(damageType_)

    // let forceFactor = api.getForceFactor(getHp(api)(state, name), damage, 0.1)
    let forceFactor = api.getForceFactor(getHp(api)(state, name), damage, 0.025)

    // const factor = 0.35
    const factor = 0.15


    let rate = api.NumberUtils.clamp(1 * forceFactor * damageTypeFactor * factor, 0, 1)
    // Console.log(rate)

    return Math.random() < rate
}

let _isControlled = (api: api) => (state: state, fromName, damage, damageType_: damageType, direction, stateMachine, box) => {
    // if (isChangeToLieState(damageType_, direction)) {
    //     return true
    // }

    // if (isLieState(stateMachine)) {
    //     return false
    // }

    // if (Girl.isGirl(fromName)) {
    //     return true
    // }

    // return _isStressing(damage, damageType_)

    let usedGirl = api.girl.getUsedGirlByName(fromName)
    if (
        // api.girl.isGirl(fromName)
        damageType_ == damageType.Direct
        && _isGirlScaleVeryBiggerThanSelf(api, state, usedGirl, box)
    ) {
        if (api.isChangeToLieState(state, stateMachine, damageType_, direction)) {
            return true
        }

        if (api.isControlledState(state, stateMachine)) {
            return false
        }


        return true
    }

    if (api.isControlledState(state, stateMachine)) {
        return false
    }


    return _isStressing(api, state, stateMachine.name, damage, damageType_)
}


let _disposeData = (api: api) => (state: state, name: name) => {
    state = api.disposeStaticDynamicUnitData(state, name)


    state = setState(api, state, {
        ...getState(api, state),
        stateMachineMap: api.MutableMapUtils.remove(getState(api, state).stateMachineMap, name),
        // defenseFactorMap: getState(state).defenseFactorMap.remove(name),
        // moveSpeedMap: getState(state).moveSpeedMap.remove(name),
        // attackFactorMap: getState(state).attackFactorMap.remove(name),
        // emitSpeedFactorMap: getState(state).emitSpeedFactorMap.remove(name),
        // critRatioFactorMap: getState(state).critRatioFactorMap.remove(name),
        // missRatioMap: getState(state).missRatioMap.remove(name),
        // hpMap: api.MutableMapUtils.remove(getState(api, state).hpMap, name),
        hpMap: getState(api, state).hpMap.remove(name),
        lodQueueIndexMap: api.MutableMapUtils.remove(getState(api, state).lodQueueIndexMap, name),
        moveTweenMap: api.MutableMapUtils.remove(getState(api, state).moveTweenMap, name),
        // shadowQueueMap: getState(state).shadowQueueMap.remove(name),
        moveDataMap: api.MutableMapUtils.remove(getState(api, state).moveDataMap, name),
    })

    // state = removePointingRange(state, name)

    return state
}

// TODO duplicate
export let damage = (
    api: api,
    [
        getShakeClipIndexFunc,
        getDeathClipIndexFunc,
        getIdleClipIndexFunc,
        getLieClipIndexFunc,
        getStandupClipIndexFunc,
        createInitialStateFunc,
        getValueFunc,
        handleDestroyedFunc = (state, name, position) => state
    ],
) => {
    return (state: state, forceData,
        weaponValue_,
        fromName, damagePosition,
        // critRatioFactor,
        // attackFactor,
        transforms, boxes, names) => {
        // requireCheck(() => {
        //     test("should only has one damage data", () => {
        //         return boxes.length == 1
        //     })
        // }, getIsDebug(state))

        let armyValue: armyValue = getValueFunc(state)

        return api.DamageUtils.damage(
            state, [
            getHp(api), updateHp(api),

            getStateMachine(api),
            setStateMachine(api),
            (
                state,
                fromName,
                [matrix, box, name, damage, damageType_],
                direction
            ) => {
                if (
                    api.girl.isGirl(fromName)
                    &&
                    _isGirlScaleVeryBiggerThanSelf(api, state, api.girl.getUsedGirlByName(fromName), box)
                    &&
                    api.isChangeToLieState(state, getStateMachine(api)(state, name), damageType_, direction)) {
                    return createLieState(api)([
                        getIdleClipIndexFunc,
                        getStandupClipIndexFunc
                    ], getLieClipIndexFunc(name), box, matrix)
                }

                return api.createStressingState([getShakeClipIndexFunc, getStateMachine(api), setStateMachine(api), createInitialStateFunc])
            },
            (
                state,
                fromName,
                [matrix, box, name, damage, damageType_],
                direction
            ) => {
                return api.createDestroyingState([getDeathClipIndexFunc, state => getState(api, state), (state, s) => setState(api, state, s), getStateMachine(api), setStateMachine(api),
                    getModelQueueIndex(api),
                    _disposeData(api),
                    api.handleDestroying, (state, name, position) => {
                        return api.handleDestroyed(state, handleDestroyedFunc, fromName, name, position)
                    }],
                    weaponValue_,
                    // forceData[1][0]
                )
            },
            _isControlled(api),
            api.buildAddLabelFunc(100, labelAnimation.None, 8)
        ], forceData, weaponValue_, fromName,
            damagePosition,
            [
                armyValue.armorType,
                armyValue.armorRatio, armyValue.armorStrength,
                // critRatioFactor,
                // attackFactor,
            ],
            transforms, boxes, names,
        )
    }
}