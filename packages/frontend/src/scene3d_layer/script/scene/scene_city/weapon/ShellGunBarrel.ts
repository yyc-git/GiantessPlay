import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, weaponName, emitterCount } from "../data/ValueType";

export let getName = () => {
    return weaponName.Other
}

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.Middle,
        armorPiercingForceRatio: armorPiercingForceRatio.High,
        type: weaponType.Explode,

        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Middle,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.Middle,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Big,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}