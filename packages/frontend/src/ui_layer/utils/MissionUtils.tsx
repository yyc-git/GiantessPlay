// import { Event } from "meta3d-jiehuo-abstract"
// import { exit as exitScene } from "../../business_layer/Scene3D"
// import { readState, writeState } from "../../business_layer/State"
// import { clearAndRegisterSceneAllMods } from "../../scene3d_layer/mod/SceneMod"
// import { setSceneChapter } from "../../scene3d_layer/script/scene/scene_city/CityScene"
// import { updateCharacterBackend } from "../../scene3d_layer/script/scene/scene_city/character/Character"
// import { markIsEnteringNextLevel } from "../../scene3d_layer/script/scene/scene_city/manage/mission/Mission"
// import { restoreWhenUpdateRewardWhenMissionFinishError, updateRewardWhenMissionFinish } from "../../scene3d_layer/script/scene/scene_city/reward/RewardGenerator"
// import { state } from "../../scene3d_layer/type/StateType"
// import { setPage, setTargetScene } from "../global/store/GlobalStore"
// import { page, scene } from "../global/store/GlobalStoreType"
// import { disposeStore, setMissionComplete } from "../index/scene/store/SceneStore"
// import { handleNetworkRequest } from "./BackendUtils"
// import { deferSwitchPageForGetNewestState } from "./SwitchPageUtils"
// import { getAbstractState } from "../../scene3d_layer/state/State"
// import { getCloseAllUIEventName } from "../../scene3d_layer/utils/EventUtils"
// import { handleEventHandler, handleHandler } from "./ErrorUtils"

// let _updateBackend = (state: state, afterFunc) => {
//     writeState(state)

//     /*! defer to to make sure that update backend after page close to avoid duplicate click button(can cause duplicate dispose scene that will error!)
//     */
//     setTimeout(() => {
//         return handleNetworkRequest(state => {
//             return updateRewardWhenMissionFinish(state)
//                 .then(updateCharacterBackend).then(writeState)
//             // .then(_ => {
//             //     return new Promise((resolve, reject) => {
//             //         setTimeout(() => {
//             //             resolve(null)
//             //         }, 1000)

//             //     })
//             // })
//         }, state => {
//             return Event.trigger<state>(state, getAbstractState, getCloseAllUIEventName(), null).then(state => {
//                 writeState(state)

//                 /*! wait for close all ui
//                 */
//                 setTimeout(() => {
//                     handleHandler(afterFunc, readState())
//                 }, 100)
//             })
//         }, state => {
//             state = restoreWhenUpdateRewardWhenMissionFinishError(state)

//             return Promise.resolve(state)
//         })
//     }, 100)

//     return Promise.resolve()
// }

// export let enterNextLevel = (state, dispatchFunc, [sceneChapter, levelNumber], newPage) => {
//     // setIsShowModalFunc(() => false)
//     dispatchFunc(setMissionComplete(false))
//     dispatchFunc(disposeStore())


//     state = markIsEnteringNextLevel(state, true)

//     return _updateBackend(state, state => {
//         return exitScene(state).then(state => {
//             writeState(state)

//             dispatchFunc(setPage(page.IndexMain))

//             setTimeout(() => {
//                 handleHandler((state, sceneChapter) => {
//                     clearAndRegisterSceneAllMods(readState(), sceneChapter).then(state => {
//                         state = setSceneChapter(state, sceneChapter)

//                         writeState(state)

//                         dispatchFunc(setTargetScene({ scene: sceneChapter, levelNumber }))
//                         // dispatchFunc(setPage(newPage))
//                         deferSwitchPageForGetNewestState(dispatchFunc, setPage(newPage))
//                     })
//                 }, readState(), sceneChapter)
//             }, 100)
//         })
//     })
// }

// export let exit = (dispatchFunc) => {
//     let state = readState()

//     dispatchFunc(disposeStore())

//     state = markIsEnteringNextLevel(state, false)

//     return _updateBackend(state, state => {
//         return exitScene(state).then(state => {
//             writeState(state)

//             // dispatchFunc(setTargetScene({ scene: scene.Play, levelNumber: 1 }))
//             // dispatchFunc(setPage(page.IndexMain))

//             setTimeout(() => {
//                 handleHandler((state, sceneChapter) => {
//                     clearAndRegisterSceneAllMods(readState(), sceneChapter).then(state => {
//                         writeState(state)

//                         dispatchFunc(setTargetScene({ scene: scene.Play, levelNumber: 1 }))
//                         dispatchFunc(setPage(page.IndexMain))
//                     })
//                 }, readState(), scene.Play)
//             }, 100)
//         })
//     })
// }
import { Render } from "meta3d-jiehuo-abstract"
import { exit as exitScene } from "../../business_layer/Scene3D"
import { getAbstractState, readState, writeState } from "../../business_layer/State"
import { clearAndRegisterSceneAllMods } from "../../scene3d_layer/mod/SceneMod"
import { setSceneChapter } from "../../scene3d_layer/script/scene/scene_city/CityScene"
import { markIsEnteringNextLevel } from "../../scene3d_layer/script/scene/scene_city/manage/mission/Mission"
import { setPage, setTargetScene } from "../global/store/GlobalStore"
import { page, scene } from "../global/store/GlobalStoreType"
import { disposeStore, setMissionComplete } from "../index/scene/store/SceneStore"
import { handleHandler } from "./ErrorUtils"
import { deferSwitchPageForGetNewestState } from "./SwitchPageUtils"

export let enterNextLevel = (state, dispatchFunc, [sceneChapter, levelNumber], newPage) => {
    // setIsShowModalFunc(() => false)
    dispatchFunc(setMissionComplete(false))
    dispatchFunc(disposeStore())

    state = markIsEnteringNextLevel(state, true)

    return exitScene(state).then(state => {
        writeState(state)

        dispatchFunc(setPage(page.IndexMain))

        setTimeout(() => {
            handleHandler((state, sceneChapter) => {
                clearAndRegisterSceneAllMods(readState(), sceneChapter).then(state => {
                    state = setSceneChapter(state, sceneChapter)

                    writeState(state)

                    dispatchFunc(setTargetScene({ scene: sceneChapter, levelNumber }))
                    dispatchFunc(setPage(newPage))
                    // deferSwitchPageForGetNewestState(dispatchFunc, setPage(newPage))
                })
            }, readState(), sceneChapter)
        }, 100)
    })
}

export let exit = (dispatchFunc) => {
    let state = readState()

    dispatchFunc(disposeStore())

    state = markIsEnteringNextLevel(state, false)

    return exitScene(state).then(state => {
        writeState(state)

        // dispatchFunc(setTargetScene({ scene: scene.Play, levelNumber: 1 }))
        // dispatchFunc(setPage(page.IndexMain))

        setTimeout(() => {
            handleHandler((state, sceneChapter) => {
                clearAndRegisterSceneAllMods(readState(), sceneChapter).then(state => {
                    writeState(state)

                    dispatchFunc(setTargetScene({ scene: scene.Play, levelNumber: 1 }))
                    // dispatchFunc(setPage(page.IndexMain))
                    deferSwitchPageForGetNewestState(dispatchFunc, setPage(page.IndexMain))
                })
            }, readState(), scene.Play)
        }, 100)
    })
}