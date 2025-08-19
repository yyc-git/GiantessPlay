import * as DataType from "../DataType"

export enum extendedAnimationName {
    PickdownFromIdle = "PickdownFromIdle",
}

export type animationName = DataType.animationName | extendedAnimationName
export const animationName = { ...DataType.animationName, ...extendedAnimationName }


export enum extendedActionName {
    PickdownFromIdle = "PickdownFromIdle",
}

export type actionName = DataType.actionName | extendedActionName
export const actionName = { ...DataType.actionName, ...extendedActionName }
