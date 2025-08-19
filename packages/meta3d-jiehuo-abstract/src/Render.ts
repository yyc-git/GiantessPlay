import type { Scene } from "three"
import { Vector2, Color, SRGBColorSpace, PMREMGenerator } from "three"
import { WebGLRenderer } from "./three/WebGLRenderer"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// import { EffectComposer } from './three/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { OutlinePass } from './three/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { crowdSize, hdLevel, physicsLevel, renderAccuracyLevel, render as renderState, shadowLevel, state } from './type/StateType'
// import { getExn } from "./utils/NullableUtils"
import { getCurrentCamera, getCurrentControls } from "./scene/Camera"
import { getHeight, getWidth } from "meta3d-utils/src/View"
import { getCurrentScene, getScene, } from "./scene/Scene"
import { getDeviceState, getIsDebug, getIsProduction, getRenderSettingState, getRenderState, setDeviceState, setRenderSettingState, setRenderState, writeState } from "./state/State"
import { isAndroid, isIOS, isMac, isMobile } from "./Device"
import { Console, NullableUtils } from "./Main"
import { addDeferExecFuncDataByTime } from "./Flow"

export let createRenderer = () => {
    let canvas = document.querySelector('#canvas')

    if (!isAndroid()) {
        return new WebGLRenderer({ antialias: true, canvas: canvas })
    }

    return new WebGLRenderer({ antialias: false, canvas: canvas })
}

let _createComposer = (renderer, camera, scene): [EffectComposer, RenderPass, OutlinePass, ShaderPass] => {
    let composer = new EffectComposer(renderer)

    if (!isAndroid()) {
        if (renderer.getContext() instanceof WebGL2RenderingContext) {
            composer.renderTarget1.samples = 8;
            composer.renderTarget2.samples = 8;
        }
        else {
            Console.warn("not open msaa");
        }
    }


    let renderPass = new RenderPass(scene, camera)

    composer.renderToScreen = true

    // renderPass.clearColor = new Color(0x9C9C9C)
    renderPass.clearAlpha = 1.0

    composer.addPass(renderPass)



    let outlinePass = new OutlinePass(new Vector2(getWidth(), getHeight()), scene, camera)

    composer.addPass(outlinePass)



    if (isAndroid()) {
        let fxaaPass = new ShaderPass(FXAAShader);
        let pixelRatio = renderer.getPixelRatio();
        if (pixelRatio != window.devicePixelRatio) {
            throw new Error("error")
        }

        fxaaPass.material.uniforms['resolution'].value.x = 1 / (getWidth() * pixelRatio);
        fxaaPass.material.uniforms['resolution'].value.y = 1 / (getHeight() * pixelRatio);

        composer.addPass(fxaaPass);
    }






    /*! because set renderTarget->colorSpace not work, so need use gamma correction here
*/
    let gammaCorrection = new ShaderPass(GammaCorrectionShader)
    gammaCorrection.needsSwap = false
    composer.addPass(gammaCorrection)


    /*! clear color after gamma is increased! should restore it correctly */
    // renderPass.clearColor = new Color(0x595959)


    renderPass.clearColor = new Color(0x000000)



    return [composer, renderPass, outlinePass, gammaCorrection]
}

let _setSizeAndViewport = (state, renderer, composer) => {
    // console.log("_setSizeAndViewport")
    // if (isNeedHandleLandscape) {
    //     renderer.setSize(getHeight(), getWidth())

    //     composer.setSize(getHeight(), getWidth())

    //     Console.warn(getWidth(), getHeight())
    //     // renderer.setSize(getWidth(), getHeight())

    //     // composer.setSize(getWidth(), getHeight())

    //     // scene.rotateZ(Math.PI / 2)
    // }
    // else {
    //     renderer.setSize(getWidth(), getHeight())

    //     composer.setSize(getWidth(), getHeight())
    // }

    renderer.setSize(getWidth(), getHeight())

    composer.setSize(getWidth(), getHeight())


    let devicePixelRatio = globalThis.devicePixelRatio
    switch (getRenderSettingState(state).hd) {
        case hdLevel.High:
            break
        case hdLevel.Middle:
            devicePixelRatio = devicePixelRatio / 2 > 1 ? devicePixelRatio / 2 : (1 + (devicePixelRatio - 1) / 2)
            break
        case hdLevel.Low:
            devicePixelRatio = 1
            break
    }

    renderer.setPixelRatio(devicePixelRatio)
    composer.setPixelRatio(devicePixelRatio)


    NullableUtils.forEach(currentControls => {
        if (!!currentControls.handleResize) {
            currentControls.handleResize()
        }
    }, getCurrentControls(state))
}


