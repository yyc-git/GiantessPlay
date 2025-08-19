import { state } from "../scene3d_layer/type/StateType"
import { Event, Render, Outline, Stats, Pick, Camera, Scene, Device, InstancedSkinLOD2, LOD, } from "meta3d-jiehuo-abstract"
// import { init as initEvent, update as updateEvent } from "meta3d-jiehuo-abstract"
// import { createRenderer, init as initRender, render, update as updateRender } from "meta3d-jiehuo-abstract"
// import { importScene as importWarehouse1Scene, init as initWarehouse1Scene } from "./script/scene/scene_warehouse/WarehouseScene"
// import { init as initArticluatedAnimation } from "meta3d-jiehuo-abstract"
// import { init as initOutline } from "meta3d-jiehuo-abstract"
// import { addStats, update as updateStats } from "meta3d-jiehuo-abstract"
import { getDynamicGroup, isResetKeyState } from "../scene3d_layer/script/scene/scene_city/CityScene"
// import { getCurrentScene, setCurrentScene, update as updateScene } from "meta3d-jiehuo-abstract"
// import { init as initCamera, update as updateCamera } from "meta3d-jiehuo-abstract"
import { scene } from "../ui_layer/global/store/GlobalStoreType"
// import { enterScene as enterWarehouseScene } from "../scene3d_layer/script/scene/scene_warehouse/WarehouseScene"
import { getAbstractState, readState, setAbstractState, writeState } from "./State"
import { enterScene, getIsProduction, updateCurrentScene } from "../scene3d_layer/script/scene/Scene"
import { Flow } from "meta3d-jiehuo-abstract"
import { CSM } from "meta3d-jiehuo-abstract"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Physics } from "meta3d-jiehuo-abstract"
import { MMD } from "meta3d-jiehuo-abstract"
import { ParticleManager } from "meta3d-jiehuo-abstract"
import { SoundManager, LabelManager } from "meta3d-jiehuo-abstract"
import { Instance } from "meta3d-jiehuo-abstract"
import { buildErrorEventData, getErrorEventName } from "../scene3d_layer/utils/EventUtils"
import { GPUSkin } from "meta3d-jiehuo-abstract"
// import { execute } from "../scene3d_layer/script/scene/scene_city/scenario/CommandManager"
import * as ScenarioManager from "../scene3d_layer/script/scene/scene_city/scenario/ScenarioManager"
import * as GameEvent from "../scene3d_layer/script/scene/scene_city/game_event/GameEvent"
import * as UI from "../scene3d_layer/script/scene/scene_city/UI"
import { SkinAnimation } from "meta3d-jiehuo-abstract"
import { ModelLoader } from "meta3d-jiehuo-abstract"
// import { init as initCamera} from "./script/scene/Camera"

// export let init = (state: state, currentScene: scene, levelNumber: number) => {
export let init = (state: state) => {
    let renderer = Render.createRenderer()

    return Device.init(getAbstractState(state)).then(abstractState => {
        return Render.init(abstractState, renderer)
    })
        .then(ModelLoader.init)
        .then(abstractState => {
            if (!getIsProduction(state)) {
                abstractState = Stats.addStats(abstractState)

                Stats.init()
            }

            return Event.init(abstractState, getAbstractState)
        })
        .then(abstractState => {
            return Physics.init(abstractState)
        })
        .then(abstractState => {
            return Pick.init(abstractState, [getAbstractState, setAbstractState, getDynamicGroup])
        }).then(abstractState => {
            return Outline.init(abstractState)
        }).then(abstractState => {
            return Scene.init(abstractState, [getAbstractState, setAbstractState, readState, writeState,
                isResetKeyState
            ])
            // }).then(abstractState => {
            //     state = setAbstractState(state, abstractState)

            //     return enterScene(state, currentScene, levelNumber)
            // })
        }).then(abstractState => {
            state = setAbstractState(state, abstractState)

            return state
        })
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
            return GPUSkin.update(state, [getAbstractState, setAbstractState])
        })
        .then(state => {
            return InstancedLOD2.update(state, getAbstractState)
        }).then(state => {
            return InstancedSkinLOD2.update(state, getAbstractState)
        })
        .then(state => {
            return setAbstractState(state, Instance.updateAllInstances(getAbstractState(state)))
        })
        .then(state => {
            return MMD.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
        }).then(state => {
            return ParticleManager.update(state, [getAbstractState, setAbstractState])
        }).then(state => {
            return SoundManager.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
        }).then(state => {
            return LabelManager.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
        }).then(state => {
            return LOD.update(getAbstractState(state)).then(abstractState => setAbstractState(state, abstractState))
        })
        // .then(GameEvent.update)
        .then(ScenarioManager.update)
        .then(UI.update)
        .then(state => {
            return state
        })

    // .then(state => {
    //     return GrassInstance.update(state, getAbstractState, NullableUtils.getExn( state.cityScene.grass.grass2).)
    // })
}

let _render = (state: state) => {
    return CSM.update(getAbstractState(state)).then(abstractState => {
        return Render.render(abstractState)
    }).then(abstractState => setAbstractState(state, abstractState))
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
export let loop = (usedFPS: number) => {
    requestAnimationFrame((time) => {
        let state = readState()

        state = setAbstractState(state, Flow.initLastTime(getAbstractState(state), time))

        if (!Flow.isLoopStart(getAbstractState(state))) {
            state = setAbstractState(state, Flow.setLastTime(getAbstractState(state), time))
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

        state = setAbstractState(state, Flow.setLastTime(getAbstractState(state), time))

        if (!getIsProduction(state)) {
            Stats.begin(getAbstractState(state))
        }

        try {
            _update(state).then(state => _render(state)).then(state => {
                writeState(state)

                if (!getIsProduction(state)) {
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

export let stopLoop = (state: state) => {
    return setAbstractState(state, Flow.stopLoop(getAbstractState(state)))
}

export let startLoop = (state: state) => {
    return setAbstractState(state, Flow.startLoop(getAbstractState(state)))
}