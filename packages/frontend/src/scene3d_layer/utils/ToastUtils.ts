import { Device } from "meta3d-jiehuo-abstract"
import { getLanguageTextData, languageKey } from "../internation/Data"
import { getAbstractState } from "../../business_layer/State"

export let wrapDescription = (state, description) => {
    if (Device.isMobileByState(getAbstractState(state))) {
        return description
    }

    return `${getLanguageTextData(state, languageKey.PressV)} ${description}`
}
