import { articluatedAnimation, pick, render, camera, scene, state, event, stats, loader, skinAnimation, device, instance, light, lod, config, flow, collision, mmd, particle, sound, label, renderSetting, version, gpuSkin, pathFind } from "../type/StateType"
import { Map } from "immutable"
import { createState as createArticluatedAnimationState } from "../animation/ArticluatedAnimation"
import { createState as createSkinAnimationState } from "../animation/SkinAnimation"
import { createState as createEventState } from "../Event"
import { createState as createDeviceState } from "../Device"
import { createState as createSceneState } from "../scene/Scene"
import { createState as createInstanceState } from "../instance/Instance"
import { createState as createLightState } from "../light/Light"
import { createState as createLODState } from "../lod/LOD"
import { createState as createPickState } from "../Pick"
import { createState as createFlowState } from "../Flow"
import { createState as createCollisionState } from "../collision/Collision"
import { createState as createMMDState } from "../mmd/MMD"
import { createState as createParticleState } from "../particle/ParticleManager"
import { createState as createRenderState } from "../Render"
import { createState as createSoundState } from "../audio/SoundManager"
import { createState as createLabelState } from "../ui_2d/LabelManager"
import { createState as createRenderSettingState } from "../setting/RenderSetting"
import { createState as createVersionState } from "../version/Version"
import { createState as createGPUSkinState } from "../gpu_skin/GPUSkin"
import { createState as createPathFindState } from "../ai/PathFind"
import { getExn, return_ } from "../utils/NullableUtils"
import { NullableUtils } from "../Main"

export let getIsDebug = (state: state) => {
    return getConfigState(state).isDebug
}

export let setIsDebug = (state: state, isDebug) => {
    return setConfigState(state, {
        ...getConfigState(state),
        isDebug: isDebug
    })
}

export let getIsProduction = (state: state) => {
    return getConfigState(state).isProduction
}

export let getIsNotTestPerf = (state: state) => {
    return getConfigState(state).isNotTestPerf
}

export let createState = (): state => {
    return {
        config: {
            isDebug: false,
            isProduction: true,
            isNotTestPerf: true,
            isSkipScenario: false,
            isSkipGameEvent: false,
        },
        renderSetting: createRenderSettingState(),
        device: createDeviceState(),
        render: createRenderState(),
        scene: createSceneState(),
        pick: createPickState(),
        articluatedAnimation: createArticluatedAnimationState(),
        skinAnimation: createSkinAnimationState(),
        event: createEventState(),
        stats: null,
        loader: {
            resourceData: Map(),
            dracoLoader: NullableUtils.getEmpty(),
            ktx2Loader: NullableUtils.getEmpty()
        },
        instance: createInstanceState(),
        lod: createLODState(),
        light: createLightState(),
        flow: createFlowState(),

        collision: createCollisionState(),
        mmd: createMMDState(),
        particle: createParticleState(),

        sound: createSoundState(),
        label: createLabelState(),

        version: createVersionState(),
        gpuSkin: createGPUSkinState(),

        pathFind: createPathFindState(),
    }
}

export let getDeviceState = (state: state) => {
    return getExn(state.device)
}

export let setDeviceState = (state: state, deviceState: device) => {
    return {
        ...state,
        device: return_(deviceState)
    }
}

export let getRenderState = (state: state) => {
    return getExn(state.render)
}

export let setRenderState = (state: state, renderState: render) => {
    return {
        ...state,
        render: return_(renderState)
    }
}

// export let getCameraState = (state: state) => {
//     return getExn(state.camera)
// }

// export let setCameraState = (state: state, cameraState: camera) => {
//     return {
//         ...state,
//         camera: return_(cameraState)
//     }
// }

export let getSceneState = (state: state) => {
    return state.scene
}

export let setSceneState = (state: state, sceneState: scene) => {
    return {
        ...state,
        scene: sceneState
    }
}

export let getPickState = (state: state) => {
    return getExn(state.pick)
}

export let setPickState = (state: state, pickState: pick) => {
    return {
        ...state,
        pick: return_(pickState)
    }
}

export let getArticluatedAnimationState = (state: state) => {
    return state.articluatedAnimation
}

