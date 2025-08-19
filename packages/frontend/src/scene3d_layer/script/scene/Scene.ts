import { config, state } from "../../type/StateType"
import * as CityScene from "./scene_city/CityScene"
// import * as WarehouseScene from "./scene_warehouse/WarehouseScene"
import { scene } from "../../../ui_layer/global/store/GlobalStoreType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getAbstractState, getConfigState, readState, setAbstractState, setConfigState, writeState } from "../../state/State"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { Render } from "meta3d-jiehuo-abstract"
import { State } from "meta3d-jiehuo-abstract"
import { Scene } from "meta3d-jiehuo-abstract"
import { getCurrentScene } from "meta3d-jiehuo-abstract/src/scene/Scene"
import { Camera } from "meta3d-jiehuo-abstract"

// export let initAllScenes = (state: state) => {
//     return CityScene.init(state).then(state => {
//         return WarehouseScene.init(state)
//     })
// }

export let getAllScenes = (state: state) => {
    return [
        CityScene.getNullableScene(state),
        // WarehouseScene.getNullableScene(state),
    ].reduce((result, nullableScene) => {
        return NullableUtils.getWithDefault(NullableUtils.map(nullableScene => {
            return result.concat([nullableScene])
        }, nullableScene), result)
    }, [])
}

export let createConfigState = (): config => {
    return {
        isStaticCastShadow: true,
        isGirlRestoreHp: true,

        isFastMove: false,
        isNotMoveCollision: false,
        isNotDamage: false,
        isKeepBig: false,
        isShowBox: false,
        isPickRangeMax: false,
        isOpenSound: false,
        isTriggerSpecificGameEvent: false,

        littleManConfig: {
            // isSelectLittleMan: false,
            isOnlyStomp: false,
            isNotExecuteGiantessAI: false,
        }
    }
}

let _disposeConfig = (state: state) => {
    return {
        ...state,
        config: createConfigState()
    }
}

export let disposeCurrentScene = (state: state) => {
    // if (NullableUtils.isNullable(currentSceneData)) {
    //     return Promise.resolve(state)
    // }

    // currentSceneData = NullableUtils.getExn(currentSceneData)

    state = setAbstractState(state, ArticluatedAnimation.removeAllArticluatedAnimations(getAbstractState(state)))

    state = _disposeConfig(state)

    let promise
    // switch (currentSceneData.scene) {
    //     case scene.Play:
    //         promise = CityScene.dispose(state)
    //         break
    //     case scene.Biwu:
    //         promise = CityScene.dispose(state)
    //         break
    //     // case scene.Warehouse:
    //     //     promise = WarehouseScene.dispose(state)
    //     //     break
    //     default:
    //         // throw new Error("error")
    //         break
    // }
    promise = CityScene.dispose(state)

    return promise.then(state => {
        return setAbstractState(state, Scene.dispose(getAbstractState(state)))
    })
}

export let updateCurrentScene = (state: state, name) => {
    // Scene.updateMatrixWorld(getCurrentScene(getAbstractState(state)))

    return ArticluatedAnimation.updateAllArticluatedAnimations(state, [readState, writeState, getAbstractState]).then(state => {
        switch (name) {
            case CityScene.getName():
                return CityScene.update(state)
            // case WarehouseScene.getName():
            //     return WarehouseScene.update(state)
            default:
                throw new Error("error")
        }
    }).then(state => {
        Scene.updateMatrixWorld(getCurrentScene(getAbstractState(state)))
        // Scene.markNotNeedsUpdate(getCurrentScene(getAbstractState(state)))

        return state
    })
}

let _getCamera = (state: state) => {
    return state.camera
}

export let enterScene = (state: state, targetScene: scene, levelNumber: number) => {
    state = setAbstractState(state, Camera.setCurrentCamera(getAbstractState(state), _getCamera(state)))

    // switch (targetScene) {
    //     case scene.Play:
    //         return CityScene.enterScene(state, levelNumber)
    //     // case scene.Warehouse:
    //     //     return WarehouseScene.enterScene(state, levelNumber)
    //     default:
    //         throw new Error("error")
    // }

    return CityScene.enterScene(state, targetScene, levelNumber)
}

export let switchScene = (state: state, currentSceneData, targetSceneData) => {
    // return disposeCurrentScene(state, currentSceneData).then(state => {
    //     return enterScene(state, targetSceneData.scene, targetSceneData.levelNumber)
    // })

    if (getIsDebug(state)) {
        state = {
            ...state,
            config: {
                ...state.config,
                isNotDamage: false,
                isNotMoveCollision: true
            }
        }
    }


    return enterScene(state, targetSceneData.scene, targetSceneData.levelNumber).then(state => {
        return setAbstractState(state, Render.markIsNeedSetSize(getAbstractState(state), true))
    })
}

export let getIsDebug = (state: state) => {
    return State.getConfigState(getAbstractState(state)).isDebug
}

export let setIsDebug = (state: state, isDebug) => {
    return setAbstractState(state, State.setConfigState(getAbstractState(state), {
        ...State.getConfigState(getAbstractState(state)),
        isDebug
    }))
}

export let getIsProduction = (state: state) => {
    // return getConfigState(state).isProduction
    return State.getConfigState(getAbstractState(state)).isProduction
}

export let setIsProduction = (state: state, isProduction) => {
    // return setConfigState(state, {
    //     ...getConfigState(state),
    //     isProduction: isProduction
    // })

    state = setAbstractState(state, State.setConfigState(getAbstractState(state), {
        ...State.getConfigState(getAbstractState(state)),
        isProduction,
    }))


    if (isProduction) {
        return setAbstractState(state, State.setConfigState(getAbstractState(state), {
            ...State.getConfigState(getAbstractState(state)),
            isNotTestPerf: true,
            isSkipScenario: false,
            isSkipGameEvent: false,
        }))
    }


    return state
}

export let getIsNotTestPerf = (state: state) => {
    return State.getConfigState(getAbstractState(state)).isNotTestPerf

}

export let setIsNotTestPerf = (state: state, value) => {
    return setAbstractState(state, State.setConfigState(getAbstractState(state), {
        ...State.getConfigState(getAbstractState(state)),
        isNotTestPerf: value
    }))
}

export let getIsSkipScenario = (state: state) => {
    return State.getConfigState(getAbstractState(state)).isSkipScenario
}


export let setIsSkipScenario = (state: state, value) => {
    return setAbstractState(state, State.setConfigState(getAbstractState(state), {
        ...State.getConfigState(getAbstractState(state)),
        isSkipScenario: value
    }))
}

export let getIsSkipGameEvent = (state: state) => {
    return State.getConfigState(getAbstractState(state)).isSkipGameEvent
}

export let setIsSkipGameEvent = (state: state, value) => {
    return setAbstractState(state, State.setConfigState(getAbstractState(state), {
        ...State.getConfigState(getAbstractState(state)),
        isSkipGameEvent: value
    }))
}


export let getCurrentCameraType = (state: state, currentScene: scene) => {
    switch (currentScene) {
        case scene.Play:
            return CityScene.getCameraType(state)
        // case scene.Warehouse:
        //     return WarehouseScene.getCameraType(state)
        default:
            throw new Error("error")
    }
}