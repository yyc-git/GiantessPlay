import { NumberUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getOrbitControlsTarget } from "../Camera"
import { isGiantessRoad } from "../CityScene"
import { getGirlState, getName, getValue } from "../girl/Girl"
import { getGirlPosition, getScale } from "../girl/Utils"
import * as LittleManCamera from "../LittleManCamera"
import { getPosition } from "../little_man/Transform"

let _getDistanceForLittleManRoad = (state: state) => {
    let dis = getPosition(state).distanceTo(getGirlPosition(state))

    let scale = getScale(state)

    // Console.log(dis, scale)

    let result
    if (dis < 0.5 * scale) {
        result = 5
    }
    else if (dis < 1 * scale) {
        result = 4
    }
    else if (dis < 2 * scale) {
        result = 3
    }
    else if (dis < 3 * scale) {
        result = 2
    }
    else {
        result = 1
    }

    return NumberUtils.clamp(
        result,
        1,
        5
    )

}

export let screenShake = (state: state) => {
    if (isGiantessRoad(state)) {
        getGirlState(state).screenShake.shake(getOrbitControlsTarget, getValue(state).screenShakeDistanceFactor * Math.pow(getScale(state), 1.0), getValue(state).screenShakeTime)
    }
    else {
        // Console.log(_getDistanceForLittleManRoad(state))

        getGirlState(state).screenShake.shake(LittleManCamera.getOrbitControlsTarget, getValue(state).screenShakeDistanceFactor *
            _getDistanceForLittleManRoad(state)
            , getValue(state).screenShakeTime)
    }

    return state
}