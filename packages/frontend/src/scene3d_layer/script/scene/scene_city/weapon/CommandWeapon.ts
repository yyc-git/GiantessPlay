import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, meleeRange, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, emitterCount } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.None,
        armorPiercingForceRatio: armorPiercingForceRatio.None,
        type: weaponType.Power,

        emitSpeed: emitSpeed.Fast,
        critRatio: critRatio.Zero,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.Middle,
        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.VeryBig,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}