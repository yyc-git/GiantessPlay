import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, emitterCount } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        // force: forceSize.VeryHigh,
        force: forceSize.High,
        armorPiercingForceRatio: armorPiercingForceRatio.High,
        type: weaponType.Explode,

        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Big,
        explodeRange: explodeRange.Middle,


        emitterSpeed: emitterSpeed.Middle,
        emitterLife: emitterLife.Long,
        emitterSize: 8 as emitterSize,
        emitterCollisionSize: 8 as emitterCollisionSize,
        emitterVolume: emitterVolume.VeryBig,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}