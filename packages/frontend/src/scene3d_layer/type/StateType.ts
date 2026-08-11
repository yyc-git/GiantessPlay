// import { warehouseScene } from "../script/scene/scene_warehouse/type/StateType"
import { cityScene } from "../script/scene/scene_city/type/StateType"
import { state as abstractState } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Camera } from "three"
import { state as blockState } from "block/src/BlockManagerType"

export type littleManConfig = {
    // isSelectLittleMan: boolean,
    isNotExecuteGiantessAI: boolean,
    // isOnlyStomp: boolean,
    // isOnlyPickup: boolean,
}

export enum language {
    Chinese="Chinese",
    English="English"
}

export type config = {
    // isDebug: boolean,
    // isProduction: boolean

    language: language,

    isStaticCastShadow: boolean,
    isGirlRestoreHp: boolean,

    isFastMove: boolean,
    isNotMoveCollision: boolean,
    isNotDamage: boolean,
    isKeepBig: boolean,
    isShowBox: boolean,
    isPickRangeMax: boolean,
    isOpenSound: boolean,
    isTriggerSpecificGameEvent: boolean,

    littleManConfig: littleManConfig,
}

export enum cameraType {
    No,
    Orbit,
    ThirdPerson,
    FirstPerson,
    Shoot,
}

export type state = {
    block: blockState,
    abstract: abstractState,
    config: config,
    camera: Camera,
    cityScene: cityScene,
    // warehouseScene: warehouseScene

}