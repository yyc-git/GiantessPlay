import { api } from "type-api/src/Type"
import { state } from "frontend/src/scene3d_layer/type/StateType";
import { buffName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/buff/BuffData";
import { secondUnit } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType";
import { blockName } from "block/src/BlockManagerType";
import { weaponName } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType";


export type blessSingleData = {
    name: buffName,
    time: secondUnit,
    count: number,
}

export enum field {
    emitterSpeed = "emitterSpeed",
    emitterLife = "emitterLife",
    emitterCount = "emitterCount",
    force = "force",
    emitSpeed = "emitSpeed",
}

export type weaponSingleFieldData = {
    name: field,
    text: string,
    ratio: number,
    baseCoin: number,
    coinFactor: number,

    maxValue?: number,
    isInteger?: boolean,
    isSub?: boolean,
}

export type weaponSingleData = {
    name: blockName | weaponName,
    text: string,
    fields: Array<weaponSingleFieldData>,
}



export type service = {
    init: any,
    dispose: any,

    getName,
    trigger,
    getLoadResourceIdData,
    getInteractionConfig,
    getMapResourceId,
    getTriggerData,

    custom?: any,

}