import * as THREE from "three";

export let create = (base_texture) => {
	// const textureLoader = new THREE.TextureLoader();
	// let base_texture = textureLoader.load(base_url);
	// let normal_texture = textureLoader.load(normal_url);
	base_texture.colorSpace = THREE.SRGBColorSpace;
	// base_texture.wrapS = normal_texture.wrapS = THREE.RepeatWrapping;
	// base_texture.wrapT = normal_texture.wrapT = THREE.RepeatWrapping;
	base_texture.wrapS = THREE.RepeatWrapping;
	base_texture.wrapT = THREE.RepeatWrapping;
	let repeatsInwidth = 256,
		repeatsInlength = 256;
	base_texture.repeat.set(repeatsInlength, repeatsInwidth);
	// normal_texture.repeat.set(repeatsInlength, repeatsInwidth);

	return new THREE.MeshPhongMaterial({
		vertexColors: true,
		// color: "white",
		map: base_texture,
		// normalMap: normal_texture,
		// wireframe: true,
	});

}