import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"


export let getWalkCharacterSoundResourceId = () => "weapon_walk_character"

export let getWalkVehicleResourceId = () => "weapon_walk_vehicle"

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`

export let getName = () => "Weapon_Walk"

export let getWalkData = (api: api, state: state): weaponValue => {
    return {
        // force: forceSize.VeryLow4,
        force: forceSize.VeryLow5,
        // armorPiercingForceRatio: armorPiercingForceRatio.Middle,
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

        meleeRange: api.NullableUtils.return_(meleeRange.VeryNear),
    }
}