import { state } from "../../../../../type/StateType"
import * as DamageUtils from "../../utils/DamageUtils"
import { getModelQueueIndex, getDefenseFactor, getHp, getState, getStateMachine, isStressingByRate, setState, setStateMachine, updateHp, createStressingState } from "../city1/milltary_building/MilltaryBuilding"
import { addLabel, createDestroyingState } from "../../utils/ArmyUtils"

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
        getWeaponValueFunc
    ],
    soundResourceId, value,

    forceData, fromName, damagePosition, transforms, boxes, names) => {
    return DamageUtils.damage(
        state, [
        getDefenseFactor, getHp, updateHp,

        getStateMachine,
        setStateMachine,
        createStressingState(
            [
                getBodyQueueFunc,
                getFullHpFunc,
                getModelAllQueuesFunc,
                buildRoughFireRayFunc,
                rotateTowardsTargetFunc,
                fireShellFunc,
                getWeaponValueFunc,
            ]
        ),
        createDestroyingState([
            setStatusFunc,
            emitBodyExplodeFunc,
            getModelQueueIndex,
            getStateMachine,
            setStateMachine,
        ],
            soundResourceId, value
        ),
        isStressingByRate,
        addLabel
    ], forceData, fromName, damagePosition, transforms, boxes, names,
    )
}