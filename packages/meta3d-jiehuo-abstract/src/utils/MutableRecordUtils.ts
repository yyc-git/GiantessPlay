import { isNullable } from "./NullableUtils"

export let create = (): any => {
    return {}
}

export let createFromObject = (obj): any => {
    return obj
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

export let getWithDefault = (map, key, default_) => {
    let value = map[key]

    if (isNullable(value)) {
        return default_
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


export let reducePromise = <initialValue, value, key extends number | string>(map: Record<key, value>, func: (initialValue: initialValue, value: value, key: key) => Promise<initialValue>, initialValue: initialValue): Promise<initialValue> => {
    let promise: Promise<initialValue> = Promise.resolve(initialValue)
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            promise = promise.then(initialValue => func(initialValue, map[key], key))
        }
    }

    return promise
}

// export let map = (map, func) => {
//     let i = 0
//     for (let key in map) {
//         if (map.hasOwnProperty(key)) {
//             map[key] = func(map[key], key, i)

//             i += 1
//         }
//     }

//     return map
// }
export let map = (map, func) => {
    let i = 0
    let newMap = create()
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            // map[key] = func(map[key], key, i)
            newMap[key] = func(map[key], key, i)

            i += 1
        }
    }

    // return map
    return newMap
}

export let forEach = (map, func) => {
    let i = 0
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            func(map[key], key, i)

            i += 1
        }
    }
}

export let getCount = (map) => {
    return Object.keys(map).length
}

export let entries = (map) => {
    return Object.entries(map)
}

export let values = <T>(map) => {
    return Object.values<T>(map)
}

export let filter = (map, func) => {
    let newMap = create()
    let i = 0
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            let value = map[key]
            if (func(value, key, i)) {
                newMap[key] = value
            }

            i += 1
        }
    }

    return newMap
}

export let toArray = (map) => {
    return reduce(map, (arr, value) => {
        arr.push(value)

        return arr
    }, [])
}

export let clear = (map) => {
    for (let key in map) {
        if (map.hasOwnProperty(key)) {
            map[key] = null
        }
    }

    return map
}