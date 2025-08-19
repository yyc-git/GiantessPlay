import * as DataType from "../../DataType"
import { extendedAnimationName as extendedAnimationNameBiwu, extendedActionName as extendedActionNameBiwu } from "../DataType"

enum extendedAnimationName {
    Welcome = "Welcome",
}

export type animationName = DataType.animationName | extendedAnimationName | extendedAnimationNameBiwu
export const animationName = { ...DataType.animationName, ...extendedAnimationName, ...extendedAnimationNameBiwu }


enum extendedActionName {
    // PickdownFromIdle = "PickdownFromIdle",
}

export type actionName = DataType.actionName | extendedActionName | extendedActionNameBiwu
export const actionName = { ...DataType.actionName, ...extendedActionName, ...extendedActionNameBiwu }
