import { animationName, armorStrength, armorRatio, hp } from "../DataType"
import * as Const from "../Const"
import { getFullHp, getFullHpByUsedGirl } from "../../girl/Girl"
import { collisionPart, damagePart } from "../../type/StateType"
import { mmd, resourceId } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Device } from "meta3d-jiehuo-abstract"
import { getName } from "../../CityScene"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { Object3D, Vector3 } from "three"
import { state } from "../../../../../type/StateType"
import { buildAPI, getAllBlockServiceFuncWithDefault, getAllBlockServiceFuncWithDefault2 } from "../../../../../mod/Mod"
import { modProtocolName } from "../../../../../mod/data/ModData"
import { mmdCharacterData, service } from "mmd-character-protocol/src/service/ServiceType"
import { getLanguageTextData, languageKey } from "../../../../../internation/Data"
import { readState } from "../../../../../state/State"
import { getModAPI } from "../../Mod"
import { getVMDRawData as getVMDRawDataMod } from "../../../../../mod/SkillGiantessMod"
// import { getMMDData, getMMDMaterialFixData as getMMDMaterialFixData, getClothHpData as getClothHpData, getFirstPersonControlsData as getFirstPersonControlsData, getShoeData as getShoeData, getBoneNameForLightStressing as getBoneNameForLightStressingMod } from "../../../../../../mod/mmd/json/MMDData"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();

export enum vmdHeight {
    H150,
    H160,
    H166,
}

// export enum mmdCharacter {
//     None = "None",

//     // Miku = "Miku",
//     // Neru = "Neru",

//     // Luka = "Luka",
//     Meiko = "Meiko",

//     Haku_Lady = "Haku_Lady",
//     // Luoli1 = "Luoli1",

//     // Baixi_Maid = "Baixi_Maid",

//     XiaHui = "XiaHui",
//     Xiaye1 = "Xiaye1",
//     Xiaye2 = "Xiaye2",
//     Nero = "Nero",
//     Changee = "Changee",
//     // Luotianyi = "Luotianyi",
//     Miku1 = "Miku1",
//     Vanilla = "Vanilla",
//     Meibiwusi = "Meibiwusi",
//     Moye = "Moye",



//     Haku_QP = "Haku_QP",
// }
export type mmdCharacter = string

// export type mmdCharacterData = {
//     heightScale: number
// }


// export let handleVMDPath = (mmdCharacter_: mmdCharacter, originPath) => {
export let handleVMDPath = (state, mmdCharacter_, [getNewPathFunc1, getNewPathFunc2], originPath) => {
    // let pOld = "vmd/"
    // let pNew = "vmd_bake_physics/"

    // let p150 = "vmd_150/"
    // let p160 = "vmd_160/"
    // let p166 = "vmd_166/"

    // let name = getName()

    if (originPath.includes("vmd_scenario/")) {
        return originPath
    }

    // originPath = getBlockServiceExn<service>(state, modProtocolName.MMDCharacterProtocol).handleVMDPath(mmdCharacter_ as any, [getNewPathFunc1, getNewPathFunc2], originPath)
    // originPath = getAllBlockServiceFuncWithDefaultAndConcat(state, [service => service.handleVMDPath(mmdCharacter_ as any, [getNewPathFunc1, getNewPathFunc2], originPath), (result, data) => data], modProtocolName.MMDCharacterProtocol, originPath)
    return getAllBlockServiceFuncWithDefault2(state, (originPath, service) => service.handleVMDPath(mmdCharacter_ as any, [getNewPathFunc1, getNewPathFunc2], originPath), modProtocolName.MMDCharacterProtocol, originPath)
}


