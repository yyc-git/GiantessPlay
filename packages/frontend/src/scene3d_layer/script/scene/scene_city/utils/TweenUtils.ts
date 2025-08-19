import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"

export let clearTween = (state: state, [hasTweenFunc, getTweenFunc, removeTweenFunc], name: string) => {
	if (!hasTweenFunc(state, name)) {
		return state
	}

	ArticluatedAnimation.stopTweens(getTweenFunc(state, name))

	state = removeTweenFunc(state, name)

	return state
}