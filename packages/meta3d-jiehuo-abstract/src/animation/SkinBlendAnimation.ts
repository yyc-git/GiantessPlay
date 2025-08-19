import { LoopOnce, LoopRepeat, SkinnedMesh } from "three"
import { getSkinAnimationState, setSkinAnimationState } from "../state/State"
import { MMDAnimationHelper } from "../three/MMDAnimationHelper"
import { skinAnimationName, state } from "../type/StateType"
import { getExn } from "../utils/NullableUtils"
import { getMMDAnimationHelper } from "../mmd/MMD"
import { getAction } from "./SkinAnimation"

export let getWeights = (state: state) => {
	return getSkinAnimationState(state).weights
}


export let setWeights = (state: state, weights) => {
	return setSkinAnimationState(state, {
		...getSkinAnimationState(state),
		weights: weights
	})
}

let _setWeight = (action, weight) => {
	action.enabled = true;
	action.setEffectiveTimeScale(1);
	action.setEffectiveWeight(weight);
}

/*! will play first animation name
* 
*/
export let activateAllActions = (state: state, mesh: SkinnedMesh, helper: MMDAnimationHelper, animationNames) => {
	animationNames.forEach(animationName => {
		let action = helper.findAnimationAction(mesh, animationName)

		_setWeight(action, getExn(getWeights(state).get(animationName)))

		helper.play(mesh, animationName, true)
	})

	return state
}

export let deactivateAllActions = (mesh: SkinnedMesh, helper: MMDAnimationHelper, animationNames) => {
	animationNames.forEach(animationName => {
		let action = helper.findAnimationAction(mesh, animationName)

		action.stop();
	})
}


export let activateAllActionsForNotMMD = (state: state, targetName, animationNames) => {
	animationNames.forEach(animationName => {
		let action = getAction(state, targetName, animationName)

		_setWeight(action, getExn(getWeights(state).get(animationName)))

		// helper.play(mesh, animationName, true)


		action.setLoop(
			LoopRepeat,
			Infinity,
		)

		action.play()
	})

	return state
}

export let deactivateAllActionsForNotMMD = (state: state, targetName, animationNames) => {
	animationNames.forEach(animationName => {
		let action = getAction(state, targetName, animationName)

		action.stop();
	})
}


// export let prepareCrossFade = (helper, mesh, startAction, endAction, defaultDuration) => {

// 	// Switch default / custom crossfade duration (according to the user's choice)

// 	var duration = _setCrossFadeDuration(defaultDuration);

// 	// // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

// 	// singleStepMode = false;
// 	// unPauseAllActions();

// 	// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
// 	// else wait until the current action has finished its current loop

// 	// if (startAction === idleAction) {

// 	// 	executeCrossFade(startAction, endAction, duration);

// 	// } else {

// 	// 	synchronizeCrossFade(startAction, endAction, duration);

// 	// }





// 	// executeCrossFade(startAction, endAction, duration);

// 	synchronizeCrossFade(helper, mesh, startAction, endAction, duration);
// }

let _setCrossFadeDuration = (defaultDuration) => {

	// // Switch default crossfade duration <-> custom crossfade duration

	// if (settings['use default duration']) {

	// 	return defaultDuration;

	// } else {

	// 	return settings['set custom duration'];

	// }


	return defaultDuration;
}

// export let synchronizeCrossFade = (helper, mesh, startAction, endAction, duration) => {

// 	helper.getMixer(mesh).addEventListener('loop', onLoopFinished);

// 	function onLoopFinished(event) {

// 		if (event.action === startAction) {

// 			helper.getMixer(mesh).removeEventListener('loop', onLoopFinished);

// 			executeCrossFade(startAction, endAction, duration);

// 		}

// 	}

// }

export let executeCrossFade = (startAction, endAction, fadeOutDuration, fadeInDuration = fadeOutDuration) => {

	// Not only the start action, but also the end action must get a weight of 1 before fading
	// (concerning the start action this is already guaranteed in this place)


	// _setWeight(startAction, 0.3);

	_setWeight(endAction, 1);
	endAction.time = 0;

	// Crossfade with warping - you can also try without warping by setting the third parameter to false

	// startAction.crossFadeTo(endAction, duration, true);


	startAction.fadeOut(fadeOutDuration)
	endAction.fadeIn(fadeInDuration)

}

export let getWeight = (state: state, mesh: SkinnedMesh, animationName) => {
	return getMMDAnimationHelper(state).findAnimationAction(mesh, animationName).getEffectiveWeight()
}

export let getWeightForNotMMD = (action) => {
	return action.getEffectiveWeight()
}


// export let playSkinAnimation = (state: state, currentAction, nextAction, loop = true) => {
// 	// _setWeight(nextAction, 1);
// 	// nextAction.time = 0;

// 	currentAction.stop()

// 	// nextAction.setLoop(
// 	// 	loop ? LoopRepeat : LoopOnce,
// 	// 	Infinity,
// 	// )
// 	// // nextAction.play().fadeIn(0.1)
// 	// nextAction.play()

// 	return state
// }