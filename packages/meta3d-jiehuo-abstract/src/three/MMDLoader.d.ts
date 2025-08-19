import { Camera, AnimationClip, FileLoader, Loader, LoadingManager, SkinnedMesh } from 'three';

export interface MMDLoaderAnimationObject {
	animation: AnimationClip;
	mesh: SkinnedMesh;
}

/*!edit by meta3d */
export interface MMDLoaderAnimationObject2 {
	animation: Array<[string, AnimationClip]>;
	mesh: SkinnedMesh;
}


export class MMDLoader extends Loader<SkinnedMesh> {
	constructor(manager?: LoadingManager);
	animationBuilder: object;
	animationPath: string;
	loader: FileLoader;
	meshBuilder: object;
	parser: object | null;

	loadAnimation(
		url: string,
		object: SkinnedMesh | Camera,
		onLoad: (object: SkinnedMesh | AnimationClip) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void,
	): void;
	loadPMD(
		url: string,
		onLoad: (object: object) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void,
	): void;
	loadPMX(
		url: string,
		onLoad: (object: object) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void,
	): void;
	loadVMD(
		url: string,
		onLoad: (object: object) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void,
	): void;
	loadVPD(
		url: string,
		isUnicode: boolean,
		onLoad: (object: object) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void,
	): void;
	loadWithAnimation(
		url: string,
		vmdUrl: string | string[],
		onLoad: (object: MMDLoaderAnimationObject) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent) => void,
	): void;
	setAnimationPath(animationPath: string): this;


	/*!edit by meta3d */
	loadWithAnimation2(url: string, allVMDData: Array<[string, string]>, onLoad: (object: MMDLoaderAnimationObject2) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
}
