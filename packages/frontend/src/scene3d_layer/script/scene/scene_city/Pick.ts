import { Box3, Box3Helper } from "three";
import { state } from "../../../type/StateType";
import { pick } from "./type/StateType";
import { getAbstractState } from "../../../state/State";
// import { getState, setState } from "../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { getCurrentScene } from "meta3d-jiehuo-abstract/src/scene/Scene";
import { getState, setState } from "./CityScene";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { addBox3Helper } from "./utils/ConfigUtils";
import { removeAndDispose } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils";

let _getState = (state: state) => {
	return getState(state).pick
}

let _setState = (state: state, pickState: pick) => {
	return setState(state, {
		...getState(state),
		pick: NullableUtils.return_(pickState)
	})
}

export let setBoxCube = (state: state, box3: nullable<Box3>) => {
	// let scene = getCurrentScene(getAbstractState(state))

	// if (!NullableUtils.isNullable(_getState(state).boxCube)) {
	// 	removeAndDispose(scene, NullableUtils.getExn(_getState(state).boxCube))
	// }

	// if (NullableUtils.isNullable(box3)) {
	// 	return _setState(state, {
	// 		..._getState(state),
	// 		boxCube: NullableUtils.getEmpty()
	// 	})
	// }

	// box3 = NullableUtils.getExn(box3)

	// let newBoxCube = addBox3Helper(getAbstractState(state), scene, box3, 0xffff00)

	// return _setState(state, {
	// 	..._getState(state),
	// 	boxCube: NullableUtils.return_(newBoxCube)
	// })
	throw new Error("err")
}

export let createState = (): pick => {
	return { boxCube: null }
}