export let getVMDRawData = (state: state) => {
    return [
        [
            animationName.Idle,

            Const.getIdleAnimationResourcePath(getName())
        ],
        [
            animationName.Walk,
            Const.getWalkAnimationResourcePath(getName())
        ],
        [
            animationName.Run,
            Const.getRunAnimationResourcePath(getName())
        ],
        // [
        //     animationName.Stomp,
        //     Const.getStompAnimationResourcePath(getName())
        // ],


        // [
        //     animationName.BreastPress,
        //     Const.getBreastPressAnimationResourcePath(getName())
        // ],
        [
            animationName.StandToCrawl,
            Const.getStandToCrawlAnimationResourcePath(getName())
        ],
        [
            animationName.CrawlToStand,
            Const.getCrawlToStandAnimationResourcePath(getName())
        ],
        [
            animationName.CrawlMove,
            Const.getCrawlMoveAnimationResourcePath(getName())
        ],
        [
            animationName.KeepCrawl,
            Const.getKeepCrawlAnimationResourcePath(getName())
        ],


        [
            animationName.Pickup,
            Const.getPickupAnimationResourcePath(getName())
        ],
        [
            animationName.Pickdown,
            Const.getPickdonwAnimationResourcePath(getName())
        ],
        [
            animationName.KeepPick,
            Const.getKeepPickAnimationResourcePath(getName())
        ],
        [
            animationName.Pinch,
            Const.getPinchAnimationResourcePath(getName())
        ],
        [
            animationName.Eat,
            Const.getEatAnimationResourcePath(getName())
        ],





        [
            animationName.HeavyStressing,
            Const.getHeavyStressingAnimationResourcePath(getName())
        ],
        [
            animationName.HeavyStressingBreast,
            Const.getHeavyStressingBreastAnimationResourcePath(getName())
        ],
        [
            animationName.HeavyStressingTrigoneAndButt,
            Const.getHeavyStressingTrigoneAndButtAnimationResourcePath(getName())
        ],
        [
            animationName.Death,
            Const.getDeathAnimationResourcePath(getName())
        ],


        [
            animationName.CrawlHeavyStressing,
            Const.getCrawlHeavyStressingAnimationResourcePath(getName())
        ],
        [
            animationName.CrawlHeavyStressingBreast,
            Const.getCrawlHeavyStressingBreastAnimationResourcePath(getName())
        ],
        [
            animationName.CrawlHeavyStressingTrigoneAndButt,
            Const.getCrawlHeavyStressingTrigoneAndButtAnimationResourcePath(getName())
        ],
        [
            animationName.CrawlDeath,
            Const.getCrawlDeathAnimationResourcePath(getName())
        ],




        // [
        //     animationName.Hello,
        //     Const.getHelloAnimationResourcePath(getName())
        // ],
    ].concat(
        getVMDRawDataMod(state)
    )
}

let _getVMDData = (state, mmdCharacter_) => {
    return getVMDRawData(state).map(([animationName_, originPath]) => {
        return [
            animationName_,
            handleVMDPath(state, mmdCharacter_, [path => path, path => path], originPath)
        ]
    })
}

export type allMMDData = Array<[mmdCharacter, resourceId, any, mmdCharacterData]>

export let getAllMMDDataWithVMDData = (state: state, getVMDDataFunc) => {
    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getMMDData(state, getVMDDataFunc, getName()), modProtocolName.MMDCharacterProtocol, [])
}

export let getAllMMDData = (state: state) => {
    return getAllMMDDataWithVMDData(state, _getVMDData)
}

// type materialName = string

// export type mmdMaterialFixData = Array<{
//     mmdCharacter: mmdCharacter,
//     noBlendingMaterialNamesInVivo: Array<materialName>,
//     diffuseFactor?: number
// }>

