import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"


export let getKickLightSoundResourceId = () => "kick_light"

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`

export let getName = () => "Weapon_KickLight"

export let getKickLightData = (api: api, state: state): weaponValue => {
    return {
        // force: forceSize.Middle,
        // force: forceSize.High,
        // force: forceSize.VeryHigh,
        // force: forceSize.High2,
        // force: forceSize.VeryLow2,
        // force: forceSize.VeryLow3,
        force: forceSize.VeryLow4,
        // armorPiercingForceRatio: armorPiercingForceRatio.VeryHigh2,
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

        emitterVolume: emitterVolume.Middle,

        // meleeRange: api.NullableUtils.return_(meleeRange.Middle),
        meleeRange: api.NullableUtils.return_(meleeRange.Far * 1.5 / 22),
    }
}