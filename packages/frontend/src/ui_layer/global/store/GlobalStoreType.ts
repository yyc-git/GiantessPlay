import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"

export enum scene {
    Play = "Play",
    Biwu = "Biwu",
}

export enum page {
    IndexMain,
    Website,
    // Donate,

    Share,
    Setting,
    SelectRoad,
    LittleManSetting,
    GiantessSetting,
    BiwuSetting,
    SelectChapter,
    SelectCharacter,
    SelectLittleMan,
    SelectLevel,
    Explain,
    Scene,

    ErrorHandle
}

export type sceneData = {
    scene: scene,
    levelNumber: number,
}

export type store = {
    currentSceneData: nullable<sceneData>,
    targetSceneData: nullable<sceneData>,
    page: page,
    pageData: nullable<any>
}