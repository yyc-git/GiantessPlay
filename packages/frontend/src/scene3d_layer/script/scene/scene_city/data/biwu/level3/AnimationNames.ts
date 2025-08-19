// import * as AnimationNames from "../AnimationNames";
import { animationName } from "./DataType";
import { getAllAnimationNames as getGirlAllAnimationNames } from "../../../girl/Animation";

// export let getLightStompAnimationNames = () => [
//     animationName.HangRightLightStomp,
//     animationName.HangLeftLightStomp,
//     animationName.BackRightLightStomp,
//     animationName.BackLeftLightStomp,
//     animationName.KeepRightLightStomp,
//     animationName.KeepLeftLightStomp,
// ]

export let getAllAnimationNames = () => [
    animationName.KeepLie,

    animationName.HangRightHand,
    animationName.HangTwoHands,
    animationName.HangLeftHandRightHand,

    animationName.BackRightHand,
    animationName.BackTwoHands,
    animationName.BackLeftHandRightHand,

    animationName.RightHandDefaultToOneFinger,
    animationName.RightHandDefaultToBeat,
    animationName.RightHandDefaultToAdd,

    animationName.TwoHandsDefaultToOneFinger,
    animationName.TwoHandsDefaultToOneFinger,
    animationName.TwoHandsDefaultToBeat,

    animationName.RightHandOneFingerToDefault,
    animationName.RightHandBeatToDefault,
    animationName.RightHandAddToDefault,

    animationName.TwoHandsOneFingerToDefault,
    animationName.TwoHandsBeatToDefault,

    animationName.KeepRightHandDefault,
    animationName.KeepTwoHandsDefault,
    animationName.KeepRightHandOneFinger,
    animationName.KeepTwoHandsOneFinger,
    animationName.KeepRightHandBeat,
    animationName.KeepTwoHandsBeat,

    animationName.KeepRightHandAdd,

    animationName.KeepLeftHandRightHand,


    animationName.HeavyStressingLie,
]
// .concat(
//     (getGirlAllAnimationNames() as any)
// )
// .concat(
//     getLightStompAnimationNames()
// )
// .concat(
//     [
//         animationName.HeavyStressingRightLightStomp,
//         animationName.HeavyStressingLeftLightStomp,

//         animationName.Excitement,
//     ]
// ).concat(
//     AnimationNames.getAllAnimationNames() as any
// )