import { state } from "../../../../../type/StateType"
import { funcData } from "../FuncData"

type heat = number

type difficultyFunc = (state: state, funcData: funcData, heat: heat, ratioOfOneHeat: number) => Promise<state>

export enum rewardLevel {
    VeryLow = 1,
    Low = 2,
    Middle = 3,
    High = 4,
    VeryHigh = 5,
    VeryHigh1 = 6,
    VeryHigh2 = 7,
}

type data<name> = {
    name: name,

    title: string,

    ratioOfOneHeat?: number,

    heat: heat,
    minHeat: heat,
    maxHeat: heat,

    rewardLevel: number,

    getTextFunc?: (state, d: data<name>) => string,

    applyFunc: difficultyFunc,
    // getDescriptionFunc: (state: state, heat: heat, ratioOfOneHeat: number) => string
    getDescriptionFunc: (state: state, funcData: funcData, heat: heat, ratioOfOneHeat: number) => string
}

type backendData<name> = {
    name: name,

    title: string,

    ratioOfOneHeat?: number,

    heat: heat,
    minHeat: heat,
    maxHeat: heat,
}

export type difficultyData<name> = Array<data<name>>

export type difficultyDataBackend<name> = Array<backendData<name>>

export let computeRatio = (heat, ratioOfOneHeat) => {
    return heat * ratioOfOneHeat
}

export let computeLevel = (heat) => {
    return heat
}