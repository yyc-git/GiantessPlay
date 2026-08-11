import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, meleeRange, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, weaponName, emitterCount } from "../data/ValueType";

export let getName = () => {
    return weaponName.Swiping
}

export let getValue = (state: state): weaponValue => {
    return {
        // force: forceSize.Middle,
        force: forceSize.Low,
        armorPiercingForceRatio: armorPiercingForceRatio.None,
        type: weaponType.Common,

        emitSpeed: emitSpeed.Middle,
        critRatio: critRatio.Middle,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.VeryFast,
        emitterLife: emitterLife.Zero,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Middle,
        emitterCount: emitterCount.Zero,

        // meleeRange: NullableUtils.return_(meleeRange.Middle),
        meleeRange: NullableUtils.return_(meleeRange.Near),
    }
}