import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, meleeRange, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, weaponName, emitterCount } from "../data/ValueType";

export let getName = () => {
    return weaponName.Other
}

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.High,
        armorPiercingForceRatio: armorPiercingForceRatio.Low,
        type: weaponType.Impact,

        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Low,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.VeryShort,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Big,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.return_(meleeRange.VeryFar)
        // meleeRange: NullableUtils.getEmpty(),
    }
}