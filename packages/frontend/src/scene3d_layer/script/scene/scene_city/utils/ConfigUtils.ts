import { NullableUtils } from "meta3d-jiehuo-abstract"
import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import * as CollisionUtils from "meta3d-jiehuo-abstract/src/utils/CollisionUtils"
import { Box3, Box3Helper, Color, Vector3 } from "three"

export let addBox3Helper = CollisionUtils.addBox3Helper

// export let addCubeHelper = (state, scene, box: Box3, colorString) => {
//     let size = box.getSize(new Vector3())

//     let cube = NewThreeInstance.createMesh(
//         NewThreeInstance.createBoxGeometry(size.x * 2, size.y * 2, size.z * 2, 1, 1),
//         NewThreeInstance.createMeshBasicMaterial({
//             color: new Color(colorString),
//         })
//     );

//     // let helper = new Cube(box, colorString)

//     (cube as any).type = "Box3Helper"

//     cube.visible = state.config.isShowBox

//     scene.add(cube)

//     return cube
// }

export let isMaxArmySpeed = () => {
    return NullableUtils.getWithDefault(
        globalThis["isMaxArmySpeed"],
        false
    )
}