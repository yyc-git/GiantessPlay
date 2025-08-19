import { CubeTexture, CubeTextureLoader, Scene } from "three";

export let create = (
    url: readonly string[],
    onLoad?,
    onProgress?,
    onError?
) => {
    const skyboxLoader = new CubeTextureLoader();

    return skyboxLoader.load(url, onLoad, onProgress, onError);
}

export let addToScene = (scene: Scene, skyboxTexture: CubeTexture) => {
    scene.background = skyboxTexture

    return scene
}