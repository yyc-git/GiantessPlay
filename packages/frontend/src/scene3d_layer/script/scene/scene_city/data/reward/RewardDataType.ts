import { state } from "../../../../../type/StateType"
import { propName } from "../../type/StateType"

type namePrefix = string

// type count = number

export type getCountFunc = (state: state) => number

export type getRateFunc = (state: state) => number

export type propData = {
    name: propName,
    // title:string,
    // description: string,
    // position: Vector3,
    // imageResourceId: resourceId,
    // count: count

    // isOutLevel: boolean,

    getCountFunc: getCountFunc,
    getRateFunc: getRateFunc,
}

export type rewardSingleData = {
    gem: getCountFunc,
    coin: getCountFunc,
    prop: Array<propData>,

    experienceValue: number,
}

export type rewardData = Record<namePrefix, rewardSingleData>

export enum experienceValue {
    Zero = 0,
    VeryLow = 0.5,
    Low = 1,
    Middle1 = 2,
    Middle2 = 3,
    Middle3 = 4,
    High = 5,
    VeryHigh = 8,
    VeryHigh2 = 15
}

export enum gem {
    Zero = 0,
    VeryLow = 1,
    Low = 2,
    Middle1 = 3,
    Middle2 = 4,
    Middle3 = 5,
    High = 7,
    VeryHigh = 10,
    VeryHigh2 = 15,
    MostHigh = 50,
    MostHigh2 = 100,
}

export enum coin {
    Zero = 0,
    VeryLow = 1,
    Low = 2,
    Middle1 = 3,
    Middle2 = 4,
    Middle3 = 5,
    High = 7,
    VeryHigh = 10,
    VeryHigh2 = 15,
    MostHigh = 100,
    MostHigh2 = 300,
}


export enum rate {
    Zero = 0,
    VeryLow2 = 0.03,
    VeryLow1 = 0.04,
    VeryLow = 0.05,
    Low1 = 0.07,
    Low = 0.1,
    Middle1 = 0.2,
    Middle2 = 0.3,
    Middle3 = 0.4,
    High = 0.5,
    VeryHigh1 = 0.6,
    VeryHigh = 0.7,
    Must = 1,
}

export enum count {
    Zero = 0,
    VeryLow = 1,
    Low1 = 2,
    Low = 3,
    Middle = 5,
    High = 8,
    VeryHigh = 12,
    MostHigh = 30,
    MostHigh2 = 60,
    MostHigh3 = 100,
}
