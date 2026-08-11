import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
/*************************************************************************************
 * CLASS NAME:  Leaf
 * DESCRIPTION: Generate leaf mesh: folded or classic.
 * NOTE:
 *
 *************************************************************************************/
class LeafGeometry {
  public style
  public width
  public height
  public width_foldDegree
  public height_foldDegree
  public verticalAxis

  constructor(
    style,
    width,
    height,
    width_foldDegree = 0,
    height_foldDegree = 0,
    verticalAxis = "y-axis"
  ) {
    this.style = style;
    this.width = width;
    this.height = height;
    this.width_foldDegree = width_foldDegree;
    this.height_foldDegree = height_foldDegree;
    this.verticalAxis = verticalAxis;
  }

  generate() {
    const { style } = this;
    if (style === "folded") return this.generateFolded();
    else if (style === "folded_reverse") return this.generateFolded2();
    else if (style === "classic") return this.generateClassic();
    else if (style === "tile") return this.generateTile();
    else if (style === "cross") return this.generateCross();
    else if (style === "cross_and_reverse") return this.generateCross2();
    else if (style === "surround") return this.generateSurround();
  }

  generateFolded() {
    const { width, height, width_foldDegree, height_foldDegree, verticalAxis } =
      this;
    const geometry = new THREE.BufferGeometry();
    let x = width / 2,
      y = height,
      z = width * width_foldDegree;
    let add_z = height * height_foldDegree;
    const vertices = [
      -x,
      0,
      z,
      0,
      0,
      0,
      x,
      0,
      z,
      -x,
      y / 2,
      z,
      0,
      y / 2,
      0,
      x,
      y / 2,
      z,
      -x,
      y,
      z + add_z,
      0,
      y,
      add_z,
      x,
      y,
      z + add_z,
    ];
    const uvs = [
      0, 0, 0.5, 0, 1, 0, 0, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 0.5, 1, 1, 1,
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
    // if (verticalAxis === "z-axis")
    //   geometry.rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
    return geometry;
  }

  generateFolded2() {
    return this.generateFolded().rotateZ(Math.PI).translate(0, this.height, 0);
  }

  generateClassic() {
    const { width, height, verticalAxis } = this;
    const geometry = new THREE.BufferGeometry();
    const vertices = [
      -1, -0.5, -1, 0, -0.5, -1, 1, -0.5, -1, -1, -0.5, 0, 0, 0, 0, 1, -0.5, 0,
      -1, -0.5, 1, 0, -0.5, 1, 1, -0.5, 1,
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
    if (verticalAxis === "z-axis")
      geometry.rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
    return geometry;
  }

  generateCross() {
    const { width, height, verticalAxis } = this;
    const geometry = new THREE.BufferGeometry();
    const vertices = [
      -width / 2,
      0,
      0,
      width / 2,
      0,
      0,
      width / 2,
      height,
      0,
      -width / 2,
      height,
      0,
      0,
      0,
      -width / 2,
      0,
      0,
      width / 2,
      0,
      height,
      width / 2,
      0,
      height,
      -width / 2,
    ];
    const uvs = [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1];
    const normals = [
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      0,
    ];
    const indices = [0, 1, 2, 2, 3, 0, 4, 5, 6, 6, 7, 4];
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
    if (verticalAxis === "z-axis")
      geometry.rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
    return geometry;
  }

  generateCross2() {
    return this.generateCross().rotateX(Math.PI).translate(0, this.height, 0);
  }

  generateTile() {
    const points = [];
    for (let i = 0; i < 10; i++) {
      let x = (i * Math.PI) / 9;
      points.push(new THREE.Vector3(x, Math.sin(x)));
    }
    const geometry = new THREE.LatheGeometry(points, 12, 0, Math.PI / 2);
    if (this.verticalAxis === "z-axis")
      geometry.rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
    return geometry;
  }

  generateSurround() {
    const geometries = [];
    for (let i = 0; i < 3; i++) {
      let eachgeometry = this.generateClassic()
        .rotateX(Math.PI / 3)
        .translate(0, 0, -0.1)
        .rotateY((i * Math.PI) / 2)
        .translate(0, i / 10, 0);
      geometries.push(eachgeometry);
    }
    return mergeGeometries(geometries, false);
  }
}

export { LeafGeometry };
