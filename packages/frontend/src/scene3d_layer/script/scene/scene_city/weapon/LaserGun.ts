import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, weaponName, emitterCount } from "../data/ValueType";

export let getName = () => {
    return weaponName.LaserGun
}

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.Middle,
        armorPiercingForceRatio: armorPiercingForceRatio.Middle,
        type: weaponType.Power,


        // emitSpeed: emitSpeed.Middle,
        emitSpeed: emitSpeed.Middle2,
        critRatio: critRatio.Low,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.VeryFast,
        emitterLife: emitterLife.Middle,

        emitterSize: emitterSize.Middle,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterVolume: emitterVolume.Small,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}