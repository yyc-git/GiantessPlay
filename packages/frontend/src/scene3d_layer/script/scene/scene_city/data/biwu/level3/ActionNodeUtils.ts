import { Vector3 } from "three"
import { state } from "../../../../../../type/StateType"
import { getBone } from "../../../utils/MMDUtils"
import { getGirl } from "../../../girl/Girl"
import { getBiwuSetting } from "../../../CityScene";
import { difficulty } from "../../../type/StateType";

const _v1 = /*@__PURE__*/ new Vector3();
const _v2 = /*@__PURE__*/ new Vector3();
// const _b1 = /*@__PURE__*/ new Box3();


let _getDownOffset = (yOffset) => {
    // return NumberUtils.getRandomFloat(-2, 2)
    return new Vector3(0, yOffset, 0)
}

export let getDownTarget = (state: state, worldPosition: Vector3, yOffset, bone1Name, bone2Name) => {
    let d = getBone(state, getGirl(state), bone1Name)
    state = d[0]
    let bone1 = d[1]

    d = getBone(state, getGirl(state), bone2Name)
    state = d[0]
    let bone2 = d[1]
    let distance = bone2.getWorldPosition(_v1).clone().sub(bone1.getWorldPosition(_v2))
    let pos = worldPosition.clone().add(distance).add(_getDownOffset(yOffset))

    return {
        x: pos.x,
        y: pos.y,
        z: pos.z,
    }
}

export let getDataFactor = (state: state) => {
    switch (getBiwuSetting(state).difficulty) {
        case difficulty.VeryEasy:
        case difficulty.Easy:
            return 0.8
        case difficulty.Middle:
            return 1
        case difficulty.Hard:
            return 1.1
        case difficulty.VeryHard:
            return 1.2
    }
}