import { id, lodQueueIndex, missileVehicleMissileEmitter, missileVehicleMissileEmitterParam, missileVehicleMissileParticle, state } from "../../type/StateType"
import { getEmpty, getExn, return_ } from "../../utils/NullableUtils";
import * as EmitterUtils from "../EmitterUtils";
import { getIsDebug, getParticleState } from "../../state/State";
import { List } from "immutable";
import { Box3, Matrix4, Mesh, Object3D, Vector3 } from "three";
import { buildInstanceParticleId, buildParticleId } from "../IDUtils";
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

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();
const _v5 = new Vector3();

export let createState = (): missileVehicleMissileEmitter => {
    return {
        particles: [],
        queue: getEmpty(),
        queueIndexMap: MutableNumberMapUtils.create(),
    }
}


export let init = (state: state, scene: Object3D, missileVehicleMissile: Mesh): [state, LODQueue] => {
    const distance = 1000

    let camera = getCurrentCamera(state)

    let group_ = createGroup()


    let mesh = changeTransformToDefault(missileVehicleMissile)
    mesh = changeToPhongMaterial(mesh)


    group_.add(mesh)


    group_.matrixAutoUpdate = false


    group_.castShadow = false
    group_.receiveShadow = false

    let details = [
        {
            group: group_,
            level: "l0",
            distance,
        },
    ]


    let queue = new LODQueue()

    queue.name = "lodQueue"

    queue.details = details

    let box = queue.computeBox()

    queue.originBox = box

    let instancedlod = new InstancedLOD2(scene, camera)

    instancedlod.setContainer(queue);
    instancedlod.setLevels(details, getIsDebug(state));
    instancedlod.setPopulation();


    state = add(state, instancedlod)

    return [state, queue]
}

let _buildParticle = (state,
    queueIndexMap,
    { fromName, speed, life, position, direction }): [state, missileVehicleMissileParticle, boolean] => {
    let d = buildInstanceParticleId(state,
        (id) => {
            return _isFromReallocate(queueIndexMap, id)
        }
    )
    state = d[0]
    let id = d[1]
    let isFromReallocate = d[2]

    return [state, {
        id,
        fromName,


        // opacity: 1,
        life,
        // size,
        createTime: Date.now(),
        updateTime: Date.now(),
        speed,
        position,
        direction,
    }, isFromReallocate]
}

let _getNameInQueue = (particleId) => {
    return String(particleId)
}

let _isFromReallocate = (queueIndexMap, id) => {
    return MutableNumberMapUtils.has(
        queueIndexMap,
        id
    )
}

let _updateTransformAndBuildBox = (matrix: Matrix4, box: Box3, {
    size,
    position,
    direction
}: missileVehicleMissileEmitterParam): [Matrix4, Box3] => {
    let transform = matrix.compose(
        _v1.set(0, 0, 0),
        TransformUtils.getLookatQuaternion(
            _v2.fromArray(position),
            _v3.fromArray(position).add(_v4.fromArray(direction))
        ),
        _v5.setScalar(size)
    )

    return [transform, box.clone().applyMatrix4(transform)]
}

let _getQueue = (state: state, getStateFunc): LODQueue => {
    return NullableUtils.getExn(getStateFunc(state).queue)
}

export let emit = ([getStateFunc, setStateFunc]) => {
    return (state: state, missileVehicleMissileEmitterParam: missileVehicleMissileEmitterParam) => {
        let d = _buildParticle(state,
            getStateFunc(state).queueIndexMap,
            missileVehicleMissileEmitterParam)
        state = d[0]
        let particle = d[1]
        let isFromReallocate = d[2]

        let particles = push(getStateFunc(state).particles,
            particle,
        )

        state = setStateFunc(state, {
            ...getStateFunc(state),
            particles
        })


        let queue = _getQueue(state, getStateFunc)

        let name = _getNameInQueue(particle.id)

        if (isFromReallocate) {
            let index: lodQueueIndex = MutableNumberMapUtils.getExn(
                getStateFunc(state).queueIndexMap,
                particle.id
            )

            let [_, box] = _updateTransformAndBuildBox(queue.transforms[index], queue.originBox, missileVehicleMissileEmitterParam)

            queue.boxes[index].copy(
                box
            )

            state = setStateFunc(state, {
                ...getStateFunc(state),
                queueIndexMap: MutableNumberMapUtils.set(getStateFunc(state).queueIndexMap, particle.id, index)
            })

        }
        else {
            let [newTransform, newBox] = _updateTransformAndBuildBox(new Matrix4(), queue.originBox, missileVehicleMissileEmitterParam)
            let newName = name

            if (getIsDebug(state)) {
                addBox3Helper(state, getCurrentScene(state), newBox, 0x5000ff)
            }


            _getQueue(state, getStateFunc).insert(newTransform, newBox, newName)

            let index = queue.getLastIndex()

            state = setStateFunc(state, {
                ...getStateFunc(state),
                queueIndexMap: MutableNumberMapUtils.set(getStateFunc(state).queueIndexMap, particle.id, index)
            })
        }

        state = setStatusForLODQueue(state, name, {
            isCollisionable: false,
            isPickable: false,
            isVisible: true
        })


        return state
    }
}

let _getQueueIndex = (state: state, getStateFunc, id: id) => {
    return MutableNumberMapUtils.getExn(getStateFunc(state).queueIndexMap, id)
}

export let getAllParticles = (getStateFunc) => {
    return (state: state) => {
        return getStateFunc(state).particles
    }
}

export let updateParticle = BulletEmitter.updateParticle

export let update = ([getStateFunc, setStateFunc]) => {
    return (state: state) => {
        return EmitterUtils.update(state, [
            getAllParticles(getStateFunc),
            (state, particles) => {
                return setStateFunc(state, {
                    ...getStateFunc(state),
                    particles
                })
            },
            updateParticle,
            (filteredParticles, queue) => {
                filteredParticles.forEach(particle => {
                    queue.updateTransform(transform => {
                        TransformUtils.setPositionToMatrix4(
                            transform,
                            _v1.fromArray(
                                particle.position
                            )
                        )
                    },
                        _getQueueIndex(state, getStateFunc, particle.id),
                        true,
                    )
                })
            },
            (state, removedParticles) => {
                return removedParticles.reduce((state, particle) => {
                    return remove(state, particle)
                }, state)
            },
        ], _getQueue(state, getStateFunc))
    }
}

export let getBox = (getStateFunc) => {
    return (state: state, id: id) => {
        return _getQueue(state, getStateFunc).boxes[
            MutableNumberMapUtils.getExn(
                getStateFunc(state).queueIndexMap,
                id
            ) as lodQueueIndex
        ]
    }
}

export let remove = (state: state, particle: missileVehicleMissileParticle) => {
    markParticleRemove(particle)

    state = setStatusForLODQueue(state, _getNameInQueue(particle.id), {
        isCollisionable: false,
        isPickable: false,
        isVisible: false
    })

    return state
}
