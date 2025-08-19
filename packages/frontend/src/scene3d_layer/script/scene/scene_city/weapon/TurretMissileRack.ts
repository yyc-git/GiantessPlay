import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.VeryHigh,
        type: weaponType.VeryHeavy,

        emitterSpeed: emitterSpeed.Middle,
        emitterLife: emitterLife.Long,
        emitterSize: 8 as emitterSize,

        meleeRange: NullableUtils.getEmpty(),
    }
}