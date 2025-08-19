import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { damagePart } from "../../../../scene3d_layer/script/scene/scene_city/type/StateType"

export enum mode {
    Default,
    Operate
}

export type dialogueData = nullable<{
    title: string,
    content: string,
    isInMiddle:boolean,
}>

export type giantessStatus = nullable<{
    target: damagePart,

    hpStyle: Record<string, string>,
    hp: number,
    fullHp: number,

    excitementStyle: Record<string, string>,
    excitement: number,
    fullExcitement: number
}>

export type skillStatus = nullable<{
    skillStyle: Record<string, string>,
    value: number,
    fullValue: number,
}>

export type levelStatus = nullable<{
    height: number,
    destroyedRate: number
}>


export type littleManStatus = nullable<{
    hpStyle: Record<string, string>,
    hp: number,
    fullHp: number,
}>

// export type qte = nullable<{
//     speed: number
// }>

export type store = {
    mode: mode,
    isEnterScenario: boolean,
    // isBlackScreenStart: boolean,
    dialogue: dialogueData,
    giantessStatus: giantessStatus,
    skillStatus: skillStatus,
    levelStatus: levelStatus,

    littleManStatus: littleManStatus,

    // qte: 
    qteRandomValue: number,

    operateRandomValue: number,
}
