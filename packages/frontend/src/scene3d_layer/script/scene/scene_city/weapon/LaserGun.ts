import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.Middle,
        type: weaponType.Middle,

        emitterSpeed: emitterSpeed.VeryFast,
        emitterLife: emitterLife.Middle,
        emitterSize: emitterSize.Middle,

        meleeRange: NullableUtils.getEmpty(),
    }
}