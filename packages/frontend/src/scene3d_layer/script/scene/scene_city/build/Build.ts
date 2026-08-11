import { Vector3 } from "three";
import { build, usedGirlEnum } from "../type/StateType";
import { getConfigData, getState, isLittleCharacterType, mutableSetState, setConfigData, setState } from "../CityScene";
import { state } from "../../../../type/StateType";
import { createData, updateUpgrade, dispose as disposeUpgrade } from "./Upgrade";
import * as Career from "./Career";
import * as Talent from "./Talent";
import { isEnteringNextLevel } from "../manage/mission/Mission";
import { readState } from "../../../../state/State";


const _v1 = new Vector3();
const _v2 = new Vector3();


export let createState = (): build => {
    return {
        level: createData(),
        career: Career.createData(),
        talent: Talent.createData(),
    }
}

export let getBuildState = (state): build => {
    return getState(state).build
}

export let setBuildState = (state, buildState: build) => {
    return setState(state, {
        ...getState(state),
        build: buildState
    })
}

export let mutableSetBuildState = (state, buildState: build) => {
    // return mutableSetState(state, {
    //     ...getState(state),
    //     build: buildState
    // })
    // getState(state).build = buildState
    readState().cityScene.build = buildState

    return state
}



export let update = (state: state) => {
    return updateUpgrade(state)
}

export let dispose = (state: state) => {
    let level = disposeUpgrade(state)

    return Career.dispose(state).then(state => {
        if (isEnteringNextLevel(state)) {
            return setBuildState(state, {
                ...getBuildState(state),
                level,
            })
        }

        return setBuildState(state, {
            ...createState(),
            level,
            // talentData: getBuildState(state).talentData
            talent: Talent.disposeButKeepTalentData(state)
        })
    })
}
