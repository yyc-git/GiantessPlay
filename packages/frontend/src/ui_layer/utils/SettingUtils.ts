import { readState, writeState } from "../../business_layer/State"

export let set = (setFunc, arr, defaultValue, isNumber = true) => {
    let state = readState()

    let value = arr.length > 0 ? (isNumber ? Number(arr[0]) : arr[0]) : defaultValue

    state = setFunc(state, value)

    writeState(state)
}