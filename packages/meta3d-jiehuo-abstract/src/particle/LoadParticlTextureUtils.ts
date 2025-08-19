import { getResource, isResourceLoaded, setResource } from "../Loader";
import { BufferAttribute, BufferGeometry, Euler, Points, PointsMaterial, Texture, TextureLoader, Vector3 } from "three";
import { state } from "../type/StateType";

export let load = (state: state, texturePath: string, notFlipY): Promise<[state, Texture]> => {
    let promise
    if (isResourceLoaded(state, texturePath)) {
        promise = Promise.resolve([state, getResource(state, texturePath)])
    }
    else {
        promise = new Promise<Texture>((resolve, reject) => {
            new TextureLoader().load(texturePath, resolve)
        }).then(map => {
            if (notFlipY) {
                map.flipY = false
            }

            state = setResource(state, texturePath, map)

            return [state, map]
        })
    }

    return promise
}