import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { camp } from "../../type/StateType"
import { createDestroyingState, createStressingState } from "../../utils/CharacterUtils"
import * as DamageUtils from "../../utils/DamageUtils"
import { getDefenseFactor, getHp, getState, getStateMachine, isStressingByRate, setState, setStateMachine, updateHp } from "../city1/soldier/Soldier"
import { getCamp } from "../city1/Army"
import { addLabel } from "../../utils/ArmyUtils"

export let damage = (
    [
        getShakeClipIndexFunc,
        getDeathClipIndexFunc,
        createInitialStateFunc,
        handleDestroyedFunc = (state, name) => state
    ]
) => {
    return (state: state, forceData, fromName, damagePosition, transforms, boxes, names) => {
        return DamageUtils.damage(
            state, [
            getDefenseFactor, getHp, updateHp,

            getStateMachine,
            setStateMachine,
            () => {
                return createStressingState([getShakeClipIndexFunc, getStateMachine, setStateMachine, createInitialStateFunc])
            },
            () => {
                return createDestroyingState([getDeathClipIndexFunc, getState, setState, getStateMachine, setStateMachine, handleDestroyedFunc]
                )
            },
            isStressingByRate,
            addLabel
        ], forceData, fromName,
            damagePosition,
            transforms, boxes, names,
        )
    }
}