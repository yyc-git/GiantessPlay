import { NumberUtils } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../../../../../type/StateType"
import { Event } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState, writeState } from "../../../../../../../../../state/State"
import { getQTEUpdateEventName } from "../../../../../../../../../utils/EventUtils"
import { Flow } from "meta3d-jiehuo-abstract"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { SoundManager } from "meta3d-jiehuo-abstract"
import { getQTEFailSoundResourceId, getQTEStartSoundResourceId, getQTESuccessSoundResourceId } from "../../../../../../little_man_data/Const"
import { getIsDebug } from "../../../../../../../Scene"
import { getSystemVolume } from "../../../../../../utils/SoundUtils"
import { isHard } from "../../../../../../manage/biwu/level2/ManageScene"
import { getLevelData, getLevelDataExn, setLevelData } from "../../../../../../CityScene"
import { qte } from "../../../../../../type/StateType"

let _getCustomDataKey = () => "qte"

let _getCustomData = (state: state) => {
    return getLevelData<qte>(state, _getCustomDataKey())
}

let _getCustomDataExn = (state: state) => {
    return getLevelDataExn<qte>(state, _getCustomDataKey())
}

let _setCustomData = (state: state, value: qte) => {
    return setLevelData(state, _getCustomDataKey(), value)
}

let _initCustomData = (state: state) => {
    return _setCustomData(state, {
        moveLineLeft: 0,
        activeLineLeft: 0,
        isHit: false,
        isStart: false,
    })
}

export let getMoveLineLeft = (state) => {
    return _getCustomDataExn(state).moveLineLeft
}

let _setMoveLineLeft = (state, value) => {
    return _setCustomData(state, {
        ..._getCustomDataExn(state),
        moveLineLeft: value
    })
}

export let getActiveLineLeft = (state) => {
    return _getCustomDataExn(state).activeLineLeft
}

let _setActiveLineLeft = (state, value) => {
    return _setCustomData(state, {
        ..._getCustomDataExn(state),
        activeLineLeft: value
    })
}

export let getIsHit = (state) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            ({ isHit }) => {
                return isHit
            },
            _getCustomData(state)
        ),
        false
    )
}

let _setIsHit = (state, value) => {
    return _setCustomData(state, {
        ..._getCustomDataExn(state),
        isHit: value
    })
}

export let getIsStart = (state) => {
    return NullableUtils.getWithDefault(
        NullableUtils.map(
            ({ isStart }) => {
                return isStart
            },
            _getCustomData(state)
        ),
        false
    )
}

let _setIsStart = (state, value) => {
    return _setCustomData(state, {
        ..._getCustomDataExn(state),
        isStart: value
    })
}

let _getWidth = () => 20

let _getActiveLineWidth = () => 5

let _generateActiveLineLeft = () => {
    return NumberUtils.getRandomInteger(0, _getWidth() - _getActiveLineWidth())
}

let _getMoveDeferName = () => "qte_move"

let _handleEnd = (state: state, isHit) => {
    state = _setMoveLineLeft(state, 0)
    state = _setActiveLineLeft(state, 0)
    state = _setIsHit(state, isHit)
    state = _setIsStart(state, false)

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(isHit ? getQTESuccessSoundResourceId() : getQTEFailSoundResourceId(), getIsDebug(state), getSystemVolume(state))))

    let _ = writeState(state)

    return Event.trigger(state, getAbstractState, getQTEUpdateEventName(), null)
}

let _move = (state: state, speed) => {
    state = setAbstractState(state, Flow.addDeferExecFuncDataByTime(getAbstractState(state), (state) => {
        let moveLineLeft = getMoveLineLeft(state)
        if (moveLineLeft < _getWidth()) {
            state = _setMoveLineLeft(state, moveLineLeft + speed)

            return _move(state, speed)
        }

        return _handleEnd(state, false)
    }, 0.03, _getMoveDeferName()))

    let _ = writeState(state)

    return Event.trigger(state, getAbstractState, getQTEUpdateEventName(), null)
}

export let startQTE = (state: state) => {
    state = _initCustomData(state)

    state = _setIsStart(state, true)

    state = _setActiveLineLeft(state, _generateActiveLineLeft())

    state = setAbstractState(state, SoundManager.addNeedToPlaySound(getAbstractState(state), SoundManager.buildNeedToPlaySoundData(getQTEStartSoundResourceId(), getIsDebug(state), getSystemVolume(state))))

    // return _move(state, NumberUtils.clamp(0.5 * 1.5 / timeScalar, 0.2, 1))
    return _move(state, 0.5 * 1.5 / _getTimeScalar(state))
}

let _isHit = (state: state) => {
    let moveLineLeft = getMoveLineLeft(state)
    let activeLineLeft = getActiveLineLeft(state)

    return moveLineLeft >= activeLineLeft && moveLineLeft <= activeLineLeft + _getActiveLineWidth()
}

let _getTimeScalar = (state: state) => {
    let factor
    if (isHard(state)) {
        factor = 2
    }
    else {
        factor = 1
    }

    const value = 1.5 * factor

    return NumberUtils.getRandomFloat(value * 0.5, value * 1.5)
}

export let pointdownHandle = (state: state, { userData }): Promise<state> => {
    if (!getIsStart(state)) {
        return Promise.resolve(state)
    }

    state = setAbstractState(state, Flow.removeDeferExecFuncData(getAbstractState(state), _getMoveDeferName()))

    return _handleEnd(state, _isHit(state))
}