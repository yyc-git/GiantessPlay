import { characterType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { modelName } from "../../../scene3d_layer/script/scene/scene_city/little_man_data/ModelData"
import { mmdCharacter } from "../../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData"

export enum scene {
    None = "None",
    Play = "Play",
    // Protect = "Protect",
    Biwu = "Biwu",
}

export enum page {
    IndexMain,
    Website,
    // Donate,
    ActiveCode,
    IndexActiveCode,

    Share,
    Setting,
    Mod,
    // SelectRoad,
    // LittleManSetting,
    // GiantessSetting,
    // BiwuSetting,
    // SelectChapter,
    SelectCharacter,
    SelectLittleMan,
    SelectLevel,
    SelectLittleManCareer,
    SelectGiantessCareer,
    Explain,
    Scene,


    Difficulty,
    LittleManTalent,
    GiantessTalent,

    Login,
    Register,

    // ErrorHandle,
    // NetworkErrorHandle,
}

export type sceneData = {
    scene: scene | string,
    levelNumber: number,
}

export type store = {
    currentSceneData: nullable<sceneData>,
    targetSceneData: nullable<sceneData>,
    page: page,
    // pageData: nullable<any>,
    characterType: characterType,
    character: nullable<modelName | mmdCharacter>
}