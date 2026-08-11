import { NullableUtils } from "meta3d-jiehuo-abstract"
import { trigger } from "../../business_layer/Event"
import { readState } from "../../business_layer/State"
import { buildErrorEventData, getErrorEventName } from "../../scene3d_layer/utils/EventUtils"

export let handleEventHandler = func => (...args) => {
    // try {
    //     let result = func(...args)

    //     if (!!result && !!result.catch) {
    //         result.catch(e => trigger(readState(), getErrorEventName(), buildErrorEventData(e)))
    //     }
    // } catch (e) {
    //     return trigger(readState(), getErrorEventName(), buildErrorEventData(e))
    // }
    return handleHandler(func, ...args)
}

export let handleHandler = (func, ...args) => {
    try {
        let result = func(...args)

        if (!!result && !!result.catch) {
            result.catch(e => trigger(readState(), getErrorEventName(), buildErrorEventData(e)))
        }
    } catch (e) {
        return trigger(readState(), getErrorEventName(), buildErrorEventData(e))
    }
}

// export let handleOnConfirm = func => {
//     try {
//         let result = func()

//         if (!!result.catch) {
//             result.catch(e => trigger(readState(), getErrorEventName(), buildErrorEventData(e)))
//         }
//     } catch (e) {
//         return trigger(readState(), getErrorEventName(), buildErrorEventData(e))
//     }
// }


export let swallowError = (promise) => {
    return promise.catch(e => {
        console.error(e)
    })
}

export let getMessage = (e) => {
    return NullableUtils.getWithDefault(e.message, e)
}

export let getStack = (e) => {
    return NullableUtils.getWithDefault(e.stack, "none")
}