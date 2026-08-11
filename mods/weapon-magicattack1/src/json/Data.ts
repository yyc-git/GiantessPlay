import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"


export let getFireballHitSoundResourceId = () => "fireball_hit"

export let getSoundPath = (name) => `./${getBlockName()}/src/asset/${name}.mp3`

export let getName = () => "Weapon_MagicAttack1"

export let getMagicAttack1Data = (api: api, state: state): weaponValue => {
    return {
        // force: forceSize.VeryLow2,
        // force: forceSize.VeryLow,
        // force: forceSize.VeryLow4,
        force: forceSize.VeryLow5,
        // force: forceSize.Low,
        armorPiercingForceRatio: armorPiercingForceRatio.Middle,
        type: weaponType.Magic,


        // emitSpeed: emitSpeed.VeryFast,
        // emitSpeed: emitSpeed.Slow,
        emitSpeed: emitSpeed.Middle,
        critRatio: critRatio.Zero,
        // explodeRange: explodeRange.VeryBig,
        explodeRange: explodeRange.Zero,


        emitterSpeed: emitterSpeed.Middle,
        emitterLife: emitterLife.Long,
        emitterSize: emitterSize.VeryBig,
        emitterCollisionSize: emitterCollisionSize.VeryBig,
        emitterCount: emitterCount.One,

        emitterVolume: emitterVolume.Big,

        meleeRange: api.NullableUtils.getEmpty(),
    }
}