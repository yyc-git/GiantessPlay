import * as AnimationNames from "../AnimationNames";
import { animationName } from "./DataType";
import { getAllAnimationNames as getGirlAllAnimationNames } from "../../../girl/Animation";

export let getLightStompAnimationNames = () => [
    animationName.HangRightLightStomp,
    animationName.HangLeftLightStomp,
    animationName.BackRightLightStomp,
    animationName.BackLeftLightStomp,
    animationName.KeepRightLightStomp,
    animationName.KeepLeftLightStomp,
]

export let getAllAnimationNames = () => (getGirlAllAnimationNames() as any).concat(
    getLightStompAnimationNames()
).concat(
    [
        animationName.HeavyStressingRightLightStomp,
        animationName.HeavyStressingLeftLightStomp,

        animationName.Excitement,
    ]
).concat(
    AnimationNames.getAllAnimationNames() as any
)