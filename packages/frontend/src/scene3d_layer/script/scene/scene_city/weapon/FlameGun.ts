import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue, meleeRange } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.High,
        type: weaponType.VeryHeavy,

        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.VeryShort,
        emitterSize: emitterSize.Middle,

        meleeRange: NullableUtils.return_(meleeRange.VeryFar)
        // meleeRange: NullableUtils.getEmpty(),
    }
}