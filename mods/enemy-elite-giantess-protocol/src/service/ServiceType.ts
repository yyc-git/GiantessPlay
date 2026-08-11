import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,


	getRewardData: any,

	damage: any,
	generateEliteGiantesses: any,
	isEliteGiantess: any,
	getValue: any,
	getNamePrefixEliteGiantess: any,
	getPickedTransform: any,
	getUBControlledTransform: any,
	getPutToBreastTransform: any,
	getPutToShoeTransform: any,
	handlePickup: any,
	updateTransform: any,
	handlePickdown: any,
	handleFall: any,
	handleRepel: any,
	handleUBControl,
	handlePutToBreast,
	handlePutToShoe,
	updateUBControlledTransform,
	updatePutToBreastTransform,
	updatePutToShoeTransform,
	getLocalTransform: any,
	getBoxForPick: any,
	getModelQueueIndex: any,
	getHp: any,
	getHpRatio: any,
	getFullHp: any,
	updateHp: any,
	getSnapshot: any,

	// getStateMachine: any,
	// setStateMachine: any,
	createInitialState: any,
}