import { bulletEmitter, bulletEmitterParam, bulletParticle, particle, state } from "../type/StateType"
import { getEmpty, getExn, return_ } from "../utils/NullableUtils";
import * as EmitterUtils from "./EmitterUtils";
import { getParticleState } from "../state/State";
import { List } from "immutable";
import { Vector3 } from "three";
import { buildParticleId } from "./IDUtils";
import { push } from "../utils/ArrayUtils";
import { getDelta, getDeltaFactor } from "../Device";
import { NullableUtils } from "../Main";

const _v1 = new Vector3();
const _v2 = new Vector3();

// let _getState = (state: state): bulletEmitter => {
// 	return getExn(getParticleState(state).bulletEmitter)
// }

// let _setState = (state: state, bulletEmitterState: bulletEmitter) => {
// 	return {
// 		...state,
// 		particle: {
// 			...getParticleState(state),
// 			bulletEmitter: return_(bulletEmitterState)
// 		}
// 	}
// }

export let createState = (): bulletEmitter => {
	return {
		geometry: getEmpty(),
		particles: []
	}
}


// let _init = (state: state, setGeometryFunc, scene, texturePath, color) => {
// 	return new Promise<Texture>((resolve, reject) => {
// 		new TextureLoader().load(texturePath, resolve)
// 	}).then(map => {
// 		// 先创建一个空的缓冲几何体
// 		const geometry = new BufferGeometry();
// 		geometry.setAttribute('position', new BufferAttribute(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
// 		geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
// 		geometry.setAttribute('a_size', new BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
// 		geometry.setAttribute('a_rotation', new BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示


// 		// 创建材质
// 		const material = new PointsMaterial({
// 			color,
// 			map, // 纹理图
// 			transparent: true,// 开启透明度
// 			depthWrite: false, // 禁止深度写入
// 			sizeAttenuation:true,
// 		});

// 		// 修正着色器
// 		material.onBeforeCompile = function (shader) {
// 			const vertexShader_attribute = `
//         attribute float a_opacity;
//         attribute float a_size;
//         // attribute float a_scale;
//     	attribute float a_rotation;

//         varying float v_opacity;
//       varying float v_rotation;
//         void main() {
//           v_opacity = a_opacity;
//       v_rotation = a_rotation;
//         `

// 			/*!in mobile, isPerspective and scale is wrong!maybe because mobile now use landscape! */
// 			let vertexShader_size
// 			if (isMobile()) {
// 				vertexShader_size = `
//         gl_PointSize = a_size;


// 		// bool isPerspective = isPerspectiveMatrix( projectionMatrix );
// 		// if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
// 		//  gl_PointSize *= ( scale / - mvPosition.z );
// 		//  gl_PointSize *= ( 500.0 / - mvPosition.z );
// 		//  gl_PointSize *= ( 500.0 / - mvPosition.z );
// 		 gl_PointSize *= ( 300.0 / - mvPosition.z );
//         `
// 			}
// 			else {
// 				vertexShader_size = `
//         gl_PointSize = a_size;
//         `
// 			}


// 			shader.vertexShader = shader.vertexShader.replace('void main() {', vertexShader_attribute)

// 			if (isMobile() && material.sizeAttenuation == true) {
// 				throw new Error("should be false for mobile")
// 			}
// 			shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', vertexShader_size)

// 			const fragmentShader_varying = `
//         varying float v_opacity;
//     	varying float v_rotation;
//         void main() {          
//       `
// 			const fragmentShader_opacity = `gl_FragColor.a *= v_opacity;
// }`


// 			shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragmentShader_varying)
// 			shader.fragmentShader = shader.fragmentShader.replace('}', fragmentShader_opacity)
// 			shader.fragmentShader = shader.fragmentShader.replace('#include <map_particle_fragment>',
// 				`
// #if defined( USE_MAP ) || defined( USE_ALPHAMAP )

// 	#if defined( USE_POINTS_UV )

// 		vec2 uv = vUv;

// 	#else

// 		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;

// 	#endif

// #endif
//       #ifdef USE_MAP
//       	// MODIFICATION =======================================================
//       	float mid = 0.5;
//         uv = vec2(
//           cos(v_rotation) * (uv.x - mid) + sin(v_rotation) * (uv.y - mid) + mid,
//           cos(v_rotation) * (uv.y - mid) - sin(v_rotation) * (uv.x - mid) + mid
//         );
//         // ====================================================================
// 	diffuseColor *= texture2D( map, uv );
//       #endif
//       #ifdef USE_ALPHAMAP
// 	diffuseColor.a *= texture2D( alphaMap, uv ).g;
//       #endif
//       `
// 			)


// 			// Console.log(
// 			// 	shader.vertexShader,
// 			// 	shader.fragmentShader
// 			// )
// 		}


// 		return [geometry, material]
// 	}).then(([geometry, material]: [BufferGeometry, PointsMaterial]) => {
// 		state = setGeometryFunc(state, geometry)

// 		let points = new Points(geometry, material)
// 		points.frustumCulled = false

// 		scene.add(points)

// 		return state
// 	})
// }

// export let init = (state: state, scene) => {
// 	return EmitterUtils.initWithoutRotation(state, (state, geometry) => {
// 		return _setState(state, {
// 			..._getState(state),
// 			geometry: return_(geometry)
// 		})
// 	}, scene, "meta3d-jiehuo-abstract/particle/bullet.png", "#ffffff")
// }

export let buildParticle = (state, { fromName, camp, speed, life, size, position, direction, getDirectionFunc }: bulletEmitterParam): bulletParticle => {
	return {
		// rotation,
		id: buildParticleId(state),
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

// export let emit = (state: state, {
// 	// rotation,
// 	fromName,
// 	camp,
// 	speed,
// 	life,
// 	size,
// 	position,
// 	direction,
// 	getDirectionFunc
// }: bulletEmitterParam) => {
// 	let particles = push(_getState(state).particles,
// 		buildParticle(state, {
// 			// rotation,
// 			fromName,
// 			camp,
// 			speed, life, size,
// 			position,
// 			direction,
// 			getDirectionFunc,
// 		}),
// 	)

// 	return _setState(state, {
// 		..._getState(state),
// 		particles
// 	})
// }

// export let getAllParticles = (state: state) => {
// 	return _getState(state).particles
// }

export let updateParticle = (specificState, particle, delta, i, now) => {
	let speed = particle.speed * delta * getDeltaFactor()

	if (!NullableUtils.isNullable(particle.direction)) {
		particle.position = _v1.fromArray(particle.position).add(_v2.fromArray(NullableUtils.getExn(particle.direction)).multiplyScalar(speed)).toArray()
	}
	else {
		particle.position = _v1.fromArray(particle.position).add(_v2.fromArray(NullableUtils.getExn(particle.getDirectionFunc)(specificState, particle.position)).multiplyScalar(speed)).toArray()
	}

	return particle
}

export let updateUtils = <specificState>(state, [getAllParticlesFunc, getStateFunc, setStateFunc], specificState: specificState,) => {
	return EmitterUtils.update(state, [
		getAllParticlesFunc,
		(state, particles) => {
			return setStateFunc(state, {
				...getStateFunc(state),
				particles
			})
		},
		(particle, delta, i, now) => {
			return updateParticle(specificState, particle, delta, i, now)
		}
	], getExn(getStateFunc(state).geometry))
}

// export let update = <specificState>(state, specificState: specificState) => {
// 	return updateUtils(state, [getAllParticles, _getState, _setState], specificState)
// }