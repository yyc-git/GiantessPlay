import { exit as exitScene } from "../../business_layer/Scene3D"
import { readState, writeState } from "../../business_layer/State"
import { setPage, setTargetScene } from "../global/store/GlobalStore"
import { page } from "../global/store/GlobalStoreType"
import { disposeStore } from "../index/scene/store/SceneStore"

export let enterLevel = ([setIsShowModalFunc, dispatchFunc], [sceneChapter, levelNumber], newPage) => {
    let state = readState()

    setIsShowModalFunc(() => false)

    dispatchFunc(disposeStore())

    return exitScene(state).then(state => {
        dispatchFunc(setPage(page.IndexMain))

        setTimeout(() => {
            dispatchFunc(setTargetScene({ scene: sceneChapter, levelNumber }))
            // dispatchFunc(setPage(page.Scene))
            dispatchFunc(setPage(newPage))
        }, 100)

        return state
    })
}

export let exit = (dispatchFunc) => {
    let state = readState()

    dispatchFunc(disposeStore())

    return exitScene(state).then(state => {
        writeState(state)

        dispatchFunc(setPage(page.IndexMain))
    })
}