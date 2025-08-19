import { state } from "./type/StateType"
import { getCanvas, getRenderer } from "./Render";
import { getRenderState, getStatsState, setStatsState } from "./state/State";
import GLBench from 'gl-bench/dist/gl-bench';
import RendererStats from 'three-webgl-stats';
import { getRootDom, rotateDom } from"meta3d-utils/src/LandscapeUtils";

export let addStats = (state: state) => {
    let rendererStats = new RendererStats()

    // rendererStats.domElement.querySelectorAll("div").forEach(div => div.style.fontSize ='10px')

    rendererStats.domElement.style.position = 'absolute'
    rendererStats.domElement.style.left = '20%'
    rendererStats.domElement.style.top = '0'
    rendererStats.domElement.style.zIndex = '1000'
    getRootDom().appendChild(rendererStats.domElement)

    getRenderer(state).info.autoReset = false

    state = setStatsState(state, {
        glBench: new GLBench(getRenderState(state).renderer.getContext(), {
            trackGPU: false,
        }),
        rendererStats: rendererStats
    })

    return state
}

// export let update = (state: state) => {
//     getStatsState(state).glBench.update()

//     return Promise.resolve(state)
// }

export let init = () => {
    let glBenchDom = document.querySelector("#gl-bench") as HTMLElement

    if (glBenchDom !== null) {
        getRootDom().appendChild(glBenchDom)
    }
}

export let begin = (state: state) => {
    getStatsState(state).glBench.begin()

}

export let end = (state: state) => {
    getStatsState(state).glBench.end()
}

export let nextFrame = (state: state, now: number) => {
    getStatsState(state).glBench.nextFrame()

    getStatsState(state).rendererStats.update(getRenderer(state));

    getRenderer(state).info.reset()
}


