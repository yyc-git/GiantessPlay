import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";

export type service = {
    init: any,
    dispose: any,

    getName: any,
    isControlledState: any,
    createState: any,

    // buildRewardName?:any,
    getRewardData?
}