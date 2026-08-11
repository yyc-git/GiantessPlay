import { hp } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType";
import { bloodData, categoryName, skinLODData } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";
import { lodQueueIndex, name, stateMachine, tween } from "meta3d-jiehuo-abstract/src/type/StateType";
import { quaternion, vector2 } from "type-api/src/Type";
import type { Map as ImmutableMap } from "immutable"

export enum animationName {
    Idle = "EliteGiantess_Idle",

    Walk = "EliteGiantess_Walk",
    Shake = "EliteGiantess_Shake",
    Death = "EliteGiantess_Death",
    DeathHeadshot = "EliteGiantess_DeathHeadshot",
    // Shoot = "EliteGiantess_Shoot",

    StompLight = "EliteGiantess_StompLight",
    StompHeavy = "EliteGiantess_StompHeavy",
    KickLight = "EliteGiantess_KickLight",
    MagicAttack1 = "EliteGiantess_MagicAttack1",

    PickedControlled = "EliteGiantess_Controlled",
    Lie = "EliteGiantess_Lie",
    StandupFromLie = "EliteGiantess_StandupFromLie",
    // FlyBack = "EliteGiantess_FlyBack",
    // StandupFromFlyBack = "EliteGiantess_StandupFromFlyBack",
    // Dizzy = "EliteGiantess_Dizzy",

    // Emit = "EliteGiantess_Emit",
    // Pointing = "EliteGiantess_Pointing",
}

export type state = {
    eliteGiantessMap: Map<categoryName, skinLODData>,

    // glb: nullable<GLTF>,

    // stateMachineMap: Map<name, stateMachine<state>>,
    stateMachineMap: Map<name, stateMachine<state>>,

    // defenseFactorMap: Map<name, defenseFactor>,
    // moveSpeedMap: Map<name, speed>,
    // attackFactorMap: Map<name, attackFactor>,
    // emitSpeedFactorMap: Map<name, emitSpeedFactor>,
    // critRatioFactorMap: Map<name, critRatioFactor>,
    // missRatioMap: Map<name,>,

    // hpMap: Map<name, hp>,
    hpMap: ImmutableMap<name, hp>,

    moveTweenMap: Map<name, Array<tween>>,

    lodQueueIndexMap: Map<name, lodQueueIndex>,


    // shadowQueueMap: Map<name, LODQueue>,

    bloodData: bloodData,


    allClipDurations: Map<categoryName, Array<number>>,
    allClipSteps: Map<categoryName, Array<number>>,

    moveDataMap: Map<name, Array<vector2>>,

    // crowdPositions: Array<Vector3>,

    // initialQuaternionMap: Map<EliteGiantessData.modelName, Quaternion>,
    initialQuaternionMap: Map<categoryName, quaternion>,

    // rocketQueue: nullable<LODQueue>,
    // rockets: Array<rocket>,

    // commander: commander,

}





