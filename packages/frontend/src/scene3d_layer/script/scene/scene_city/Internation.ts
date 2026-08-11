import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import * as Data from "../../../internation/Data";
import { internation } from "./type/StateType";

export let createState = (): internation => {
    return {
        textData: Data.getTextData(),
        textDataByVariable: Data.getTextDataByVariable(),
        imageData:Data.getImageData(),
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).internation)
}

export let getTextData = (state: state) => {
    return _getState(state).textData
}

export let getTextDataByVariable = (state: state) => {
    return _getState(state).textDataByVariable
}

export let getImageData = (state: state) => {
    return _getState(state).imageData
}