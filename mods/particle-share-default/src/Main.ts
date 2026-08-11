import { getBlockService as getBlockServiceBlockManager, createBlockState as createBlockStateBlockManager, getBlockInfo as getBlockInfoBlockManager } from "block/src/BlockManagerType"
import { service as particleShareService } from "particle-share-protocol/src/service/ServiceType"
import { billboardEmitterParam, billboardParticle, state as particleShareState, shotBulletEmitterParam } from "particle-share-protocol/src/state/StateType"
import { getBlockName, getProtocolName } from "./script/Utils"
import { api } from "type-api/src/Type"
import { particleType } from "particle-protocol/src/state/StateType"
import { state } from "frontend/src/scene3d_layer/type/StateType"
import { bindEvent, unbindEvent } from "./script/Event"
import { bulletEmitterParam, bulletParticle } from "meta3d-jiehuo-abstract/src/type/StateType"


let _buildBulletParticle = (api: api, state: state, { fromName, camp, speed, life, size, position, direction, getDirectionFunc }: bulletEmitterParam): bulletParticle => {
    return {
        // rotation,
        id: api.buildParticleId(api.getAbstractState(state)),
        fromName,
        camp,

        fromPosition: position,

        opacity: 1,
        life,
        size,
        createTime: Date.now(),
        updateTime: Date.now(),
        speed,
        position,
        direction,
        getDirectionFunc,
    }
}

let _buildShotBulletParticles = (api: api, state: state, { fromName, camp, speed, life, size, position, direction, minOffset, maxOffset, count }: shotBulletEmitterParam): Array<bulletParticle> => {
    return api.ArrayUtils.range(0, count - 1).map(i => {
        return {
            id: api.buildParticleId(api.getAbstractState(state)),
            fromName,
            camp,

            fromPosition: position,

            opacity: 1,
            life,
            size,
            createTime: Date.now(),
            updateTime: Date.now(),
            speed,
            position,
            direction: api.vector3.toArray(api.vector3.normalize(api.vector3.fromArray(
                api.vector3.getTempVector1(),
                [
                    direction[0] + api.NumberUtils.getRandomFloat(minOffset, maxOffset),
                    direction[1] + api.NumberUtils.getRandomFloat(minOffset, maxOffset),
                    direction[2] + api.NumberUtils.getRandomFloat(minOffset, maxOffset),
                ])), []),
        }
    })
}

let _buildBillboardParticle = ({ speed, life, position, offset, planeMesh }): billboardParticle => {
    let now = Date.now()

    return {
        opacity: 1,
        life,
        // size,
        createTime: now,
        updateTime: now,
        speed,
        position,

        offset,
        // repeat,

        planeMesh
    }
}

let _emitBillboard = (api: api, state, [service, getStateFunc, setStateFunc], {
    speed,
    life,

    width,
    height,

    position,

    resourceId,

    setQuaternionFunc,
}: billboardEmitterParam) => {
    let geo = api.NewThreeInstance.createPlaneGeometry(width, height)

    let material = api.NewThreeInstance.createMeshBasicMaterial({ map: api.Loader.getResource(api.getAbstractState(state), resourceId).clone(), alphaTest: 0, side: api.material.getDoubleSide(), transparent: true })
    material = api.fixZFighting(material)

    let mesh = api.NewThreeInstance.createMesh(geo, material)
    api.vector3.fromArray(
        mesh.position,
        position
    )

    let _ = api.NullableUtils.getWithDefault(setQuaternionFunc,
        (quaternion) => {
            return api.TransformUtils.rotateOnWorldAxis(
                quaternion,
                Math.PI / 2,
                api.vector3.set(
                    api.vector3.getTempVector1(),
                    1, 0, 0
                )
            )
        }
    )(mesh.quaternion)

    api.getScene(state).add(mesh)


    let frameData = api.getCurrentFrameImageData(0, service.getColCount(), service.getRowCount())


    let map = material.map
    api.vector2.fromArray(
        map.repeat, [1 / service.getColCount(), 1 / service.getRowCount()]
    )
    api.vector2.fromArray(
        map.offset, frameData.offset
    )
    map.flipY = false


    return setStateFunc(state, {
        ...getStateFunc(state),
        particles: api.ArrayUtils.push(getStateFunc(state).particles,
            _buildBillboardParticle({
                speed, life,
                position,

                offset: frameData.offset,

                planeMesh: mesh
            }),
        )
    })
}

