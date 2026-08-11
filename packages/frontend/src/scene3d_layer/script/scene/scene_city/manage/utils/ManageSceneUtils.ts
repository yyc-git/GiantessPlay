import { ArticluatedAnimation } from "meta3d-jiehuo-abstract";
import { state } from "../../../../../type/StateType";
import { stop as stopTweens } from "../../TweenManager";
import { stop } from "../../behaviour_tree/BehaviourTreeManager";
import { getAbstractState, setAbstractState } from "../../../../../state/State";
import { Flow } from "meta3d-jiehuo-abstract";
import { usedGirl } from "../../type/StateType";

export let stopAIAndAllTweensAndDefer = (state: state, stopBehaviourTreeFunc = stop, usedGirl: usedGirl) => {
    return stopBehaviourTreeFunc(state, usedGirl).then(state => {
        ArticluatedAnimation.stopAllArticluatedAnimations(getAbstractState(state))

        stopTweens(state)

        state = setAbstractState(state, Flow.dispose(getAbstractState(state)))

        return state
    })
}