export let getMMDMaterialFixData = (state: state) => {
    // let result: mmdMaterialFixData = [
    //     {
    //         mmdCharacter: mmdCharacter.Moye,
    //         noBlendingMaterialNamesInVivo: [],
    //         diffuseFactor: 1.2
    //     }
    // ]

    // // if (Device.isVivo()) {
    // if (Device.isAndroid()) {
    //     /*! for vivo
    //     * 
    //     */
    //     return result.concat([
    //         {
    //             mmdCharacter: mmdCharacter.Haku_QP,
    //             noBlendingMaterialNamesInVivo: [
    //                 "身体",
    //             ]
    //         },
    //         {
    //             mmdCharacter: mmdCharacter.Haku_Lady,
    //             noBlendingMaterialNamesInVivo: [
    //                 // "裙子最外层背部蕾丝边",
    //                 // "裙子最外层背部蕾丝黑色",
    //                 "身体",
    //                 "刘海",
    //                 "渣女大波浪用飘柔",
    //                 // "奶罩",
    //                 // "奶罩蕾丝"
    //             ]
    //         },
    //         // {
    //         //     mmdCharacter: mmdCharacter.Baixi_Maid,
    //         //     noBlendingMaterialNamesInVivo: [
    //         //         // "All",
    //         //         "头发",
    //         //         "Skin"
    //         //     ]
    //         // },


    //         {
    //             mmdCharacter: mmdCharacter.XiaHui,
    //             noBlendingMaterialNamesInVivo: [
    //                 "Skin01",
    //                 "skin02",
    //                 // "jacket1",
    //                 "hear1",
    //                 "hear3",
    //                 "Hair",
    //                 "hair2",
    //                 // "jeans1",
    //                 // "jeans2"
    //             ]
    //         },
    //         // {
    //         //     mmdCharacter: mmdCharacter.Baixi_Maid,
    //         //     noBlendingMaterialNamesInVivo: [
    //         //         // "All",
    //         //         "头发",
    //         //         "Skin"
    //         //     ]
    //         // },
    //         {
    //             mmdCharacter: mmdCharacter.Xiaye1,
    //             noBlendingMaterialNamesInVivo: [
    //                 "Body",
    //                 "hair00",
    //                 "hair01",
    //                 // "hairshadow",
    //                 "前发=============",
    //                 "前发丝",
    //                 "呆毛",
    //                 "前长发",
    //             ]
    //         },
    //         {
    //             mmdCharacter: mmdCharacter.Xiaye2,
    //             noBlendingMaterialNamesInVivo: [
    //                 "Leg",
    //                 "後髪",
    //                 "hair00",
    //             ]
    //         },
    //         {
    //             mmdCharacter: mmdCharacter.Nero,
    //             noBlendingMaterialNamesInVivo: [
    //                 "◎Skin",
    //                 "◆后盘发",
    //                 "◆后发",
    //                 "◆前髮",
    //                 "◆前細髮",
    //             ]
    //         },
    //         {
    //             mmdCharacter: mmdCharacter.Changee,
    //             noBlendingMaterialNamesInVivo: [
    //                 "Skin",
    //                 "发辫",
    //                 "hair00",
    //                 "hair01",
    //                 "额前长发",
    //             ]
    //         },
    //         // {
    //         //     mmdCharacter: mmdCharacter.Luotianyi,
    //         //     noBlendingMaterialNamesInVivo: [
    //         //         "Skin",
    //         //         "Leg",
    //         //         "8字辫 系发 组1",
    //         //         "8字辫 组1",
    //         //         "8字辫后发辫 组1",
    //         //         "hair00",
    //         //         "後髪",
    //         //     ]
    //         // },
    //         {
    //             mmdCharacter: mmdCharacter.Miku1,
    //             noBlendingMaterialNamesInVivo: [
    //                 "skin",
    //                 "body00",
    //                 "body01",
    //                 "body_pink",
    //                 "body_green",
    //                 "body_green2",
    //                 "body02",
    //                 "hair00",
    //                 "hair01",
    //                 // "hairshadow",
    //                 "leg",
    //                 "wing",
    //             ]
    //         },
    //         {
    //             mmdCharacter: mmdCharacter.Vanilla,
    //             noBlendingMaterialNamesInVivo: [
    //                 "skin (Instance)",
    //                 "Hair_Aho006a-HairAho (Instance)",
    //                 "Hair_Twin030-HairTwin (Instance)",
    //                 "Hair_R069-HairR (Instance)",
    //                 "Hair_R069-HairAcc (Instance)",
    //                 "Hair_F077-HairF (Instance)",
    //             ]
    //         },
    //         {
    //             mmdCharacter: mmdCharacter.Meibiwusi,
    //             noBlendingMaterialNamesInVivo: [
    //                 "身体",
    //                 "头发",
    //             ]
    //         },
    //         {
    //             mmdCharacter: mmdCharacter.Moye,
    //             noBlendingMaterialNamesInVivo: [
    //                 "体",
    //                 "体（パンツ）",
    //                 "体（手袋）",
    //                 "体（靴下）",
    //                 "前髪１",
    //                 "髪",
    //             ]
    //         },
    //     ])
    //         .concat(

    //             // getBlockServiceExn<service>(state, modProtocolName.MMDCharacterProtocol).getMMDMaterialFixData(getModAPI(state)) as any
    //             getAllBlockServiceFuncWithDefault<service>(state, service => service.getMMDMaterialFixData(getModAPI(state)), modProtocolName.MMDCharacterProtocol, [])
    //         )


    // }

    // return result


    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getMMDMaterialFixData(getModAPI(state)), modProtocolName.MMDCharacterProtocol, [])
}

