import { state } from "../../../../../type/StateType"
import * as DamageUtils from "../../utils/DamageUtils"
import { getModelQueueIndex, getHp, getState, getStateMachine, setState, setStateMachine, updateHp, createStressingState, disposeData, getModelQueueIndexNullable, isStressing } from "../city1/milltary_building/MilltaryBuilding"
import { addLabel, createDestroyingState } from "../../utils/ArmyUtils"
import { armyValue, weaponValue } from "../../data/ValueType"
import { createFlattenState, isChangeToFlattenState, isControlled } from "../../utils/RigidBodyUtils"

export let damage = (state: state,
    [
        getBodyQueueFunc,
        getFullHpFunc,
        setStatusFunc,
        emitBodyExplodeFunc,
        getModelAllQueuesFunc,
        buildRoughFireRayFunc,
        rotateTowardsTargetFunc,
        fireShellFunc,
        getWeaponValueFunc,
        setScaleYFunc
    ],
    soundResourceId, value: armyValue,
    forceData, weaponValue_, fromName, damagePosition,
    // critRatioFactor,
    // attackFactor,
    transforms, boxes, names) => {
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
            if (
                isChangeToFlattenState(
                    state,
                    getStateMachine(state, name),
                    damage, damageType_,
                    direction,
                    getFullHpFunc(state, name),
                    getHp(state, name),
                    fromName
                )
            ) {
                return createFlattenState(
                    getStateMachine,
                    setStateMachine,
                    createDestroyingState,
                    getModelQueueIndex,
                    getModelQueueIndexNullable,
                    disposeData,
                )([
                    getBodyQueueFunc,
                    setScaleYFunc,
                    setStatusFunc,
                    emitBodyExplodeFunc
                ],
                    soundResourceId, weaponValue_,
                    fromName,
                    [matrix, box, name, damage, damageType_],
                    forceData[0][1]
                )
            }

            return createStressingState(
                [
                    getBodyQueueFunc,
                    getFullHpFunc,
                    getModelAllQueuesFunc,
                    buildRoughFireRayFunc,
                    rotateTowardsTargetFunc,
                    fireShellFunc,
                    getWeaponValueFunc
                ],
            )()
        },
        createDestroyingState([
            setStatusFunc,
            emitBodyExplodeFunc,
            getModelQueueIndexNullable,
            disposeData,
            getStateMachine,
            setStateMachine,
        ],
            soundResourceId, weaponValue_,
            forceData[1][0]
        ),
        isControlled(isStressing),
        addLabel
    ], forceData, weaponValue_, fromName, damagePosition,
        [value.armorType, value.armorRatio, value.armorStrength,
            // critRatioFactor,
            // attackFactor,
        ],
        transforms, boxes, names,
    )
}