import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue } from "../data/ValueType";

export let getValue = (state:state): weaponValue => {
    return {
        force: forceSize.Middle,
        type: weaponType.Heavy,

        emitterSpeed: emitterSpeed.Fast,
        emitterLife: emitterLife.Middle,
        emitterSize: emitterSize.Middle,

        meleeRange: NullableUtils.getEmpty(),
    }
}