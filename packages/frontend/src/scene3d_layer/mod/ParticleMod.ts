import { getBlockServiceExn, getBlockStateExn, setBlockState } from "./Mod"
import { service as particleService } from "particle-protocol/src/service/ServiceType"
import { state as particleState } from "particle-protocol/src/state/StateType"
import { modProtocolName } from "./data/ModData"
import { state } from "../type/StateType"
import { particleType } from "particle-protocol/src/state/StateType"
import * as BulletEmitter from "meta3d-jiehuo-abstract/src/particle/BulletEmitter"
import * as EmitterUtils from "meta3d-jiehuo-abstract/src/particle/EmitterUtils"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../state/State"
import { hasId, initForOffset, removeBulletParticle, updateGeometryAttributeForOffset, updateGeometryAttributeForRepeatOffset, updateOffsetParticle } from "meta3d-jiehuo-abstract/src/particle/ParticleUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { addReallocateIds } from "meta3d-jiehuo-abstract/src/particle/IDUtils"
import { load } from "meta3d-jiehuo-abstract/src/particle/LoadParticlTextureUtils"
import { BufferGeometry, PointsMaterial, Texture } from "three"
import { getModAPI, getSceneAllBlockNames } from "../script/scene/scene_city/Mod"
import { markParticleRemove } from "meta3d-jiehuo-abstract/src/particle/ParticleManager"
import { removeAndDispose } from "meta3d-jiehuo-abstract/src/scene/utils/DisposeUtils"
import { getScene } from "../script/scene/scene_city/CityScene"
import { getEmitFragileGrowthBlockService, getEmitPoisonSingleBlockService } from "./BuffMod"
import { Optimize } from "meta3d-jiehuo-abstract"
import { getFloat32ArrayAndReset } from "meta3d-jiehuo-abstract/src/Optimize"
import { ParticleManager } from "meta3d-jiehuo-abstract"

export let getEffectInjureDamageBlockName = () => "particle-effect-injure-damage"

export let getEffectUpgradeBlockName = () => "particle-effect-upgrade"

export let getEffectHitBlurBlockName = () => "particle-effect-hit-blur"

export let getEffectHitCharmBlockName = () => "particle-effect-hit-charm"

export let getEffectHitCrippledBlockName = () => "particle-effect-hit-crippled"

export let getEffectHitExcitementBlockName = () => "particle-effect-hit-excitement"

export let getEffectHitIceSingleBlockName = () => "particle-effect-hit-icesingle"

export let getEffectHitPoisonSingleBlockName = () => "particle-effect-hit-poisonsingle"

export let getEffectHitInjureSingleBlockName = () => "particle-effect-hit-injuresingle"

// export let getEffectHitFragileGrowthBlockName = () => "particle-effect-hit-fragilegrowth"

export let getEffectHitDecreaseScaleBlockName = () => "particle-effect-hit-decreasescale"

export let getEffectHitExplodeSingleBlockName = () => "particle-effect-hit-explodesingle"

export let getBulletEmitSubmachineBlockName = () => "particle-bullet-emit-submachine"

export let getBulletHitSubmachineBlockName = () => "particle-bullet-hit-submachine"

export let getBulletEmitBasicBlockName = () => "particle-bullet-emit-basic"

export let getBulletHitBasicBlockName = () => "particle-bullet-hit-basic"

export let getBulletEmitShotBlockName = () => "particle-bullet-emit-shot"

export let getBulletHitShotBlockName = () => "particle-bullet-hit-shot"

export let getBulletEmitFireballBlockName = () => "particle-bullet-emit-fireball"

export let getBulletHitFireballBlockName = () => "particle-bullet-hit-fireball"

export let getBulletEmitBiggerBlockName = () => "particle-bullet-emit-bigger"

export let getBulletEmitSmallerBlockName = () => "particle-bullet-emit-smaller"

export let getBillboardExplodeRangeBlockName = () => "particle-billboard-explode-range"

export let getBillboardIceOverwriteBlockName = () => "particle-billboard-ice-overwrite"


export let getShareBlockName = () => "particle-share-default"

