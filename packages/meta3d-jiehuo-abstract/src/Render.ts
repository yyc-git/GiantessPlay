import type { Scene } from "three"
import { Vector2, Color, SRGBColorSpace, PMREMGenerator, NoToneMapping, LinearToneMapping, ReinhardToneMapping, CineonToneMapping, ACESFilmicToneMapping, CustomToneMapping, ShaderChunk } from "three"
import { WebGLRenderer } from "./three/WebGLRenderer"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// import { EffectComposer } from './three/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { OutlinePass } from './three/OutlinePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { render as renderState, state } from './type/StateType'
// import { getExn } from "./utils/NullableUtils"
import { getCurrentCamera, getCurrentControls } from "./scene/Camera"
import { getHeight, getWidth } from "meta3d-utils/src/View"
import { getCurrentScene, getScene, } from "./scene/Scene"
import { getDeviceState, getIsDebug, getIsNotTestPerf, getIsProduction, getRenderState, readState, setDeviceState, setRenderState, writeState } from "./state/State"
import { isAndroid, isIOS, isMac, isMobile } from "./Device"
import { Console, NullableUtils } from "./Main"
import { addDeferExecFuncDataByTime } from "./Flow"
import { hdLevel } from "setting-default/src/Type"
import { NormalizeColorShader } from "./three/NormalizeColorShader"

// export let getDomElement = (): HTMLCanvasElement => {
//     return document.querySelector('#canvas')
// }

export let createRenderer = (canvas) => {
    // let canvas = getDomElement()

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



    // /*! for set color > 1.0 when add ice single, ... effect 
    // * 
    // */
    // let normalizeColor = new ShaderPass(NormalizeColorShader)
    // composer.addPass(normalizeColor);



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

export let updateDevicePixelRatio = (state, hd) => {
    let { renderer, composer } = getRenderState(state)

    let devicePixelRatio = globalThis.devicePixelRatio
    switch (hd) {
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
}

let _setSizeAndViewport = (state, hd) => {
    let { renderer, composer } = getRenderState(state)

    if (NullableUtils.isNullable(renderer)) {
        return
    }

    renderer = NullableUtils.getExn(renderer)
    composer = NullableUtils.getExn(composer)

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


    updateDevicePixelRatio(state, hd)


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

let _resizeHandler = (event) => {
    let state = readState()

    // _setSizeAndViewport(state)

    let _ = writeState(markIsNeedSetSize(state, true))
}

let _bindResizeEvent = () => {
    window.addEventListener("resize", _resizeHandler)
}

let _unbindResizeEvent = () => {
    window.removeEventListener("resize", _resizeHandler)
}

export let createState = (): renderState => {
    return {
        // isNeedHandleLandscape: false,
        // canvas: null,
        isNeedSetSize: true,
        renderer: null,
        composer: null,
        renderPass: null,
        outlinePass: null,
        gammaCorrection: null,

        webglcontextlostExtension: null,
    }
}

export let getWebglcontextlostExtension = (state: state) => {
    return getRenderState(state).webglcontextlostExtension
}

export let initWhenImportScene = (state: state, canvas) => {
    let renderer = createRenderer(canvas)

    // let camera = getCurrentCamera(state)
    let scene = getScene(state)

    renderer.setPixelRatio(globalThis.devicePixelRatio)

    renderer.outputColorSpace = SRGBColorSpace;


    /*! why tonemapping not work?
    const toneMappingOptions = {
        None: NoToneMapping,
        Linear: LinearToneMapping,
        Reinhard: ReinhardToneMapping,
        Cineon: CineonToneMapping,
        ACESFilmic: ACESFilmicToneMapping,
        Custom: CustomToneMapping,
    };

    renderer.toneMapping = toneMappingOptions.Custom

    ShaderChunk.tonemapping_pars_fragment = ShaderChunk.tonemapping_pars_fragment.replace(

        'vec3 CustomToneMapping( vec3 color ) { return color; }',

        `
                    vec3 CustomToneMapping( vec3 color ) {
                        float lengh = color.r + color.g + color.b;
                        return color/length;
                    }`

    );
    */


    let [composer, renderPass, outlinePass, gammaCorrection] = _createComposer(renderer, null, scene)







    // composer.setPixelRatio(window.devicePixelRatio)

    // state = _setSizeAndViewport(state, renderer, composer)


    _bindResizeEvent()

    // _setSizeAndViewport(renderer, composer)

    state = setRenderState(state, {
        ...getRenderState(state),
        // canvas: renderer.domElement,
        renderer,
        composer,
        renderPass,
        outlinePass,
        gammaCorrection,
        webglcontextlostExtension: NullableUtils.return_(
            renderer.getContext().getExtension('WEBGL_lose_context')
        )
    })

    // renderer.getContext().getExtension('WEBGL_lose_context').loseContext()



    // if (!getIsProduction(state) && isMac()) {
    //     state = setRenderSettingState(state, {
    //         ...getRenderSettingState(state),
    //         hd: hdLevel.Low,
    //         shadow: shadowLevel.Low,
    //         maxUnitCount: maxUnitCount.Small,
    //         renderAccuracy: renderAccuracyLevel.Low,
    //         physics: physicsLevel.VeryLow
    //     })
    // }


    if (getIsProduction(state) || !getIsNotTestPerf(state)) {
        renderer.debug.checkShaderErrors = false
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

export let render = (state: state, hd: hdLevel) => {
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
            _setSizeAndViewport(state, hd)

            return Promise.resolve(specificState)
        }, 0.1)

        state = markIsNeedSetSize(state, false)
    }

    getRenderState(state).composer.render()

    // state = DirectionLightShadow.render(state)

    return Promise.resolve(state)
}

// export let getCanvas = (state: state) => {
//     return getRenderState(state).canvas
// }

export let getRenderer = (state: state) => {
    return getRenderState(state).renderer
}

// export let markIsNeedLandscape = (state: state) => {
//     return setRenderState(state, {
//         ...getRenderState(state),
//         isNeedHandleLandscape: true
//     })
// }


export let disposeRenderer = (renderer: WebGLRenderer) => {
    renderer.dispose()
}

export let dispose = (state: state) => {
    state = markIsNeedSetSize(state, true)

    let { renderer, composer, renderPass, outlinePass, gammaCorrection } = getRenderState(state)

    NullableUtils.forEach(renderer => disposeRenderer(renderer), renderer)
    NullableUtils.forEach(composer => composer.dispose(), composer)
    NullableUtils.forEach(renderPass => renderPass.dispose(), renderPass)
    NullableUtils.forEach(outlinePass => outlinePass.dispose(), outlinePass)
    NullableUtils.forEach(gammaCorrection => gammaCorrection.dispose(), gammaCorrection)

    _unbindResizeEvent()

    // state = setRenderState(state, createState())
    state = setRenderState(state, {
        ...createState(),
        webglcontextlostExtension: getRenderState(state).webglcontextlostExtension
    })

    return state
}

