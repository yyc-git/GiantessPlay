import { PerspectiveCamera } from "three"
import { FirstPersonControls } from "../three/FirstPersonControls"
import { state } from "../type/StateType"
import { NullableUtils } from "../Main"
1
export let computeTransformForCamera = (state: state, controls: FirstPersonControls): number => {
    let controlRotationAngle = controls.getAzimuthalAngle()

    return controlRotationAngle
}

export let create = (domElement) => {
    return new FirstPersonControls(new PerspectiveCamera(), domElement)
}