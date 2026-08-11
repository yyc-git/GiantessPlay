// export let multiplyValue = (oldValue,  value) => {
//     return oldValue * (1 +  value)
// }

import { NumberUtils } from "meta3d-jiehuo-abstract"

// export let dividValue = (oldValue,  value) => {
//     return oldValue / (1 +  value)
// }

// export let addValue = (oldValue,  value) => {
//     return oldValue +  value
// }

// export let subValue = (oldValue,  value) => {
//     return oldValue -  value
// }

// export let buildPercentDescription = ( value) => {
//     return `${Math.round( value * 100)}%`
// }

export let multiplyValue = (oldValue, value) => {
    return oldValue * (1 + value)
}

export let dividValue = (oldValue, value) => {
    return oldValue / (1 + value)
}

export let addValue = (oldValue, value) => {
    return oldValue + value
}

export let subValue = (oldValue, value) => {
    return oldValue - value
}

export let buildPercentDescription = (value) => {
    return `${NumberUtils.convertDecimalToPercent(value, 2)}%`
}


export let limitValueNotExceedOne = (value: number) => {
    if (value < 0) {
        return 0
    }

    if (value >= 1) {
        return 0.999
    }

    return value
}
