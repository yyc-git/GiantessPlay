import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getScaleByHeight } from "../girl/Utils"

export let computeAnimationDurationFactor = (height: number) => {
    let scale = getScaleByHeight(height)

    if (scale <= 25) {
        return scale / 30
    }
    else if (scale <= 50) {
        // return scale / 40
        return scale / 50
    }
    else if (scale <= 100) {
        // return scale / 50
        return scale / 70
    }
    // else if (scale <= 200) {
    //     // return scale / 60
    //     return scale / 90
    // }
    // else if (scale <= 400) {
    //     // return scale / 70
    //     return scale / 110
    // }
    // else {
    //     // let newScale = scale / 40
    //     // return scale / 80
    //     return scale / 150

    //     // return NumberUtils.greaterThan(newScale, 25 / 30)
    // }

    else if (scale <= 200) {
        // return scale / 110
        return scale / 90
    }
    else if (scale <= 400) {
        // return scale / 180
        return scale / 130
    }
    else if (scale <= 800) {
        // return scale / 280
        // return scale / 250
        // return scale / 210
        return scale / 200
    }
    else if (scale <= 1600) {
        // return scale / 400
        // return scale / 300
        return scale / 270
    }
    else if (scale <= 3200) {
        // return scale / 600
        // return scale / 450
        return scale / 400
    }
    else if (scale <= 6400) {
        // return scale / 1000
        // return scale / 600
        return scale / 550
    }
    else {
        // let newScale = scale / 40
        // return scale / 80
        // return scale / 1200
        return scale / 700

        // return NumberUtils.greaterThan(newScale, 25 / 30)
    }
}