import { Vector2, Vector3 } from "three";
import { state } from "../../../../../type/StateType";
import { getGirlBox, getGirlPosition } from "../../girl/Utils";
import { getPosition } from "../../little_man/Transform";
import { PathFind } from "meta3d-jiehuo-abstract";
import { getGrid, getGridForJudgeWalkable } from "../city1/PathFind";
import { NumberUtils } from "meta3d-jiehuo-abstract";
import { attackTarget } from "../../type/StateType";

const _v1 = new Vector3();
const _v1_1 = new Vector2();

export let getRewardPropPosition = (state: state, usedGirl) => {
    // let step = NumberUtils.clamp(getGirlBox(state, usedGirl).getSize(_v1).x, 5, 10)
    let step = NumberUtils.clamp(getGirlBox(state, usedGirl).getSize(_v1).x, 5, 50)
    let startPosition = getGirlPosition(state, usedGirl)
    let endPosition = getPosition(state)
    let dir = endPosition.clone().sub(startPosition).normalize()
    let length = endPosition.distanceTo(startPosition)

    let position = startPosition.clone()
    let moveLength = 0

    do {
        position.add(dir.clone().multiplyScalar(step))
        moveLength += step
    }
    while (
        moveLength < (length - step)
        && !PathFind.isWalkable(
            _v1_1.set(position.x, position.z),
            // getGrid(state, attackTarget.LittleMan, position),
            getGridForJudgeWalkable(state)
        )
    )

    return position
}