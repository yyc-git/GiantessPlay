import { state } from "../../../../../../type/StateType";
import { getAllAnimationNames as getGirlAllAnimationNames } from "../../../girl/Animation";
import * as AnimationNames from "../AnimationNames";
import { animationName } from "./DataType";

export let getAllAnimationNames = (state: state) => (getGirlAllAnimationNames(state) as any).concat(
    [
        animationName.Welcome,
    ]
).concat(
    AnimationNames.getAllAnimationNames() as any
)