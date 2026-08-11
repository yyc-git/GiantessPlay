import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
// import { renderSetting, settingType, settingValue } from "../state/StateType"

export enum uiType {
	Selector,
	Switch
}

export type uiData = Array<{
	type: uiType,
	name: string,
	key: string,

	options?: Array<{
		value: string,
		label: string
	}>,

	uncheckedText?: string,
	checkedText?: string

}>

export type settingType = string

export type service = {
	init: (api: api, state: state) => Promise<state>,
	dispose: (api: api, state: state) => Promise<state>,

	// getDefaultRenderSetting: (api: api) => renderSetting,
	// getRenderSetting: (api: api, state: state) => renderSetting,
	// setRenderSettingKey: (api: api, state: state, key, value) => state,

	getDefaultSetting: <settingValue>(api: api) => settingValue,
	getSetting: <settingValue> (api: api, state: state) => settingValue,
	setSettingKey: (api: api, state: state, key, value) => state,
	setSetting: any,

	// getCameraRotateSpeedRatio: (api: api, state: state) => number,


	getUIData: (api: api) => uiData,
	getSettingType: (api: api) => settingType,
}