import { NullableUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { camp } from "../../type/StateType"
import * as DamageUtils from "../../utils/DamageUtils"
import { getCamp } from "../city1/Army"
import { getModelQueueIndex, getDefenseFactor, getHp, getState, getStateMachine, isStressingByRate, setState, setStateMachine, updateHp, createStressingState } from "../city1/milltary_vehicle/MilltaryVehicle"
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

    forceData, fromName, damagePosition, transforms, boxes, names,
    isNotRotateTowardsTarget = false
) => {
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
                getWeaponValueFunc
            ],
            isNotRotateTowardsTarget
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
        addLabel,
    ], forceData, fromName, damagePosition, transforms, boxes, names,
    )
}