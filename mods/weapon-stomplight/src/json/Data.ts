import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"

export let getName = () => "Weapon_StompLight"

export let getStompLightData = (api: api, state: state): weaponValue => {
    return {
        // force: forceSize.High,
        // force: forceSize.VeryLow3,
        force: forceSize.VeryLow4 * 0.4,
        // armorPiercingForceRatio: armorPiercingForceRatio.High,
        armorPiercingForceRatio: armorPiercingForceRatio.Low,
        type: weaponType.Body,


        // emitSpeed: emitSpeed.VeryFast,
        // emitSpeed: emitSpeed.Slow,
        emitSpeed: emitSpeed.Middle,
        critRatio: critRatio.Zero,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.MostFast,
        emitterLife: emitterLife.Middle,
        emitterSize: emitterSize.Big,
        emitterCollisionSize: emitterCollisionSize.Middle,
        emitterCount: emitterCount.Zero,

        emitterVolume: emitterVolume.Middle2,

        // meleeRange: api.NullableUtils.return_(meleeRange.Near),
        // meleeRange: api.NullableUtils.return_(meleeRange.Near * 1.5),
        // meleeRange: api.NullableUtils.return_(meleeRange.Near * 1.5 / 24),
        // meleeRange: api.NullableUtils.return_(meleeRange.Near * 1.6 / 22),
        meleeRange: api.NullableUtils.return_(meleeRange.Near * 1.5 * 1.1 / 22),
    }
}