export let setArticluatedAnimationState = (state: state, articluatedAnimationState: articluatedAnimation) => {
    return {
        ...state,
        articluatedAnimation: articluatedAnimationState
    }
}

export let getSkinAnimationState = (state: state) => {
    return state.skinAnimation
}

export let setSkinAnimationState = (state: state, skinAnimationState: skinAnimation) => {
    return {
        ...state,
        skinAnimation: skinAnimationState
    }
}

export let getEventState = (state: state) => {
    return state.event
}

export let setEventState = (state: state, eventState: event) => {
    return {
        ...state,
        event: eventState
    }
}

export let getStatsState = (state: state) => {
    return getExn(state.stats)
}

export let setStatsState = (state: state, statsState: stats) => {
    return {
        ...state,
        stats: return_(statsState)
    }
}

// export let getInstanceState = (state: state) => {
//     return getExn(state.instance)
// }

// export let setInstanceState = (state: state, instantState: instance) => {
//     return {
//         ...state,
//         instance: return_(instantState)
//     }
// }


export let getLoaderState = (state: state) => {
    return state.loader
}

export let setLoaderState = (state: state, loaderState: loader) => {
    return {
        ...state,
        loader: loaderState
    }
}

export let getInstanceState = (state: state) => {
    return state.instance
}

export let setInstanceState = (state: state, instanceState: instance) => {
    return {
        ...state,
        instance: instanceState
    }
}

export let getLightState = (state: state) => {
    return state.light
}

export let setLightState = (state: state, lightState: light) => {
    return {
        ...state,
        light: lightState
    }
}

export let getLODState = (state: state) => {
    return state.lod
}

export let setLODState = (state: state, lodState: lod) => {
    return {
        ...state,
        lod: lodState
    }
}

export let getConfigState = (state: state) => {
    return state.config
}

export let setConfigState = (state: state, configState: config) => {
    return {
        ...state,
        config: configState
    }
}

export let getFlowState = (state: state) => {
    return state.flow
}

export let setFlowState = (state: state, flowState: flow) => {
    return {
        ...state,
        flow: flowState
    }
}

export let getCollisionState = (state: state) => {
    return state.collision
}

export let setCollisionState = (state: state, collisionState: collision) => {
    return {
        ...state,
        collision: collisionState
    }
}

export let getMMDState = (state: state) => {
    return state.mmd
}

export let setMMDState = (state: state, mmdState: mmd) => {
    return {
        ...state,
        mmd: mmdState
    }
}

export let getParticleState = (state: state) => {
    return getExn(state.particle)
}

export let setParticleState = (state: state, particleState: particle) => {
    return {
        ...state,
        particle: return_(particleState)
    }
}


export let getSoundState = (state: state) => {
    return getExn(state.sound)
}

export let setSoundState = (state: state, soundState: sound) => {
    return {
        ...state,
        sound: return_(soundState)
    }
}

export let getLabelState = (state: state) => {
    return getExn(state.label)
}

export let setLabelState = (state: state, labelState: label) => {
    return {
        ...state,
        label: return_(labelState)
    }
}

export let getRenderSettingState = (state: state) => {
    return getExn(state.renderSetting)
}

export let setRenderSettingState = (state: state, renderSettingState: renderSetting) => {
    return {
        ...state,
        renderSetting: return_(renderSettingState)
    }
}

export let getVersionState = (state: state) => {
    return getExn(state.version)
}

export let setVersionState = (state: state, versionState: version) => {
    return {
        ...state,
        version: return_(versionState)
    }
}

export let getGPUSkinState = (state: state) => {
    return getExn(state.gpuSkin)
}

export let setGPUSkinState = (state: state, gpuSkinState: gpuSkin) => {
    return {
        ...state,
        gpuSkin: return_(gpuSkinState)
    }
}

export let getPathFindState = (state: state) => {
    return getExn(state.pathFind)
}

export let setPathFindState = (state: state, pathFindState: pathFind) => {
    return {
        ...state,
        pathFind: return_(pathFindState)
    }
}

export let readState = () => {
    return NullableUtils.getExn(globalThis["meta3d_state"].abstract) as state
}

export let writeState = (state: state) => {
    globalThis["meta3d_state"].abstract = state

    return state
}
