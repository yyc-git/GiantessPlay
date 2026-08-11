import { TupleUtils } from "meta3d-jiehuo-abstract"

export let group = (arr, pageCount) => {
    return TupleUtils.getTuple3First(arr.reduce(([result, pageResult, index], value, i) => {
        index += 1
        pageResult.push(value)

        if (index >= pageCount || i == arr.length - 1) {
            result.push(pageResult)
            pageResult = []
            index = 0
        }

        return [result, pageResult, index]
    }, [[], [], 0]))
}