let _emit = (api: api, state, [service, getStateFunc, setStateFunc, buildOffsetParticleFunc], param) => {
    let frameData = api.getCurrentFrameImageData(0, service.getColCount(), service.getRowCount())

    return setStateFunc(state, {
        ...getStateFunc(state),
        particles: api.ArrayUtils.push(getStateFunc(state).particles,
            buildOffsetParticleFunc({
                ...param,

                offset: frameData.offset,
                repeat: [1 / service.getColCount(), 1 / service.getRowCount()]
            })
        )
    })
}

let _buildEffectOffsetParticle = ({ speed, life, size, getPositionFunc, offset, repeat }: any): any => {
    let now = Date.now()

    return {
        opacity: 1,
        life,
        size,
        createTime: now,
        updateTime: now,
        speed,

        getPositionFunc,

        offset,
        repeat
    }
}

export let getBlockService: getBlockServiceBlockManager<
    particleShareService
> = (api: api) => {
    return {
        bindEvent: bindEvent,
        unbindEvent: unbindEvent,

        emit: (state, [service, getStateFunc, setStateFunc], particleType_, param, count) => {
            switch (particleType_) {
                case particleType.BulletEmit:
                    let particle = _buildBulletParticle(api, state, param)

                    state = setStateFunc(state, {
                        ...getStateFunc(state),
                        particles: api.ArrayUtils.push(getStateFunc(state).particles,
                            particle,
                        )
                    })

                    state = api.setAbstractState(state, api.setNeedCollisionCheckLoopCount(api.getAbstractState(state), particle.id, count))

                    return state


                case particleType.ShotBulletsEmit:
                    let particles = _buildShotBulletParticles(api, state, param)
                    state = setStateFunc(state, {
                        ...getStateFunc(state),
                        particles: api.ArrayUtils.pushArrs(getStateFunc(state).particles,
                            particles,
                        )
                    })

                    state = particles.reduce((state, particle) => {
                        return api.setAbstractState(state, api.setNeedCollisionCheckLoopCount(api.getAbstractState(state), particle.id, count))
                    }, state)

                    return state


                case particleType.BulletHit:
                    return _emit(api, state, [service, getStateFunc, setStateFunc, api.buildOffsetParticle], param)
                case particleType.Effect:
                    return _emit(api, state, [service, getStateFunc, setStateFunc, _buildEffectOffsetParticle], param)
                case particleType.Billboard:
                    return _emitBillboard(api, state, [service, getStateFunc, setStateFunc], param)
            }
        },
        getAllParticlesForCollisionCheck: (state, getStateFunc) => {
            return api.getAllEmitParticlesForCollisionCheck(api.getAbstractState(state), getStateFunc(state).particles)
        }
    }
}

export let createBlockState: createBlockStateBlockManager<
    particleShareState
> = (api: api) => {
    return null
}

export let getBlockInfo: getBlockInfoBlockManager = (api) => {
    if (api.internation.isChinese()) {
        return {
            protocolName: getProtocolName(),
            blockName: getBlockName(),
            /*! title should be unique
            * 
            */
            title: "粒子共享->默认",
            author: "官方",
            category: "粒子",
            version: "0.0.1",
        }
    }

    return {
        protocolName: getProtocolName(),
        blockName: getBlockName(),
        /*! title should be unique
        * 
        */
        title: "Particle Share->Default",
        author: "Author",
        category: "Particle",
        version: "0.0.1",
    }
}