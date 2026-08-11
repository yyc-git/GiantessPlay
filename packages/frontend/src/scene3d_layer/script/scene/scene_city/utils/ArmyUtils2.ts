import { NumberUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getAbstractState, setAbstractState } from "../../../../../business_layer/State"
import { shellParticle, bulletParticle, rocketParticle, missileVehicleMissileParticle, name, fontType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { objectStateName, particleNeedCollisionCheckLoopFrames } from "../type/StateType"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { getRenderSetting } from "../../../../mod/SettingMod"
import { physicsLevel } from "setting-default/src/Type"
import { Box3, Matrix4, Vector3 } from "three"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { nullable } from "block/src/Type"
import { damageWithMultipleData, damageWithSingleData } from "./DamageUtils"
import { TupleUtils } from "meta3d-jiehuo-abstract"
import { emitterSpeed } from "../data/ValueType"
import { getIsShowExplosionSmoke } from "../UI"
import { StateMachine } from "meta3d-jiehuo-abstract"
import { api } from "type-api/src/Type"

const _v1 = new Vector3();
const _v2 = new Vector3();


export let computePositionByOffset = (pos, offset) => {
    return pos.set(
        NumberUtils.getRandomValue1() * offset + pos.x,
        pos.y,
        NumberUtils.getRandomValue1() * offset + pos.z,
    )
}

// export let getParticleNeedCollisionCheckLoopCount = (state: state): particleNeedCollisionCheckLoopFrames => {
//     switch (getRenderSetting(state).physics) {
//         case physicsLevel.VeryLow:
//             // return particleNeedCollisionCheckLoopFrames.Four
//             return particleNeedCollisionCheckLoopFrames.Three
//         case physicsLevel.Low:
//             // return particleNeedCollisionCheckLoopFrames.Three
//             return particleNeedCollisionCheckLoopFrames.Two
//         case physicsLevel.Middle:
//         // return particleNeedCollisionCheckLoopFrames.Two
//         case physicsLevel.High:
//         case physicsLevel.VeryHigh:
//             return particleNeedCollisionCheckLoopFrames.One
//     }
// }
export let getParticleNeedCollisionCheckLoopCount = (state: state, emitterSpeed_): particleNeedCollisionCheckLoopFrames => {
    // return particleNeedCollisionCheckLoopFrames.Three
    // if (emitterSpeed_ > emitterSpeed.VeryFast) {
    //     return particleNeedCollisionCheckLoopFrames.One
    // }

    switch (getRenderSetting(state).physics) {
        case physicsLevel.VeryLow:
            // return particleNeedCollisionCheckLoopFrames.Four
            return particleNeedCollisionCheckLoopFrames.Three
        case physicsLevel.Middle:
        case physicsLevel.Low:
            // return particleNeedCollisionCheckLoopFrames.Three
            return particleNeedCollisionCheckLoopFrames.Two
        // case physicsLevel.Middle:
        //     return particleNeedCollisionCheckLoopFrames.Two
        case physicsLevel.High:
        case physicsLevel.VeryHigh:
            return particleNeedCollisionCheckLoopFrames.One
    }
}

export let setParticleNeedCollisionCheckLoopCount = (state: state, particle: shellParticle | bulletParticle | rocketParticle | missileVehicleMissileParticle, emitterSpeed_) => {
    return setAbstractState(state, ParticleManager.setNeedCollisionCheckLoopCount(getAbstractState(state), particle.id, getParticleNeedCollisionCheckLoopCount(state, emitterSpeed_)))
}

export let removeParticle = (state: state, particle) => {
    ParticleManager.markParticleRemove(particle)

    return state
}



export let isZeroForce = (force) => {
    return force <= 0
}

export let handleCollisionWithArmy = (state,
    removeParticleFunc,
    particle,
    forceDirection: Vector3,
    // pointPosition: nullable<Vector3>,
    damagePosition,
    [transform, box, name],
    fromName,
    [
        force, damageType, weaponType
    ],
    weaponValue_,
) => {
    state = removeParticleFunc(state, particle)

    return damageWithSingleData(state, [[force, forceDirection], [damageType, weaponType]],
        weaponValue_,
        fromName,
        // NullableUtils.return_(pointPosition),
        damagePosition,
        [
            transform,
            box,
            name
            // ]).then(TupleUtils.getTuple2First)
        ])
}

export let handleHitArmy = (
    handleHitArmyFunc,
) => {
    return (
        state: state,
        removeParticleFunc,
        data: Array<[Matrix4, Box3, name]>,
        pointBox, camp_,
        particle,
        particleFromName,
        particleDirection,
        pointPosition,
        damagePosition,
        [force, damageType_, weaponType_],
        weaponValue_,
    ) => {
        // if (isZeroForce(force)) {
        //     return Promise.resolve(state)
        // }

        // requireCheck(() => {
        // 	test("data.length should == 1", () => {
        // 		return data.length == 1
        // 	})
        // }, getIsDebug(state))

        // let data3 = checkCollisionWithArmy(state, pointBox, camp_)

        // if (!NullableUtils.isNullable(data)) {
        if (data.length > 0) {
            return NullableUtils.getExn(handleHitArmyFunc)(
                state, (state) => {
                    return ArrayUtils.reducePromise(data, ([state, damageNames], d) => {
                        return handleCollisionWithArmy(state,
                            removeParticleFunc,
                            particle,
                            _v1.fromArray(particleDirection),
                            // _v2.fromArray(pointPosition),
                            damagePosition,
                            d,
                            particleFromName,
                            [force, damageType_, weaponType_], weaponValue_,).then((result) => {
                                return [result[0],
                                ArrayUtils.pushArrs(damageNames, result[1])
                                ]
                            })
                    }, [state, []])
                },
                pointPosition,
                pointBox,
                particleDirection,
                data,
                weaponValue_
            )
        }

        return Promise.resolve(state)
    }
}


export let emitBodyExplode = (state: state, position, box: Box3) => {
    // let halfHeight = box.getSize(_v1).y / 2
    // let height = box.getSize(_v1).y
    let center = box.getCenter(_v1).toArray()


    // let sizeFactor = height / 2

    if (getIsShowExplosionSmoke(state)) {
        state = setAbstractState(state, ParticleManager.emitDust(getAbstractState(state), {
            speed: 0.1,
            // life: 3000,
            life: 1500,
            // size: 20 * sizeFactor,
            size: 20,
            // size: 40,
            // position: [position[0], position[1] - 1.5 + halfHeight, position[2]]
            // position: [center[0], center[1] - 1.5, center[2]]
            // position: center
            position: [center[0], position[1] - 1.5, center[2]]
        }))
    }
    state = setAbstractState(state, ParticleManager.emitShellEmitOrExplode(getAbstractState(state), {
        speed: 1,
        // life: 1500,
        life: 730,
        // size: 40 * sizeFactor,
        size: 40,
        // position: center
        // position: position
        position: [center[0], position[1] + 1.5, center[2]]
    }))

    return state

}

export let getStateMachineUtils = (name, stateMachine) => {
    // if (NullableUtils.isNullable(stateMachine)) {
    //     let s = StateMachine.create(name, objectStateName.Destroyed)

    //     s.previousState = StateMachine.create(name, objectStateName.Destroyed)

    //     return s
    // }

    return stateMachine
}

export let healArmy = (api: api, state: state, addHpRatio, name, box): [state, number] => {
    let hp = api.getArmyHp(state, name)
    let fullHp = api.getArmyFullHp(state, name)

    let newHp = api.NumberUtils.lessThan(
        Math.round(hp + fullHp * addHpRatio),
        fullHp
    )

    let addedHp

    if (newHp > hp && !api.NullableUtils.isNullable(box)) {
        addedHp = newHp - hp

        state = api.setArmyHp(
            state,
            name,
            newHp
        )
        state = api.addStatusToNameInTime(state, name)
        state = api.addLabel(
            state,
            addedHp,
            api.NullableUtils.getExn(box),
            fontType.Heal,
            api.NullableUtils.getEmpty(),
            name,
            2500,
            api.NullableUtils.return_(1.5)
        )
    }
    else {
        addedHp = 0
    }

    return [state, addedHp]
}