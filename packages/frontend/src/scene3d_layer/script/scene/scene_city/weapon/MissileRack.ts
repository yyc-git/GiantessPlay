import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, weaponName, emitterCount } from "../data/ValueType";

export let getName = () => {
    return weaponName.Other
}

export let getValue = (state: state): weaponValue => {
    return {
        // force: forceSize.High,
        force: forceSize.Middle2,
        armorPiercingForceRatio: armorPiercingForceRatio.Middle,
        type: weaponType.Explode,

        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Middle,
        explodeRange: explodeRange.Middle,


        emitterSpeed: emitterSpeed.Middle,
        // emitterSpeed: 0.01 as any,
        emitterLife: emitterLife.Long,
        emitterSize: 5 as emitterSize,
        emitterCollisionSize: 5 as emitterCollisionSize,
        emitterVolume: emitterVolume.Big,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}