let _getAllModBlockNames = (state) => {
    return getSceneAllBlockNames(state, [
        getEffectInjureDamageBlockName(),
        getEffectUpgradeBlockName(),

        getEffectHitBlurBlockName(),
        getEffectHitCharmBlockName(),
        getEffectHitCrippledBlockName(),
        getEffectHitExcitementBlockName(),
        getEffectHitIceSingleBlockName(),
        getEffectHitPoisonSingleBlockName(),
        getEffectHitInjureSingleBlockName(),
        // getEffectHitFragileGrowthBlockName(),
        getEffectHitDecreaseScaleBlockName(),
        getEffectHitExplodeSingleBlockName(),

        getBulletEmitSubmachineBlockName(),
        getBulletHitSubmachineBlockName(),

        getBulletEmitBasicBlockName(),
        getBulletHitBasicBlockName(),

        getBulletEmitShotBlockName(),
        getBulletHitShotBlockName(),

        getBulletEmitFireballBlockName(),
        getBulletHitFireballBlockName(),

        getBulletEmitBiggerBlockName(),

        getBulletEmitSmallerBlockName(),

        getBillboardExplodeRangeBlockName(),
        getBillboardIceOverwriteBlockName(),
    ])
}

let _getAllModData = (state): Array<[particleService, any, any]> => {
    return _getAllModBlockNames(state).reduce((result, blockName) => {
        return ArrayUtils.push(
            result,
            [
                getBlockServiceExn<particleService>(state, modProtocolName.ParticleProtocol, blockName),
                state => getBlockStateExn<particleState<any>>(state, modProtocolName.ParticleProtocol, blockName),
                (state, blockState) => {
                    return setBlockState(state, modProtocolName.ParticleProtocol, blockName, blockState)
                }
            ]
        )
    }, [])
}



//TODO duplicate
let _update = (state: state, [getParticlesFunc, setParticlesFunc, updateFunc,
    // updateGeometryAttributeFunc = (filteredParticles, geometry) => {
    updateGeometryAttributeFunc = (state, filteredParticles, geometry) => {
        // // 遍历粒子,收集属性
        // let [positionList, opacityList, sizeList] = filteredParticles.reduce(([positionList, opacityList, sizeList], particle,) => {
        //     // positionList = positionList.concat(particle.position)
        //     positionList.push(particle.position[0], particle.position[1], particle.position[2])
        //     opacityList.push(particle.opacity)
        //     sizeList.push(particle.size)

        //     return [positionList, opacityList, sizeList]
        // }, [[], [], []])

        // // 粒子属性写入
        // // geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(new Float32Array(positionList), 3));
        // // geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(new Float32Array(opacityList), 1));
        // // geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(new Float32Array(sizeList), 1));


        // // let abstractState = getAbstractState(state)

        // // geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(Optimize.getFloat32ArrayAndReset(abstractState, positionList.length, false), 3));
        // // geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(Optimize.getFloat32ArrayAndReset(abstractState, opacityList.length, false), 1));
        // // geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(Optimize.getFloat32ArrayAndReset(abstractState, sizeList.length, false), 1));

        // geometry.getAttribute('position').copyArray(positionList)
        // geometry.getAttribute('a_opacity').copyArray(opacityList)
        // geometry.getAttribute('a_size').copyArray(sizeList)

        // let abstractState = getAbstractState(state)

        let _ = ParticleManager.updateGeometryAttribute(geometry, filteredParticles)
    },
    removeParticlesFunc = (state, removedParticles) => {
        return removedParticles.reduce((state, particle) => {
            return setAbstractState(state, removeBulletParticle(getAbstractState(state), particle))
        }, state)
    },
], geometry) => {
    let now = Date.now()
    let delta = Device.getDelta(getAbstractState(state))

    let mappedParticles = getParticlesFunc(state).map((particle, i) => {
        particle = updateFunc(particle, delta, i, now)

        particle.updateTime = now

        return particle
    })


    // let filteredParticles = mappedParticles.filter(particle => {
    // 	return (particle.updateTime - particle.createTime) <= particle.life
    // })
    let [filteredParticles, reallocateIds, removedParticles] = mappedParticles.reduce(([filteredParticles, reallocateIds, removedParticles], particle) => {
        if ((particle.updateTime - particle.createTime) <= particle.life) {
            filteredParticles.push(particle)
        }
        else {
            removedParticles.push(particle)

            if (hasId(particle)) {
                reallocateIds.push(particle.id)
            }
        }

        return [filteredParticles, reallocateIds, removedParticles]
    }, [[], [], []])

    state = setAbstractState(state, addReallocateIds(getAbstractState(state), reallocateIds))

    state = removeParticlesFunc(state, removedParticles)

    state = setParticlesFunc(state, filteredParticles)

    if (mappedParticles.length > 0) {
        updateGeometryAttributeFunc(state, filteredParticles, geometry)
    }

    return state
}

