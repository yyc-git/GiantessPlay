import { NullableUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { fastProp, forceSize } from "./type/StateType";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { characterType, name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { Map } from "immutable";
import { isEnteringNextLevel } from "./manage/mission/Mission";

export let createState = (): fastProp => {
    return {
        littleMan: Map<number, any>(),
        giantess: Map<number, any>(),
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).fastProp)
}

let _setState = (state: state, fastPropState: fastProp) => {
    return setState(state, {
        ...getState(state),
        fastProp: NullableUtils.return_(fastPropState)
    })
}

export let getFastPropData = (state: state) => {
    return _getState(state)
}

export let setFastPropData = (state: state, { characterType_, index, value }) => {
    let s = _getState(state)

    let d
    switch (characterType_) {
        case characterType.LittleMan:
            d = s.littleMan
            break
        case characterType.Giantess:
            d = s.giantess
            break
        default:
            throw new Error("err")
    }


    d = d.filter((oldValue) => {
        return oldValue.propName != value.propName
    })

    d = d.set(
        index, value
    )


    switch (characterType_) {
        case characterType.LittleMan:
            state = _setState(state, {
                ..._getState(state),
                littleMan: d
            })
            break
        case characterType.Giantess:
            state = _setState(state, {
                ..._getState(state),
                giantess: d
            })
            break
        default:
            throw new Error("err")
    }

    return state
}

export let initWhenImportScene = (state:state) => {

}

export let dispose = (state: state) => {
    if (isEnteringNextLevel(state)) {
        return state
    }

    return _setState(state, createState())
}
