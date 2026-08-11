import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType"

export enum coin {
	// VeryLow = 2000,
	// Low = 3000,
	// Middle = 4000,
	// High = 5000,
	// VeryHigh = 6000,
	VeryLow = 1000,
	Low = 2000,
	Middle = 3000,
	High = 4000,
	VeryHigh = 5000,
}

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,

	getName: any,
	getPropData: any,
	isDisable: any,
	use: any,

	getRewardData?: any,
	getCoin?: any,
}