import { Object3D } from "three";
import { physicsLevel } from "setting-default/src/Type"
// import { getRenderSetting } from "../setting/RenderSetting";

export let setShadow = <T extends Object3D>(object: T, castShadow, receiveShadow): T => {
    object.traverse(child => {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
    })

    return object
}

export let decideReceiveShadow = (physics: physicsLevel) => {
    switch (physics) {
        case physicsLevel.VeryHigh:
            return true
        default:
            return false
    }
}