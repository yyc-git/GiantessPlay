import { tween } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../../type/StateType";
// import { getBiwuSetting } from "../../CityScene";
// import { difficulty } from "../../type/StateType";
import { getAbstractState, readState } from "../../../../../state/State";
import { getMMDAnimationHelper } from "meta3d-jiehuo-abstract/src/mmd/MMD";
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { getAutoDifficulty } from "../../difficulty/Difficulty";
import { autoDifficulty } from "../../type/StateType";

export let getFightRate = (state: state) => {
    switch (getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
            return 1 / 6
        case autoDifficulty.Easy:
            return 1 / 4
        case autoDifficulty.Middle:
            return 1 / 3
        case autoDifficulty.Hard:
            return 2 / 5
        case autoDifficulty.VeryHard:
        case autoDifficulty.VeryHard1:
            return 1 / 2
        case autoDifficulty.VeryHard2:
        case autoDifficulty.VeryHard3:
            return 2 / 3
        case autoDifficulty.VeryHard4:
        case autoDifficulty.VeryHard5:
            return 3 / 4
    }
}

export let getRestRateFactor = (state: state) => {
    switch (getAutoDifficulty(state)) {
        case autoDifficulty.VeryEasy:
        case autoDifficulty.Easy:
            return 1.1
        case autoDifficulty.Middle:
            return 1
        case autoDifficulty.Hard:
        case autoDifficulty.VeryHard:
            return 0.9
        case autoDifficulty.VeryHard1:
        case autoDifficulty.VeryHard2:
            return 0.8
        case autoDifficulty.VeryHard3:
        case autoDifficulty.VeryHard4:
            return 0.7
        case autoDifficulty.VeryHard5:
            return 0.6
    }
}

export let createTween = (state: state, usedGirl,
    [
        isFootIKBoneFunc,
        updateBoneFunc,
        onCompleteFunc
    ],
    sourceObject, targetObject, time,
    actionName
): [state, tween] => {
    let helper = getMMDAnimationHelper(getAbstractState(state), usedGirl)

    let tween = ArticluatedAnimation.createTween(getAbstractState(state), sourceObject)
        .to(targetObject, time)
        .onUpdate(() => {
            MutableRecordUtils.set(helper.ikBoneCustomData, actionName, (bone) => {
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