import * as THREE from "three";
import { TerrainGeometry } from "./TerrainGeometry";
import * as TerrainMaterial from "./TerrainMaterial"
import { ArrayUtils } from "../Main";
import { findObjectByName } from "../scene/Scene";
import { map } from "../utils/NullableUtils";
import { nullable } from "../utils/nullable";

const _q = new THREE. Quaternion();
const _m = new THREE.Matrix4();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();


let _buildName = () => "Terrain"

export let create = (config) => {
  // TODO move url to Loader.log when loadResource

  let geometry = new TerrainGeometry()
  // geometry.material = material;
  geometry.subdivisions = 300;
  geometry.rangeWidth = 4000;
  geometry.rangeHeight = 4000;
  // geometry.rangeWidth = 2000;
  // geometry.rangeHeight = 2000;
  geometry.minHeight = 0;
  // geometry.maxHeight = 500;
  // geometry.maxHeight = 100;
  geometry.maxHeight = 0.1;
  // geometry.heightMapAsset = wd.LoaderManager.getInstance().get("heightMap");
  geometry.isHeightMapStoreHeightInEachPixel = false;

  // return geometry.loadHeightMap(config.heightMapUrl).then(geometry => {
  //   let material = TerrainMaterial.create(config.baseUrl, config.normalUrl)

  //   let mesh = new THREE.Mesh(geometry.createBufferGeometry(), material);
  //   mesh.userData = {
  //     geometry: geometry
  //   }

  //   return mesh
  // })

  geometry.setMapData(config.heightMap, config.colorMap)

  // let material = TerrainMaterial.create(config.baseUrl, config.normalUrl)
  let material = TerrainMaterial.create(config.baseMap)

  let mesh = new THREE.Mesh(geometry.createBufferGeometry(), material);
  mesh.userData = {
    geometry: geometry
  }

  mesh.name = _buildName()

  return mesh

}

export let buildBigBoundingBox = () => {
	let size = 100000

	return new THREE.Box3().setFromCenterAndSize(_v1.set(0, 0, 0), _v2.set(size, size, size))
}

export let getBoundingBox = (terrainMesh) => {
  terrainMesh.geometry.computeBoundingBox();

  return terrainMesh.geometry.boundingBox;
}

export let getTerrainGeometry = (terrainMesh): TerrainGeometry => {
  return terrainMesh.userData.geometry
}

export let findTerrainGeometry = (scene): nullable<TerrainGeometry> => {
  return map(getTerrainGeometry, findObjectByName(scene, _buildName()))
}

// let _handleRange = (obj, handleFunc, count, terrainMesh, xMin, xMax, zMin, zMax) => {
//   let position = new THREE.Vector3();
//   let quaterion = new THREE.Quaternion();
//   let scale = new THREE.Vector3(1, 1, 1);
//   const y_axis = new THREE.Vector3(0, 1, 0);

//   let x = xMin
//   let z = zMin
//   while (true) {
//     // let y = getHeight(vertices, x, z)
//     let y = getTerrainGeometry(terrainMesh).getHeightAtCoordinates(x, z)

//     x += count
//     if (x > xMax) {
//       x = xMin
//       z += count
//     }

//     if (z > zMax) {
//       break
//     }

//     position.set(x, y, z);
//     quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);

//     obj = handleFunc(obj, position, quaterion, scale)
//   }

//   return obj
// }

export let generateRandomXZ = (rangeWidth, rangeHeight) => {
  return [Math.random() * (rangeWidth * 2) - rangeWidth, Math.random() * (rangeHeight * 2) - rangeHeight]
}

let _getRandomStep = (count) => {
  return Math.random() * count + count / 2
}

export let isInGroups = ([x, z], [xMin, xMax, zMin, zMax]) => {
  let expand = 0

  return x <= xMax + expand && x >= xMin - expand && z <= zMax + expand && z >= zMin - expand
}

let _generateRandomXZ = (xSize, zSize) => {
  let [x, z] = [Math.random() * (xSize * 2) - xSize, Math.random() * (zSize * 2) - zSize]

  if (!isInGroups([x, z], [-xSize / 2, xSize / 2, -zSize / 2, zSize / 2])) {
    return _generateRandomXZ(xSize, zSize)
  }

  return [x, z]
}

let _handleRange = (obj, handleFunc, count, terrainMesh, xSize, zSize) => {
  let position = new THREE.Vector3();
  let quaterion = new THREE.Quaternion();
  let scale = new THREE.Vector3(1, 1, 1);
  const y_axis = new THREE.Vector3(0, 1, 0);

  // let count = 0
  let transforms = []


  ArrayUtils.range(0, count - 1).forEach(() => {
    let [x, z] = _generateRandomXZ(xSize, zSize)
    let y = getTerrainGeometry(terrainMesh).getHeightAtCoordinates(x, z)

    position.set(x, y, z);
    quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);

    transforms.push(
      [
        position.clone(), quaterion.clone(), scale.clone()
      ]
    )
  })

  // while (true) {
  //   // let y = getHeight(vertices, x, z)
  //   let y = getTerrainGeometry(terrainMesh).getHeightAtCoordinates(x, z)

  //   x += _getRandomStep(count)

  //   if (x > xMax) {
  //     x = xMin
  //     z += _getRandomStep(count)
  //   }

  //   if (z > zMax) {
  //     break
  //   }

  //   // if (y <= getTerrainGeometry(terrainMesh).maxHeight && y >= 0) {
  //   // }
  //   position.set(x, y, z);
  //   quaterion.setFromAxisAngle(y_axis, Math.random() * Math.PI * 2);

  //   transforms.push(
  //     [
  //       position.clone(), quaterion.clone(), scale.clone()
  //     ]
  //   )



  //   count += 1
  // }


  obj = handleFunc(obj, transforms, count)

  return obj
}

export let insertRange = (octree, count, terrainMesh, xSize, zSize) => {
  return _handleRange(octree, (octree, transforms, _) => {
    transforms.reduce((octree, [position, quaterion, scale]) => {
      octree.insert(new THREE.Matrix4().compose(position, quaterion, scale))

      return octree
    }, octree)
  }, count, terrainMesh, xSize, zSize)
}

// export let addInstancedMeshRange = (scene, mesh, terrainMesh, [count, xMin, xMax, zMin, zMax]) => {
//   return _handleRange(scene, (scene, transforms, count) => {
//     // let clonedOne: THREE.Mesh = mesh.clone(true)
//     // clonedOne.position.copy(position)
//     // clonedOne.setRotationFromQuaternion(quaterion)
//     // clonedOne.scale.copy(scale)

//     // scene.add(clonedOne)

//     // return scene

//     let instancedMesh = new THREE.InstancedMesh(mesh.geometry, mesh.material, count);

//     instancedMesh = transforms.reduce((instancedMesh, [position, quaterion, scale], i) => {
//       instancedMesh.setMatrixAt(i, new THREE.Matrix4().compose(position, quaterion, scale));

//       return instancedMesh
//     }, instancedMesh)

//     instancedMesh.instanceMatrix.needsUpdate = true

//     scene.add(instancedMesh)

//     return scene
//   }, count, terrainMesh, xMin, xMax, zMin, zMax)
// }