//TODO duplicate
let _updateUtils = (state, [getAllParticlesFunc, getStateFunc, setStateFunc]) => {
    return _update(state, [
        getAllParticlesFunc,
        (state, particles) => {
            return setStateFunc(state, {
                ...getStateFunc(state),
                particles
            })
        },
        (particle, delta, i, now) => {
            return BulletEmitter.updateParticle(state, particle, delta, i, now)
        }
    ], NullableUtils.getExn(getStateFunc(state).geometry))
}


export let updateParticle = (state: state) => {
    let api = getModAPI(state)

    return ArrayUtils.reduce<state, any>(_getAllModData(state), (state, [service, getStateFunc, setStateFunc]) => {
        switch (service.getParticleType()) {
            case particleType.BulletEmit:
            case particleType.ShotBulletsEmit:
                return _updateUtils(state, [state => getStateFunc(state).particles, getStateFunc, setStateFunc])
            case particleType.BulletHit:
                return _update(state, [
                    state => getStateFunc(state).particles,
                    (state, particles) => {
                        return setStateFunc(state, {
                            ...getStateFunc(state),
                            particles
                        })
                    },
                    (particle, _, i, now) => {
                        return updateOffsetParticle(particle, now, service.getColCount(), service.getRowCount())
                    },
                    (state, filteredParticles, geometry) => updateGeometryAttributeForOffset(filteredParticles, geometry)
                ], NullableUtils.getExn(getStateFunc(state).geometry))

            case particleType.Effect:
                return _update(state, [
                    state => getStateFunc(state).particles,
                    (state, particles) => {
                        return setStateFunc(state, {
                            ...getStateFunc(state),
                            particles
                        })
                    },
                    (particle, _, i, now) => {
                        return updateOffsetParticle(particle, now, service.getColCount(), service.getRowCount())
                    },
                    updateGeometryAttributeForRepeatOffset
                ], NullableUtils.getExn(getStateFunc(state).geometry))

            case particleType.Billboard:
                return _update(state, [
                    state => getStateFunc(state).particles,
                    (state, particles) => {
                        return setStateFunc(state, {
                            ...getStateFunc(state),
                            particles
                        })
                    },
                    (particle, _, i, now) => {
                        return updateOffsetParticle(particle, now, service.getColCount(), service.getRowCount())
                    },
                    (state, filteredParticles, _) => {
                        filteredParticles.forEach(particle => {
                            api.vector2.fromArray(
                                particle.planeMesh.material.map.offset,
                                particle.offset
                            )
                        })
                    },
                    (state, removedParticles) => {
                        return removedParticles.reduce((state, particle) => {
                            markParticleRemove(particle)
                            removeAndDispose(getScene(state), particle.planeMesh)

                            return state
                        }, state)
                    },
                ], NullableUtils.getEmpty())



            default:
                throw new Error("err")
        }
    }, state)
}



