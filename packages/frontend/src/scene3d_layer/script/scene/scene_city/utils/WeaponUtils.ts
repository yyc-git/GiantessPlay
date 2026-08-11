import { Vector3 } from "three";
import { critRatio, emitSpeed, emitterSpeed, emitterLife, emitterCollisionSize, emitterCount, emitterSize, emitterVolume, explodeRange, meleeRange, weaponType, weaponValue } from "../data/ValueType";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { damageType, forceSize, particleNeedCollisionCheckLoopFrames } from "../type/StateType";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { armorType, critRatioFactor, excitement } from "../data/DataType";
import { getHeight } from "./DamageUtils";
import { getParticleNeedCollisionCheckLoopCount } from "./ArmyUtils2";
import { getGirlWeaponType } from "../girl/Utils";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();

export let computeHitPosition = (position, pointBox, direction, scalar) => {
    return _v1.fromArray(position).add(
        _v3.fromArray(direction).multiplyScalar(
            pointBox.getSize(_v2).length() * scalar
        )
    )
}

// export let convertEmitSpeedToFactor = (emitSpeed_: emitSpeed, fasttestFactor:number) => {
//     return emitSpeed_ / emitSpeed.VeryFast * fasttestFactor
// }

// export let convertEmitSpeedToLoopCount = (emitSpeed_: emitSpeed) => {

// }

// export let computeForce = (weaponValue: weaponValue): [damageType, forceSize] => {
//     let damageType_
//     switch (weaponValue.type) {
//         case weaponType.Light:
//         case weaponType.Middle:
//             damageType_ = damageType.Global
//             break
//         case weaponType.Heavy:
//         case weaponType.VeryHeavy:
//             damageType_ = damageType.Heavy
//             break
//         default:
//             throw new Error("err")
//     }

//     return [damageType_, weaponValue.force]
// }

export let computeExcitementFactor = (weaponType_: weaponType): number => {
    let factor
    switch (weaponType_) {
        case weaponType.Explode:
            factor = 1.5
            break
        case weaponType.Impact:
            factor = 0.5
            break
        case weaponType.Magic:
        case weaponType.Effect:
        case weaponType.EffectSelf:
            factor = 0.8
            break
        case weaponType.Body:
            factor = 1
            break
        case weaponType.Power:
            factor = 1.5
            break
        case weaponType.Common:
            factor = 1.2
            break
        default:
            throw new Error("err")
    }

    return factor
}

export let computeForceFactor = (weaponType_: weaponType, armorType_: armorType): number => {
    let factor
    switch (weaponType_) {
        case weaponType.Explode:
            switch (armorType_) {
                case armorType.Giantess:
                case armorType.Building:
                    factor = 1
                    break
                case armorType.Mech:
                    factor = 0.75
                    break
                case armorType.LittleMan:
                case armorType.Light:
                    factor = 0.25
                    break
                case armorType.Heavy:
                    factor = 0.5
                    break
            }
            break
        case weaponType.Impact:
            switch (armorType_) {
                case armorType.Mech:
                    factor = 0.25
                    break
                case armorType.Giantess:
                case armorType.Building:
                    factor = 0.5
                    break
                case armorType.LittleMan:
                case armorType.Heavy:
                case armorType.Light:
                    factor = 1
                    break
            }
            break
        case weaponType.Magic:
        case weaponType.Effect:
        case weaponType.EffectSelf:
            switch (armorType_) {
                // case armorType.Giantess:
                //     // factor = 0.5
                //     // factor = 0.8
                //     factor = 1.3
                //     break
                case armorType.Building:
                    factor = 0.3
                    break
                case armorType.LittleMan:
                case armorType.Light:
                    factor = 1.3
                    break
                case armorType.Giantess:
                case armorType.Mech:
                case armorType.Heavy:
                    factor = 2
                    break
            }
            break
        case weaponType.Body:
        // switch (armorType_) {
        //     case armorType.Giantess:
        //         factor = 0.9
        //         break
        //     case armorType.Building:
        //         factor = 1.2
        //         break
        //     case armorType.LittleMan:
        //     case armorType.Light:
        //     case armorType.Heavy:
        //         factor = 1.2
        //         break
        // }
        // break
        case weaponType.Power:
            switch (armorType_) {
                case armorType.Giantess:
                case armorType.Mech:
                case armorType.Building:
                case armorType.LittleMan:
                case armorType.Light:
                case armorType.Heavy:
                    factor = 1
                    break

            }
            break
        case weaponType.Common:
            switch (armorType_) {
                case armorType.Giantess:
                    factor = 1.5
                    break
                case armorType.Building:
                case armorType.Mech:
                    factor = 0.5
                    break
                case armorType.LittleMan:
                case armorType.Light:
                case armorType.Heavy:
                    factor = 1
                    break
            }
            break
        default:
            throw new Error("err")
    }

    return factor
}

