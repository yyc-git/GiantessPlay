import { NumberUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getCurrentUsedGirls, getUsedGirlData, getValue } from "../girl/Girl"
import { getGirlPosition, getScale } from "../girl/Utils"
import * as LittleManCamera from "../LittleManCamera"
import { getPosition } from "../little_man/Transform"
import { isGiantessCharacterType } from "../CityScene"
import { ArrayUtils } from "meta3d-jiehuo-abstract"

let _getDistanceForLittleManRoad = (state: state, usedGirl) => {
    let dis = getPosition(state).distanceTo(getGirlPosition(state, usedGirl))

    let scale = getScale(state, usedGirl)

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
    else if (dis < 4 * scale) {
        result = 1
    }
    else {
        result = 0
    }

    return NumberUtils.clamp(
        result,
        0,
        5
    )

}

export let screenShake = (state: state) => {
    if (isGiantessCharacterType(state)) {
        //     getUsedGirlData(state, usedGirl).screenShake.shake(moveCameraForScreenShake, getValue(state).screenShakeDistanceFactor * Math.pow(getScale(state, usedGirl), 1.0), getValue(state).screenShakeTime)
    }
    else {
        // Console.log(_getDistanceForLittleManRoad(state))


        state = ArrayUtils.reduce(
            getCurrentUsedGirls(state),
            (state, usedGirl) => {
                getUsedGirlData(state, usedGirl).screenShake.shake(LittleManCamera.moveCameraForScreenShake, getValue(state, usedGirl).screenShakeDistanceFactor *
                    _getDistanceForLittleManRoad(state, usedGirl)
                    , getValue(state, usedGirl).screenShakeTime)

                return state
            },
            state
        )


    }

    return state
}