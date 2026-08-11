import { state } from "../../../../type/StateType"
import { isLittleCharacterType } from "../CityScene"
import { getBoxMinXZSize } from "./Box3Utils"
import { getPlayerBox } from "./PlayerUtils"

export let computeDistanceByBox = (state: state) => {
    let boxSize, factor

    boxSize = getBoxMinXZSize(getPlayerBox(state))

    if (isLittleCharacterType(state)) {
        factor = 3
    }
    else {
        factor = 2.5
    }

    return boxSize * factor
}