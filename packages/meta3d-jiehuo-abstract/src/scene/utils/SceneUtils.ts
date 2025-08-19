import { AmbientLight } from "three"

export let addAmbientLight = (scene) => {
    let color = 0xFFFFFF;
    let intensity = 1;
    let light = new AmbientLight(color, intensity);
    scene.add(light);

    return scene
}

export let buildResourceId = (getName, levelNumber: number) => {
    return `${getName()}_${levelNumber}`
}
