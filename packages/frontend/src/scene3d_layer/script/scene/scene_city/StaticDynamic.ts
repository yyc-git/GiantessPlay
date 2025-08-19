import { List } from "immutable"
import { state } from "../../../type/StateType"
import { getState, setState } from "./CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { damageData } from "./type/StateType"

export let getDamageFuncs = (state: state) => {
	return getState(state).damageData.funcs
}

export let registerDamageData = (state: state, data) => {
	return setState(state, {
		...getState(state),
		damageData: {
			...getState(state).damageData,
			// isSelfFuncs: getState(state).damageData.isSelfFuncs.push(isSelfFunc),
			// damageFuncs: getState(state).damageData.damageFuncs.push(damageFunc),
			funcs: getState(state).damageData.funcs.push(data),
			// damageFuncs: getState(state).damageData.damageFuncs.push(damageFunc),
		}
	})
}

export let getDamageGiantessFuncExn = (state: state) => {
	return NullableUtils.getExn(getState(state).damageData.damageGiantessFunc)
}

export let registerDamageGiantessFunc = (state: state, func) => {
	return setState(state, {
		...getState(state),
		damageData: {
			...getState(state).damageData,
			damageGiantessFunc: NullableUtils.return_(func)
		}
	})
}

export let createState = (): damageData => {
	return {
		funcs: List(),
		damageGiantessFunc: NullableUtils.getEmpty()
	}
}

export let dispose = (state: state) => {
	return setState(state, {
		...getState(state),
		damageData: createState(),
	})
}
