import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { blockName } from "block/src/BlockManagerType";

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,

	getScene: () => string,
	getSceneData: (api: api, state: state) => [string, string],
	getAllBlockNames: (api: api) => Array<blockName>,

	// handleInit: any,
	handleUpdate: any,
	handleDispose: any,
	buildScene: any,
	handleInitWhenImportScene: any,
	handleBeforeLoadResource: any,
	getLoadData: any,

	getDifficultyData: any,
	getNextLevelData: any,
	updateArmyValue: any,
	updateEliteGiantessValue: any,


	updateAttackTarget: any,

	findGameEventBlockName: any,

}