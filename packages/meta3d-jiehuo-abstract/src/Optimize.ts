import { getOptimizeState, setOptimizeState } from "./state/State";
import { MutableMapUtils, NullableUtils } from "./Main";
import { optimize, state } from "./type/StateType";
import { TypedArray } from "three";

export let createState = (): optimize => {
    return {
        // float32ArrayPools: ArrayUtils.create()
        float32ArrayPools: MutableMapUtils.create(),
    }
}

export let dispose = (state: state) => {
    // return state
    return setOptimizeState(state, createState())
}

export let getFloat32ArrayAndReset = (state: state, length, isReset): [state, Float32Array] => {
    // let newData = []
    // let result

    // for (let data of getOptimizeState(state).float32ArrayPools) {
    //     if (data.length == length) {
    //         result = data
    //     }
    //     else {
    //         newData = ArrayUtils.push(newData, data)
    //     }
    // }

    // state = setOptimizeState(state, {
    //     ...getOptimizeState(state),
    //     float32ArrayPools: newData
    // })

    // return [state,
    //     NullableUtils.getWithDefault(
    //         // NullableUtils.map(data => {
    //         //     return data.fill(0)
    //         // }, getOptimizeState(state).float32ArrayPools.find(data => data.length == length)),
    //         result,
    //         new Float32Array(length)
    //     )]

    let result = MutableMapUtils.get(
        getOptimizeState(state).float32ArrayPools,
        length,
    )
    if (NullableUtils.isNullable(result)) {
        result = new Float32Array(length)
    }
    else {
        result = NullableUtils.getExn(result)

        if (isReset) {
            result = result.fill(0)
        }

        state = setOptimizeState(state, {
            ...getOptimizeState(state),
            float32ArrayPools: MutableMapUtils.remove(
                getOptimizeState(state).float32ArrayPools,
                length,
            )
        })
    }

    return [state, result]
}

// export let addFloat32Array = (state: state, data) => {
//     return setOptimizeState(state, {
//         ...getOptimizeState(state),
//         float32ArrayPools: ArrayUtils.push(getOptimizeState(state).float32ArrayPools, data)
//     })
// }
export let mutableAddFloat32Array = (state: state, data: Float32Array | TypedArray) => {
    // let _ = ArrayUtils.push(getOptimizeState(state).float32ArrayPools, data)


    const length = data.length

    // if (MutableMapUtils.has(getOptimizeState(state).float32ArrayPools, length)) {
    //     return
    // }

    const maxCount = 200

    if (MutableMapUtils.getCount(getOptimizeState(state).float32ArrayPools) > maxCount) {
        MutableMapUtils.clear(getOptimizeState(state).float32ArrayPools)
        return
    }

    let _ = MutableMapUtils.set(getOptimizeState(state).float32ArrayPools, length, data)
}