import { readState, writeState } from "../../business_layer/State"
import { buildAPI } from "../../scene3d_layer/mod/Mod"
import { getModAPI } from "../../scene3d_layer/script/scene/scene_city/Mod"

export let set = (setFunc, arr, defaultValue, isNumber = true) => {
    let state = readState()

    let value = arr.length > 0 ? (isNumber ? Number(arr[0]) : arr[0]) : defaultValue

    state = setFunc(state, value)

    writeState(state)
}

export let setPromise = (state, setFunc, arr, getDefaultValueFunc, isNumber = true) => {
    let value = arr.length > 0 ? (isNumber ? Number(arr[0]) : arr[0]) : getDefaultValueFunc(getModAPI(state), readState())

    return setFunc(value)
}