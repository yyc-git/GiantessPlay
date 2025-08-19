import { getName as getSceneName } from "../../../CityScene"
import { getName } from "../../../girl/Girl"
import { animationName } from "./DataType"

export let getAnimationFrameCountMap = () => {
	return {
		[animationName.PickdownFromIdle]: 65,
		[animationName.Welcome]: 10,
	} as Record<animationName, number>
}

export let getAnimationFrameCountWithoutState = (animationName_) => {
	return getAnimationFrameCountMap()[animationName_]
}

export let getPickdownFromIdleAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/pickdown_fromIdle.vmd`

export let getWelcomeAnimationResourcePath = (name) => `./resource_girl/${name}/vmd_scenario/level1_welcome.vmd`

export let getPickdownFromIdleWorkFrameIndex = () => 45