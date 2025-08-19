import { isNullable } from "./NullableUtils"

export let create = () => {
    return {}
}

export let has = (map, key) => {
    return !isNullable(get(map, key))
}

export let get = (map, key) => {
    return map[key]
}

export let getExn = (map, key) => {
    let value = map[key]

    if (isNullable(value)) {
        throw new Error("error")
    }

    return value
}

export let concat = (map1, map2) => {
    for (let key in map2) {
        if (map2.hasOwnProperty(key)) {
            map1[key] = map2[key]
        }
    }

    return map1
}

export let set = (map, key, value) => {
    map[key] = value

    return map
}

export let remove = (map, key) => {
    delete map[key]

    return map
}

export let reduce = (map, func, initialValue) => {
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            initialValue = func(initialValue, map[key], key)
        }
    }

    return initialValue
}

export let map = (map, func) => {
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            map[key] = func(map[key], key)
        }
    }

    return map
}

export let getCount = (map) => {
    return Object.keys(map).length
}