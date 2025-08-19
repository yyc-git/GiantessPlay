import { StaticLODContainer } from "meta3d-jiehuo-abstract/src/lod/lod2/StaticLODContainer"
import { InstanceSourceLOD } from "meta3d-jiehuo-abstract/src/lod/InstanceSourceLOD"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../type/StateType"
import { computeHeight } from "../girl/Utils"
import { getDestroyedRate } from "../CityScene"

export let getDestroyedEventName = () => "destroyed"

export let getGirlDestroyingEventName = () => "girl_destroying"

export let buildDestroyedEventData = (fromName, toName) => {
	return {
		fromName,
		toName
	}
}

export let buildLevelStatusUpdateEventData = (state: state) => {
	return {
		height: computeHeight(state),
		destroyedRate: getDestroyedRate(state)
	}
}