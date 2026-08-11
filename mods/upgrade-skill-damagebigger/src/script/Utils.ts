import { nullable } from "block/src/Type"
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-skill-damagebigger"

// export let getParticleShareProtocolName = () => "particle-share-protocol"

// export let getParticleProtocolName = () => "particle-protocol"

// export let getParticleShareBlockName = () => "particle-share-default"

// export let getParticleBillboardIceOverwriteBlockName = () => "particle-billboard-ice-single"


export let getBuffProtocolName = () => "buff-protocol"

export let getBuffPlayerStatusBlockName = () => "buff-playerstatus-damagebigger"

export let getBuffBossStatusBlockName = () => "buff-bossstatus-damagebigger"


export type data = {
    maxScale: number,
    // originPlayerGirlScale: nullable<number>,
    // originPlayerGirlScale: number,
    // sumExcitement: number,
    // sumIncreaseScale: number,
    // lastDecreaseScaleTime: nullable<secondUnit>,
}

export let createState = (api: api): blockState => {
    return {
        dataMap: api.MutableRecordUtils.create(),

        // originPlayerGirlScale: api.NullableUtils.getEmpty(),
        lastDecreaseScaleTime: api.NullableUtils.getEmpty(),
    }
}

export let createData = (api: api) => {
    return {
        // maxScale: -1,
        maxSumIncreaseScale: Infinity,
        // originPlayerGirlScale: api.NullableUtils.getEmpty(),
        sumIncreaseScale: 0,
        // lastDecreaseScaleTime: api.NullableUtils.getEmpty(),
    }
}

export let getState = (api: api, state) => {
    return api.blockAPI.getBlockState<blockState>(state,
        getProtocolName(),
        getBlockName()
    )
}

export let setState = (api: api, state, s) => {
    return api.blockAPI.setBlockState(state,
        getProtocolName(),
        getBlockName(),
        s
    )
}

let _getData = (api: api, state, usedGirl) => {
    return api.MutableRecordUtils.get(
        getState(api, state).dataMap,
        usedGirl
    )
}


export let hasData = (api: api, state, usedGirl) => {
    return !api.NullableUtils.isNullable(_getData(api, state, usedGirl))
}

export let getData = (api: api, state, usedGirl) => {
    return api.NullableUtils.getExn(_getData(api, state, usedGirl))
}

export let setData = (api: api, state, usedGirl, value) => {
    return setState(api, state,
        {
            ...getState(api, state),
            dataMap: api.MutableRecordUtils.set(getState(api, state).dataMap, usedGirl, value)
        }
    )
}

export let removeData = (api: api, state, usedGirl) => {
    return setState(api, state,
        {
            ...getState(api, state),
            dataMap: api.MutableRecordUtils.remove(getState(api, state).dataMap, usedGirl)
        }
    )
}

// let _getDataWithDefault = (api: api, state, func, value) => {
//     return api.NullableUtils.getWithDefault(
//         api.NullableUtils.map(data => func(data), getData(api, state, usedGirl)),
//         value
//     )
// }

// export let getMaxScale = (api: api, state) => {
//     return _getDataWithDefault(api, state, data => data.maxScale, -1)
// }

export let getMaxSumIncreaseScale = (api: api, state, usedGirl) => {
    // return _getDataWithDefault(api, state, data => data.maxSumIncreaseScale, -1)
    if (!api.isGiantessCharacterTypeByUsedGirl(state, usedGirl)) {
        return +Infinity
    }

    return getData(api, state, usedGirl).maxSumIncreaseScale
}

// export let getSumIncreaseScale = (api: api, state) => {
//     return _getDataWithDefault(api, state, data => data.sumIncreaseScale, 0)
// }
// export let getMaxScale = (api: api, state) => {
//     if (!api.isGiantessCharacterType(state)) {
//         return +Infinity
//     }

//     return getData(api, state, usedGirl).maxScale
// }

export let getSumIncreaseScale = (api: api, state, usedGirl) => {
    return getData(api, state, usedGirl).sumIncreaseScale
}

// export let isExceedMaxScale = (api: api, state) => {
//     return api.getGirlScale(state, usedGirl) >= getMaxScale(api, state)
// }
export let isExceedMaxSumIncreaseScale = (api: api, state, usedGirl) => {
    return getSumIncreaseScale(api, state, usedGirl) >= getMaxSumIncreaseScale(api, state, usedGirl)
}


export let updateGirlScale = (api: api, state: state, usedGirl, increasedScale: number, isCheckExceed) => {
    if (isCheckExceed && isExceedMaxSumIncreaseScale(api, state, usedGirl)) {
        return state
    }

    // return api.setGirlScaleAndKeepCamera(state,usedGirl, api.NumberUtils.lessThan(api.getGirlValue(state, usedGirl).initialScale + getSumIncreaseScale(api, state), getMaxScale(api, state)))
    // return api.setGirlScaleAndKeepCamera(state,usedGirl, api.NumberUtils.lessThan(api.getGirlScale(state, usedGirl) + increasedScale, getMaxScale(api, state)))

    return api.setGirlScaleAndKeepCamera(state, usedGirl, api.getGirlScale(state, usedGirl) + increasedScale)

    // return api.girl.computeGirlBoxAndNotChangeCenterXY(state)
}
