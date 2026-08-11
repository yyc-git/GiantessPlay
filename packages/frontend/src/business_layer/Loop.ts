import { state } from "../scene3d_layer/type/StateType"
import { Event, Render, Outline, Stats, Pick, Camera, Scene, Device, InstancedSkinLOD2, LOD, } from "meta3d-jiehuo-abstract"
// import { init as initEvent, update as updateEvent } from "meta3d-jiehuo-abstract"
// import { createRenderer, init as initRender, render, update as updateRender } from "meta3d-jiehuo-abstract"
// import { importScene as importWarehouse1Scene, init as initWarehouse1Scene } from "./script/scene/scene_warehouse/WarehouseScene"
// import { init as initArticluatedAnimation } from "meta3d-jiehuo-abstract"
// import { init as initOutline } from "meta3d-jiehuo-abstract"
// import { addStats, update as updateStats } from "meta3d-jiehuo-abstract"
import { getDynamicGroup, isEnterScene, isMustStopLoop, isResetKeyState, useCamera, init as initCityScene, isDisposed } from "../scene3d_layer/script/scene/scene_city/CityScene"
// import { getCurrentScene, setCurrentScene, update as updateScene } from "meta3d-jiehuo-abstract"
// import { init as initCamera, update as updateCamera } from "meta3d-jiehuo-abstract"
import { scene } from "../ui_layer/global/store/GlobalStoreType"
// import { enterScene as enterWarehouseScene } from "../scene3d_layer/script/scene/scene_warehouse/WarehouseScene"
import { getAbstractState, readState, setAbstractState, writeState } from "./State"
import { enterScene, getCamera, getIsDebug, getIsNotTestPerf, getIsProduction, updateCurrentScene } from "../scene3d_layer/script/scene/Scene"
import { Flow } from "meta3d-jiehuo-abstract"
import { CSM } from "meta3d-jiehuo-abstract"
import { InstancedLOD2, GrassInstance } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Physics } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { SoundManager, LabelManager } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import { buildErrorEventData, getCanvasNoneEventName, getErrorEventName, getRequestFullScreenEventName } from "../scene3d_layer/utils/EventUtils"
import { GPUSkin } from "meta3d-jiehuo-abstract"
// import { execute } from "../scene3d_layer/script/scene/scene_city/scenario/CommandManager"
import * as ScenarioManager from "../scene3d_layer/script/scene/scene_city/scenario/ScenarioManager"
import * as GameEvent from "../scene3d_layer/script/scene/scene_city/game_event/GameEvent"
import * as UI from "../scene3d_layer/script/scene/scene_city/UI"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { ModelLoader } from "meta3d-jiehuo-abstract"
import { buildNameByUsedGirl, createUsedGirlData, getCurrentUsedGirls, getGirlMesh, hasCurrentUsedGirl, hasUsedGirl, isPlayerGoddess, isUseGirl, isUsePlayerGoddess, setUsedGirlData } from "../scene3d_layer/script/scene/scene_city/girl/Girl"
import { start, stop } from "../scene3d_layer/script/scene/scene_city/Time"
import { pauseAllTweens, resumeAllTweens } from "meta3d-jiehuo-abstract/src/animation/ArticluatedAnimation"
import { getRenderSetting, setRenderSetting } from "../scene3d_layer/mod/SettingMod"
import * as Loop from "../scene3d_layer/script/scene/scene_city/Loop"
// import { hasOpenedModal } from "../ui_layer/utils/ModalUtils"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { CameraControls } from "meta3d-jiehuo-abstract"
import { updateParticle } from "../scene3d_layer/mod/ParticleMod"
import { getCanvas, isCanvasShow } from "../ui_layer/utils/CanvasUtils"
import { hasOpenedModalDom } from "../ui_layer/utils/ModalUtils"
import { addStoppedLoopCount, getStoppedLoopCount, setStoppedLoopCount } from "meta3d-jiehuo-abstract/src/Flow"
import { usedGirlEnum } from "../scene3d_layer/script/scene/scene_city/type/StateType"
import { getUsedGirl } from "../scene3d_layer/mod/LevelGiantessMod"
import { getCameraPosition, getCameraType } from "../scene3d_layer/script/scene/scene_city/Camera"
import { Console } from "meta3d-jiehuo-abstract"
import { isCanFullScreenForMobile, isFullScreen } from "../ui_layer/utils/ScreenUtils"
import { isUseCareer, setIsControlledUnitCanAttack } from "../scene3d_layer/script/scene/scene_city/build/Career"
import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { careerFeatureName } from "../scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData"
import { hasBuff } from "../scene3d_layer/script/scene/scene_city/buff/Buff"
import { getCallGoddessBlockService } from "../scene3d_layer/mod/BuffMod"
import { destroyGiantess } from "../scene3d_layer/script/scene/scene_city/utils/DamageUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { isUseCareerFeature, isUseCareerFeatureByCharacterType } from "../scene3d_layer/mod/CareerMod"
import { Shadow } from "meta3d-jiehuo-abstract"
import { hdLevel, renderAccuracyLevel, shadowLevel } from "setting-default/src/Type"
// import { init as initCamera} from "./script/scene/Camera"
// import * as Mod from "../../../../../../mod/Mod"

