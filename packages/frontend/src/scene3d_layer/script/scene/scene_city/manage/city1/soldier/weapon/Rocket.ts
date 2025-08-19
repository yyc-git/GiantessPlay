import { SoundManager } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../../../state/State"
import { state } from "../../../../../../../type/StateType"
import { handleCollisionWithArmy, checkRangeCollisionWithArmy, emitShellEmitOrExplode, handleHitArmy } from "../../../../utils/ArmyUtils"
import { getRocketGunHitSoundResourceId } from "../../../../CityScene"
import { getIsDebug } from "../../../../../Scene"
import { getVolume } from "../../../../utils/SoundUtils"
import { getValue } from "../Rocketeer"
import { Box3, Matrix4, Vector3 } from "three"
import { explodeSize } from "../../../../data/ValueType"
import { computeHitPosition } from "../../../../utils/WeaponUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { damageType } from "../../../../type/StateType"
import { name } from "meta3d-jiehuo-abstract/src/type/StateType"

const _v1 = new Vector3();

export let handleRocketHitStatic = (state: state, handleFunc, position,
    pointBox: Box3,
    direction: [number, number, number]
) => {
    let hitPositionVec = computeHitPosition(position, pointBox, direction, 0.6)

    let { emitVolume } = getValue(state)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state),
        SoundManager.buildNeedToPlaySoundData(getRocketGunHitSoundResourceId(), getIsDebug(state), getVolume(state, emitVolume, hitPositionVec, 0))
    ))

    state = emitShellEmitOrExplode(state, hitPositionVec.toArray(), explodeSize.Small)


    return handleFunc(state)
}

export let handleRocketHitGirl = handleRocketHitStatic

// export let handleRocketHitArmy = (state: state,
//     removeParticleFunc,
//     data: Array<[Matrix4, Box3, name]>,
//     pointBox, camp_,
//     particle,
//     pointPosition,
//     [force, type]
// ) => {
//     // let data3 = checkRangeCollisionWithArmy(state, pointBox, camp_)

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