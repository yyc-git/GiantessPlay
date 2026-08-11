import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { camp } from "../../type/StateType"
import { createDestroyingState, createStressingState, isChangeToLieState } from "../../utils/CharacterUtils"
import * as DamageUtils from "../../utils/DamageUtils"
import { createLieState, disposeData, getHp, getModelQueueIndex, getModelQueueIndexNullable, getState, isControlled, setState, updateHp } from "../city1/soldier/Soldier"
import { getCampWithDefault } from "../city1/Army"
import { addLabel, handleDestroyed, handleDestroying, handleHeadShot } from "../../utils/ArmyUtils"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../../Scene"
import { armyValue } from "../../data/ValueType"
import { getStateMachine, setStateMachine } from "../city1/soldier/utils/SoldierUtils"

export let damage = (
    [
        getShakeClipIndexFunc,
        getDeathClipIndexFunc,
        getIdleClipIndexFunc,
        getLieClipIndexFunc,
        getStandupClipIndexFunc,
        createInitialStateFunc,
        getValueFunc,
        handleDestroyedFunc = (state, name, position) => state
    ]
) => {
    return (state: state, forceData, weaponValue_, fromName, damagePosition,
        // critRatioFactor,
        // attackFactor,
        transforms, boxes, names) => {
        // requireCheck(() => {
        //     test("should only has one damage data", () => {
        //         return boxes.length == 1
        //     })
        // }, getIsDebug(state))

        // forceData = handleHeadShot(forceData, damagePosition, fromName, weaponValue_, boxes[0])

        let armyValue: armyValue = getValueFunc(state)

        return DamageUtils.damage(
            state, [
            // getDefenseFactor,
            // // getAttackFactor,
            // // getCritRatioFactor,
            // getMissRatio,
            getHp, updateHp,

            getStateMachine,
            setStateMachine,
            (
                state,
                fromName,
                [matrix, box, name, damage, damageType_],
                direction
            ) => {
                if (isChangeToLieState(state, getStateMachine(state, name), damageType_, direction)) {
                    return createLieState([
                        getIdleClipIndexFunc,
                        getStandupClipIndexFunc
                    ], getLieClipIndexFunc(name), box, matrix)
                }

                return createStressingState([getShakeClipIndexFunc, getStateMachine, setStateMachine, createInitialStateFunc])
            },
            (
                state,
                fromName,
                [matrix, box, name, damage, damageType_],
                direction
            ) => {
                return createDestroyingState([getDeathClipIndexFunc, getState, setState, getStateMachine, setStateMachine,
                    getModelQueueIndexNullable,
                    disposeData,
                    handleDestroying, (state, name, position) => {
                        return handleDestroyed(state, handleDestroyedFunc, fromName, name, position)
                    }],
                    weaponValue_,
                    // forceData[1][0]
                )
            },
            isControlled,
            addLabel
        ], forceData,
            weaponValue_,
            fromName,
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