// export let setSizeAndViewport = (state) => {
//     _setSizeAndViewport(getRenderer(state), getRenderState(state).composer)
// }

// let _getIsNeedLandscape = (state: state) => {
//     return getRenderState(state).isNeedHandleLandscape
// }

let _bindResizeEvent = (state, renderer, composer) => {
    window.addEventListener("resize", _ => {
        // camera.aspect = getWidth() / getHeight()
        // camera.updateProjectionMatrix()

        _setSizeAndViewport(state, renderer, composer)
    })
}

export let createState = (): renderState => {
    return {
        // isNeedHandleLandscape: false,
        canvas: null,
        isNeedSetSize: true,
        renderer: null,
        composer: null,
        renderPass: null,
        outlinePass: null,
        gammaCorrection: null
    }
}

export let init = (state: state, renderer) => {
    // let camera = getCurrentCamera(state)
    let scene = getScene(state)

    renderer.setPixelRatio(globalThis.devicePixelRatio)

    renderer.outputColorSpace = SRGBColorSpace;


    let [composer, renderPass, outlinePass, gammaCorrection] = _createComposer(renderer, null, scene)







    // composer.setPixelRatio(window.devicePixelRatio)

    // state = _setSizeAndViewport(state, renderer, composer)


    _bindResizeEvent(state, renderer, composer)

    // _setSizeAndViewport(renderer, composer)

    state = setRenderState(state, {
        ...getRenderState(state),
        canvas: renderer.domElement,
        renderer,
        composer,
        renderPass,
        outlinePass,
        gammaCorrection
    })




    if (!getIsProduction(state) && isMac()) {
        state = setRenderSettingState(state, {
            ...getRenderSettingState(state),
            hd: hdLevel.Low,
            shadow: shadowLevel.Low,
            crowdSize: crowdSize.Small,
            renderAccuracy: renderAccuracyLevel.Low,
            physics: physicsLevel.VeryLow
        })
    }


    return Promise.resolve(state)
}

export let update = (state: state) => {
    let { renderPass, outlinePass } = getRenderState(state)

    let scene = getCurrentScene(state) as Scene
    let camera = getCurrentCamera(state)

    renderPass.scene = scene
    renderPass.camera = camera

    outlinePass.renderScene = scene
    outlinePass.renderCamera = camera


    // console.log(
    //     "update render:",
    //     getWidth(), getHeight()
    // )
    if (isMobile() && getWidth() < getHeight() * 1.5) {
        // if (isMobile() && getWidth() <= getHeight()) {
        state = markIsNeedSetSize(state, true)
    }


    return Promise.resolve(state)
}

export let markIsNeedSetSize = (state, isNeedSetSize) => {
    return setRenderState(state, {
        ...getRenderState(state),
        isNeedSetSize: isNeedSetSize
    })
}

export let render = (state: state) => {
    let { renderer, composer, isNeedSetSize } = getRenderState(state)
    // let deviceState = getDeviceState(state)

    // if (width != deviceState.width || height != deviceState.height) {
    //     Console.log(
    //         width, height, deviceState.width, deviceState.height
    //     );

    //     state = _setSizeAndViewport(state, renderer, composer)

    //     state = _updateSize(state)
    // }
    // state = _setSizeAndViewport(state, renderer, composer)

    if (isNeedSetSize) {
        // setTimeout(() => {
        //     _setSizeAndViewport(state, renderer, composer)
        // }, 100)
        state = addDeferExecFuncDataByTime(state, (specificState) => {
            _setSizeAndViewport(state, renderer, composer)

            return Promise.resolve(specificState)
        }, 0.1)

        state = markIsNeedSetSize(state, false)
    }

    getRenderState(state).composer.render()

    // state = DirectionLightShadow.render(state)

    return Promise.resolve(state)
}

export let getCanvas = (state: state) => {
    return getRenderState(state).canvas
}

export let getRenderer = (state: state) => {
    return getRenderState(state).renderer
}

// export let markIsNeedLandscape = (state: state) => {
//     return setRenderState(state, {
//         ...getRenderState(state),
//         isNeedHandleLandscape: true
//     })
// }

export let dispose = (state: state) => {
    state = markIsNeedSetSize(state, true)

    return state
}