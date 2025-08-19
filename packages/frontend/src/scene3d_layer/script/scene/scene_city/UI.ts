import { Event } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import { ui, uiUpdateLoopFrames } from "./type/StateType";
import { getAbstractState } from "../../../state/State";
import { getOperateUpdateEventName, getSkillStatusUpdateEventName } from "../../../utils/EventUtils";
import { RenderSetting } from "meta3d-jiehuo-abstract";
import { renderAccuracyLevel } from "meta3d-jiehuo-abstract/src/type/StateType";

let _getState = (state: state): ui => {
    return getState(state).ui
}

let _setState = (state: state, uiState: ui) => {
    return setState(state, {
        ...getState(state),
        ui: uiState
    })
}

let _restoreUIUpdateLoopCount = (state: state) => {
    switch (RenderSetting.getRenderSetting(getAbstractState(state)).renderAccuracy) {
        case renderAccuracyLevel.VeryHigh:
        case renderAccuracyLevel.High:
            state = setUIUpdateLoopCount(state, uiUpdateLoopFrames.Short)
            break
        case renderAccuracyLevel.Middle:
            state = setUIUpdateLoopCount(state, uiUpdateLoopFrames.Middle)
            break
        case renderAccuracyLevel.Low:
            state = setUIUpdateLoopCount(state, uiUpdateLoopFrames.Long)
            break
    }

    return state
}

export let initWhenImportScene = (state: state) => {
    state = _restoreUIUpdateLoopCount(state)

    return Promise.resolve(state)
}

export let update = (state: state) => {
    state = setUIUpdateLoopCount(state, Math.max(_getState(state).uiUpdateLoopCount - 1, 0))

    if (_getState(state).uiUpdateLoopCount <= 0) {
        state = _restoreUIUpdateLoopCount(state)

        return Event.trigger(state, getAbstractState, getOperateUpdateEventName(), null).then(state => {
            let isShow
            if (_getState(state).needUpdateSkillBar) {
                isShow = true
            }
            else {
                isShow = false
            }

            return Event.trigger(state, getAbstractState, getSkillStatusUpdateEventName(), isShow)
        })
    }

    return Promise.resolve(state)
}


export let setUIUpdateLoopCount = (state: state, loopCount: number) => {
    return _setState(state, {
        ..._getState(state),
        uiUpdateLoopCount: loopCount
    })
}


export let setNeedUpdateSkillBar = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        needUpdateSkillBar: value
    })
}

export let createState = (): ui => {
    return {
        uiUpdateLoopCount: -1,
        needUpdateSkillBar: false
    }
}

export let dispose = (state: state) => {
    return _setState(state, createState())
}