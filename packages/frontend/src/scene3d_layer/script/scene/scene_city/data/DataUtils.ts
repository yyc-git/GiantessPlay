import { NullableUtils } from "meta3d-jiehuo-abstract"
import { articluatedAnimationData, articluatedAnimationName } from "./DataType"
import { ArticluatedAnimation } from "meta3d-jiehuo-abstract"
import { state } from "../../../../type/StateType"
import { getAbstractState } from "../../../../state/State"
import { getConfigData } from "../CityScene"

export let findArticluatedAnimationData = (state: state, name) => {
	return NullableUtils.getExn(getConfigData(state).articluatedAnimationData.find((data) => {
		return data.name == name
	}))
}


export let playArticluatedAnimation = (state: state, [onUpdateFunc, getValueFunc, getParamFunc, handleTweenRepeatCompleteFunc, onStartFunc = () => Promise.resolve()], articluatedAnimationData: articluatedAnimationData<articluatedAnimationName>) => {
	let object = {
		...articluatedAnimationData.initial(state, getValueFunc)
	}

	// let onUpdateFunc = () => {
	// 	_updateTween(matrix, object, position, quat.clone(), scale, zAxis)
	// }

	let allTweens = []

	let tweensData = articluatedAnimationData.tweens(state, getParamFunc)

	let tweenFirst = ArticluatedAnimation.createTween(getAbstractState(state), object)
		.to(tweensData[0][0], tweensData[0][1],)
		.onUpdate(onUpdateFunc)
		.onStart(onStartFunc)

	allTweens.push(tweenFirst)

	ArticluatedAnimation.addTween(getAbstractState(state), tweenFirst)

	if (tweensData.length >= 2) {
		let tweenLast = ArticluatedAnimation.createTween(getAbstractState(state), object)
			.to(tweensData[tweensData.length - 1][0], tweensData[tweensData.length - 1][1],)
			.onUpdate(onUpdateFunc)

		ArticluatedAnimation.addTween(getAbstractState(state), tweenLast)

		if (tweensData.length >= 3) {
			let lastLastTween = tweensData.slice(1, -1).reduce((lastTween, [object_, time]) => {
				let tween = ArticluatedAnimation.createTween(getAbstractState(state), object)
					.to(object_, time)
					.onUpdate(onUpdateFunc)
				// .onComplete(() => {
				// 	ArticluatedAnimation.removeTween(tween)

				// 	return Promise.resolve()
				// })

				allTweens.push(tween)

				lastTween.chain(tween)

				ArticluatedAnimation.addTween(getAbstractState(state), tween)

				return tween
			}, tweenFirst)

			lastLastTween.chain(tweenLast)
		}
		else if (tweensData.length == 2) {
			tweenFirst.chain(tweenLast)
		}

		allTweens.push(tweenLast)

		tweenFirst.start()
	}
	else {
		tweenFirst.start()
	}

	handleTweenRepeatCompleteFunc(allTweens)

	return allTweens
}

