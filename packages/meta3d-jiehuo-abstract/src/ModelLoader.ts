import type { Object3D } from "three"
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { state } from "./type/StateType"
import { getRenderer } from "./Render"
import { getLoaderState, setLoaderState } from "./state/State"
import { NullableUtils } from "./Main"

export let init = (state: state, renderer) => {
    let dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("./resource/three/draco/gltf/")

    let ktx2Loader = new KTX2Loader()
        .setTranscoderPath("./resource/three/basis/")
        .detectSupport(renderer)


    return Promise.resolve(setLoaderState(state, {
        ...getLoaderState(state),
        fbxLoader: NullableUtils.return_(new FBXLoader()),
        dracoLoader: NullableUtils.return_(dracoLoader),
        ktx2Loader: NullableUtils.return_(ktx2Loader)
    }))
}

export let parseGlb = (state: state, glb: ArrayBuffer, renderer): Promise<GLTF> => {
    return new Promise((resolve, reject) => {
        let { dracoLoader, ktx2Loader } = getLoaderState(state)

        new GLTFLoader(
            // DefaultLoadingManager as any,
        )
            .setDRACOLoader(NullableUtils.getExn(dracoLoader))
            .setMeshoptDecoder(MeshoptDecoder)
            .setKTX2Loader(NullableUtils.getExn(ktx2Loader))
            // .register(Meta3DCameraActive.getExtension)
            // .register(Meta3DCameraController.getExtension)
            // .register(Meta3DScript.getExtension)
            .parse(
                glb,
                "",
                (gltf) => {
                    // resolve(gltf.scene.children[0])

                    // dracoLoader.dispose();
                    // (dracoLoader as any).decoderConfig = {}

                    // ktx2Loader.dispose()



                    resolve(gltf)
                },
                (event) => reject(event)
            )
    })
}

export let parseFbx = (state: state, fbx: ArrayBuffer, path: string): Promise<Object3D> => {
    // return new Promise((resolve, reject) => {
    //     resolve(new FBXLoader().parse(fbx, path))
    // })

    let { fbxLoader } = getLoaderState(state)

    return new Promise((resolve, reject) => {
        // resolve(new FBXLoader().parse(fbx, path))
        resolve(NullableUtils.getExn(fbxLoader).parse(fbx, path))
    }).then((obj: any) => {
        obj.traverse(obj => {
            if (obj.isSkinnedMesh) {
                obj.geometry.FBX_Deformer = null
            }
        })

        return obj
    })
}

/*! need dipose fbxLoader->sceneGraph:
    animations,
    children->animations
* 
*/