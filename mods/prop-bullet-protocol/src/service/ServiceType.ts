import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { nullable } from "block/src/Type"

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,

	getWeaponValue: any,

	getWeaponName: any,
	getPropData: any,
	// getWeaponImageResourceId: any,
	// getWeaponImageBase64: any,
	getWeaponImagePath: any,
	getWeaponGlbResourceId: any,
	isLockable: any,
	getEmitSoundResourceId: any,

	handleHitGirl: nullable<any>,
	handleHitLittleMan: nullable<any>,
	handleHitArmy: nullable<any>,
	handleHitStatic: nullable<any>,

	emitParticleEmit: any,
	getAllParticlesForCollisionCheck: any,
	getPointBox: any,


	isDisable?: any,
}