// export let init = (state: state, currentScene: scene, levelNumber: number) => {
export let init = (state: state) => {
    let renderer = Render.createRenderer(getCanvas())

    // state = initAtVeryBegin(state)

    return Device.init(getAbstractState(state))
        // .then(abstractState => {
        //     return Render.init(abstractState)
        // })
        .then(abstractState => ModelLoader.init(abstractState, renderer))
        .then(abstractState => {
            // if (!getIsProduction(state)) {
            //     abstractState = Stats.addStats(abstractState, renderer)

            //     Stats.init()
            // }

            return Event.init(abstractState)
        })
        .then(abstractState => {
            return Physics.init(abstractState)
        })
        .then(abstractState => {
            return Pick.init(abstractState, [getAbstractState, setAbstractState, getDynamicGroup])
        })
        // .then(abstractState => {
        //     return Outline.init(abstractState)
        // })
        .then(abstractState => {
            return Scene.init(abstractState, [getAbstractState, setAbstractState, readState, writeState,
                isResetKeyState
            ], getCanvas())
            // }).then(abstractState => {
            //     state = setAbstractState(state, abstractState)

            //     return enterScene(state, currentScene, levelNumber)
            // })
        }).then(abstractState => {
            state = setAbstractState(state, abstractState)

            return state
        }).then(state => {
            Render.disposeRenderer(renderer)

            return state
        })
        .then(initCityScene)
}


let _update = (state: state) => {
    return Device.update(getAbstractState(state)).then(abstractState => {
        return Event.update(setAbstractState(state, abstractState), getAbstractState)
    }).then(state => {
        return Scene.update(state, [updateCurrentScene, getAbstractState, setAbstractState])

        // return Camera.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
    })
        // .then(state => {
        //     return updateCurrentScene(state, Scene.getCurrentScene(getAbstractState(state)).name)
        // })
        .then(state => {
            return Render.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
        })
        .then(state => {
            // return Flow.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
            return Flow.update(state, [getAbstractState, setAbstractState])
        })
        .then(state => {
            if (isMustStopLoop(state)) {
                return state
            }

            return GPUSkin.update(state, [getAbstractState, setAbstractState])
                .then(state => {
                    return InstancedLOD2.update(state, [getAbstractState, setAbstractState])
                }).then(state => {
                    return InstancedSkinLOD2.update(state, [getAbstractState, setAbstractState])
                })
                .then(state => {
                    return setAbstractState(state, Instance.updateAllInstances(getAbstractState(state)))
                })
                .then(state => {
                    return ArrayUtils.reducePromise(getCurrentUsedGirls(state), (state, usedGirl) => {
                        if (isUseGirl(state, usedGirl)) {
                            return MMD.update(getAbstractState(state), usedGirl).then(abstractState => setAbstractState(state, abstractState))
                        }

                        return Promise.resolve(state)
                    }, state)
                }).then(state => {
                    state = updateParticle(state)

                    return ParticleManager.update(state, [getAbstractState, setAbstractState])
                }).then(state => {
                    return SoundManager.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
                }).then(state => {
                    return LabelManager.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
                }).then(state => {
                    return LOD.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
                })
                // .then(GameEvent.update)
                // .then(ScenarioManager.update)
                .then(UI.update)
        })

    // .then(state => {
    //     return GrassInstance.update(state, getAbstractState, NullableUtils.getExn( state.cityScene.grass.grass2).)
    // })
}

let _render = (state: state) => {
    if (isMustStopLoop(state)) {
        return Promise.resolve(state)
    }

    return CSM.update(getAbstractState(state)).then(abstractState => {
        return Render.render(abstractState, getRenderSetting(state).hd)
    }).then(abstractState => setAbstractState(state, abstractState))
}

export let update = (state) => {
    return _update(state)
}

export let execLoop = (state) => {
    return _update(state).then(state => _render(state))
}

export let updateUIAndSound = (state) => {
    state = UI.setUIUpdateLoopCount(state, 0)
    return UI.update(state).then(state => {
        return SoundManager.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
    })
}

// export let loop = (isUse30FPS) => {
//     requestAnimationFrame((time) => {
//         let state = readState()

