import { id, rocketEmitter, state } from "../../type/StateType"
import { getEmpty, getExn, return_ } from "../../utils/NullableUtils";
import * as EmitterUtils from "../EmitterUtils";
import { getIsDebug, getParticleState } from "../../state/State";
import { List } from "immutable";
import { Box3, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { buildParticleId } from "../IDUtils";
import { push } from "../../utils/ArrayUtils";
import { getDelta, getDeltaFactor } from "../../Device";
import { getCurrentCamera } from "../../scene/Camera";
import { createGroup } from "../../NewThreeInstance";
import { changeTransformToDefault } from "../../utils/Object3DUtils";
import { changeToPhongMaterial } from "../../utils/MaterialUtils";
import { LODQueue } from "../../lod/lod2/LODQueue";
import { InstancedLOD2, add } from "../../lod/lod2/InstancedLOD2";
import { MutableNumberMapUtils, NullableUtils, TransformUtils } from "../../Main";
import { setStatusForLODQueue } from "../../lod/LOD";
import * as BulletEmitter from "../BulletEmitter"
import { addBox3Helper } from "../../utils/CollisionUtils";
import { getCurrentScene, getScene } from "../../scene/Scene";
import { markParticleRemove } from "../ParticleManager";
import * as InstanceEmitterUtils from "./InstanceEmitterUtils"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();
const _v5 = new Vector3();

let _getState = (state: state): rocketEmitter => {
    return getExn(getParticleState(state).rocketEmitter)
}

let _setState = (state: state, rocketEmitterState: rocketEmitter) => {
    return {
        ...state,
        particle: {
            ...getParticleState(state),
            rocketEmitter: return_(rocketEmitterState)
        }
    }
}

export let createState = InstanceEmitterUtils.createState

export let init = (state: state, scene: Object3D, mesh: Mesh) => {
    let d = InstanceEmitterUtils.init(state, scene, mesh)
    state = d[0]
    let queue = d[1]

    return _setState(state, {
        ..._getState(state),
        queue: return_(queue)
    })
}

export let emit = InstanceEmitterUtils.emit([_getState, _setState])

export let update = InstanceEmitterUtils.update([_getState, _setState])

export let getBox = InstanceEmitterUtils.getBox(_getState)

export let remove = InstanceEmitterUtils.remove

export let getAllParticles = InstanceEmitterUtils.getAllParticles(_getState)
