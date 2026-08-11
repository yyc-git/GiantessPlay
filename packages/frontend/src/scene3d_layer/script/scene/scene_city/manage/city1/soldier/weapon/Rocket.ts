import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { emitShellEmitOrExplode } from "../../../../utils/ArmyUtils"
import { getRocketGunHitSoundResourceId } from "../../../../CityScene"
import { getIsDebug } from "../../../../../Scene"
import { getVolume } from "../../../../utils/SoundUtils"
import { Box3, Matrix4, Vector3 } from "three"
import { explodeSize } from "../../../../data/ValueType"
import { computeHitPosition } from "../../../../utils/WeaponUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { damageType } from "../../../../type/StateType"
import { name } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getValue } from "../../../../weapon/RocketGun"
import { handleHitArmy } from "../../../../utils/ArmyUtils2"
import { TupleUtils } from "meta3d-jiehuo-abstract"

const _v1 = new Vector3();

export let handleRocketHitStatic = (state: state, handleFunc, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    let hitPositionVec = computeHitPosition(position, pointBox, direction, 0.6)

    let { emitterVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getRocketGunHitSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume, hitPositionVec, 0))
    ))

    state = emitShellEmitOrExplode(state, hitPositionVec.toArray(), explodeSize.Small)


    return handleFunc(state).then(TupleUtils.getTuple2First)
}

export let handleRocketHitGirl = (state: state, handleFunc, usedGirl, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    let hitPositionVec = computeHitPosition(position, pointBox, direction, 0.6)

    let { emitterVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getRocketGunHitSoundResourceId(), getIsDebug(state), getVolume(state, emitterVolume, hitPositionVec, 0))
    ))

    state = emitShellEmitOrExplode(state, hitPositionVec.toArray(), explodeSize.Small)


    return handleFunc(state).then(TupleUtils.getTuple2First)
}

// export let handleRocketHitArmy = (state: state,
//     removeParticleFunc,
//     data: Array<[Matrix4, Box3, name]>,
//     pointBox, camp_,
//     particle,
//     pointPosition,
//     [force, type]
// ) => {
//     // let data3 = checkRangeBoxCollisionWithArmy(state, pointBox, camp_)

//     if (data.length > 0) {
//         return handleRocketHitStatic(state, state => {
//             return ArrayUtils.reducePromise(data, (state, d) => {
//                 return handleCollisionWithArmy(state,
//                     removeParticleFunc,
//                     particle,
//                     _v1.fromArray(particle.direction),
//                     pointPosition,
//                     d,
//                     particle.fromName,
//                     [force, damageType.Normal, type])
//             }, state)
//         }, pointPosition,
//             pointBox,
//             particle.direction,
//         )
//     }

//     return Promise.resolve(state)
// }
export let handleRocketHitArmy = handleHitArmy(handleRocketHitStatic)

export let handleRocketHitLittleMan = handleRocketHitStatic