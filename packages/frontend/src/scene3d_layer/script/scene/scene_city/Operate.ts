import { getOperateCache, setOperateCache } from "meta3d-jiehuo-abstract/src/storage/Storage"
import { getConfigData, getGirlScale, getState, isGiantessCharacterType, setState } from "./CityScene"
import { state } from "../../../type/StateType"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { operate } from "./type/StateType"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { Scene } from "meta3d-jiehuo-abstract"
import { getAbstractState } from "../../../../business_layer/State"
import { writeState } from "../../../state/State"

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).operate)
}

let _setState = (state: state, operateState: operate) => {
    return setState(state, {
        ...getState(state),
        operate: NullableUtils.return_(operateState)
    })
}

export let createState = (): operate => {
    return {
        savedOperatePosition: MutableRecordUtils.create(),
        isStartDrag: false,
    }
}

let _buildPositionCacheKey = () => `operate_buildPositionCacheKey`

export let getSavedOperatePosition = (state: state, characterType_, actionName) => {
    return NullableUtils.bind(
        map => {
            return MutableRecordUtils.get(map, actionName)
        }, MutableRecordUtils.get(_getState(state).savedOperatePosition, characterType_)
    )
}

let _setSavedOperatePosition = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        savedOperatePosition: value
    })
}

export let setSavedOperatePosition = (state: state, characterType_, actionName, value) => {
    return _setState(state, {
        ..._getState(state),
        savedOperatePosition: MutableRecordUtils.set(_getState(state).savedOperatePosition, characterType_,
            MutableRecordUtils.set(
                MutableRecordUtils.getWithDefault(
                    _getState(state).savedOperatePosition,
                    characterType_,
                    MutableRecordUtils.create()
                ),
                actionName,
                value
            )
        )
    })
}

export let saveOperatePosition = (state: state) => {
    return setOperateCache(_buildPositionCacheKey(), _getState(state).savedOperatePosition)
}

export let getOperateDataFromBackend = (state: state) => {
    return getOperateCache(_buildPositionCacheKey()).then(value => {
        return NullableUtils.getWithDefault(NullableUtils.map(value => {
            return _setSavedOperatePosition(state, value)
        }, value), state)
    })
}


export let getIsStartDrag = (state: state) => {
    return _getState(state).isStartDrag
}

export let setIsStartDrag = (state: state, value) => {
    return _setState(state, {
        ..._getState(state),
        isStartDrag: value
    })
}

export let resetOperatePosition = (state: state, characterType_) => {
    state = _setState(state, {
        ..._getState(state),
        savedOperatePosition: MutableRecordUtils.set(_getState(state).savedOperatePosition, characterType_,
            MutableRecordUtils.create()
        )
    })

    writeState(state)

    return saveOperatePosition(state)
}

export let dispose = (state: state) => {
    state = _setState(state, {
        ...createState(),

        savedOperatePosition: _getState(state).savedOperatePosition
    })

    return state
}