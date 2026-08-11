// import * as THREE from "three";
// /*************************************************************************************
//  * CLASS NAME:  ClassicFlower
//  * DESCRIPTION: Generate classic flower mesh.
//  * NOTE:
//  *
//  *************************************************************************************/
// class FruitGeometry {
//   public style
//   public width
//   public height

//   constructor(style, width, height) {
//     this.style = style;
//     this.width = width;
//     this.height = height;
//   }
//   generate() {
//     const { style } = this;
//     if (style === "sphere") return this.generateSphere();
//     else if (style === "cross") return this.generateCross();
//   }
//   generateCross() {
//     const { width, height } = this;
//     const geometry = new THREE.BufferGeometry();
//     const vertices = [
//       -width / 2,
//       0,
//       0,
//       width / 2,
//       0,
//       0,
//       width / 2,
//       height,
//       0,
//       -width / 2,
//       height,
//       0,
//       0,
//       0,
//       -width / 2,
//       0,
//       0,
//       width / 2,
//       0,
//       height,
//       width / 2,
//       0,
//       height,
//       -width / 2,
//     ];
//     const uvs = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
//     const normals = [
//       0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
//       0,
//     ];
//     const indices = [0, 1, 2, 2, 3, 0, 4, 5, 6, 6, 7, 4];
//     geometry.setAttribute(
//       "position",
//       new THREE.BufferAttribute(new Float32Array(vertices), 3)
//     );
//     geometry.setAttribute(
//       "normal",
//       new THREE.BufferAttribute(new Float32Array(normals), 3)
//     );
//     geometry.setAttribute(
//       "uv",
//       new THREE.BufferAttribute(new Float32Array(uvs), 2)
//     );
//     geometry.setIndex(indices);
//     return geometry;
//   }
// }

// export { FruitGeometry };