export let computeCrit = ([force, damageType_], weaponValue: weaponValue, critRatioFactor: critRatioFactor): [forceSize, damageType] => {
    if (NumberUtils.isRandomRate(weaponValue.critRatio * critRatioFactor)) {
        return [force * 2, damageType.Crit]
    }

    return [force, damageType_]
}

export let isMeleeWeapon = (meleeRange_: meleeRange) => {
    return !NullableUtils.isNullable(meleeRange_)
}

export let isRemoteWeapon = (meleeRange_: meleeRange) => {
    return NullableUtils.isNullable(meleeRange_)
}

export let isRangeWeapon = (weaponValue_: weaponValue) => {
    return weaponValue_.explodeRange > explodeRange.Zero
}

export let computeHalfSize = (state, weaponValue_: weaponValue) => {
    // let halfSize = new Vector3().setScalar(weaponValue_.emitterCollisionSize / 5)
    // let halfSize = new Vector3().setScalar(Math.cbrt(weaponValue_.emitterCollisionSize))
    let halfSize = new Vector3().setScalar(Math.cbrt(weaponValue_.emitterCollisionSize) / 2)

    let halfSizeScalar
    switch (getParticleNeedCollisionCheckLoopCount(state, weaponValue_.emitterSpeed)) {
        case particleNeedCollisionCheckLoopFrames.One:
            halfSizeScalar = 1
            break
        case particleNeedCollisionCheckLoopFrames.Two:
            halfSizeScalar = 3
            break
        case particleNeedCollisionCheckLoopFrames.Three:
            halfSizeScalar = 7
            break
    }

    return [
        halfSize.multiplyScalar(halfSizeScalar),
        halfSizeScalar
    ]
}

export let computeRange = (explodeRange_: explodeRange) => {
    explodeRange_ = Math.round(explodeRange_)

    return Math.pow(2, explodeRange_)
}

export let computeRangeForce = (force) => {
    return force / 2
}

export let getRangePointBox = (pointBox, explodeRange_) => {
    // let vec
    // switch (explodeRange_) {
    //     case explodeRange.VeryLow:
    //         // vec = _v1.set(1, 0.5, 1)
    //         vec = _v1.set(2, 1, 2)
    //         break
    //     case explodeRange.Low:
    //         // vec = _v1.set(2, 1, 2)
    //         vec = _v1.set(4, 2, 4)
    //         break
    //     case explodeRange.Middle:
    //         // vec = _v1.set(4, 2, 4)
    //         vec = _v1.set(8, 4, 8)
    //         break
    //     case explodeRange.Big:
    //         // vec = _v1.set(6, 3, 6)
    //         vec = _v1.set(16, 8, 16)
    //         break
    //     case explodeRange.VeryBig:
    //         // vec = _v1.set(9, 5, 9)
    //         vec = _v1.set(32, 16, 32)
    //         break
    //     default:
    //         throw new Error("err")
    // }
    let range = computeRange(explodeRange_)
    let vec = _v1.set(range, range / 2, range)

    return pointBox.clone().expandByVector(
        vec
    )
}

// export let getMeleeRange = (
//     meleeRange,
//     box,
//     isEliteGiantess
// ) => {
//     if (!isEliteGiantess) {
//         return meleeRange
//     }

//     return NullableUtils.map(
//         meleeRange => {
//             return getHeight(box) * meleeRange
//         }, meleeRange
//     )
// }


export let buildEffectWeaponValue = (force: number, armorPiercingForceRatio, type, critRatio): weaponValue => {
    return {
        force: force,
        armorPiercingForceRatio,
        type,

        emitSpeed: emitSpeed.VerySlow,
        critRatio,
        explodeRange: explodeRange.Zero,

        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.Middle,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Middle,
        emitterCount: emitterCount.Zero,

        meleeRange: NullableUtils.getEmpty(),
    }
}

export let buildGirlWeaponValue = (force: number, armorPiercingForceRatio, critRatio): weaponValue => {
    return {
        force: force,
        armorPiercingForceRatio,
        critRatio,
        type: getGirlWeaponType(),

        emitSpeed: emitSpeed.Fast,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.Middle,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Middle,
        emitterCount: emitterCount.Zero,

        meleeRange: NullableUtils.return_(meleeRange.VeryFar)
    }
}

export let isRemoteDamage = (weaponValue_, damageType_) => {
    switch (damageType_) {
        case damageType.Direct:
        // case damageType.Miss:
        case damageType.Range:
        case damageType.Global:
            return false
    }

    return isRemoteWeapon(weaponValue_.meleeRange)
}


export let computeRemoteDistance = (emitterLife, emitterSpeed) => {
    let targetDistance = (emitterLife * emitterSpeed / 20)
    let minTargetDistance = NumberUtils.greaterThan(targetDistance / 3, 10)

    return [targetDistance, minTargetDistance]
}

export let limitNonBulletEmitterSpeed = (emitterSpeed) => {
    return NumberUtils.lessThan(emitterSpeed, 2)
}

export let isEffect = (weaponType_) => {
    return weaponType_ == weaponType.Effect
        || weaponType_ == weaponType.EffectSelf
}