//         if (!Flow.isLoopStart(getAbstractState(state))) {
//             writeState(state)

//             loop(isUse30FPS)
//             return
//         }

//         if (!getIsProduction(state)) {
//             Stats.begin(getAbstractState(state))
//         }

//         _update(state).then(state => _render(state)).then(state => {
//             writeState(state)

//             if (!getIsProduction(state)) {
//                 Stats.end(getAbstractState(state))
//                 Stats.nextFrame(getAbstractState(state), time)
//             }

//             loop(isUse30FPS)
//         })
//     })
// }

let _closeAllMMDShadow = (state: state) => {
    return ArrayUtils.reduce(getCurrentUsedGirls(state), (state, usedGirl) => {
        Shadow.setShadow(
            getGirlMesh(state, usedGirl),
            false,
            false
        )

        return state
    }, state)
}

let _restoreAllMMDShadow = (state: state) => {
    return ArrayUtils.reduce(getCurrentUsedGirls(state), (state, usedGirl) => {
        Shadow.setShadow(
            getGirlMesh(state, usedGirl),
            true,
            false
        )

        return state
    }, state)
}

let _autoOptimize = (state: state, time: number) => {
    let fps = Flow.getFPS(getAbstractState(state))

    if (time - Flow.getFirstUpdateTime(getAbstractState(state)) <= 5000) {
        return state
    }

    // console.log(fps);



    if (Device.isMobileByState(getAbstractState(state))) {
        if (getCurrentUsedGirls(state).length >= 2
            || fps <= 20
        ) {
            state = _closeAllMMDShadow(state)
        }
        else {
            state = _restoreAllMMDShadow(state)
        }

        // TODO need restore renderSetting when dispose
        // if (fps <= 15) {
        //     state = setRenderSetting(state, {
        //         ...getRenderSetting(state),
        //         renderAccuracy: renderAccuracyLevel.Low,
        //     })
        // }

        // if (fps <= 10) {
        //     state = setRenderSetting(state, {
        //         ...getRenderSetting(state),
        //         shadow: shadowLevel.Low
        //     })

        //     LOD.closeAllShadow(getAbstractState(state))
        // }

        // if (fps <= 5) {
        //     state = setRenderSetting(state, {
        //         ...getRenderSetting(state),
        //         hd: hdLevel.Middle,
        //     })

        //     Render.updateDevicePixelRatio(getAbstractState(state), getRenderSetting(state).hd)
        // }
    }
    else {
        if (
            fps <= 30
            // fps <= 40
        ) {
            state = _closeAllMMDShadow(state)
        }
        else {
            state = _restoreAllMMDShadow(state)
        }
    }

    return state
}


/*! fix "occasionally, will stop loop" bug
* 
*/
let _fixStopLoopWhenNoModal = (state: state) => {
    if (isMustStopLoop(state) || isDisposed(state)) {
        return state
    }

    if (hasOpenedModalDom()) {
        state = setAbstractState(state, setStoppedLoopCount(getAbstractState(state), 0))
    }
    else {
        if (
            isEnterScene(state)
            &&
            !Flow.isLoopStart(getAbstractState(state))
        ) {
            /*! because there is an interval between show modal and stop loop, so count to wait
            * 
            */
            state = setAbstractState(state, addStoppedLoopCount(getAbstractState(state)))
        }
    }

    // if (getStoppedLoopCount(getAbstractState(state)) > 100) {
    if (getStoppedLoopCount(getAbstractState(state)) > (Device.isMobileByState(getAbstractState(state)) ? 30 : 60)) {
        state = startLoop(state)
        state = UI.resetOpenedModalCount(state)

        state = setAbstractState(state, setStoppedLoopCount(getAbstractState(state), 0))
    }

    return state
}

/*! may occur on PC when start mission, cause black screen 
reason
getXxxThirdPersonControlOrbitControlsTarget ->getBoxCenter return NaN, maybe box is undefined because mesh not be loaded yet
* 
*/
let _fixCameraPositionMayNaN = (state: state) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(camera => {
            if (isNaN(camera.position.x)) {
                Console.warn("camera.position is NaN")

                camera.position.set(0, 0, 0)

                state = useCamera(state, getCameraType(state), false)
            }

            return state
        }, Camera.getCurrentCameraNullable(getAbstractState(state))),
        state
    )
}


/*! fix: 那个暂停一下游戏以后回来玩就是这样了
* 
*/
let _fixCameraMiss = (state: state) => {
    if (NullableUtils.isNullable(Camera.getCurrentCameraNullable(getAbstractState(state)))
    ) {
        let camera = getCamera(state)
        // if (NullableUtils.isNullable(camera)) {
        //     throw new Error("Scene->camera shouldn't be null")
        // }

        state = setAbstractState(state, Camera.setCurrentCamera(getAbstractState(state), camera))
    }

    return state
}

