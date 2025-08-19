import { Euler, Matrix4, Mesh, Quaternion, Vector3 } from "three"
import { createMesh, createMeshPhongMaterial } from "../NewThreeInstance"
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry'
import { fixZFighting } from "../utils/MaterialUtils"
import { ensureCheck, test } from "../utils/Contract"

const _q1 = new Quaternion();
const _q2 = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();


export let createDecalMaterial = ({ map }) => {
    return fixZFighting(createMeshPhongMaterial({
        // specular: 0x444444,
        map,
        // normalMap: decalNormal,
        // normalScale: new THREE.Vector2(1, 1),
        // shininess: 30,
        transparent: true,
        // transparent: false,
        // wireframe: false
    }))
}

export let getHorizontalOrientation = () => {
    let q1 = _q1.setFromAxisAngle(_v1.set(1, 0, 0), Math.PI / 2)

    return new Euler(0, 0, 0).setFromQuaternion(
        _q2.set(0, 0, 0, 1).premultiply(q1)
    )
}

export let buildScale = (buildingBox) => {
    // return new Vector3(1, 1, 1).multiplyScalar(buildingBox.getSize(new Vector3()).length())


    let size = buildingBox.getSize(_v1)

    // return new Vector3(1, 1, 1).multiplyScalar(Math.max(size.x, size.z)).multiplyScalar(
    return new Vector3(1, 1, 1).multiplyScalar(Math.max(size.x, size.z))
        .multiplyScalar(
            //     // return new Vector3(1, 1, 1).multiplyScalar(
            Math.random() * 1 + 1
        )
}

export let createDecalMesh = ([objQuat, objScale, objGeometry], [position, orientation, scale], decalMaterial, isDebug) => {
    let value = createMesh(new DecalGeometry({
        matrixWorld: new Matrix4().compose(_v1.set(0, 0, 0), objQuat, objScale),
        geometry: objGeometry
    } as Mesh, position, orientation, scale), decalMaterial)

    return ensureCheck(value, () => {
        test("geometry should has attribute", () => {
            return value.geometry.getAttribute("position").array.length > 0
        })
    }, isDebug)
}