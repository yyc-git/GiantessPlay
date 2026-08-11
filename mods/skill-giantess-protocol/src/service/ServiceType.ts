import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,

	getActionName,
	getAllAnimationNames,
	getForceAnimationName,
	isKeepPoseAnimation,
	getOperateRenderData,
	getAnimationBlendData,
	getAnimationCollisionData,
	getActionData,
	getPhase,
	getSkillStressingFactor,
	getAnimationData,
	getAllSkillDataForPlayer,
	getAllSkillDataForLevelOrBoss,
	getVMDRawData,
	getAnimationFrameCount,
	isSkillState,
	computeForceDirectionDefault,
	computeDamageTypeDefault,
	createFSMStateByChangeAnimationName?,
	handleChangeAnimationName?,

	isActionValid,
	triggerAction,
}