import { state } from "frontend/src/scene3d_layer/type/StateType";
import { particleType } from "../state/StateType";
import { api } from "type-api/src/Type";

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,

	getImageId?: () => string,
	getImagePath: () => string,
	getParticleType: () => particleType,

	// emit: <param>(state: state, param: param, needCollisionCheckLoopCount?: number) => state,
	// getAllParticlesForCollisionCheck: (state: state) => number,

	getColCount?: () => number,
	getRowCount?: () => number,
}