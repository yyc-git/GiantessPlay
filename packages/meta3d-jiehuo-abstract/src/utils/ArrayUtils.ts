import { MutableRecordUtils, NumberUtils } from "../Main";
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

// let _func = <initialValue>(func, arr, initialValue: initialValue, index: number, length): Promise<initialValue> => {
//     // let result = func(initialValue, arr[index], index)
//     // if (result.then == undefined) {
//     //     throw new Error('err')
//     // }

//     return func(initialValue, arr[index], index).then(initialValue => {
//         let newIndex = index + 1
//         if (newIndex >= length) {
//             return initialValue
//         }


//         return _func(func, arr, initialValue, newIndex, length)
//     })
// }
// let _execute = (initialValue, tasks, arr) => {
//     return tasks.reduce(
//         (previousPromise, currentPromise, i) => previousPromise.then((initialValue) => {
//             // return new Promise(resolve => {
//             //     return currentPromise(initialValue, arr[i], i)
//             //     // .then(result => {
//             //     //     resolve(resultList.concat(result))
//             //     // }).catch(() => {
//             //     //     resolve(resultList.concat(null))
//             //     // })
//             // })
//             return currentPromise(initialValue, arr[i], i)
//         }),
//         Promise.resolve(initialValue)
//     )
// }

// let _execute = async (accumulator, func, arr) => {
//     // let len = arr.length

//     // for (let i = 0, length = len; i < length; i++) {
//     //     initialValue = await func(initialValue, arr[i], i)
//     // }

//     // return initialValue
//     if (!arr?.length) return accumulator; // 提前处理空数组

//     for (const [index, element] of arr.entries()) {
//         accumulator = await func(accumulator, element, index);
//     }

//     return accumulator;
// }
// const _execute = async <T, U>(
//     accumulator: T,
//     func: (acc: T, element: U, index: number) => Promise<T>,
//     arr: U[]
// ): Promise<T> => {
//     let len = arr.length

//     // if (!arr?.length) return accumulator;
//     if (len == 0) return accumulator;

//     let acc = accumulator;
//     for (let i = 0; i < len; i++) {
//         acc = await func(acc, arr[i], i);
//     }
//     return acc;
// };

export let range = (a, b) => {
    let result = []

    for (let i = a; i <= b; i++) {
        result.push(i)
    }

    return result
}

export let reducePromise = async <initialValue, value>(arr: Array<value>, func: (initialValue: initialValue, value: value, index: number) => Promise<initialValue>, initialValue: initialValue): Promise<initialValue> => {
    // let length = arr.length
    // if (length == 0) {
    //     return Promise.resolve(initialValue)
    // }

    // return _func(func, arr, initialValue, 0, length)


    // let promise
    // for (let i = 0; i < arr.length; i++) {
    //     promise = func(initialValue, arr[i], i).then(initialValue => {
    //         return func(initialValue, arr[i + 1], i + 1)
    //     })
    //     // arr[i].then((num) => {
    //     //     console.log(num)
    //     //     return arr[i + 1]
    //     // })
    // }

    // return _execute(
    //     initialValue,
    //     range(0, arr.length - 1).map(_ => func),
    //     arr,
    // )

    // return arr.reduce((pre, value, i) => {
    //     return pre.then(initialValue => {
    //         return func(initialValue, value, i)
    //     })
    // }, Promise.resolve(initialValue))


    // return _execute(initialValue, func, arr)
    const len = arr.length

    let acc = initialValue;

    // if (!arr?.length) return accumulator;
    if (len == 0) return initialValue;
    // if (len == 1) {
    //     return await func(acc, arr[0], 0)
    // }

    for (let i = 0; i < len; i++) {
        acc = await func(acc, arr[i], i);
    }
    return acc;
}

// let _ = reducePromise([1, 2, 3], (sum, value) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(sum + value)
//         }, 100)
//     })
// }, 0).then(v => {
//     console.log(v)
// })


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

export let getWithDefault = <T>(arr: Array<T>, index: number, default_): T => {
    let value = arr[index]

    if (isNullable(value)) {
        return default_
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

export let reduce = <initialValue, value>(arr, func, initialValue: initialValue): initialValue => {
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

// export let randomShuffle = (arr) => {
//     let originLength = arr.length
//     let result = []

//     if (originLength == 0) {
//         return []
//     }

//     arr = clone(arr)

//     let index
//     let length = originLength
//     do {
//         index = NumberUtils.getRandomInteger(0, length - 1)

//         result.push(arr[index])

//         arr.splice(index, 1)

//         length = arr.length
//     } while (result.length < originLength)

//     return result
// }
export let randomShuffle = (arr) => {
    if (arr.length === 0) {
        return []
    }

    // 创建数组的浅拷贝
    const result = arr.slice()

    // Fisher-Yates 洗牌算法
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[result[i], result[j]] = [result[j], result[i]]
    }

    return result
}

// export let group = (arr: Array<any>, getIdFunc) => {
//     let groupObj = arr.reduce((group, value) => {
//         let id = getIdFunc(value)

//         if (group[id] == undefined) {
//             group[id] = [value]
//         }
//         else {
//             group[id].push(value)
//         }

//         return group
//     }, {})


//     return MutableRecordUtils.entries(groupObj)
// }

export let groupByStep = <T>(arr: Array<T>, size: number): Array<Array<T>> => {
    let result = []

    // for (let i = 0, len = arr.length; i < len; i += size) {
    //     let r1 = []
    //     let j = 0
    //     while (j < size) {
    //         r1.push(arr[i + j])

    //         j += 1
    //     }

    //     result.push(r1)
    // }

    let i = 0, len = arr.length
    while (i < len) {
        let r1 = []
        let j = 0

        while (j < size) {
            if (i + j >= len) {
                break
            }
            r1.push(arr[i + j])

            j += 1
        }

        result.push(r1)

        i += size
    }

    return result
}
