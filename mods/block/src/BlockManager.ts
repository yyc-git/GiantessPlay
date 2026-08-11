import { state as blockManagerState, blockProtocolName, getBlockService, api, blockName, state, blockService } from "./BlockManagerType"
import { List, Map } from "immutable"
import { flatten, getEmpty, getExn, getExnFromStrictNullable, getExnFromStrictUndefined, getWithDefault, isNullable, map, return_ } from "./Utils"
import { api as apiType } from "type-api/src/Type"
import { MutableMapUtils } from "meta3d-jiehuo-abstract"

export let createState = (): blockManagerState => {
    return {
        // blockServiceMap: Map(),
        // blockStateMap: Map()

        blockServiceMap: MutableMapUtils.create(),
        blockStateMap: MutableMapUtils.create(),
    }
}

export let getBlockServiceExn = <blockService>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName, blockName): blockService => {
    return MutableMapUtils.getExn(
        MutableMapUtils.getExn(
            blockManagerState.blockServiceMap, blockProtocolName
        ),
        blockName
    )
}

// export let getBlockServiceByBlockNameExn = <blockService>(blockManagerState: blockManagerState, blockName): blockService => {
//     return getExn(MutableMapUtils.reduce(blockManagerState.blockServiceMap, (result, blockMap, _,) => {
//         if (!isNullable(result)) {
//             return result
//         }

//         return MutableMapUtils.get(blockMap, blockName)
//     }, getEmpty()))
// }


export let getBlockProtocolName = (blockManagerState: blockManagerState, blockName): blockProtocolName => {
    return getExn(MutableMapUtils.reduce(blockManagerState.blockServiceMap, (result, blockMap, blockProtocolName,) => {
        if (!isNullable(result)) {
            return result
        }

        if (MutableMapUtils.has(blockMap, blockName)) {
            return return_(blockProtocolName)
        }
    }, getEmpty()))
}

export let getAllBlockServicesOfBlockProtocolName = (blockManagerState: blockManagerState, blockProtocolName: blockProtocolName): Array<[blockName, blockService]> => {
    return getWithDefault(
        map(map => {
            return MutableMapUtils.entries(map)
        }, MutableMapUtils.get(blockManagerState.blockServiceMap, blockProtocolName)),
        []
    )
}

export let getAllBlockServices = (blockManagerState: blockManagerState) => {
    return MutableMapUtils.reduce(blockManagerState.blockServiceMap, ((result, map) => {
        return MutableMapUtils.reduce(map, ((result, value) => {
            result.push(value)

            return result
        }), result)
    }), [])
}

export let getAllBlockServiceAndNames = (blockManagerState: blockManagerState): Array<[any, blockName]> => {
    return MutableMapUtils.reduce(blockManagerState.blockServiceMap, ((result, map) => {
        return MutableMapUtils.reduce(map, ((result, value, name) => {
            result.push([value, name])

            return result
        }), result)
    }), [])
}

export let getBlockState = <blockState>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName, blockName): blockState => {
    return map(
        m => {
            return MutableMapUtils.get(m, blockName)
        },
        MutableMapUtils.get(
            blockManagerState.blockStateMap,
            blockProtocolName
        )
    )
}


export let getBlockStateExn = <blockState>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName, blockName): blockState => {
    return getExnFromStrictUndefined(getBlockState(blockManagerState, blockProtocolName, blockName))
}

// export let hasBlockState = <blockState>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName, blockName): boolean => {
//     return isNullable(getBlockState(blockManagerState, blockProtocolName, blockName))
// }

export let setBlockState = <blockState>(blockManagerState: blockManagerState, blockProtocolName: blockProtocolName, blockName, blockState: blockState): blockManagerState => {
    let map = getWithDefault(
        MutableMapUtils.get(
            blockManagerState.blockStateMap,
            blockProtocolName
        ),
        MutableMapUtils.create()
    )

    return {
        ...blockManagerState,
        blockStateMap: MutableMapUtils.set(blockManagerState.blockStateMap,
            blockProtocolName,
            MutableMapUtils.set(
                map,
                blockName,
                blockState
            )
        )
    }
}

export let buildAPI = (): api => {
    return {
        getBlockService: getBlockServiceExn,
        getAllBlockServicesOfBlockProtocolName: getAllBlockServicesOfBlockProtocolName,
        getBlockState: getBlockStateExn,
        setBlockState: setBlockState,
    }
}

export let registerBlock = <blockService, blockState>(
    api: apiType,
    blockManagerState: blockManagerState, blockProtocolName: blockProtocolName,
    blockName: blockName,
    getBlockService: getBlockService<blockService>,
    blockState: blockState
): blockManagerState => {
    let map = getWithDefault(
        MutableMapUtils.get(
            blockManagerState.blockServiceMap,
            blockProtocolName
        ),
        MutableMapUtils.create()
    )

    blockManagerState = {
        ...blockManagerState,
        blockServiceMap:
            MutableMapUtils.set(
                blockManagerState.blockServiceMap,
                blockProtocolName,
                MutableMapUtils.set(
                    map,
                    blockName,
                    getBlockService(
                        api
                    )
                )
            )
    }

    blockManagerState = setBlockState(blockManagerState, blockProtocolName, blockName, blockState)

    return blockManagerState
}

// export let dispose = () => {
//     return createState()
// }
export let dispose = (blockManagerState: blockManagerState) => {
    return {
        ...createState(),
        blockStateMap: blockManagerState.blockStateMap
    }
}