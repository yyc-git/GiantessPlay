import { nullable } from "./nullable"

export let getExn = <T>(nullableValue: nullable<T>): T => {
    // if (nullableValue === null || nullableValue === undefined) {
    if (isNullable(nullableValue)) {
        throw new Error("nullableValue should exist")
        // throw new Error(`nullableValue should exist. isMustStopLoop:${globalThis["meta3d_state"].cityScene.isMustStopLoop}, isDisposed: ${globalThis["meta3d_state"].cityScene.isDisposed}`)
    }

    return nullableValue as T
}
// export const getExn = <T>(nullableValue: T | null | undefined): T => {
//     if (nullableValue == null) { // 使用 nullish 检查
//         throw new TypeError(
//             `Expected non-nullish value but received ${String(nullableValue)}. ` +
//             `This error usually indicates missing data or unhandled edge case.`
//         );
//     }

//     return nullableValue; // 无需类型断言，TS 自动推断
// };

export let getExnWithMessage = <T>(nullableValue: nullable<T>, errorMessage): T => {
    // if (nullableValue === null || nullableValue === undefined) {
    if (isNullable(nullableValue)) {
        throw new Error(errorMessage)
    }

    return nullableValue as T
}

export let getExnFromStrictNullable = <T>(nullableValue: T | null): T => {
    // if (nullableValue === null) {
    if (isStrictNullable(nullableValue)) {
        throw new Error("nullableValue should exist")
    }

    return nullableValue as T
}

export let return_ = <T>(value: T): nullable<T> => {
    return value as nullable<T>
}

// export let isNullable = <T>(nullableValue: nullable<T>): boolean => {
//     return nullableValue === null || nullableValue === undefined
// }
// export let isNullable = <T>(nullableValue: T | null | undefined): boolean => {
//     return nullableValue === null || nullableValue === undefined
//     // return nullableValue == null
// }
// 优化版本
export const isNullable = <T>(value: T | null | undefined) => value == null;

export let isStrictNullable = <T>(nullableValue: T | null): boolean => {
    return nullableValue === null
}


export let map = <T, Y>(func: (nullableValue: T) => Y, nullableValue: nullable<T>): Y | null | undefined => {
    if (isNullable(nullableValue)) {
        return nullableValue as null | undefined
    }

    return func(nullableValue as T)
}

export let bind = <T, Y>(func: (nullableValue: T) => Y | null | undefined, nullableValue: nullable<T>): Y | null | undefined => {
    if (isNullable(nullableValue)) {
        return nullableValue as null | undefined
    }

    return func(nullableValue as T)
}

export let getWithDefault = <T>(nullableValue: nullable<T>, default_: T): T => {
    if (isNullable(nullableValue)) {
        return default_
    }

    return nullableValue as T
}

export let getWithDefaultFunc = <T>(nullableValue: nullable<T>, getDefaultFunc: () => T): T => {
    if (isNullable(nullableValue)) {
        return getDefaultFunc()
    }

    return nullableValue as T
}

export let getWithNullableDefaultFunc = <T>(nullableValue: nullable<T>, getDefaultFunc: () => nullable<T>): nullable<T> => {
    if (isNullable(nullableValue)) {
        return getDefaultFunc()
    }

    return nullableValue as nullable<T>
}

export let getEmpty = <T>(): nullable<T> => {
    return undefined
}

export let forEach = <T>(func: (nullableValue: T) => void, nullableValue: nullable<T>): void => {
    if (isNullable(nullableValue)) {
        return
    }

    func(nullableValue as T)

    return
}