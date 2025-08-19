import { isNullable } from "./NullableUtils";
import { nullable } from "./nullable";

export let removeDuplicateItemsWithBuildKeyFunc = (arr: any, buildKeyFunc: any) => {
    let resultArr = [];
    // let map = MutableHashMap$Meta3dCommonlib.createEmpty(undefined, undefined);
    let map: any = {}
    for (let i = 0, i_finish = arr.length; i < i_finish; ++i) {
        let item = arr[i];
        let key = buildKeyFunc(item);
        // let match = MutableHashMap$Meta3dCommonlib.get(map, key);
        let match = map[key]
        if (match !== undefined) {

        } else {
            // Js_array.push(item, resultArr);
            // MutableHashMap$Meta3dCommonlib.set(map, key, item);
            resultArr.push(item)
            map[key] = item
        }
    }
    return resultArr
}

export let removeDuplicateItems = (arr: any) => {
    return removeDuplicateItemsWithBuildKeyFunc(arr, (key: number) => key)
}


export let hasDuplicateItems = (arr: any, buildKeyFunc: any): boolean => {
    let result = false
    let map: any = {}
    for (let i = 0, i_finish = arr.length; i < i_finish; ++i) {
        let item = arr[i];
        let key = buildKeyFunc(item);
        let match = map[key]
        if (match !== undefined) {
            result = true
            break
        }

        map[key] = item
    }
    return result
}

export let intersect = (arr1: any, arr2: any) => arr1.filter((value: any) => arr2.includes(value))

export let hasIntersect = (arr1: any, arr2: any) => intersect(arr1, arr2).length > 0

let _func = <initialValue>(func, arr, initialValue: initialValue, index: number): Promise<initialValue> => {
    if (index >= arr.length) {
        return Promise.resolve(initialValue)
    }

    // let result = func(initialValue, arr[index], index)
    // if (result.then == undefined) {
    //     throw new Error('err')
    // }

    return func(initialValue, arr[index], index).then(initialValue => {
        return _func(func, arr, initialValue, index + 1)
    })
}

export let reducePromise = <initialValue, value>(arr: Array<value>, func: (initialValue: initialValue, value: value, index: number) => Promise<initialValue>, initialValue: initialValue): Promise<initialValue> => {
    return _func(func, arr, initialValue, 0)
}


export let isArraysEqual = (a: Array<any>, b: Array<any>) => {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false
    }
    return true
}

export let push = <T>(arr: Array<T>, value: T) => {
    arr.push(value)

    return arr
}

// export let pushValues = <T>(arr: Array<T>, ...values) => {
//     arr.push(...values)

//     return arr
// }


export let pushArrs = <T>(arr: Array<T>, values: Array<T>) => {
    values.forEach(value => {
        arr.push(value)
    })

    return arr
}


export let flatten = <T>(arr: Array<Array<T>>): Array<T> => {
    return arr.reduce((result, valueArr) => {
        return result.concat(valueArr)
    }, [])
}

export let zip = <T>(...arr: Array<Array<T>>): Array<T> => Array.from({ length: Math.max(...arr.map(a => a.length)) }, (_, i) => arr.map(a => a[i])) as Array<T>

export let unzip = arr => {
    return arr.reduce(
        (acc, val) => (val.forEach((v, i) => acc[i].push(v)), acc),
        Array.from({
            length: Math.max(...arr.map(x => x.length))
        }).map(x => [])
    )
}

export let range = (a, b) => {
    let result = []

    for (let i = a; i <= b; i++) {
        result.push(i)
    }

    return result
}

export let get = <T>(arr: Array<T>, index: number): nullable<T> => {
    return arr[index]
}

export let getExn = <T>(arr: Array<T>, index: number): T => {
    let value = arr[index]

    if (isNullable(value)) {
        throw new Error("error")
    }

    return value
}

export let getLast = <T>(arr: Array<T>): nullable<T> => {
    return arr[arr.length - 1]
}

export let set = <T>(arr: Array<T>, index: number, value) => {
    arr[index] = value

    return arr
}

export let changeToHash = (arr: Array<string>) => {
    return arr.reduce((hash, value, i) => {
        hash[value] = i

        return hash
    }, {})
}

export let remove = (arr, index) => {
    return arr.filter((value, i) => {
        return i != index
    })
}

export let removeMutiples = (arr, indices) => {
    return arr.filter((value, i) => {
        return !indices.includes(i)
    })
}


export let multiplyScalar = (arr, scalar) => {
    return arr.map(value => value * scalar)
}

export let map = (arr, func) => {
    return arr.map(func)
}

export let forEach = (arr, func) => {
    return arr.forEach(func)
}

export let filter = (arr, func) => {
    return arr.filter(func)
}

export let reduce = (arr, func, initialValue) => {
    return arr.reduce(func, initialValue)
}

export let create = () => []

export let popLastOne = <T>(arr: Array<T>) => {
    return arr.pop()
}

export let has = <T>(arr: Array<T>, index: number) => {
    return !isNullable(arr[index])
}

export let includes = <T>(arr: Array<T>, value: T) => {
    return arr.includes(value)
}

export let clone = (arr) => {
    return arr.slice()
}