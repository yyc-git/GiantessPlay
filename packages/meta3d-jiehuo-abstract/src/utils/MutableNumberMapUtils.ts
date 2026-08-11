import { MutableRecordUtils } from "../Main"
import * as ArrayUtils from "./ArrayUtils"

export type t<key extends number, value> = Array<value>


export let create = ArrayUtils.create

export let get = ArrayUtils.get

export let getExn = ArrayUtils.getExn

export let getWithDefault = ArrayUtils.getWithDefault

export let set = ArrayUtils.set

export let reduce = ArrayUtils.reduce

export let filter = ArrayUtils.filter

export let map = ArrayUtils.map

export let forEach = ArrayUtils.forEach

export let remove = ArrayUtils.remove
// export let remove = (map, key) => {
//     delete map[key]

//     return map
// }

export let removeMutiples = (map, indices) => {
    for (let index of indices) {
        remove(map, index)
    }

    return map
}


export let has = ArrayUtils.has

export let fromMutableMap = (map) => {
    return MutableRecordUtils.reduce(map, (result, value, key) => {
        return set(result, key, value)
    }, create())
}


export let getCount = map => map.length