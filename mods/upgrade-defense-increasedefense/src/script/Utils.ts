import { usedGirlEnum } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { api } from "type-api/src/Type"
import { state as blockState } from "upgrade-protocol/src/state/StateType"

export let getProtocolName = () => "upgrade-protocol"

export let getBlockName = () => "upgrade-defense-increasedefense"

// export let getParticleShareProtocolName = () => "particle-share-protocol"

// export let getParticleProtocolName = () => "particle-protocol"

// export let getParticleShareBlockName = () => "particle-share-default"

// export let getParticleBillboardIceOverwriteBlockName = () => "particle-billboard-ice-single"


export let getBuffProtocolName = () => "buff-protocol"

export let getBuffBlockName = () => "buff-emit-defense-increasedefense"

// export let getBuffArmyBlockName = () => "buff-army-stressprotect"

// export let getBuffLittleManBlockName = () => "buff-littleman-stressprotect"

// export let getBuffGiantessBlockName = () => "buff-giantess-stressprotect"




export let createState = (api: api): blockState => {
    return {
    }
}
