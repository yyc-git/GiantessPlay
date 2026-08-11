import { name } from "meta3d-jiehuo-abstract/src/type/StateType";
import { state } from "../../../../type/StateType";
import { isCharacter } from "./CollisionUtils";
import { Box3 } from "three";
import { getHeight } from "./DamageUtils";
import { getBoxMaxSize, getBoxVolumn } from "./Box3Utils";

type kg = number

export let computeMass = (state: state, name: name, box: Box3): kg => {
    if (isCharacter(state, name)) {
        return getBoxMaxSize(box) * 50
    }

    // return getHeight(box) * 500
    return getBoxMaxSize(box) * 200
}