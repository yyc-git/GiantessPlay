import { Matrix4, Vector3 } from "three";
import { state } from "../../../../../../type/StateType";
import { modelName } from "../../../army_data/MilltaryBuildingData";
import { getBreastTransformPrefix, getGiantessParentTransform, getGiantessTransformFunc, updateGiantessAddToSkeletonData } from "../../../utils/SkeletonUtils";
import { getBoxForPick, getInitialQuaternion, getLocalTransform, updateTransform } from "../../city1/milltary_building/MilltaryBuilding";
import { getLevelData, setLevelData } from "../../../CityScene";
import * as ShellTurret from "../../city1/milltary_building/ShellTurret";
import { attackTarget, camp, giantessAddToSkeletonData } from "../../../type/StateType";
import { setAllCollisionParts } from "../../../utils/CollisionUtils";
import { collisionPart, pose } from "../../../data/biwu/level3/CollisionShapeData";
import { changePose } from "../../../girl/Pose";

const _v1 = new Vector3();

let _getShellTurretTransformOnBreast = getGiantessTransformFunc(
    (state) => getInitialQuaternion(state, modelName.ShellTurret),

    getBreastTransformPrefix(),

    // new Vector3(-0.1, -0.3, 0),
    // new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    // -1.6, -0.6, 1.5,
    0, 0, 0
)

export let addOnBreast = (state: state) => {
    return ShellTurret.generateTurrets(state, [
        // new Vector3(-80, 0, 70)
        // new Vector3(0, 0, 0)
        new Vector3(-220, 0, 81)
    ], camp.Giantess, attackTarget.None).then(([state, names]) => {
        let name = names[0]
        let queue = ShellTurret.getAllModelQueues(state)[0]

        let index = ShellTurret.getModelQueueIndex(state, name)
        let transform = queue.transforms[index]

        state = setLevelData<giantessAddToSkeletonData>(state, "breast", {
            getTransformFunc: _getShellTurretTransformOnBreast,
            updateTransformFunc: updateTransform,
            getLocalTransformFunc: getLocalTransform,
            getBoxFunc: getBoxForPick,

            queue: queue,
            index: index,
            name: name,
            originTransform: transform.clone(),
        })

        return state
    })
}

let _initAllCollisionParts = (state: state) => {
    return setAllCollisionParts(state, [
        collisionPart.Torso,
        collisionPart.LowBreast,

        collisionPart.TrigoneAndButt,
        collisionPart.LeftBreast,
        collisionPart.RightBreast,
        collisionPart.LeftNipple,
        collisionPart.RightNipple,

        collisionPart.Head,

        collisionPart.LeftFoot1,
        collisionPart.LeftFoot2,
        collisionPart.RightFoot1,
        collisionPart.RightFoot2,
        collisionPart.LeftShank1,
        collisionPart.LeftShank2,
        collisionPart.RightShank1,
        collisionPart.RightShank2,
        collisionPart.LeftThigh,
        collisionPart.RightThigh,
        collisionPart.LeftUpperArm,
        collisionPart.RightUpperArm,
        collisionPart.LeftLowerArm,
        collisionPart.RightLowerArm,
        collisionPart.LeftHand,
        collisionPart.RightHand,

        collisionPart.RightFinger,
        collisionPart.LeftFinger,
    ])
}

export let initWhenImportScene = (state: state) => {
    state = _initAllCollisionParts(state)

    state = changePose(state, pose.Lie)

    return state
}

export let update = (state: state) => {
    return updateGiantessAddToSkeletonData(state, getLevelData<giantessAddToSkeletonData>(state, "breast"), collisionPart.RightBreast, "右胸上2")
}