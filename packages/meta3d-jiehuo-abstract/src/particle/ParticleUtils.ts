import { protectParticle, shellEmitOrExplodeParticle, state } from "../type/StateType"
import { BufferAttribute, BufferGeometry, Euler, Points, PointsMaterial, Texture, TextureLoader, Vector3 } from "three";
import { isMobile } from "../Device";
import { clamp, getRandomValue1, toFloatString } from "../utils/NumberUtils";
import { load } from "./LoadParticlTextureUtils";
import { NullableUtils } from "../Main";

export let initForOffset = (state: state, setGeometryFunc, scene, texturePath, color,
	depthTest = true,
	notFlipY=true,
) => {
	let promise = load(state, texturePath, notFlipY)

	return promise.then(([state, map]) => {
		// 先创建一个空的缓冲几何体
		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new BufferAttribute(new Float32Array([]), 3)); // 一个顶点由3个坐标构成
		geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array([]), 1)); // 点的透明度，用1个浮点数表示
		geometry.setAttribute('a_size', new BufferAttribute(new Float32Array([]), 1)); // 点的初始大小，用1个浮点数表示
		geometry.setAttribute('a_offset', new BufferAttribute(new Float32Array([]), 2));
		geometry.setAttribute('a_repeat', new BufferAttribute(new Float32Array([]), 2));

		// 创建材质
		const material = new PointsMaterial({
			color,
			map, // 纹理图
			transparent: true,// 开启透明度
			depthWrite: false, // 禁止深度写入
			depthTest: depthTest,
			sizeAttenuation: isMobile() ? false : true,
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
	}).then(([state, geometry, material]: [state, BufferGeometry, PointsMaterial]) => {
		state = setGeometryFunc(state, geometry)

		let points = new Points(geometry, material)
		points.frustumCulled = false

		scene.add(points)

		return state
	})
}

export let buildOffsetParticle = ({ speed, life, size, position, offset, repeat }): shellEmitOrExplodeParticle => {
	let now = Date.now()

	return {
		opacity: 1,
		life,
		size,
		createTime: now,
		updateTime: now,
		speed,
		position,

		offset,
		repeat
	}
}

export let buildRepeatOffsetParticle = ({ speed, life, size, getPositionFunc, getIsFinishFunc, offset, repeat }: any, opacity): protectParticle => {
	let now = Date.now()

	return {
		opacity: opacity,
		life,
		size,
		createTime: now,
		updateTime: now,
		speed,

		getPositionFunc,
		getIsFinishFunc,

		offset,
		repeat
	}
}

export let getCurrentFrameImageData = (frameIndex: number, colCount, rowCount): { offset: [number, number] } => {
	// requireCheck(() => {
	// 	test("frameIndex should be valid", () => {
	// 		return frameIndex >= 0 && frameIndex < 8 * 6
	// 	})
	// }, true)
	frameIndex = clamp(frameIndex, 0, colCount * rowCount - 1)

	let colIndex = frameIndex % colCount
	let rowIndex = Math.floor(frameIndex / colCount)

	return {
		offset: [colIndex * 1 / colCount, rowIndex * 1 / rowCount],
	}
}

export let updateOffsetParticle = (particle: shellEmitOrExplodeParticle, now, colCount, rowCount) => {
	let passedTime = now - particle.createTime

	let { offset } = getCurrentFrameImageData(
		Math.floor((passedTime * particle.speed) / particle.life * (colCount * rowCount - 1)),
		colCount, rowCount
	)

	particle.offset = offset

	return particle
}

export let updateRepeatOffsetParticle = <specificState>(specificState: specificState, particle: protectParticle, now, colCount, rowCount) => {
	let passedTime = now - particle.createTime

	let frameIndex = Math.floor((passedTime * particle.speed) / particle.life * (colCount * rowCount - 1))

	// if (frameIndex == (colCount * rowCount - 1) && particle.repeatCount > 1) {
	if (frameIndex == (colCount * rowCount - 1) && !particle.getIsFinishFunc(specificState)) {
		particle.createTime = now
		// particle.repeatCount -= 1

		frameIndex = 0
	}

	let { offset } = getCurrentFrameImageData(
		frameIndex,
		colCount, rowCount
	)

	particle.offset = offset

	return particle
}


export let updateGeometryAttributeForOffset = (filteredParticles, geometry) => {
	// 遍历粒子,收集属性
	let [positionList, opacityList, sizeList, offsetList, repeatList] = filteredParticles.reduce(([positionList, opacityList, sizeList, offsetList, repeatList], particle,) => {
		// positionList = positionList.concat(particle.position)
		positionList.push(particle.position[0], particle.position[1], particle.position[2])
		opacityList.push(particle.opacity)
		sizeList.push(particle.size)

		// offsetList = offsetList.concat(particle.offset)
		// repeatList = repeatList.concat(particle.repeat)
		offsetList.push(particle.offset[0], particle.offset[1])
		repeatList.push(particle.repeat[0], particle.repeat[1])

		return [positionList, opacityList, sizeList, offsetList, repeatList]
	}, [[], [], [], [], []])

	// 粒子属性写入
	geometry.setAttribute('position', new BufferAttribute(new Float32Array(positionList), 3));
	geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array(opacityList), 1));
	geometry.setAttribute('a_size', new BufferAttribute(new Float32Array(sizeList), 1));

	geometry.setAttribute('a_offset', new BufferAttribute(new Float32Array(offsetList), 2));
	geometry.setAttribute('a_repeat', new BufferAttribute(new Float32Array(repeatList), 2));
}

export let updateGeometryAttributeForRepeatOffset = <specificState>(specificState: specificState) => {
	return (filteredParticles, geometry) => {
		// 遍历粒子,收集属性
		let [positionList, opacityList, sizeList, offsetList, repeatList] = filteredParticles.reduce(([positionList, opacityList, sizeList, offsetList, repeatList], particle: protectParticle,) => {
			// positionList = positionList.concat(particle.position)
			let position = particle.getPositionFunc(specificState)

			positionList.push(position[0], position[1], position[2])
			opacityList.push(particle.opacity)
			sizeList.push(particle.size)

			// offsetList = offsetList.concat(particle.offset)
			// repeatList = repeatList.concat(particle.repeat)
			offsetList.push(particle.offset[0], particle.offset[1])
			repeatList.push(particle.repeat[0], particle.repeat[1])

			return [positionList, opacityList, sizeList, offsetList, repeatList]
		}, [[], [], [], [], []])

		// 粒子属性写入
		geometry.setAttribute('position', new BufferAttribute(new Float32Array(positionList), 3));
		geometry.setAttribute('a_opacity', new BufferAttribute(new Float32Array(opacityList), 1));
		geometry.setAttribute('a_size', new BufferAttribute(new Float32Array(sizeList), 1));

		geometry.setAttribute('a_offset', new BufferAttribute(new Float32Array(offsetList), 2));
		geometry.setAttribute('a_repeat', new BufferAttribute(new Float32Array(repeatList), 2));
	}
}

export let hasId = (particle: any) => {
	return !NullableUtils.isNullable(particle.id)
}