//TODO duplicate
let _initWithoutRotation = (state: state, setGeometryFunc, scene, texturePath, color) => {
    let promise = load(getAbstractState(state), texturePath, false).then(([abstractState, map]) => [setAbstractState(state, abstractState), map] as [state, Texture])

    return promise.then(([state, map]) => {
        // 先创建一个空的缓冲几何体
        let geometry = NewThreeInstance.createBufferGeometry();
        // geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
        // geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
        // geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
        // // geometry.setAttribute('a_scale', new BufferAttribute(new Float32Array([]), 1)); // 点的放大量，用1个浮点数表示

        // const maxCount = 5000

        let _ = ParticleManager.initGeometryAttributes(geometry, 1000)


        // 创建材质
        const material = NewThreeInstance.createPointsMaterial({
            color,
            map, // 纹理图
            transparent: true,// 开启透明度
            depthWrite: false, // 禁止深度写入
            // sizeAttenuation:true,
            sizeAttenuation: Device.isMobileByState(getAbstractState(state)) ? false : true,
        });

        // 修正着色器
        material.onBeforeCompile = function (shader) {
            const vertexShader_attribute = `
        attribute float a_opacity;
        attribute float a_size;
        // attribute float a_scale;
        varying float v_opacity;
        void main() {
          v_opacity = a_opacity;
        `

            /*!in mobile, isPerspective and scale is wrong!maybe because mobile now use landscape! */
            let vertexShader_size
            if (Device.isMobileByState(getAbstractState(state))) {
                vertexShader_size = `
        gl_PointSize = a_size;


		// bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		// if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
		//  gl_PointSize *= ( scale / - mvPosition.z );
		//  gl_PointSize *= ( 500.0 / - mvPosition.z );
		//  gl_PointSize *= ( 500.0 / - mvPosition.z );
		 gl_PointSize *= ( 300.0 / - mvPosition.z );
        `
            }
            else {
                vertexShader_size = `
        gl_PointSize = a_size;
        `
            }


            shader.vertexShader = shader.vertexShader.replace('void main() {', vertexShader_attribute)

            if (Device.isMobileByState(getAbstractState(state)) && material.sizeAttenuation == true) {
                throw new Error("should be false for mobile")
            }
            shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', vertexShader_size)

            const fragmentShader_varying = `
        varying float v_opacity;
        void main() {          
      `
            const fragmentShader_opacity = `gl_FragColor.a *= v_opacity;
}`


            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragmentShader_varying)
            shader.fragmentShader = shader.fragmentShader.replace('}', fragmentShader_opacity)


            // Console.log(
            // 	shader.vertexShader,
            // 	shader.fragmentShader
            // )
        }


        return [state, geometry, material]
    }).then(([state, geometry, material]: [state, any, PointsMaterial]) => {
        state = setGeometryFunc(state, geometry)

        let points = NewThreeInstance.createPoints(geometry, material)
        points.frustumCulled = false

        scene.add(points)

        return state
    })
}


