import { NullableUtils } from "meta3d-jiehuo-abstract";
import { tweenManager } from "./type/StateType";
import { state } from "../../../type/StateType";
import { getState, setState } from "./CityScene";
import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { getAbstractState } from "../../../state/State";
// import { disposeTween } from "meta3d-jiehuo-abstract/src/animation/ArticluatedAnimation";
import { MutableMapUtils } from "meta3d-jiehuo-abstract";

export let createState = (): tweenManager => {
    return {
        tweens: [],
        tweensMap: MutableMapUtils.create()
    }
}

let _getState = (state: state) => {
    return NullableUtils.getExn(getState(state).tweenManager)
}

let _setState = (state: state, tweenState: tweenManager) => {
    return setState(state, {
        ...getState(state),
        tweenManager: tweenState
    })
}

export let addTweens = (state: state, tweens) => {
    return _setState(state, {
        ..._getState(state),
        tweens: ArrayUtils.pushArrs(_getState(state).tweens, tweens)
    })
}

let _getTweensByKeyWithDefault = (state: state, key, default_) => {
    return MutableMapUtils.getWithDefault(_getState(state).tweensMap, key, default_)
}

export let setTweensByKey = (state: state, key, tweens) => {
    return _setState(state, {
        ..._getState(state),
        tweensMap: MutableMapUtils.set(_getState(state).tweensMap, key, tweens)
    })
}

export let removeTweens = (state: state, tweens) => {
    let ids = ArrayUtils.map(tweens, tween => tween.getId())

    // ArticluatedAnimation.removeTweens(getAbstractState(state), tweens)

    // tweens.forEach(disposeTween)
    ArticluatedAnimation.removeTweens(getAbstractState(state), tweens)

    return _setState(state, {
        ..._getState(state),
        tweens: ArrayUtils.filter(_getState(state).tweens, tween => {
            return !ids.includes(tween.getId())
        })
    })
}

export let removeTweensByKey = (state: state, key) => {
    ArticluatedAnimation.removeTweens(getAbstractState(state), _getTweensByKeyWithDefault(state, key, []))

    return _setState(state, {
        ..._getState(state),
        tweensMap: MutableMapUtils.remove(_getState(state).tweensMap, key)
    })
}

let _getAllTweens = (state: state) => {
    return _getState(state).tweens.concat(
        MutableMapUtils.toArray(_getState(state).tweensMap
        )
    ).filter(tween => {
        return !NullableUtils.isNullable(tween) && !NullableUtils.isNullable(tween.getId)
    })
}

export let dispose = (state: state) => {
    ArticluatedAnimation.removeTweens(getAbstractState(state), _getAllTweens(state))

    return _setState(state, createState())
}

export let stop = (state: state) => {
    ArticluatedAnimation.stopTweens(_getAllTweens(state))
}