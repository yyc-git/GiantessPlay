import * as DataType from "../../DataType"
import { extendedAnimationName as extendedAnimationNameBiwu, extendedActionName as extendedActionNameBiwu } from "../DataType"

enum extendedAnimationName {
    KeepLie = "KeepLie",

    HangRightHand = "HangRightHand",
    HangTwoHands = "HangTwoHands",
    HangLeftHandRightHand = "HangLeftHandRightHand",

    BackRightHand = "BackRightHand",
    BackTwoHands = "BackTwoHands",
    BackLeftHandRightHand = "BackLeftHandRightHand",

    RightHandDefaultToOneFinger = "RightHandDefaultToOneFinger",
    RightHandDefaultToBeat = "RightHandDefaultToBeat",
    RightHandDefaultToAdd = "RightHandDefaultToAdd",
    TwoHandsDefaultToOneFinger = "TwoHandsDefaultToOneFinger",
    TwoHandsDefaultToBeat = "TwoHandsDefaultToBeat",

    RightHandOneFingerToDefault = "RightHandOneFingerToDefault",
    RightHandBeatToDefault = "RightHandBeatToDefault",
    RightHandAddToDefault = "RightHandAddToDefault",
    TwoHandsOneFingerToDefault = "TwoHandsOneFingerToDefault",
    TwoHandsBeatToDefault = "TwoHandsBeatToDefault",

    KeepRightHandDefault = "KeepRightHandDefault",
    KeepTwoHandsDefault = "KeepTwoHandsDefault",
    KeepRightHandOneFinger = "KeepRightHandOneFinger",
    KeepTwoHandsOneFinger = "KeepTwoHandsOneFinger",
    KeepRightHandBeat = "KeepRightHandBeat",
    KeepTwoHandsBeat = "KeepTwoHandsBeat",

    KeepRightHandAdd = "KeepRightHandAdd",

    KeepLeftHandRightHand = "KeepLeftHandRightHand",

    HeavyStressingLie = "HeavyStressingLie",
}

export type animationName = DataType.animationName | extendedAnimationName | extendedAnimationNameBiwu
export const animationName = { ...DataType.animationName, ...extendedAnimationName, ...extendedAnimationNameBiwu }



enum extendedActionName {
    KeepLie = "KeepLie",

    HangRightHand = "HangRightHand",
    HangTwoHands = "HangTwoHands",
    HangLeftHandRightHand = "HangLeftHandRightHand",

    BackRightHand = "BackRightHand",
    BackTwoHands = "BackTwoHands",
    BackLeftHandRightHand = "BackLeftHandRightHand",

    RightHandDefaultToOneFinger = "RightHandDefaultToOneFinger",
    RightHandDefaultToBeat = "RightHandDefaultToBeat",
    RightHandDefaultToAdd = "RightHandDefaultToAdd",
    TwoHandsDefaultToOneFinger = "TwoHandsDefaultToOneFinger",
    TwoHandsDefaultToBeat = "TwoHandsDefaultToBeat",

    RightHandOneFingerToDefault = "RightHandOneFingerToDefault",
    RightHandBeatToDefault = "RightHandBeatToDefault",
    RightHandAddToDefault = "RightHandAddToDefault",
    TwoHandsOneFingerToDefault = "TwoHandsOneFingerToDefault",
    TwoHandsBeatToDefault = "TwoHandsBeatToDefault",

    KeepRightHandDefault = "KeepRightHandDefault",
    KeepTwoHandsDefault = "KeepTwoHandsDefault",
    KeepRightHandOneFinger = "KeepRightHandOneFinger",
    KeepTwoHandsOneFinger = "KeepTwoHandsOneFinger",
    KeepRightHandBeat = "KeepRightHandBeat",
    KeepTwoHandsBeat = "KeepTwoHandsBeat",

    KeepRightHandAdd = "KeepRightHandAdd",

    KeepLeftHandRightHand = "KeepLeftHandRightHand",


    RightHandOneFingerAttack = "RightHandOneFingerAttack",
    RightHandBeatAttack = "RightHandBeatAttack",
    RightHandAdd = "RightHandAdd",
    LeftHandOneFingerAttack = "LeftHandOneFingerAttack",
    LeftHandBeatAttack = "LeftHandBeatAttack",

    LeftHandRigthHandAttack = "LeftHandRigthHandAttack",

    LeftHandProtect = "LeftHandProtect",

    RightHand = "RightHand",
    TwoHands = "TwoHands",
    LeftHandRigthHand = "LeftHandRigthHand",


    HeavyStressingLie = "HeavyStressingLie",
}

export type actionName = DataType.actionName | extendedActionName | extendedActionNameBiwu
export const actionName = { ...DataType.actionName, ...extendedActionName, ...extendedActionNameBiwu }




export enum heavyStressingLiePhase {
    Up,
    Other
}



export enum articluatedAnimationName {
    MoveLeftHandProtect = "MoveLeftHandProtect",
}