//TODO duplicate
let _initForOffset = (state: state, setGeometryFunc, scene, texturePath, color,
    depthTest = true,
    notFlipY = true,
) => {
    let promise = load(getAbstractState(state), texturePath, notFlipY).then(([abstractState, map]) => [setAbstractState(state, abstractState), map] as [state, Texture])

    return promise.then(([state, map]) => {
        // 先创建一个空的缓冲几何体
        const geometry = new BufferGeometry();
        // geometry.setAttribute('position', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
        // geometry.setAttribute('a_opacity', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
        // geometry.setAttribute('a_size', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
        // geometry.setAttribute('a_offset', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 2));
        // geometry.setAttribute('a_repeat', NewThreeInstance.createBufferAttribtue(new Float32Array([]), 2));

        let _ = ParticleManager.initGeometryAttributesForOffset(geometry, 1000)

        // 创建材质
        const material = new PointsMaterial({
            color,
            map, // 纹理图
            transparent: true,// 开启透明度
            depthWrite: false, // 禁止深度写入
            depthTest: depthTest,
            sizeAttenuation: Device.isMobileByState(getAbstractState(state)) ? false : true,
            // alphaTest:0.3,
        });



        // 修正着色器
        material.onBeforeCompile = function (shader) {
            const vertexShader_attribute = `
        attribute float a_opacity;
        attribute float a_size;
    	attribute vec2 a_offset;
    	attribute vec2 a_repeat;

        varying float v_opacity;
        varying vec2 v_offset;
        varying vec2 v_repeat;

        void main() {
          v_opacity = a_opacity;
      v_offset = a_offset;
      v_repeat = a_repeat;
        `

            /*!in mobile, isPerspective and scale is wrong!maybe because mobile now use landscape! */
            let vertexShader_size
            if (Device.isMobileByState(getAbstractState(state))) {
                vertexShader_size = `
        gl_PointSize = a_size;


		// bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		// if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
		//  gl_PointSize *= ( scale / - mvPosition.z );
		//  gl_PointSize *= ( 500.0 / - mvPosition.z );
		//  gl_PointSize *= ( 500.0 / - mvPosition.z );
		 gl_PointSize *= ( 300.0 / - mvPosition.z );
        `
            }
            else {
                vertexShader_size = `
        gl_PointSize = a_size;
        `
            }


            shader.vertexShader = shader.vertexShader.replace('void main() {', vertexShader_attribute)

            if (Device.isMobileByState(getAbstractState(state)) && material.sizeAttenuation == true) {
                throw new Error("should be false for mobile")
            }
            shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', vertexShader_size)

            const fragmentShader_varying = `
        varying float v_opacity;
    	varying vec2 v_offset;
    	varying vec2 v_repeat;
        void main() {          
      `
            const fragmentShader_opacity = `gl_FragColor.a *= v_opacity;
}`


            shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragmentShader_varying)
            shader.fragmentShader = shader.fragmentShader.replace('}', fragmentShader_opacity)
            shader.fragmentShader = shader.fragmentShader.replace('#include <map_particle_fragment>',
                `
#if defined( USE_MAP ) || defined( USE_ALPHAMAP )

	#if defined( USE_POINTS_UV )

		vec2 uv = vUv;

	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;

	#endif

#endif
      #ifdef USE_MAP
      	// MODIFICATION =======================================================
	uv = uv*v_repeat + v_offset;
  // ====================================================================

	vec4 mapColor = texture2D( map, uv );

	// diffuseColor *= texture2D( map, uv );
	diffuseColor *= mapColor;
      #endif
      #ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
      #endif
// //       if(diffuseColor.r <0.5 && diffuseColor.g <0.5 && diffuseColor.b <0.5 ){
//       if(mapColor.r <0.5 && mapColor.g <0.5 && mapColor.b <0.5 ){
// // diffuseColor /= vec4(10.0);
// // diffuseColor = vec4(vec3(0.1), 1.0);
// // diffuseColor = vec4(vec3(1.0), 1.0);
// // diffuseColor.rgb *= vec3(0.05);
// // diffuseColor.a = 0.9;
// // diffuseColor.a = min(diffuseColor.a * 3.0, 0.9);
//       }
//       else{
// // diffuseColor.rgb *= vec3(10.0);
// // diffuseColor.a = 0.9;
//       }
      `
            )


            // shader.fragmentShader =`
            // uniform sampler2D spriteSheet;
            // uniform vec2 repeat;

            //         varying vec2 v_offset;
            //         varying vec2 v_repeat;
            //         varying float v_opacity;

            // void main() {

            // //     vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );
            //     vec2 uv = vec2( gl_PointCoord.x, gl_PointCoord.y );

            //     vec4 tex = texture2D( spriteSheet, uv * repeat + vOffset );

            // //     if ( tex.a < 0.5 ) discard;

            //     gl_FragColor = tex;
            // 	gl_FragColor.a *= v_opacity;


            // }
            // `

            // Console.log(
            // 	shader.vertexShader,
            // 	shader.fragmentShader
            // )
        }


        return [state, geometry, material]
    }).then(([state, geometry, material]: [state, any, PointsMaterial]) => {
        state = setGeometryFunc(state, geometry)

        let points = NewThreeInstance.createPoints(geometry, material)
        points.frustumCulled = false

        scene.add(points)

        return state
    })
}

export let enableParticle = (state: state, scene) => {
    return ArrayUtils.reducePromise<state, any>(_getAllModData(state), (state, [service, getStateFunc, setStateFunc]) => {
        switch (service.getParticleType()) {
            case particleType.BulletEmit:
            case particleType.ShotBulletsEmit:
                return _initWithoutRotation(state,
                    (state, geometry) => {
                        return setStateFunc(state, {
                            ...getStateFunc(state),
                            geometry: NullableUtils.return_(geometry)
                        })
                    },
                    scene,
                    service.getImagePath(),
                    "#ffffff"
                )
            case particleType.BulletHit:
            case particleType.Effect:
                return _initForOffset(state,
                    (state, geometry) => {
                        return setStateFunc(state, {
                            ...getStateFunc(state),
                            geometry: NullableUtils.return_(geometry)
                        })
                    },
                    scene,
                    service.getImagePath(),
                    "#ffffff",
                    // true,
                    false,
                    true
                )


            case particleType.Billboard:
                return Promise.resolve(state)


            default:
                throw new Error("err")
        }
    }, state)
}