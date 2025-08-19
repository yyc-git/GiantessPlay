import { BufferAttribute, BufferGeometry, Euler, Points, PointsMaterial, Texture, TextureLoader, Vector3 } from "three";
import { state } from "../type/StateType"
import { return_ } from "../utils/NullableUtils";
import { getDelta, isMobile } from "../Device";
import { getResource, isResourceLoaded } from "../Loader";
import { load } from "./LoadParticlTextureUtils";
import { hasId } from "./ParticleUtils";
import { addReallocateIds } from "./IDUtils";

export let initWithoutRotation = (state: state, setGeometryFunc, scene, texturePath, color) => {
	let promise = load(state, texturePath, false)

	return promise.then(([state, map]) => {
		// 先创建一个空的缓冲几何体
		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
		geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
		geometry.setAttribute('a_size', new BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
		// geometry.setAttribute('a_scale', new BufferAttribute(new Float32Array([]), 1)); // 点的放大量，用1个浮点数表示


		// 创建材质
		const material = new PointsMaterial({
			color,
			map, // 纹理图
			transparent: true,// 开启透明度
			depthWrite: false, // 禁止深度写入
			// sizeAttenuation:true,
			sizeAttenuation: isMobile() ? false : true,
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
			if (isMobile()) {
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

			if (isMobile() && material.sizeAttenuation == true) {
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
	}).then(([state, geometry, material]: [state, BufferGeometry, PointsMaterial]) => {
		state = setGeometryFunc(state, geometry)

		let points = new Points(geometry, material)
		points.frustumCulled = false

		scene.add(points)

		return state
	})
}


export let initWithRotation = (state: state, setGeometryFunc, scene, texturePath, color) => {
	return new Promise<Texture>((resolve, reject) => {
		new TextureLoader().load(texturePath, resolve)
	}).then(map => {
		// 先创建一个空的缓冲几何体
		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
		geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
		geometry.setAttribute('a_size', new BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
		geometry.setAttribute('a_rotation', new BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
		// geometry.setAttribute('a_scale', new BufferAttribute(new Float32Array([]), 1)); // 点的放大量，用1个浮点数表示


		// 创建材质
		const material = new PointsMaterial({
			color,
			map, // 纹理图
			transparent: true,// 开启透明度
			depthWrite: false, // 禁止深度写入
			sizeAttenuation: isMobile() ? false : true,
		});

		// 修正着色器
		material.onBeforeCompile = function (shader) {
			const vertexShader_attribute = `
        attribute float a_opacity;
        attribute float a_size;
        // attribute float a_scale;
    	attribute float a_rotation;

        varying float v_opacity;
      varying float v_rotation;
        void main() {
          v_opacity = a_opacity;
      v_rotation = a_rotation;
        `

			/*!in mobile, isPerspective and scale is wrong!maybe because mobile now use landscape! */
			let vertexShader_size
			if (isMobile()) {
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

			if (isMobile() && material.sizeAttenuation == true) {
				throw new Error("should be false for mobile")
			}
			shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', vertexShader_size)

			const fragmentShader_varying = `
        varying float v_opacity;
    	varying float v_rotation;
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
      	float mid = 0.5;
        uv = vec2(
          cos(v_rotation) * (uv.x - mid) + sin(v_rotation) * (uv.y - mid) + mid,
          cos(v_rotation) * (uv.y - mid) - sin(v_rotation) * (uv.x - mid) + mid
        );
        // ====================================================================
	diffuseColor *= texture2D( map, uv );
      #endif
      #ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
      #endif
      `
			)


			// Console.log(
			// 	shader.vertexShader,
			// 	shader.fragmentShader
			// )
		}


		return [geometry, material]
	}).then(([geometry, material]: [BufferGeometry, PointsMaterial]) => {
		state = setGeometryFunc(state, geometry)

		let points = new Points(geometry, material)
		points.frustumCulled = false

		scene.add(points)

		return state
	})
}

export let initByChangeColor = (state: state, setGeometryFunc, scene) => {
	// 先创建一个空的缓冲几何体
	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new BufferAttribute(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
	geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
	geometry.setAttribute('a_size', new BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
	geometry.setAttribute('a_color', new BufferAttribute(new Float32Array([]), 3));


	// 创建材质
	const material = new PointsMaterial({
		transparent: true,// 开启透明度
		depthWrite: false, // 禁止深度写入
		sizeAttenuation: isMobile() ? false : true,
	});

	// 修正着色器
	material.onBeforeCompile = function (shader) {
		const vertexShader_attribute = `
        attribute float a_opacity;
        attribute float a_size;
        attribute vec3 a_color;
        varying float v_opacity;
        varying vec3 v_color;
        void main() {
          v_opacity = a_opacity;
          v_color = a_color;
        `

		/*!in mobile, isPerspective and scale is wrong!maybe because mobile now use landscape! */
		let vertexShader_size
		if (isMobile()) {
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

		if (isMobile() && material.sizeAttenuation == true) {
			throw new Error("should be false for mobile")
		}
		shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size;', vertexShader_size)

		const fragmentShader_varying = `
        varying float v_opacity;
        varying vec3 v_color;
        void main() {          
      `
		const fragmentShader_opacity = `
		gl_FragColor.rgb = v_color;


		//change rect shape to circle shape
		vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
		gl_FragColor.a = step(ll, 0.5) * v_opacity;
}`


		shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragmentShader_varying)
		shader.fragmentShader = shader.fragmentShader.replace('}', fragmentShader_opacity)


		// Console.log(
		// 	shader.vertexShader,
		// 	shader.fragmentShader
		// )
	}


	state = setGeometryFunc(state, geometry)

	let points = new Points(geometry, material)
	points.frustumCulled = false

	scene.add(points)

	return Promise.resolve(state)
}

export let updatePosition = (position, index, speed, time, isAdd) => {
	if (isAdd) {
		position[index] += speed * time / 1000
		return
	}

	position[index] -= speed * time / 1000
}


export let update = (state: state, [getParticlesFunc, setParticlesFunc, updateFunc,
	updateGeometryAttributeFunc = (filteredParticles, geometry) => {
		// 遍历粒子,收集属性
		let [positionList, opacityList, sizeList] = filteredParticles.reduce(([positionList, opacityList, sizeList], particle,) => {
			// positionList = positionList.concat(particle.position)
			positionList.push(particle.position[0], particle.position[1], particle.position[2])
			opacityList.push(particle.opacity)
			sizeList.push(particle.size)

			return [positionList, opacityList, sizeList]
		}, [[], [], []])

		// 粒子属性写入
		geometry.setAttribute('position', new BufferAttribute(new Float32Array(positionList), 3));
		geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array(opacityList), 1));
		geometry.setAttribute('a_size', new BufferAttribute(new Float32Array(sizeList), 1));
	},
	removeParticlesFunc = (state, removedParticles) => {
		return state
	},
], geometry) => {
	let now = Date.now()
	let delta = getDelta(state)

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

	state = addReallocateIds(state, reallocateIds)

	state = removeParticlesFunc(state, removedParticles)

	state = setParticlesFunc(state, filteredParticles)

	if (mappedParticles.length > 0) {
		updateGeometryAttributeFunc(filteredParticles, geometry)

		// // 遍历粒子,收集属性
		// let [positionList, opacityList, sizeList, rotationList] = filteredParticles.reduce(([positionList, opacityList, sizeList, rotationList], particle,) => {
		// 	positionList = positionList.concat(particle.position)
		// 	opacityList.push(particle.opacity)
		// 	sizeList.push(particle.size)
		// 	if (isUseRotation) {
		// 		rotationList.push(particle.rotation)
		// 	}

		// 	return [positionList, opacityList, sizeList, rotationList]
		// }, [[], [], [], []])

		// // let geometry = getExn(_getState(state).geometry)

		// // Console.log(
		// // 	sizeList
		// // )

		// // 粒子属性写入
		// geometry.setAttribute('position', new BufferAttribute(new Float32Array(positionList), 3));
		// geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array(opacityList), 1));
		// // geometry.setAttribute('a_scale', new BufferAttribute(new Float32Array(scaleList), 1));
		// geometry.setAttribute('a_size', new BufferAttribute(new Float32Array(sizeList), 1));
		// if (isUseRotation) {
		// 	geometry.setAttribute('a_rotation', new BufferAttribute(new Float32Array(rotationList), 1));
		// }
	}

	return state
}