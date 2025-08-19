import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../type/StateType";
import { forceSize } from "../data/DataType";
import { weaponType, emitterLife, emitterSize, emitterSpeed, weaponValue } from "../data/ValueType";

export let getValue = (state: state): weaponValue => {
    return {
        force: forceSize.High,
        type: weaponType.VeryHeavy,

        emitterSpeed: emitterSpeed.Middle,
        // emitterSpeed: 0.01 as any,
        emitterLife: emitterLife.Long,
        emitterSize: 5 as emitterSize,

        meleeRange: NullableUtils.getEmpty(),
    }
}