import { Mesh, Object3D, BufferGeometry, Material, Texture, ShaderMaterial, SkinnedMesh, Sprite, InstancedMesh } from "three"
import { getWithDefault, map } from "../../utils/NullableUtils";
import { NullableUtils, MutableRecordUtils } from "../../Main";
import { nullable } from "../../utils/nullable";

let _disposeMaterial = (object: Material) => {
    object.onBeforeCompile = null
    object.dispose()
};

let _deepDisposeTexture = (object: Texture) => {
    object.dispose()
    // if (!!data.data) {
    //     data.data = null
    // }

    if (object.source == null || object.source.data == null) {
        return
    }

    let data = object.source.data

    if (!!data.remove) {
        data.remove()
    }

    object.source.data = null
};

let _shallowDisposeTexture = (object: Texture) => {
    object.dispose()
};



export let disposeGeometry = (geometry: BufferGeometry) => {
    geometry.dispose();

    // if (!!geometry.morphAttributes.position) {
    //     geometry.morphAttributes.position = [];
    // }

    // geometry.morphAttributes = {};

    (geometry as any).morphTargets = []
    geometry.morphTargetsRelative = false

    geometry.groups = [];
    geometry.userData = {};
    (geometry as any).bones = null


    geometry.name = '';

    geometry.index = null;
    MutableRecordUtils.forEach(geometry.attributes, (value, key) => {
        geometry.attributes[key] = null
    })
    geometry.attributes = {};


    MutableRecordUtils.forEach(geometry.morphAttributes, (value, key) => {
        geometry.morphAttributes[key] = null
    })
    geometry.morphAttributes = {};

    geometry.morphTargetsRelative = false;

    geometry.groups = [];

    geometry.boundingBox = null;
    geometry.boundingSphere = null;

    geometry.drawRange = { start: 0, count: Infinity };

    // geometry.userData = {};
}

let _disposeObjectMaterial = (object: any) => {
    if (object.material) {
        if (object.material.isMMDToonMaterial) {
            _traverseMaterialsTextures(object.material, _disposeMaterial, _deepDisposeTexture);
        }
        else {
            _traverseMaterialsTextures(object.material, _disposeMaterial, _shallowDisposeTexture);
        }
    }
}

export let disposeSkeleton = (skeleton) => {
    skeleton.dispose()
    skeleton.boneMatrices = null

    skeleton.bones.forEach(bone => {
        deepDispose(bone)
    })
    skeleton.bones = []

    skeleton.boneInverses = []
}

let _disposeObject = (object: nullable<Object3D & Mesh & SkinnedMesh & InstancedMesh>) => {
    // NullableUtils.forEach(object => {
    // object.removeFromParent()
    // object.clear()

    if (object.geometry) {
        disposeGeometry(object.geometry);
    }
    _disposeObjectMaterial(object)
    // if (object instanceof SkinnedMesh) {
    if (!!object.skeleton) {
        disposeSkeleton(object.skeleton)
    }

    if (!!object.dispose) {
        object.dispose()
    }
    // }, object)
};

let _disposeSprite = (object: Sprite) => {
    _disposeObjectMaterial(object)
};

let _deepDispose = (object: any) => {
    if (object instanceof Sprite) {
        _disposeSprite(object)
    }
    else {
        _disposeObject(object as any)
    }
}

export let deepDispose = (
    object: nullable<Object3D>
) => {
    // NullableUtils.forEach(object => {
    _deepDispose(object)

    if (object.traverse) {
        object.traverse((obj) => {
            _deepDispose(obj)
        })
    }
    // }, object)
}

/**
 * Traverse material or array of materials and all nested textures
 * executing there respective callback
 *
 * @param material          Three js Material or array of material
 * @param materialCallback  Material callback
 * @param textureCallback   Texture callback
 */
let _traverseMaterialsTextures = (
    material: Material | Material[],
    materialCallback?: (material: any) => void,
    textureCallback?: (texture: any) => void
) => {
    const traverseMaterial = (mat: Material) => {
        if (materialCallback) materialCallback(mat);

        if (!textureCallback) return;

        if (mat.type == 'MMDToonMaterial') {
            [
                // 'specular',
                // 'opacity',
                // 'diffuse',

                'map',
                'matcap',
                'gradientMap',

                'lightMap',
                // 'lightMapIntensity',

                'aoMap',
                // 'aoMapIntensity',

                // 'emissive',
                'emissiveMap',

                'bumpMap',
                // 'bumpScale',

                'normalMap',
                // 'normalScale',

                // 'displacemantBias',
                'displacemantMap',
                // 'displacemantScale',

                'specularMap',

                'alphaMap',

                // 'reflectivity',
                // 'refractionRatio',
            ].forEach(mapKey => {
                if (getWithDefault(
                    map(map => {
                        return map.isTexture
                    }, mat[mapKey]),
                    false
                )) {
                    textureCallback(mat[mapKey])
                }
            })
        }
        else {
            Object.values(mat)
                .filter((value) => value instanceof Texture)
                .forEach((texture) => textureCallback(texture)
                );
        }



        if ((mat as ShaderMaterial).uniforms)
            Object.values((mat as ShaderMaterial).uniforms)
                .filter(({ value }) => value instanceof Texture)
                .forEach(({ value }) => textureCallback(value))
    };

    if (Array.isArray(material)) {
        material.forEach((mat) => traverseMaterial(mat));
    } else traverseMaterial(material);
}

let _remove = (scene, obj) => {
    let o = obj
    while (!NullableUtils.isNullable(o.parent)) {
        let parent = NullableUtils.getExn(o.parent)
        NullableUtils.getExn(o.parent).remove(o)

        if (parent.uuid == scene.uuid) {
            break
        }

        o = parent
    }
}

export let removeAndDispose = (scene, obj: Object3D) => {
    _remove(scene, obj)

    deepDispose(obj)
}


// export let disposeInstancedMesh = (scene, instancedMesh, renderer, isDisposeGeometry = true) => {
// export let disposeInstancedMesh = (scene, instancedMesh, renderer) => {
//     // Remove from scene
//     _remove(scene, instancedMesh)


//     // // Dispose materials
//     // if (instancedMesh.material) {
//     //     // const materials = Array.isArray(instancedMesh.material)
//     //     //     ? instancedMesh.material
//     //     //     : [instancedMesh.material];

//     //     // materials.forEach(mat => mat.dispose());
//     //     _disposeObjectMaterial(instancedMesh)
//     // }

//     // // Dispose base geometry (if not shared)
//     // if (isDisposeGeometry && instancedMesh.geometry) {
//     //     // instancedMesh.geometry.dispose();
//     //     disposeGeometry(instancedMesh.geometry)
//     // }
//     _disposeObject(instancedMesh)

//     // // Dispose instanced attributes
//     // if (instancedMesh.instanceMatrix) {
//     //     // renderer.deleteAttribute(instancedMesh.instanceMatrix);
//     //     instancedMesh.instanceMatrix = null;
//     // }

//     // if (instancedMesh.instanceColor) {
//     //     // renderer.deleteAttribute(instancedMesh.instanceColor);
//     //     instancedMesh.instanceColor = null;
//     // }

//     // instancedMesh.dispose()
// }