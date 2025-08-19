import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.None,
        type: weaponType.Light,

        emitterSpeed: emitterSpeed.MostFast,
        emitterLife: emitterLife.VeryLong,
        emitterSize: emitterSize.Big,

        meleeRange: NullableUtils.getEmpty(),
    }
}