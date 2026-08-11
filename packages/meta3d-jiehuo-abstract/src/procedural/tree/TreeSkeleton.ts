import * as THREE from "three";

class TreeSkeleton {
  public positions
  public children
  public treeObj

  constructor(array?) {
    this.positions = [];
    this.children = [];

    let offset = 0;
    array?.forEach((v) => {
      v.toArray(this.positions, offset);
      offset += 3;
    });
  }
  add(child) {
    this.children.push(child);
  }
  setTreeObj(treeObj) {
    this.treeObj = treeObj;
  }
  getRootPosition() {
    return new THREE.Vector3().fromArray(this.positions, 0);
  }
}
export { TreeSkeleton };
