// export type t<value> = Array<value>

export let create = () => []

export let pop = <T>(arr: Array<T>) => {
    return arr.pop()
}

export let push = <T>(arr: Array<T>, value) => {
    arr.unshift(value)

    return arr
}

export let getCount = (arr) => {
    return arr.length
}