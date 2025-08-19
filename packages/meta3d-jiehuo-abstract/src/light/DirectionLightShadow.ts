import { DirectionalLight, PCFShadowMap, WebGLRenderer, CameraHelper, Object3D, PCFSoftShadowMap, VSMShadowMap } from "three";
import { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer";
import { shadowLevel, state } from "../type/StateType";
import { getLightState, setLightState } from "../state/State";
import { getExn, isNullable, return_ } from "../utils/NullableUtils";
import { getRenderer } from "../Render";
import { getRenderSetting } from "../setting/RenderSetting";

// export let enableShadow = (state: state, light: DirectionalLight, renderer: WebGLRenderer, isDebug): [state, DirectionalLight, WebGLRenderer] => {
export let enableShadow = (state: state, scene, light: DirectionalLight, renderer: WebGLRenderer, isDebug): [Object3D, DirectionalLight, WebGLRenderer] => {
    light.castShadow = true
    // let size = 600
    // let size = 100
    // let size = 350
    // light.shadow.camera.top = size;
    // light.shadow.camera.bottom = -size;
    // light.shadow.camera.left = - size;
    // light.shadow.camera.right = size;
    // light.shadow.camera.far = 500
    // light.shadow.camera.near = 0.5;

    // light.shadow.camera.position.copy(light.position)

    /*! x axis
    * 
    */
    // light.shadow.camera.top = 500
    light.shadow.camera.top = 200
    // light.shadow.camera.bottom = -500
    light.shadow.camera.bottom = -50

    /*! z axis
    * 
    */
    light.shadow.camera.left = -150
    light.shadow.camera.right = 150

    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500

    light.shadow.bias = -0.004
    // light.shadow.bias = -0.01

    let SHADOW_MAP_WIDTH, SHADOW_MAP_HEIGHT
    switch (getRenderSetting(state).shadow) {
        case shadowLevel.Low:
            SHADOW_MAP_WIDTH = 512
            SHADOW_MAP_HEIGHT = 512
            break
        case shadowLevel.Middle:
            SHADOW_MAP_WIDTH = 1024
            SHADOW_MAP_HEIGHT = 1024
            break
        case shadowLevel.High:
            SHADOW_MAP_WIDTH = 4096
            SHADOW_MAP_HEIGHT = 4096
            break
    }

    light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    // light.shadow.autoUpdate = false
    light.shadow.autoUpdate = true
    light.shadow.needsUpdate = true

    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = PCFShadowMap;
    renderer.shadowMap.type = PCFSoftShadowMap;
    // renderer.shadowMap.type = VSMShadowMap;

    if (isDebug) {
        // let dirLightShadowMapViewer = new ShadowMapViewer(light)

        // state = setLightState(state, {
        //     ...getLightState(state),
        //     directionLightShadowMapViewer: return_(dirLightShadowMapViewer)
        // })

        // TODO need fix
        scene.add(new CameraHelper(light.shadow.camera));
    }

    return [scene, light, renderer]
}

export let updateShadow = (light: DirectionalLight) => {
    light.shadow.needsUpdate = true

    return light
}

// export let updateForWindowResize = (state: state) => {
//     // if (isNullable(getLightState(state).directionLightShadowMapViewer)) {
//     //     return state
//     // }

//     // getExn(getLightState(state).directionLightShadowMapViewer).update()
//     // getExn(getLightState(state).directionLightShadowMapViewer).updateForWindowResize()

//     return state
// }

// export let render = (state: state) => {
//     // if (isNullable(getLightState(state).directionLightShadowMapViewer)) {
//     //     return state
//     // }

//     // getExn(getLightState(state).directionLightShadowMapViewer).render(getRenderer(state))

//     return state
// }