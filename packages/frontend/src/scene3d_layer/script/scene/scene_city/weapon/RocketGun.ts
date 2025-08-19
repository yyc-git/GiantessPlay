import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { getIsDebug } from "../../Scene";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.High,
        type: weaponType.Heavy,

        emitterSpeed: emitterSpeed.Slow,
        emitterLife: emitterLife.Long,
        // emitterSize: emitterSize.Middle_Instance,
        emitterSize: 0.05 as emitterSize,

        meleeRange: NullableUtils.getEmpty(),
    }
}