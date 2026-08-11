import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { damagePart, fastProp, usedGirl } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType"
import { mmdCharacter } from "../../../../scene3d_layer/script/scene/scene_city/data/mmd/MMDData"
import { upgradeFuncData, upgradeStoreData } from "../../../../scene3d_layer/script/scene/scene_city/data/build/BuildData"
import { tradeName } from "../../../../scene3d_layer/script/scene/scene_city/data/interaction/InteractionData"
import { uiData as uiDataComponent } from "../../page_for_uiapi/components/Type"
import { uiData as sceneUIDataComponent } from "../city/page_for_uiapi/components/Type"
import { List, Map } from "immutable"
// import { uiData as uiDataMod } from "setting-protocol/src/service/ServiceType"

export enum mode {
    Default,
    Operate
}

export type dialogueData = nullable<{
    title: string,
    content: string,
    isInMiddle: boolean,
}>

export type getPropData = nullable<{
    title: string,
    imageSrc: string,
    count: number,
    description: string,
}>

export type gameEventTipData = nullable<{
    description: string,
}>


// export type bossStatus = nullable<{
//     target: damagePart,
//     name: mmdCharacter,

//     hpStyle: Record<string, string>,
//     hp: number,
//     fullHp: number,

//     height: number,

//     usedGirl: usedGirl,

//     // excitementStyle: Record<string, string>,
//     // excitement: number,
//     // fullExcitement: number
// }>
export type bossStatus = Array<{
    target: damagePart,
    name: mmdCharacter,

    hpStyle: Record<string, string>,
    hp: number,
    fullHp: number,

    height: number,

    usedGirl: usedGirl,
}>

export type giantessStatus = nullable<{
    target: damagePart,

    hpStyle: Record<string, string>,
    hp: number,
    fullHp: number,

    excitementStyle: Record<string, string>,
    excitement: number,
    fullExcitement: number,

    lifeCount: number,
}>

export type skillStatus = nullable<{
    skillStyle: Record<string, string>,
    value: number,
    fullValue: number,
}>

export type levelStatus = nullable<{
    height: number,
    // destroyedRate: number
    gem: number,
    coin: number,
}>


export type littleManStatus = nullable<{
    hpStyle: Record<string, string>,
    hp: number,
    fullHp: number,

    lifeCount: number,
}>


export type characterStatus = nullable<{
    isCanSwitchCharacterType: boolean,
}>

// export type qte = nullable<{
//     speed: number
// }>


export type upgradeData = Array<upgradeStoreData>

type isMarkNotOutLevelBuild = boolean

export type tradeData = Array<[tradeName, number, number, string, string, string, isMarkNotOutLevelBuild]>

type nextLevelData = Array<{
    name: string,
    scene: string,
    levelNumber: number,
}>

export type missionComplete = nullable<{
    isShowModal: boolean,
    nextLevelData: nextLevelData,
    // levelGem: number,
    // levelCoin: number,
}>

export type uiData = uiDataComponent

export type sceneUIData = sceneUIDataComponent

// type characterFastPropData = Record<number, {
// type characterFastPropData = Map<number, {
//     usePropFunc: any,
//     propName: string,
//     propImageSrc: string,
//     // count: number,
// }>

// export type fastPropData = {
//     littleMan: characterFastPropData,
//     giantess: characterFastPropData,
// }


export type store = {
    mode: mode,
    isEnterScenario: boolean,
    // isBlackScreenStart: boolean,
    dialogue: dialogueData,
    getProp: getPropData,
    gameEventTip: gameEventTipData,
    bossStatus: bossStatus,
    giantessStatus: giantessStatus,
    playerSkillStatus: skillStatus,
    bossSkillStatus: skillStatus,
    levelStatus: levelStatus,
    characterStatus: characterStatus,

    littleManStatus: littleManStatus,

    // qte: 
    qteRandomValue: number,

    operateRandomValue: number,
    manualUIUpdateRandomValue: number,

    levelBarRandomValue: number,

    upgradeData: upgradeData,

    tradeData: tradeData,

    missionComplete: missionComplete,

    uiData: uiData,
    sceneUIData: sceneUIData,

    // fastPropData: fastProp,
}
