import { Object3D } from "three";
import { physicsLevel, state } from "../type/StateType";
import { getRenderSetting } from "../setting/RenderSetting";

export let setShadow = <T extends Object3D>(object: T, castShadow, receiveShadow): T => {
    object.traverse(child => {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
    })

    return object
}

export let decideReceiveShadow = (state: state) => {
    switch (getRenderSetting(state).physics) {
        case physicsLevel.VeryHigh:
            return true
        default:
            return false
    }
}