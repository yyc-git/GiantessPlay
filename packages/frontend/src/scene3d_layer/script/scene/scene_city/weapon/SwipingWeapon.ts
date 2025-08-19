import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, meleeRange } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.Middle,
        type: weaponType.Heavy,

        emitterSpeed: emitterSpeed.VeryFast,
        emitterLife: emitterLife.Zero,
        emitterSize: emitterSize.Middle,

        meleeRange: NullableUtils.return_(meleeRange.Middle),
    }
}