/*! fix: 攻击到的单位被控制了还在攻击是bug吗？
(why?)
* 
*/
let _fixIsControlledUnitCanAttack = (state: state) => {
    // if (!isUseCareer(state, characterType.Giantess, careerFeatureName.ControlledUnitCanAttack)) {
    if (!isUseCareerFeatureByCharacterType(state, characterType.Giantess, careerFeatureName.ControlledUnitCanAttack)) {
        return setIsControlledUnitCanAttack(state, false)
    }

    return state
}

/*! fix: 玩家女神不是只有四分钟吗 这都十七分钟了他还在那站着
* 
*/
let _fixPlayerGoddesNotDisappear = (state: state) => {
    // if (isPlayerGoddess(state, usedGirl) && !hasBuff(state, getCallGoddessBlockService(state).getName(), getName(), usedGirlEnum.PlayerGoddess)) {
    if (hasCurrentUsedGirl(state, usedGirlEnum.PlayerGoddess) && !hasBuff(state, getCallGoddessBlockService(state).getName(), buildNameByUsedGirl(usedGirlEnum.PlayerGoddess), usedGirlEnum.PlayerGoddess)) {
        return destroyGiantess(state, usedGirlEnum.PlayerGoddess)
    }

    return Promise.resolve(state)
}

let _handleCameraLock = (state) => {
    if (!hasOpenedModalDom() && isEnterScene(state)) {
        state = setAbstractState(state, CameraControls.lock(getAbstractState(state)))
    }
    else if (Camera.isCanLock(getAbstractState(state))) {
        state = setAbstractState(state, CameraControls.unlock(getAbstractState(state)))
    }

    return state
}

// let _fixCanvasNone = (state: state) => {
//     if (getCanvas().style.display == "none") {
//         return Event.trigger(state, getAbstractState, getCanvasNoneEventName(), NullableUtils.getEmpty())
//     }

//     return Promise.resolve(state)
// }

export let loop = (usedFPS: number) => {
    let state = readState()

    state = setAbstractState(state, Flow.setMaxFPS(getAbstractState(state), usedFPS))

    writeState(state)


    requestAnimationFrame((time) => {
        let state = readState()

        state = _fixStopLoopWhenNoModal(state)
        state = _fixCameraPositionMayNaN(state)
        state = _fixCameraMiss(state)
        state = _fixIsControlledUnitCanAttack(state)

        state = _handleCameraLock(state)


        state = setAbstractState(state, Flow.setFrameIndex(getAbstractState(state), Flow.getFrameIndex(getAbstractState(state)) + 1))

        state = setAbstractState(state, Flow.setFPS(getAbstractState(state), time, Flow.getFrameIndex(getAbstractState(state))))
        // state = setAbstractState(state, Flow.initLastTime(getAbstractState(state), time))

        if (!Flow.isLoopStart(getAbstractState(state))
            || isMustStopLoop(state)
            || isDisposed(state)
        ) {
            writeState(state)
            loop(usedFPS)
            return
        }

        let isExec = false
        if (usedFPS !== 60) {
            let intervalTime = Flow.computeIntervalTime(getAbstractState(state), time)

            isExec = intervalTime > Math.floor(1000 / usedFPS)
        }
        else {
            isExec = true
        }

        if (!isExec) {
            writeState(state)
            loop(usedFPS)
            return
        }

        // state = setAbstractState(state, Flow.setLastTime(getAbstractState(state), time))

        // if (!getIsProduction(state)) {
        // if (getIsDebug(state)) {
        // if (!getIsProduction(state)) {
        if (!getIsNotTestPerf(state)) {
            Stats.begin(getAbstractState(state))
        }

        try {
            state = setAbstractState(state, Flow.setFirstUpdateTime(getAbstractState(state), time))

            state = _autoOptimize(state, time)

            _update(state).then(_render)
                // .then(_fixCanvasNone)
                .then(_fixPlayerGoddesNotDisappear)
                .then(state => {
                    writeState(state)

                    if (!getIsNotTestPerf(state)) {
                        Stats.end(getAbstractState(state))
                        Stats.nextFrame(getAbstractState(state), time)
                    }

                    loop(usedFPS)
                }).catch(e => {
                    return Event.trigger(readState(), getAbstractState, getErrorEventName(), buildErrorEventData(e))
                })
        } catch (e) {
            return Event.trigger(readState(), getAbstractState, getErrorEventName(), buildErrorEventData(e))
        }
    })
}

export let stopLoop = Loop.stopLoop

export let startLoop = Loop.startLoop

export let isStopLoop = Loop.isStopLoop