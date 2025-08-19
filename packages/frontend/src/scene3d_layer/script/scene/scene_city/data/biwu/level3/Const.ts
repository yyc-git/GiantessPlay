import { getName as getSceneName } from "../../../CityScene"
import { getName } from "../../../girl/Girl"
import { animationName } from "./DataType"

export let getAnimationFrameCountMap = () => {
	return {
		[animationName.KeepLie]: 120,
		[animationName.BackRightHand]: 30,
		[animationName.BackTwoHands]: 30,
		[animationName.BackLeftHandRightHand]: 30,
		[animationName.HangRightHand]: 30,
		[animationName.HangTwoHands]: 30,
		[animationName.HangLeftHandRightHand]: 30,
		[animationName.RightHandDefaultToOneFinger]: 30,
		[animationName.RightHandDefaultToBeat]: 30,
		[animationName.RightHandDefaultToAdd]: 30,
		[animationName.TwoHandsDefaultToOneFinger]: 30,
		[animationName.TwoHandsDefaultToBeat]: 30,
		[animationName.RightHandOneFingerToDefault]: 30,
		[animationName.RightHandBeatToDefault]: 30,
		[animationName.RightHandAddToDefault]: 30,
		[animationName.TwoHandsOneFingerToDefault]: 30,
		[animationName.TwoHandsBeatToDefault]: 30,
		[animationName.KeepRightHandDefault]: 120,
		[animationName.KeepTwoHandsDefault]: 120,
		[animationName.KeepRightHandOneFinger]: 120,
		[animationName.KeepTwoHandsOneFinger]: 120,
		[animationName.KeepLeftHandRightHand]: 120,


		[animationName.HeavyStressingLie]: 70,
	} as Record<animationName, number>
}

export let getAnimationFrameCountWithoutState = (animationName_) => {
	return getAnimationFrameCountMap()[animationName_]
}

export let getKeepLieAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_lie.vmd`

export let getHangRightHandAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/hangRightHand_default.vmd`

export let getHangTwoHandsAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/hangTwoHands_default.vmd`

export let getHangLeftHandRightHandAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/hangLeftHandRightHand.vmd`

export let getBackRightHandAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/backRightHand.vmd`

export let getBackTwoHandsAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/backTwoHands.vmd`

export let getBackLeftHandRightHandAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/backLeftHandRightHand.vmd`

export let getRightHandDefaultToOneFingerAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/rightHand_default_to_oneFinger.vmd`

export let getRightHandDefaultToBeatAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/rightHand_default_to_beat.vmd`

export let getRightHandDefaultToAddAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/rightHand_default_to_add.vmd`

export let getTwoHandsDefaultToOneFingerAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/twoHands_default_to_oneFinger.vmd`

export let getTwoHandsDefaultToBeatAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/twoHands_default_to_beat.vmd`

export let getRightHandOneFingerToDefaultAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/rightHand_oneFinger_to_default.vmd`

export let getRightHandBeatToDefaultAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/rightHand_beat_to_default.vmd`

export let getRightHandAddToDefaultAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/rightHand_add_to_default.vmd`

export let getTwoHandsOneFingerToDefaultAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/twoHands_oneFinger_to_default.vmd`

export let getTwoHandsBeatToDefaultAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/twoHands_beat_to_default.vmd`

export let getKeepRightHandDefaultAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_rightHand_default.vmd`

export let getKeepTwoHandsDefaultAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_twoHands_default.vmd`

export let getKeepRightHandOneFingerAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_rightHand_oneFinger.vmd`

export let getKeepTwoHandsOneFingerAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_twoHands_oneFinger.vmd`

export let getKeepTwoHandsBeatAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_twoHands_beat.vmd`

export let getKeepRightHandBeatAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_rightHand_beat.vmd`

export let getKeepRightHandAddAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_rightHand_add.vmd`

export let getKeepLeftHandRigthHandAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/keep_leftHandRightHand.vmd`


export let getHeavyStressingLieAnimationResourcePath = (name) => `./resource_girl/${name}/vmd/heavy_stressing_lie.vmd`





// export let getDownArrowResourcePath = (name) => `./resource/${name}/down_arrow.png`
export let getDownArrowResourcePath = () => `./resource/ui/in_game/down_arrow.png`

export let getDownArrowResourceId = () => `${getSceneName()}_${getName()}_${getDownArrowResourcePath()}`

export let getHeavyStressingLieBeginMaxFrameIndex = () => 10

export let getHeavyStressingLieEndMaxFrameIndex = () => 60