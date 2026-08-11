import { createConfigState } from "../script/scene/Scene"
import { createState as createCitySceneState } from "../script/scene/scene_city/CityScene"
// import { createState as createWarehouseSceneState } from "../script/scene/scene_warehouse/WarehouseScene"
import { config, state } from "../type/StateType"
import { cityScene } from "../script/scene/scene_city/type/StateType"
// import { warehouseScene } from "../script/scene/scene_warehouse/type/StateType"
import { State } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
// import { createState as createAbstractState } from "meta3d-jiehuo-abstract"
import { state as abstractState } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state as blockState } from "block/src/BlockManagerType"
import { createState as createBlockState } from "block/src/BlockManager"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { View } from "meta3d-jiehuo-abstract"
// import {NullableUtils} from "meta3d-jiehuo-abstract"


export let createState = (): state => {
    return {
        block: createBlockState(),
        abstract: State.createState(),
        config: createConfigState(),
        camera: NewThreeInstance.createPerspectiveCamera(60, View.getWidth() / View.getHeight(), 1, 1000),
        cityScene: createCitySceneState(),
        // warehouseScene: createWarehouseSceneState()
    }
}

export let readState = () => {
    return NullableUtils.getExn(globalThis["meta3d_state"]) as state
}

export let writeState = (state: state) => {
    globalThis["meta3d_state"] = state

    return state
}

export let getBlockState = (state: state) => {
    return state.block
}

export let setBlockState = (state: state, blockState: blockState) => {
    return {
        ...state,
        block: blockState
    }
}


export let getAbstractState = (state: state) => {
    return state.abstract
}

export let setAbstractState = (state: state, abstractState: abstractState) => {
    return {
        ...state,
        abstract: abstractState
    }
}

export let getConfigState = (state: state) => {
    return state.config
}

export let setConfigState = (state: state, configState: config) => {
    return {
        ...state,
        config: configState
    }
}

export let getCitySceneState = (state: state) => {
    return state.cityScene
}

export let setCitySceneState = (state: state, citySceneState: cityScene) => {
    return {
        ...state,
        cityScene: citySceneState
    }
}

export let mutableSetCitySceneState = (state: state, citySceneState: cityScene) => {
    state.cityScene = citySceneState

    return state
}


// export let getWarehouseSceneState = (state: state) => {
//     return state.warehouseScene
// }

// export let setWarehouseSceneState = (state: state, warehouseSceneState: warehouseScene) => {
//     return {
//         ...state,
//         warehouseScene: warehouseSceneState
//     }
// }

// export let cloneBlockState = (blockState: blockState, hash = new WeakMap()) => {
//     if (typeof blockState !== "object" || blockState == null) {
//         return blockState;
//     }

//     if (hash.has(blockState)) {
//         return hash.get(blockState);
//     }

//     let clone = Array.isArray(blockState) ? [] : {};
//     hash.set(blockState, clone);

//     for (const key in blockState) {
//         if (Object.prototype.hasOwnProperty.call(blockState, key)) {
//             clone[key] = cloneBlockState(blockState[key], hash);
//         }
//     }

//     return clone;
// }

// export let copyBlockState = (blockState1: blockState, blockState2: blockState) => {
//     if (typeof blockState1 !== "object" || blockState1 == null) {
//         return blockState1
//     }

//     for (const key in blockState1) {
//         if (Object.prototype.hasOwnProperty.call(blockState1, key)) {
//             blockState2[key] = copyBlockState(blockState1[key], blockState2[key])
//         }
//     }

//     return blockState2
// }