import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.VeryLow,
        // force: forceSize.High,
        type: weaponType.Light,

        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.Middle,
        // emitterLife: emitterLife.Short,
        emitterSize: emitterSize.Middle,

        meleeRange: NullableUtils.getEmpty(),
    }
}