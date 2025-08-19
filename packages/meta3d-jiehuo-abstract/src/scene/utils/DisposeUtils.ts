import { Mesh, Object3D, BufferGeometry, Material, Texture, ShaderMaterial, SkinnedMesh, Sprite } from "three"
import { getWithDefault, map } from "../../utils/NullableUtils";

let _dispose = (object: Material | Texture) => object.dispose();

let _disposeGeometry = (geometry: BufferGeometry) => {
    geometry.dispose()

    // if (!!geometry.morphAttributes.position) {
    //     geometry.morphAttributes.position = [];
    // }

    geometry.morphAttributes = {};

    (geometry as any).morphTargets = []
    geometry.morphTargetsRelative = false
    geometry.attributes = {};
    geometry.groups = [];
    geometry.userData = {};
    (geometry as any).bones = null


    geometry.name = '';

    geometry.index = null;
    geometry.attributes = {};

    geometry.morphAttributes = {};
    geometry.morphTargetsRelative = false;

    geometry.groups = [];

    geometry.boundingBox = null;
    geometry.boundingSphere = null;

    geometry.drawRange = { start: 0, count: Infinity };

    // geometry.userData = {};
}

let _disposeObject = (object: Object3D & Mesh & SkinnedMesh) => {
    if (object.geometry) {
        _disposeGeometry(object.geometry);
    }
    if (object.material) {
        _traverseMaterialsTextures(object.material, _dispose, _dispose);
    }
    if (object instanceof SkinnedMesh) {
        object.skeleton.dispose()
        object.skeleton.boneMatrices = null
        object.skeleton.bones = []
        object.skeleton.boneInverses = []
    }
};

let _disposeSprite = (object: Sprite) => {
    if (object.material) {
        _traverseMaterialsTextures(object.material, _dispose, _dispose);
    }
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
    object: Object3D
) => {
    _deepDispose(object)

    if (object.traverse) {
        object.traverse((obj) => {
            _deepDispose(obj)
        })
    }
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

        // if (mat.type == 'MMDToonMaterial') {
        //     // [
        //     //     // 'specular',
        //     //     // 'opacity',
        //     //     // 'diffuse',

        //     //     'map',
        //     //     'matcap',
        //     //     'gradientMap',

        //     //     'lightMap',
        //     //     // 'lightMapIntensity',

        //     //     'aoMap',
        //     //     // 'aoMapIntensity',

        //     //     // 'emissive',
        //     //     'emissiveMap',

        //     //     'bumpMap',
        //     //     // 'bumpScale',

        //     //     'normalMap',
        //     //     // 'normalScale',

        //     //     // 'displacemantBias',
        //     //     'displacemantMap',
        //     //     // 'displacemantScale',

        //     //     'specularMap',

        //     //     'alphaMap',

        //     //     // 'reflectivity',
        //     //     // 'refractionRatio',
        //     // ].forEach(mapKey => {
        //     //     // if (!!mat[mapKey] && mat[mapKey].isTexture) {
        //     //     if (getWithDefault(
        //     //         map(map => {
        //     //             return map.isTexture
        //     //         }, mat[mapKey]),
        //     //         false
        //     //     )) {
        //     //         textureCallback(mat[mapKey])
        //     //     }
        //     // })
        // }
        // else {
        Object.values(mat)
            .filter((value) => value instanceof Texture)
            .forEach((texture) => textureCallback(texture)
            );
        // }



        if ((mat as ShaderMaterial).uniforms)
            Object.values((mat as ShaderMaterial).uniforms)
                .filter(({ value }) => value instanceof Texture)
                .forEach(({ value }) => textureCallback(value))
    };

    if (Array.isArray(material)) {
        material.forEach((mat) => traverseMaterial(mat));
    } else traverseMaterial(material);
}

export let removeAndDispose = (scene, obj: Object3D) => {
    scene.remove(obj)

    deepDispose(obj)
}