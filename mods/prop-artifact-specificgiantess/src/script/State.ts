import { state as blockState } from "prop-other-protocol/src/state/StateType"

export let buildDefaultValue = () => "Default"
// export let buildDefaultValue = () => null


export let createState = (): blockState => {
    return {
        mmdCharacter: buildDefaultValue()
    }
}