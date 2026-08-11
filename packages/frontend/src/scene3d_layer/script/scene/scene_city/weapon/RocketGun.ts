import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, emitSpeed, critRatio, emitterCollisionSize, emitterVolume, armorPiercingForceRatio, explodeRange, weaponName, emitterCount } from "../data/ValueType";

export let getName = () => {
    return weaponName.RocketGun
}

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.Middle2,
        armorPiercingForceRatio: armorPiercingForceRatio.Low,
        type: weaponType.Explode,

        emitSpeed: emitSpeed.Slow,
        critRatio: critRatio.Low,
        explodeRange: explodeRange.Low,


        emitterSpeed: emitterSpeed.Slow,
        emitterLife: emitterLife.Long,
        // emitterSize: emitterSize.Middle_Instance,
        emitterSize: 0.05 as emitterSize,
        emitterCollisionSize: 0.05 as emitterCollisionSize,
        emitterVolume: emitterVolume.Middle,
        emitterCount: emitterCount.One,

        meleeRange: NullableUtils.getEmpty(),
    }
}