import { getName as getSceneName } from "../../../CityScene"
import { getName } from "../../../girl/Girl"
import { animationName } from "./DataType"

export let getAnimationFrameCountMap = () => {
	return {
		[animationName.PickdownFromIdle]: 65,

		[animationName.HangRightLightStomp]: 20,
		[animationName.HangLeftLightStomp]: 20,
		[animationName.BackRightLightStomp]: 20,
		[animationName.BackLeftLightStomp]: 20,
		[animationName.KeepRightLightStomp]: 60,
		[animationName.KeepLeftLightStomp]: 60,
		[animationName.HeavyStressingRightLightStomp]: 60,
		[animationName.HeavyStressingLeftLightStomp]: 60,

		[animationName.Excitement]: 25,
	} as Record<animationName, number>
}

export let getAnimationFrameCountWithoutState = (animationName_) => {
	return getAnimationFrameCountMap()[animationName_]
}

// export let getHakuQPResourceId = () => `${getSceneName()}_${getName()}_${getHakuQPResourcePath(getName())}`

// export let getHakuQPResourcePath = (name) => `./resource_girl/${name}/旗袍 Haku/tda haku QP.pmx`

export let getHangRightLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/hangRightLightStomp.vmd`

export let getHangLeftLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/hangLeftLightStomp.vmd`

export let getBackRightLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/backRightLightStomp.vmd`

export let getBackLeftLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/backLeftLightStomp.vmd`

export let getKeepRightLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_rightLightStomp.vmd`

export let getKeepLeftLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_leftLightStomp.vmd`

export let getHeavyStressingRightLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/heavy_stressing_rightLightStomp.vmd`

export let getHeavyStressingLeftLightStompAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/heavy_stressing_leftLightStomp.vmd`


export let getExcitementAnimationResourcePath = (name) => `./resource_girl/${name}/vmd_scenario/level2_excitement.vmd`