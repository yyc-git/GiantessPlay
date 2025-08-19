import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { Bone, Object3D, SkinnedMesh } from "three"

let _buildBoneGroupName = () => "boneGroup"

export let getBonePositionYOffset = (obj: Object3D) => {
    return Object3DUtils.findObjectByName(obj, _buildBoneGroupName()).position.y
}

export let setBonePositionYOffset = (state, obj: Object3D, value) => {
    Object3DUtils.findObjectByName(obj, _buildBoneGroupName()).position.setY(value)

    return state
}

export let setBonePositionOffset = (state, obj: Object3D, value: [number, number, number]) => {
    Object3DUtils.findObjectByName(obj, _buildBoneGroupName()).position.set(...value)

    return state
}


export let addBoneGroup = (obj: Object3D) => {
    let boneGroup = new Object3D()
    boneGroup.name = _buildBoneGroupName()
    // boneGroup.position.setY(getCurrentModelData(state).positionYOffset)

    let isFindFirstBone = false

    obj.traverse(obj => {
        if (isFindFirstBone) {
            return
        }

        if ((obj as Bone).isBone) {
            let parent = obj.parent
            // obj.remove(c)
            boneGroup.add(obj)
            parent.add(boneGroup)

            isFindFirstBone = true
        }
    })

    return obj
}
