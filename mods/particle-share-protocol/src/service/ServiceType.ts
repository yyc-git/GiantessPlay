import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { particleType } from "particle-protocol/src/state/StateType";

export type service = {
    bindEvent: any,
    unbindEvent: any,

    emit: (state: state, [service, getStateFunc, setStateFunc]: any, particleType_: particleType, param: any, needCollisionCheckLoopCount?: number) => state,
    getAllParticlesForCollisionCheck: (state: state, getStateFunc: any) => number,
}