export let getBody = () => getLanguageTextData(readState(), languageKey.Body)

export let buildShoeDamagePart = () => "鞋"

export let isShoe = (damagePart) => {
    return damagePart == buildShoeDamagePart()
}

// type singleClothCollisionData<collisionPart> = {
//     collisionPart: Array<collisionPart>,
//     damagePart: damagePart,
//     damageParts?: Array<damagePart>,
//     children: Array<singleClothCollisionData<collisionPart>>

// }

// export type clothCollisionData<collisionPart> = Array<{
//     mmdCharacter: mmdCharacter,
//     data: Array<singleClothCollisionData<collisionPart>>
// }>

export let getClothCollisionData = (state: state) => {
    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getClothCollisionData(buildShoeDamagePart()), modProtocolName.MMDCharacterProtocol, [])
}

// export type clothHpData = Array<{
//     mmdCharacter: mmdCharacter,
//     data: Array<{
//         damagePart: damagePart,
//         hp: hp,
//         // defenseFactor: number,
//         armorRatio: armorRatio,
//         armorStrength: armorStrength,
//         stressingFactorWhenDestroyed?: number,
//     }>
// }>

// export enum defenseFactor {
//     VeryHigh = 2,
//     High = 1.5,
//     Middle = 1,
//     Low = 0.5,
//     VeryLow = 0.3,
//     VeryLow2 = 0.1,
// }

// export enum stressingFactorWhenDestroyed {
//     VeryHigh = 4,
//     High = 3,
//     Middle = 2.5,
//     Low = 2,
//     VeryLow = 1.5,
//     VeryLow2 = 1,
// }


export let getClothHpData = (state: state, usedGirl) => {
    let fullHp = getFullHpByUsedGirl(state, usedGirl)

    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getClothHpData(fullHp, getBody(), buildShoeDamagePart()), modProtocolName.MMDCharacterProtocol, [])
}


// export type firstPersonControlsData = Array<{
//     mmdCharacter: mmdCharacter,
//     data: {
//         getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => Vector3,

//         hideMaterialNames: Array<string>,
//     }
// }>

export let getFirstPersonControlsData = (state: state) => {
    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getFirstPersonControlsData(), modProtocolName.MMDCharacterProtocol, [])
}

// type skeletonName = string

// export enum shoeType {
//     None,
//     Heel,
//     Common
// }

// export type shoeData = Array<{
//     mmdCharacter: mmdCharacter,
//     data: {
//         shoeType: shoeType,
//         notIKBones?: Array<{
//             name: skeletonName,
//             yOffset: number
//         }>,
//         ikBones?: Array<{
//             names: Array<skeletonName>,
//             yOffset: number
//         }>,
//         // hideMaterialNames: Array<string>,
//     }
// }>

export let getShoeData = (state: state) => {
    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getShoeData(), modProtocolName.MMDCharacterProtocol, [])
}



// export type boneNameForLightStressing = Array<{
//     mmdCharacter: mmdCharacter,
//     boneName: Record<any, string>,
//     boneAmplitude?: Record<any, number>,
// }>

// export let getBoneNameForLightStressing = (state: state) => {
//     return getAllBlockServiceFuncWithDefault<service>(state, service => service.getBoneNameForLightStressing(), modProtocolName.MMDCharacterProtocol, [])
// }

export let getAttributeData = (state: state) => {
    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getAttributeData(), modProtocolName.MMDCharacterProtocol, [])
}
