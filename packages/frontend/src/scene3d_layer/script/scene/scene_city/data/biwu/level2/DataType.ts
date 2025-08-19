import * as DataType from "../../DataType"
import { extendedAnimationName as extendedAnimationNameBiwu, extendedActionName as extendedActionNameBiwu } from "../DataType"

enum extendedAnimationName {
    HangRightLightStomp = "HangRightLightStomp",
    HangLeftLightStomp = "HangLeftLightStomp",
    BackRightLightStomp = "BackRightLightStomp",
    BackLeftLightStomp = "BackLeftLightStomp",
    KeepRightLightStomp = "KeepRightLightStomp",
    KeepLeftLightStomp = "KeepLeftLightStomp",

    HeavyStressingRightLightStomp = "HeavyStressingRightLightStomp",
    HeavyStressingLeftLightStomp = "HeavyStressingLeftLightStomp",


    Excitement = "Excitement",
}

export type animationName = DataType.animationName | extendedAnimationName | extendedAnimationNameBiwu
export const animationName = { ...DataType.animationName, ...extendedAnimationName, ...extendedAnimationNameBiwu }



enum extendedActionName {
    // LightStomp = "LightStomp",
    LightStomp = "LightStomp",

    HangRightLightStomp = "HangRightLightStomp",
    HangLeftLightStomp = "HangLeftLightStomp",
    BackRightLightStomp = "BackRightLightStomp",
    BackLeftLightStomp = "BackLeftLightStomp",

    HeavyStressingRightLightStomp = "HeavyStressingRightLightStomp",
    HeavyStressingLeftLightStomp = "HeavyStressingLeftLightStomp",
}

export type actionName = DataType.actionName | extendedActionName | extendedActionNameBiwu
export const actionName = { ...DataType.actionName, ...extendedActionName, ...extendedActionNameBiwu }



export enum articluatedAnimationName {
    Rub = "Rub",
}
