import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,

	getActionName,
	getAnimationName,
	getOperateData,
	getAnimationBlendData,
	getAllAnimationNames,
	getAllAnimationNamesExceptDeathAnimations,
	getAnimationCollisionData,
	getSkillData,
	getLoadData,
	getAnimationFrameCountMap,

	isActionValid,
	triggerAction,
}