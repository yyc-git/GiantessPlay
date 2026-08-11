import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, emitterCount } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        // force: forceSize.High,
        force: forceSize.Middle2,
        armorPiercingForceRatio: armorPiercingForceRatio.VeryHigh,
        type: weaponType.Explode,

        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Big,
        explodeRange: explodeRange.Zero,


        // emitterSpeed: emitterSpeed.Fast,
        emitterSpeed: emitterSpeed.VeryFast,
        emitterLife: emitterLife.Long,
        emitterSize: emitterSize.Big,
        emitterCollisionSize: emitterCollisionSize.Big,
        emitterVolume: emitterVolume.VeryBig,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}