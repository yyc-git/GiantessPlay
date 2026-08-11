import { getAbstractState, setAbstractState } from "../../../../../../state/State"
import { state } from "../../../../../../type/StateType"
// import * as PathFindBiwu from "../PathFind"
import { createGrid, setGrid } from "../../city1/PathFind"
import { PathFind } from "meta3d-jiehuo-abstract"
import { getLevelData } from "../../../data/biwu/level3/LevelData"
import { getUsedGirl } from "../Utils"

export let initWhenImportScene = (state: state) => {
    let usedGirl = getUsedGirl()
    let {
        minX,
        maxX,
        minZ,
        maxZ,
    } = getLevelData(state, usedGirl).torsorRange

    let step = 1
    let range = {
        min: [minX, minZ],
        max: [maxX, maxZ]
    }

    state = setAbstractState(state, PathFind.setStep(getAbstractState(state), step))

    // state = setGrid(state, createGrid(state, range, step))
    state = setGrid(state, range, step)

    return Promise.resolve(state)

}

export let dispose = (state: state) => {
    return Promise.resolve(state)
}