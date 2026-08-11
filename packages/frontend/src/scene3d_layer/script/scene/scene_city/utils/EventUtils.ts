import { StaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/StaticLODContainer"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../type/StateType"
import { computeHeight } from "../girl/Utils"
import { getDestroyedRate, isCanSwitchCharacterType } from "../CityScene"
import { getRealTotalCoin, getTotalCoin, getTotalGem } from "../reward/RewardGenerator"
import { hasGirl, isUseGirl } from "../girl/Girl"
import { usedGirlEnum } from "../type/StateType"

export let getDestroyedEventName = () => "destroyed"

export let getDestroyingEventName = () => "destroying"

export let getGirlDestroyingEventName = () => "girl_destroying"

export let buildDestroyedEventData = (fromName, toName) => {
	return {
		fromName,
		toName
	}
}

export let buildDestroyintEventData = buildDestroyedEventData


export let buildLevelStatusUpdateEventData = (state: state) => {
	let usedGirl = usedGirlEnum.PlayerGirl

	return {
		height: isUseGirl(state, usedGirl) ? computeHeight(state, usedGirl) : 0,
		// destroyedRate: getDestroyedRate(state)
		gem: getTotalGem(state),
		coin: getRealTotalCoin(state)
	}
}

export let buildCharacterStatusUpdateEventData = (state: state) => {
	return {
		isCanSwitchCharacterType: isCanSwitchCharacterType(state)
	}
}