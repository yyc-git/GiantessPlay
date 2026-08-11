import { Vector3 } from "three";
import { state } from "../../../../../../type/StateType";
import { getPositionY } from "../../city1/Army";
import { getGirlPositionYKey } from "./ArmyManager";
import { getLevelData } from "../../../data/biwu/level3/LevelData";
import { NumberUtils } from "meta3d-jiehuo-abstract";

export let getRewardPropPosition = (state: state, usedGirl) => {
    let { minX, maxX, minZ, maxZ } = getLevelData(state, usedGirl).torsorRange

    let x = NumberUtils.getHalfValue(maxX, minX)
    let z = NumberUtils.getHalfValue(maxZ, minZ)

    return new Vector3(x, getPositionY(state, getGirlPositionYKey(usedGirl), x, z), z)
}

export let getRewardPropOffset = (state: state) => {
    return 10
}

// export let getRewardCoinOffset = (state: state) => {
//     return 10
// }