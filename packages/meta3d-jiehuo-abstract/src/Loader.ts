import { getExn, isNullable } from "./utils/NullableUtils"
import { getLoaderState, setLoaderState } from "./state/State"
import { resourceId, resourceType, state } from "./type/StateType"
import { reducePromise } from "./utils/ArrayUtils"
import { TextureLoader, ImageLoader } from "three"
import { MMD } from "./Main"
import { MMDLoaderAnimationObject2 } from "./three/MMDLoader"
import { loadAudio } from "./audio/Audio"

let _onProgressForMMD = (xhr) => {
    if (xhr.lengthComputable) {
        let percentComplete = xhr.loaded / xhr.total * 100;
        // Console.log(Math.round(percentComplete, 2) + '% downloaded');
        // Console.log(Math.round(percentComplete) + '% downloaded');

    }
}

let _loadMMD = (state: state, path) => {
    let loader = MMD.getMMDLoader(state)

    return new Promise<MMDLoaderAnimationObject2>((resolve, reject) => {
        loader.loadWithAnimation2(path[0], path[1], (mmd) => {
            resolve(mmd)
        }, _onProgressForMMD, reject)
    })
}

let _loadAudio = (path) => {
    return loadAudio(path)
}

export let load = (state: state, resourceData: Array<{ id: resourceId, path: string | Array<string> | [string, Array<[string, string]>], type: resourceType }>, setPercentFunc) => {
    setPercentFunc(0)

    let needLoadResourceData = resourceData.filter(({ id }) => {
        return !isResourceLoaded(state, id)
    })

    let count = needLoadResourceData.length

    return reducePromise(needLoadResourceData, (state, { id, path, type }, index) => {
        let promise

        if (type == resourceType.MMD) {
            promise = _loadMMD(state, path as [string, Array<[string, string]>])
        }
        else if (type == resourceType.Audio) {
            promise = _loadAudio(path as Array<string>)
        }
        else {
            let path_: string = path as string

            promise = fetch(path_)
                .then(response => {
                    switch (type) {
                        case resourceType.ArrayBuffer:
                            return response.arrayBuffer()
                        case resourceType.Texture:
                            return new Promise((resolve, reject) => {
                                new TextureLoader().load(path_, resolve, (_) => { }, reject)
                            })
                        // case resourceType.Image:
                        //     return new Promise((resolve, reject) => {
                        //         new ImageLoader().load(path_, resolve, (_) => { }, reject)
                        //     })
                        default:
                            throw new Error("err")
                    }
                })
        }


        return promise.then(resource => {
            setPercentFunc(Math.floor((index + 1) / count * 100))

            return setResource(state, id, resource)
        })
    }, state)
}

export let setResource = (state: state, id, resource) => {
    return setLoaderState(state, {
        ...getLoaderState(state),
        resourceData: getLoaderState(state).resourceData.set(id, resource)
    })
}

export let getResource = <resource>(state: state, id: resourceId): resource => {
    return getExn(getLoaderState(state).resourceData.get(id))
}

export let removeResource = (state: state, id: resourceId) => {
    return setLoaderState(state, {
        ...getLoaderState(state),
        resourceData: getLoaderState(state).resourceData.remove(id)
    })
}

export let removeResources = (state: state, getResourceIdFunc, levelNumber) => {
    return levelNumber.reduce((state, levelNumber) => {
        return removeResource(state, getResourceIdFunc(levelNumber))
    }, state)
}

export let isResourceLoaded = (state: state, id: resourceId) => {
    return getLoaderState(state).resourceData.has(id)
}
