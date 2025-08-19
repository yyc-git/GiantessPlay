import { AnimationClip, AnimationMixer, DataTexture, FloatType, MathUtils, Matrix4, Object3D, RGBAFormat, Skeleton } from "three";
import { state } from "../type/StateType"
import { push } from "../utils/ArrayUtils";
import { patchShader } from "./GPUSkinnedMeshMaterialPatcher";
import { getGPUSkinState, setGPUSkinState } from "../state/State";
import { getExn } from "../utils/NullableUtils";

export let registerAnimation = (state: state, material, skeleton: Skeleton, root: Object3D, animations: Array<AnimationClip>, [maxDuration, fps]): [state, Array<number>, Array<number>] => {
	let mixer = new AnimationMixer(root)

	let allAnimationData = animations.reduce((allAnimationData, clip) => {
		clip.optimize();

		let action = mixer.clipAction(clip)

		return push(allAnimationData, [clip, action])
	}, [])


	root.updateWorldMatrix(true, true);

	// const maxDuration = 2
	let maxSteps = Math.ceil(maxDuration * fps)

	const _offsetMatrix = new Matrix4();
	// const _identityMatrix = /*@__PURE__*/ new Matrix4();

	let bones = skeleton.bones
	let boneInverses = skeleton.boneInverses

	let clipSize = bones.length * maxSteps

	patchShader(material, skeleton, clipSize)


	let data = allAnimationData.reduce(([boneMatrices, allClipDurations, allClipSteps], [clip, action], i) => {
		action.play()

		let duration = clip.duration;
		if (duration > maxDuration) {
			throw new Error("err")
		}

		//=frameCount
		// let steps = Math.ceil(duration * fps);
		let steps = Math.floor(duration * fps);

		allClipDurations.push(duration)
		allClipSteps.push(steps)


		//one frame's time
		let stepDuration = 1 / fps;
		mixer.update(0);

		for (let s = 0; s < steps; s++) {
			mixer.update(stepDuration);

			bones.forEach((b) => {
				b.updateMatrixWorld(true)
			})

			// Compute for each animation step the bones matrices
			for (let b = 0; b < bones.length; b++) {
				_offsetMatrix.multiplyMatrices(bones[b].matrixWorld, boneInverses[b]);
				_offsetMatrix.toArray(boneMatrices,
					i * clipSize * 16 +
					(s * bones.length + b) * 16);
			}
		}

		action.stop()

		return [boneMatrices, allClipDurations, allClipSteps]
	}, [[], [], []])
	let boneMatrices = data[0]
	let allClipDurations = data[1]
	let allClipSteps = data[2]


	// Compute/update texture
	let size = Math.sqrt(allAnimationData.length * clipSize * 4); // 4 pixels needed for 1 matrix
	size = MathUtils.ceilPowerOfTwo(size);
	size = Math.max(size, 4);

	let boneMatricesForTexture = new Float32Array(size * size * 4); // 4 floats per RGBA pixel
	boneMatricesForTexture.set(boneMatrices); // copy current values

	const boneTexture = new DataTexture(boneMatricesForTexture, size, size, RGBAFormat, FloatType);
	boneTexture.needsUpdate = true;

	skeleton.boneMatrices = boneMatricesForTexture;
	skeleton.boneTexture = boneTexture;


	// state = setGPUSkinState(state, {
	// 	...getGPUSkinState(state),
	// 	clipDataMap: getGPUSkinState(state).clipDataMap.set(instancedSkinLOD2Name, allClipData)
	// })

	return [state, allClipDurations, allClipSteps]
	// return allClipData
}

// export let getClipData = (state, instancedSkinLOD2Name) => {
// 	return getExn(getGPUSkinState(state).clipDataMap.get(instancedSkinLOD2Name))
// }