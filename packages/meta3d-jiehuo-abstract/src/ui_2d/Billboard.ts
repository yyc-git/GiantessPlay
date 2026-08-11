import * as THREE from "three"
import { getExn, isNullable } from "../utils/NullableUtils"
import { state } from "../type/StateType"
import { Loader, NullableUtils } from "../Main"
import { nullable } from "../utils/nullable"
import { createMesh, createMeshBasicMaterial, createPlaneGeometry } from "../NewThreeInstance"


let _makeLabelCanvas = (text, { baseWidth, size, backgroundColor, textColor }) => {
    const borderSize = 2;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const font = `${size}px bold sans-serif`;

    ctx.font = font;
    const textWidth = ctx.measureText(text).width;
    const doubleBorderSize = borderSize * 2;
    const width = baseWidth + doubleBorderSize;
    const height = size + doubleBorderSize;

    // 设置画布尺寸（仅当尺寸变化时才调整）
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        ctx.font = font; // 尺寸变化后需重新设置字体
    }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';


    if (!isNullable(backgroundColor)) {
        ctx.fillStyle = getExn(backgroundColor)
        ctx.fillRect(0, 0, width, height)
    }

    // scale to fit but don't stretch
    // if (isScale) {
    ctx.translate(width / 2, height / 2)
    const scaleFactor = Math.min(1, baseWidth / textWidth)
    ctx.scale(scaleFactor, 1)
    // }

    ctx.fillStyle = textColor
    ctx.fillText(text, 0, 0)

    return ctx.canvas
}

export let setIsAlwaysShow = (material, isAlwaysShow: boolean) => {
    material.depthTest = !isAlwaysShow

    return material
}

export let createLabal = (text,
    // position: THREE.Vector3,
    {
        // isSizeAttenuation = true,
        // isAlwaysShow = false,
        width,
        size,
        scaleFactor,
        backgroundColor,
        textColor
    }) => {
    let canvas = _makeLabelCanvas(text, { baseWidth: width, size, backgroundColor, textColor })
    let texture = new THREE.CanvasTexture(canvas)
    // because our canvas is likely not a power of 2
    // in both dimensions set the filtering appropriately.
    texture.minFilter = THREE.LinearFilter
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping

    let labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        // sizeAttenuation: isSizeAttenuation
    })
    // labelMaterial.depthTest = !isAlwaysShow


    let label = new THREE.Sprite(labelMaterial)
    // label.position.copy(position)

    // if units are meters then 0.01 here makes size
    // of the label into centimeters.
    let labelBaseScale = 0.01 * scaleFactor
    // let labelBaseScale = 1
    label.scale.x = canvas.width * labelBaseScale
    label.scale.y = canvas.height * labelBaseScale

    // label = setIsAlwaysShow(label, isAlwaysShow)

    label.frustumCulled = false

    return label
}

export let createImage = (
    state: state,
    imageResourceId: string,
    position: nullable<THREE.Vector3>,
    center: nullable<[number, number]>,
    {
        isSizeAttenuation = true,
        isAlwaysShow = false,
        width,
        height,
    }
) => {
    // let canvas = _makeLabelCanvas(ctx, text, { baseWidth: width, size, backgroundColor, textColor })
    // let texture = new THREE.CanvasTexture(canvas)
    // // because our canvas is likely not a power of 2
    // // in both dimensions set the filtering appropriately.
    // texture.minFilter = THREE.LinearFilter
    // texture.wrapS = THREE.ClampToEdgeWrapping
    // texture.wrapT = THREE.ClampToEdgeWrapping

    let texture = Loader.getResource<THREE.Texture>(state, imageResourceId)

    let labelMaterial = new THREE.SpriteMaterial({
        map: texture,
        sizeAttenuation: isSizeAttenuation
    })


    let label = new THREE.Sprite(labelMaterial)

    NullableUtils.forEach(position => {
        label.position.copy(getExn(position))
    }, position)
    NullableUtils.forEach(center => {
        label.center.set(getExn(center)[0], getExn(center)[1])
    }, center)

    label.scale.set(width, height, 1)

    label.material = setIsAlwaysShow(label.material, isAlwaysShow)

    label.updateMatrixWorld(true)

    label.frustumCulled = false

    return label
}

export let createPlaneImage = (
    state: state,
    imageResourceId: string,
    position: nullable<THREE.Vector3>,
    {
        transparent = false,
        alphaTest = 0,
        isAlwaysShow,
        width,
        height,
    }
) => {
    let geo = createPlaneGeometry(width, height)

    let material = createMeshBasicMaterial({ map: Loader.getResource<THREE.Texture>(state, imageResourceId), alphaTest: alphaTest, side: THREE.DoubleSide, transparent: transparent })

    let mesh = createMesh(geo, material)
    mesh.position.copy(position)

    mesh.material = setIsAlwaysShow(mesh.material, isAlwaysShow)

    return mesh
}

/*! refer to: https://discourse.threejs.org/t/how-to-create-progress-bar-in-three-js/43544/3
* 
*/
export let createHpBar = (
    progress: { value: number },
    position: nullable<THREE.Vector3>,
    {
        isSizeAttenuation = true,
        isAlwaysShow = false,
        width,
        height,
    }
) => {
    let labelMaterial = new THREE.SpriteMaterial({
        sizeAttenuation: isSizeAttenuation,
        onBeforeCompile: shader => {
            shader.uniforms.progress = progress
            shader.fragmentShader = `
          #define ss(a, b, c) smoothstep(a, b, c)
          uniform float progress;
          ${shader.fragmentShader}
        `.replace(
                `outgoingLight = diffuseColor.rgb;`,
                `outgoingLight = diffuseColor.rgb;
            vec3 backColor = mix(vec3(0), vec3(0, 0.5, 0), progress);
            float pb = step(progress, vUv.x);
            outgoingLight.rgb = mix(vec3(0, 1, 0), backColor, pb);
          `
            );
            // console.log(shader.fragmentShader);
        }
    } as any)
    labelMaterial.defines = { "USE_UV": "" };

    let label = new THREE.Sprite(labelMaterial)

    NullableUtils.forEach(position => {
        label.position.copy(getExn(position))
    }, position)

    label.center.set(0.5, 0)

    label.scale.set(width, height, 1)

    label.material = setIsAlwaysShow(label.material, isAlwaysShow)

    label.updateMatrixWorld(true)

    label.frustumCulled = false

    return label
}