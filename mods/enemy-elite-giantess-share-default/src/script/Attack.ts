import { api } from "type-api/src/Type"
import { getStateMachine } from "./Utils"
import { armyValue, meleeRange, weaponValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { objectStateName } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"

let _buildAttackDeferName = (name) => `${name}_at`

// export let updateForce = (
//     api: api,
//     weaponValue: weaponValue,
//     box,
// ) => {
//     return {
//         ...weaponValue,
//         force: api.getHeightByBox(box) * weaponValue.force
//     }
// }

// export let getMeleeRange = (
//     api: api,
//     weaponValue: weaponValue,
//     box,
// ) => {
//     return api.NullableUtils.map(
//         meleeRange => {
//             return api.getHeightByBox(box) * meleeRange
//         }, weaponValue.meleeRange
//     )
// }

export let addEffect = (api: api, state, box, center, attackRangeBox) => {
    let scale = api.computeScaleByBox(box)

    if (!api.isMiddleGiantessOrBiggerByScale(scale)) {
        return state
    }

    let size = api.box3.getSize(attackRangeBox, api.vector3.getTempVector1())

    state = api.addFootDamageDecal(state,
        size.x,
        size.z,
        api.getPositionParrelToObj(center, 0)
    )
    state = api.setAbstractState(state, api.ParticleManager.emitStompDust(api.getAbstractState(state),
        {
            speed: 10 * Math.max(scale / 10, 1),
            changeLife: 500,
            life: 3000,
            size: scale,
            position: api.getPositionParrelToObj(center, 1.5).toArray()
        }
    ))

    return state
}

export let attack = (
    api: api,
    state,
    [
        emitFunc,
        getAttackClipIndexFunc,
        getIdleClipIndexFunc,
        getWeaponValueFunc,
        getAttackWayFunc,
    ],
    // bulletStartLocalPosition,
    armyValue: armyValue,
    // emitSpeed: emitSpeed,
    // weaponValue: weaponValue,
    initialQuaternion,

    name,
    //  clipIndex,

    lodQueue, lODQueueIndex) => {
    if (!api.StateMachine.isState(getStateMachine(api)(state, name), objectStateName.Attack)
        // || getAttackTargetExn(state, name) == attackTarget.None
    ) {
        return state
    }

    let matrix = lodQueue.getTransform(lODQueueIndex)

    let eliteGiantessPosition = api.TransformUtils.getPositionFromMatrix4(matrix)
    let eliteGiantessScale = api.TransformUtils.getScaleFromMatrix4(matrix)
    // let targetPosition = getGirlPositionParrelToArmy(state, eliteGiantessPosition.y, getRandomCollisionPart())

    let [targetPosition, targetPart] = api.getTargetDataForSoldier(state, name, eliteGiantessPosition)
    if (api.NullableUtils.isNullable(targetPosition)) {
        return state
    }
    targetPosition = api.NullableUtils.getExn(targetPosition)

    let lookatQuaternion = api.TransformUtils.getLookatQuaternion(
        eliteGiantessPosition,
        targetPosition
    )

    api.TransformUtils.setQuaternionToMatrix4(matrix,
        initialQuaternion.clone().premultiply(
            lookatQuaternion
        )
    )


    let box = lodQueue.getBox(lODQueueIndex)
    let weaponValue = getWeaponValueFunc(state, name, box)

    let {
        emitSpeed,
    } = weaponValue




    let remainAttackFrames = api.computeRemainAttackFrames(state, name, emitSpeed)
    if (api.isCanNotAttackByCD(remainAttackFrames)) {
        state = api.setAbstractState(state, api.GPUSkin.playLoop(
            api.getAbstractState(state),
            name, getIdleClipIndexFunc(name)
        ))

        return api.setAbstractState(state, api.Flow.addDeferExecFuncData(api.getAbstractState(state), (state) => {
            return Promise.resolve(attack(api, state,
                [emitFunc, getAttackClipIndexFunc, getIdleClipIndexFunc, getWeaponValueFunc, getAttackWayFunc],

                armyValue,
                initialQuaternion,

                name, lodQueue, lODQueueIndex))
        }, remainAttackFrames, _buildAttackDeferName(name)))
    }


    let newArmyValue = api.getArmyValueForAttack(state, armyValue, eliteGiantessPosition)
    // Console.log(armyValue)
    // Console.log(newArmyValue)

    // let bulletStartWorldPosition = getBulletStartLocalPositionFunc(eliteGiantessScale)
    //     .applyQuaternion(lookatQuaternion)
    //     .add(
    //         eliteGiantessPosition
    //     )

    let attackWay = getAttackWayFunc(api, state, name, box)

    state = emitFunc(state,
        // bulletStartWorldPosition,
        attackWay,
        targetPosition,
        targetPart,
        lookatQuaternion,
        eliteGiantessPosition,
        eliteGiantessScale,
        newArmyValue,
        weaponValue,
    )

    let clipIndex = getAttackClipIndexFunc(state, name, attackWay)

    state = api.setIsEliteGiantessAttacking(state, name, true)

    state = api.setAbstractState(state, api.GPUSkin.playOnce(
        api.getAbstractState(state),
        (state) => {
            state = api.setAbstractState(state, api.GPUSkin.playLastFrame(api.getAbstractState(state), name, clipIndex))


            state = api.setIsEliteGiantessAttacking(state, name, false)

            state = api.setLastAttackFrame(state, name, api.Flow.getFrameIndex(api.getAbstractState(state)))

            state = api.setAbstractState(state, api.Flow.addDeferExecFuncData(api.getAbstractState(state), (state) => {
                return Promise.resolve(attack(api, state,
                    [emitFunc, getAttackClipIndexFunc, getIdleClipIndexFunc, getWeaponValueFunc, getAttackWayFunc],

                    armyValue,
                    initialQuaternion,

                    name, lodQueue, lODQueueIndex))
            }, api.computeAttackFrames(state, name, emitSpeed), _buildAttackDeferName(name)))

            return Promise.resolve(state)
        },
        name, clipIndex
    ))

    return state
}

let _clearAttack = (api, state: state, name) => {
    state = api.setIsEliteGiantessAttacking(state, name, false)

    return api.setAbstractState(state, api.Flow.removeDeferExecFuncData(api.getAbstractState(state), _buildAttackDeferName(name)))
}

export let exitFuncForCreateAttackState = (api: api) => (state: state, stateMachine) => {
    let name = stateMachine.name

    state = api.setAbstractState(state, api.Flow.removeDeferExecFuncData(api.getAbstractState(state), name))

    state = _clearAttack(api, state, name)

    return Promise.resolve(state)
}