import { tween } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../../type/StateType";
import { getBiwuSetting } from "../../CityScene";
import { difficulty } from "../../type/StateType";
import { getAbstractState, readState } from "../../../../../state/State";
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD";
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { MutableMapUtils } from "meta3d-jiehuo-abstract";

export let getFightRate = (state: state) => {
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
            return 1 / 6
        case difficulty.Easy:
            return 1 / 4
        case difficulty.Middle:
            return 1 / 3
        case difficulty.Hard:
            return 2 / 5
        case difficulty.VeryHard:
            return 1 / 2
    }
}

export let getRestRateFactor = (state: state) => {
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
        case difficulty.Easy:
            return 1.1
        case difficulty.Middle:
            return 1
        case difficulty.Hard:
        case difficulty.VeryHard:
            return 0.9
    }
}

export let createTween = (state: state,
    [
        isFootIKBoneFunc,
        updateBoneFunc,
        onCompleteFunc
    ],
    sourceObject, targetObject, time,
    actionName
): [state, tween] => {
    let helper = getMMDAnimationHelper(getAbstractState(state))

    let tween = ArticluatedAnimation.createTween(getAbstractState(state), sourceObject)
        .to(targetObject, time)
        .onUpdate(() => {
            MutableMapUtils.set(helper.ikBoneCustomData, actionName, (bone) => {
                if (isFootIKBoneFunc(bone)) {
                    updateBoneFunc(bone, sourceObject)
                }
            })

            return Promise.resolve()
        })
        .onComplete(() => {
            let state = readState()

            ArticluatedAnimation.removeTween(getAbstractState(state), tween)

            return onCompleteFunc(state)
        })

    tween.start()
    ArticluatedAnimation.addTween(getAbstractState(state), tween)

    return [state, tween]
}