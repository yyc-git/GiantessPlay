import { api } from "type-api/src/Type"
import { forceSize } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { armorPiercingForceRatio, critRatio, emitSpeed, emitterSpeed, explodeRange, weaponType, weaponValue, emitterLife, emitterSize, emitterCollisionSize, emitterVolume, meleeRange, emitterCount } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { getBlockName } from "../script/Utils"

let _getPath = (name, postfix) => `./${getBlockName()}/src/asset/${name}.${postfix}`

export let getSoundPath = (name) => _getPath(name, "mp3")

export let getSwipingEmmitOtherSoundResourceId = () => "swiping_emit_other"

export let getSwipingEmmitGirlSoundResourceId = () => "swiping_emit_girl"

export let getName = () => "Weapon_LittleMan_Swiping"

export let getSwipingData = (api: api, state: state): weaponValue => {
    return {
        force: forceSize.Middle,
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

        meleeRange: api.NullableUtils.return_(meleeRange.Near),
    }
}