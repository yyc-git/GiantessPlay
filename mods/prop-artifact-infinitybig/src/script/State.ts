import { state as blockState } from "prop-other-protocol/src/state/StateType"

export let createState = (): blockState => {
    return {
        isWork: false
    }
}
// export let createState = (): blockState => null