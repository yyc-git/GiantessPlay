import * as ArrayUtils from "./ArrayUtils"

export type t<key extends number, value> = Array<value>


export let create = ArrayUtils.create

export let get = ArrayUtils.get

export let getExn = ArrayUtils.getExn

export let set = ArrayUtils.set

export let reduce = ArrayUtils.reduce

export let filter = ArrayUtils.filter

export let map = ArrayUtils.map

export let forEach = ArrayUtils.forEach

export let remove = ArrayUtils.remove

export let removeMutiples = ArrayUtils.removeMutiples

export let has = ArrayUtils.has