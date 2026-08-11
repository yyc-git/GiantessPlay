import * as THREE from "three";
/*************************************************************************************
 * CLASS NAME:  ClassicFlower
 * DESCRIPTION: Generate classic flower mesh.
 * NOTE:
 *
 *************************************************************************************/
class FlowerGeometry {
  constructor() {}
  generate() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [
      -1, 0.5, -1, 0, 0.5, -1, 1, 0.5, -1, -1, 0.5, 0, 0, 0, 0, 1, 0.5, 0, -1,
      0.5, 1, 0, 0.5, 1, 1, 0.5, 1,
    ];
    const uvs = [
      0, 1, 0.5, 1, 1, 1, 0, 0.5, 0.5, 0.5, 1, 0.5, 0, 0, 0.5, 0, 1, 0,
    ];
    const normals = [
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, 1,
    ];
    const indices = [
      0, 1, 3, 4, 3, 1, 1, 2, 4, 5, 4, 2, 3, 4, 6, 7, 6, 4, 4, 5, 7, 8, 7, 5,
    ];
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    geometry.setAttribute(
      "normal",
      new THREE.BufferAttribute(new Float32Array(normals), 3)
    );
    geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );
    geometry.setIndex(indices);
    return geometry;
  }
}

export { FlowerGeometry };
