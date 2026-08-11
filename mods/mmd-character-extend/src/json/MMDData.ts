import { api } from "type-api/src/Type"
import { attributeData, boneNameForLightStressing, clothCollisionData, clothHpData, collisionPart, dataForPartialScale, excitementIncreaseFactor, firstPersonControlsData, initialScale, mmdData, mmdMaterialFixData, pickControlledTransformData, resourceLevel, selectCharacterData, shoeControlledTransformData, shoeData, shoeType, stressingFactorWhenDestroyed } from "mmd-character-protocol/src/service/ServiceType"
import { mmdCharacter } from "./Type"
import { armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, speed, hp, stressingRateFactor, armorType, restoreHpTime, restoreHpSpeedRate, biggerMaxTime, abstorbHpRate } from "frontend/src/scene3d_layer/script/scene/scene_city/data/DataType"
import { luck } from "frontend/src/scene3d_layer/script/scene/scene_city/data/ValueType"
import { language, state } from "frontend/src/scene3d_layer/type/StateType"
import { vmdHeight } from "frontend/src/scene3d_layer/script/scene/scene_city/data/mmd/MMDData"

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [mmdCharacter.Haku_Lady]: "弱音女士",
            [mmdCharacter.Haku_QP]: "弱音旗袍",
            [mmdCharacter.XiaHui]: "夏卉",
            [mmdCharacter.Xiaye1]: "夏夜1",
            [mmdCharacter.Xiaye2]: "夏夜2",
            [mmdCharacter.Nero]: "尼禄",
            [mmdCharacter.Changee]: "嫦娥",
            [mmdCharacter.Miku1]: "初音",
            [mmdCharacter.Vanilla]: "香子兰",
            [mmdCharacter.Meibiwusi]: "梅比乌斯",
            [mmdCharacter.Moye]: "摩耶",
            [mmdCharacter.Lipusi]: "莉普丝",
            [mmdCharacter.Youye]: "柚叶",
            [mmdCharacter.Kongzhilvzhe]: "空之律者",
            [mmdCharacter.Qiyana]: "琪亚娜",
            [mmdCharacter.Noah]: "诺亚",
            [mmdCharacter.Sunxiaomei]: "孙晓美",
            [mmdCharacter.Ciming]: "赤溟",
        },
        [language.English]: {
            [mmdCharacter.Haku_Lady]: mmdCharacter.Haku_Lady,
            [mmdCharacter.Haku_QP]: mmdCharacter.Haku_QP,
            [mmdCharacter.XiaHui]: mmdCharacter.XiaHui,
            [mmdCharacter.Xiaye1]: mmdCharacter.Xiaye1,
            [mmdCharacter.Xiaye2]: mmdCharacter.Xiaye2,
            [mmdCharacter.Nero]: mmdCharacter.Nero,
            [mmdCharacter.Changee]: mmdCharacter.Changee,
            [mmdCharacter.Miku1]: mmdCharacter.Miku1,
            [mmdCharacter.Vanilla]: mmdCharacter.Vanilla,
            [mmdCharacter.Meibiwusi]: mmdCharacter.Meibiwusi,
            [mmdCharacter.Moye]: mmdCharacter.Moye,
            [mmdCharacter.Lipusi]: mmdCharacter.Lipusi,
            [mmdCharacter.Youye]: mmdCharacter.Youye,
            [mmdCharacter.Kongzhilvzhe]: mmdCharacter.Kongzhilvzhe,
            [mmdCharacter.Qiyana]: mmdCharacter.Qiyana,
            [mmdCharacter.Noah]: mmdCharacter.Noah,
            [mmdCharacter.Sunxiaomei]: mmdCharacter.Sunxiaomei,
            [mmdCharacter.Ciming]: mmdCharacter.Ciming,
        },
    }
}

let _replaceVMDPathByReplace = (mmdCharacter_, originPath) => {
    let pOld = "vmd/"
    let p150 = `vmd_150/`
    let p160 = `vmd_160/`
    let p166 = `vmd_166/`

    let target
    switch (_getVMDHeight(mmdCharacter_)) {
        case vmdHeight.H150:
            target = p150
            break
        case vmdHeight.H160:
            target = p160
            break
        case vmdHeight.H166:
            target = p166
            break
    }

    return originPath.replace(pOld, target)
}

// let _replaceVMDPathToNotBakePhysics = (getNewPathFunc2, originPath, prefix) => {
//     // let pOld = "vmd/"
//     // let pNew = "vmd_bake_physics/"
//     let p = "vmd/"

//     // let name = getName()

//     // originPath = originPath.replace(pOld, getNewPathFunc1(pNew))

//     if (!originPath.includes(p)) {
//         return originPath
//     }

//     // return originPath.replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/${prefix}/`))
//     return originPath.replace(/.+\/(vmd_bake_physics\/.+\.vmd)$/, getNewPathFunc2(`mmd-character-extend/src/asset/${prefix}/$1`))
// }

let _replaceVMDPathToBakePhysics = ([getNewPathFunc1, getNewPathFunc2], originPath, prefix, isBakePhysics = true) => {
    let pOld = "vmd/"
    let pNew = isBakePhysics ? "vmd_bake_physics/" : "vmd/"

    let name = getName()

    originPath = originPath.replace(pOld, getNewPathFunc1(pNew))

    if (!originPath.includes(pNew)) {
        return originPath
    }

    // return originPath.replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/${prefix}/`))
    // return originPath.replace(/.+\/(vmd_bake_physics\/.+\.vmd)$/, getNewPathFunc2(`mmd-character-extend/src/asset/${prefix}/$1`))
    return originPath.replace(isBakePhysics ? /.+\/(vmd_bake_physics\/.+\.vmd)$/ : /.+\/(vmd\/.+\.vmd)$/, getNewPathFunc2(`mmd-character-extend/src/asset/${prefix}/$1`))
}

let _getVMDHeight = (mmdCharacter_: mmdCharacter) => {
    switch (mmdCharacter_) {
        case mmdCharacter.Vanilla:
            return vmdHeight.H150
        case mmdCharacter.Ciming:
        case mmdCharacter.Haku_Lady:
        case mmdCharacter.Haku_QP:
        case mmdCharacter.XiaHui:
        case mmdCharacter.Xiaye1:
        case mmdCharacter.Xiaye2:
        case mmdCharacter.Nero:
        case mmdCharacter.Changee:
        case mmdCharacter.Miku1:
        case mmdCharacter.Moye:
        case mmdCharacter.Lipusi:
        case mmdCharacter.Youye:
        case mmdCharacter.Kongzhilvzhe:
        case mmdCharacter.Qiyana:
        case mmdCharacter.Noah:
            return vmdHeight.H160
        case mmdCharacter.Meibiwusi:
        case mmdCharacter.Sunxiaomei:
            return vmdHeight.H166
        default:
            return vmdHeight.H160
    }
}


export let handleVMDPath = (mmdCharacter_: mmdCharacter, [getNewPathFunc1, getNewPathFunc2], originPath) => {
    let pOld = "vmd/"
    // let pNew = "vmd_bake_physics/"

    // let prefix = "mmd-character-extend/src/asset/"

    // let p150 = `vmd_150/`
    // let p160 = `vmd_160/`
    // let p166 = `vmd_166/`
    // let p180 = `vmd_180/`

    // let name = getName()

    // if (originPath.includes("vmd_scenario/")) {
    //     return originPath
    // }

    switch (mmdCharacter_) {
        case mmdCharacter.Xiaye1:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/Tda 夏夜1 HMS illustrious Prom Dress Ver1.00 [Silver]/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "Tda 夏夜1 HMS illustrious Prom Dress Ver1.00 [Silver]")
        case mmdCharacter.Xiaye2:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/TDA 夏夜2 MOON LIGHT DANCER LTY/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "TDA 夏夜2 MOON LIGHT DANCER LTY")
        case mmdCharacter.Moye:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/摩耶ver1.04/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "摩耶ver1.04")
        case mmdCharacter.XiaHui:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/TDA式宴 夏卉/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "TDA式宴 夏卉", false)
        case mmdCharacter.Haku_Lady:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/The TDA Lady Haku Is Trump Ver2.00 [Silver]/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "The TDA Lady Haku Is Trump Ver2.00 [Silver]")
        case mmdCharacter.Haku_QP:
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "旗袍 Haku")
        case mmdCharacter.Changee:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/TDA 嫦娥123话OL装 Ver 1.00/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "TDA 嫦娥123话OL装 Ver 1.00")
        case mmdCharacter.Miku1:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/Tda初音Ver1.10/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "Tda初音Ver1.10")
        case mmdCharacter.Nero:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/TDA Nero Claudius L2 bride Ver 1.00/`))
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "TDA Nero Claudius L2 bride Ver 1.00")
        // return originPath.replace(pOld, p160)
        case mmdCharacter.Lipusi:
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "椛暗式-莉普丝 ver1.12", false)
        // return _replaceVMDPathByReplace(mmdCharacter_, originPath)
        case mmdCharacter.Ciming:
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "赤溟", false)
        // return originPath.replace(pOld, p160)
        case mmdCharacter.Youye:
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "rk4BlcwiQM")
        // return originPath.replace(pOld, p160)
        case mmdCharacter.Kongzhilvzhe:
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "空之律者 改模配布", false)
        // return _replaceVMDPathByReplace(mmdCharacter_, originPath)
        case mmdCharacter.Qiyana:
            // return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "椛暗式-莉普丝 ver1.12")
            // return originPath.replace(pOld, p160)
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "琪亚娜—时砾逐光")
        case mmdCharacter.Noah:
            // return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "椛暗式-莉普丝 ver1.12")
            // return originPath.replace(pOld, p160)
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "Noah_Set_Mark2_1.0", false)
        case mmdCharacter.Sunxiaomei:
            // return originPath.replace(pOld, p160)
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "孙晓美体操服", false)
        case mmdCharacter.Vanilla:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/Vanilla v1.0/`))
            // return _replaceVMDPathByReplace(mmdCharacter_, originPath)
            return _replaceVMDPathToBakePhysics([getNewPathFunc1, getNewPathFunc2], originPath, "Vanilla v1.0", false)


        case mmdCharacter.Meiko:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/Meiko/`))
            return _replaceVMDPathByReplace(mmdCharacter_, originPath)
        case mmdCharacter.Meibiwusi:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/梅比乌斯OL装/`))
            return _replaceVMDPathByReplace(mmdCharacter_, originPath)
        default:
            // throw new Error("err")
            return originPath
    }
}


export let getName = () => "city"

export let getMikuResourcePath = (name) => `./mmd-character-extend/src/asset/miku_v2.pmd`

export let getNeruResourcePath = (name) => `./mmd-character-extend/src/asset/Neru_Akita.pmd`

export let getLukaResourcePath = (name) => `./mmd-character-extend/src/asset/Luka_Megurine.pmd`

export let getMeikoResourcePath = (name) => `./mmd-character-extend/src/asset/Meiko/Meiko_Sakine.pmx`

export let getHakuQPResourcePath = (name) => `./mmd-character-extend/src/asset/旗袍 Haku/tda haku QP.pmx`
// export let getHakuQPResourcePath = (name) => `../Tda Miku Standard Base 2.5/Tda Miku Standard Base 2.5.pmx`

export let getHakuLadyResourcePath = (name) => `./mmd-character-extend/src/asset/The TDA Lady Haku Is Trump Ver2.00 [Silver]/The TDA Lady Haku Is Trump Ver2.00 [Silver].pmx`

// export let getLuoli1ResourcePath = (name) => `../ぷにる/傉偵傞_僶僢僌塃.pmx`

// export let getBaixiMaidResourcePath = (name) => `../女仆白希/女仆白希安全裤.pmx`

export let getXiahuiResourcePath = (name) => `./mmd-character-extend/src/asset/TDA式宴 夏卉/TDA Utage CORAL COAST.pmx`

export let getXiaye1ResourcePath = (name) => `./mmd-character-extend/src/asset/Tda 夏夜1 HMS illustrious Prom Dress Ver1.00 [Silver]/Tda HMS illustrious Prom Dress Ver1.00 [Silver].pmx`

export let getXiaye2ResourcePath = (name) => `./mmd-character-extend/src/asset/TDA 夏夜2 MOON LIGHT DANCER LTY/TDA MOON LIGHT DANCER LTY.pmx`

export let getNeroResourcePath = (name) => `./mmd-character-extend/src/asset/TDA Nero Claudius L2 bride Ver 1.00/TDA Nero Claudius L2 bride.pmx`

export let getChangeeResourcePath = (name) => `./mmd-character-extend/src/asset/TDA 嫦娥123话OL装 Ver 1.00/TDA 嫦娥123话OL装 Ver 1.00.pmx`

// export let getLuotianyiResourcePath = (name) => `../TDA 洛天依旗袍 芒种 Ver1.00/TDA 洛天依旗袍 芒种 Ver1.00.pmx`

export let getMiku1ResourcePath = (name) => `./mmd-character-extend/src/asset/Tda初音Ver1.10/Tda幃弶壒儈僋丒傾儁儞僪_Ver1.10.pmx`

export let getVanillaResourcePath = (name) => `./mmd-character-extend/src/asset/Vanilla v1.0/Vanilla.pmx`

export let getMeibiwusiResourcePath = (name) => `./mmd-character-extend/src/asset/梅比乌斯OL装/梅比乌斯5.0.pmx`

export let getMoyeResourcePath = (name) => `./mmd-character-extend/src/asset/摩耶ver1.04/捁奀夵擇ver1.04.pmx`

export let getLipusiResourcePath = (name) => `./mmd-character-extend/src/asset/椛暗式-莉普丝 ver1.12/椛暗式-莉普丝 ver1.12.pmx`

export let getCimingResourcePath = (name) => `./mmd-character-extend/src/asset/赤溟/赤溟_01.pmx`

export let getYouyeResourcePath = (name) => `./mmd-character-extend/src/asset/rk4BlcwiQM/柚叶泳装.pmx`

export let getKongzhilvzheResourcePath = (name) => `./mmd-character-extend/src/asset/空之律者 改模配布/空之律者.pmx`

export let getQiyanaResourcePath = (name) => `./mmd-character-extend/src/asset/琪亚娜—时砾逐光/琪亚娜1.0.pmx`

export let getNoahResourcePath = (name) => `./mmd-character-extend/src/asset/Noah_Set_Mark2_1.0/Noah_BunnyB_Mark2_1.0.pmx`

export let getSunxiaomeiResourcePath = (name) => `./mmd-character-extend/src/asset/孙晓美体操服/XiaoMeiOriginFix_02_elrein.pmx`


export let getMMDData = (state, getVMDDataFunc, name): Array<mmdData> => {
    return [
        /*! remove Meiko, because pickup vmd not right
        [
            mmdCharacter.Meiko,
            getMeikoResourceId(),
            [
                getMeikoResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Meiko,
                )
            ],
            {
                heightScale: 1
            }
        ],
        */


        // [
        //     mmdCharacter.Haku_QP,
        //     // getHakuQPResourceId(),
        //     mmdCharacter.Haku_QP,
        //     [
        //         getHakuQPResourcePath(getName()),
        //         getVMDDataFunc(state,
        //             mmdCharacter.Haku_QP,
        //         )
        //     ],
        //     {
        //         heightScale: 1
        //     }
        // ],


        [
            mmdCharacter.Haku_Lady,
            mmdCharacter.Haku_Lady,
            [
                getHakuLadyResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Haku_Lady,
                )
            ],
            {
                heightScale: 1
            }
        ],

        [
            mmdCharacter.Haku_QP,
            mmdCharacter.Haku_QP,
            [
                getHakuQPResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Haku_QP,
                )
            ],
            {
                heightScale: 1
            }
        ],

        // [
        // 	mmdCharacter.Luoli1,
        // 	getLuoli1ResourceId(),
        // 	[
        // 		getLuoli1ResourcePath(getName()),
        // 		getVMDDataFunc(state,
        // 			mmdCharacter.Luoli1,
        // 		)
        // 	],
        // 	{
        // 		heightScale: 0.85
        // 	}
        // ],

        // [
        //     mmdCharacter.Baixi_Maid,
        //     getBaixiMaidResourceId(),
        //     [
        //         getBaixiMaidResourcePath(getName()),
        //         getVMDDataFunc(state,
        //             mmdCharacter.Baixi_Maid,
        //         )
        //     ],
        //     {
        //         heightScale: 1
        //     }
        // ],


        [
            mmdCharacter.XiaHui,
            mmdCharacter.XiaHui,
            [
                getXiahuiResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.XiaHui,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Xiaye1,
            mmdCharacter.Xiaye1,
            [
                getXiaye1ResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Xiaye1,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Xiaye2,
            mmdCharacter.Xiaye2,
            [
                getXiaye2ResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Xiaye2,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Nero,
            mmdCharacter.Nero,
            [
                getNeroResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Nero,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Changee,
            mmdCharacter.Changee,
            [
                getChangeeResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Changee,
                )
            ],
            {
                heightScale: 1
            }
        ],
        // [
        //     mmdCharacter.Luotianyi,
        //     mmdCharacter.Luotianyi,
        //     [
        //         getLuotianyiResourcePath(getName()),
        //         getVMDDataFunc(state,
        //             mmdCharacter.Luotianyi,
        //         )
        //     ],
        //     {
        //         heightScale: 1
        //     }
        // ],
        [
            mmdCharacter.Miku1,
            mmdCharacter.Miku1,
            [
                getMiku1ResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Miku1,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Vanilla,
            mmdCharacter.Vanilla,
            [
                getVanillaResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Vanilla,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Meibiwusi,
            mmdCharacter.Meibiwusi,
            [
                getMeibiwusiResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Meibiwusi,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Moye,
            mmdCharacter.Moye,
            [
                getMoyeResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Moye,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Lipusi,
            mmdCharacter.Lipusi,
            [
                getLipusiResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Lipusi,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Ciming,
            mmdCharacter.Ciming,
            [
                getCimingResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Ciming,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Youye,
            mmdCharacter.Youye,
            [
                getYouyeResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Youye,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Kongzhilvzhe,
            mmdCharacter.Kongzhilvzhe,
            [
                getKongzhilvzheResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Kongzhilvzhe,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Qiyana,
            mmdCharacter.Qiyana,
            [
                getQiyanaResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Qiyana,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Noah,
            mmdCharacter.Noah,
            [
                getNoahResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Noah,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Sunxiaomei,
            mmdCharacter.Sunxiaomei,
            [
                getSunxiaomeiResourcePath(getName()),
                getVMDDataFunc(state,
                    mmdCharacter.Sunxiaomei,
                )
            ],
            {
                heightScale: 1
            }
        ],
    ]
}


export let getMMDMaterialFixData = (api: api) => {
    let result: mmdMaterialFixData = [
        // {
        //     mmdCharacter: mmdCharacter.Moye,
        //     noBlendingMaterialNamesInVivo: [],
        //     diffuseFactor: 1.2
        // }
    ]


    if (api.getIsDebug(api.readState())
        || api.Device.isAndroid()
    ) {
        // if (true) {
        /*! for vivo
noBlendingMaterialNamesInVivo should give body,face,hair material name
        * 
        */
        return result.concat([
            {
                mmdCharacter: mmdCharacter.Haku_QP,
                noBlendingMaterialNamesInVivo: [
                    "身体",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Haku_Lady,
                noBlendingMaterialNamesInVivo: [
                    // "裙子最外层背部蕾丝边",
                    // "裙子最外层背部蕾丝黑色",
                    "身体",
                    "刘海",
                    "渣女大波浪用飘柔",
                    // "奶罩",
                    // "奶罩蕾丝"
                ]
            },
            // {
            //     mmdCharacter: mmdCharacter.Baixi_Maid,
            //     noBlendingMaterialNamesInVivo: [
            //         // "All",
            //         "头发",
            //         "Skin"
            //     ]
            // },


            {
                mmdCharacter: mmdCharacter.XiaHui,
                noBlendingMaterialNamesInVivo: [
                    "Skin01",
                    "skin02",
                    // "jacket1",
                    "hear1",
                    "hear3",
                    "Hair",
                    "hair2",
                    // "jeans1",
                    // "jeans2"
                ]
            },
            // {
            //     mmdCharacter: mmdCharacter.Baixi_Maid,
            //     noBlendingMaterialNamesInVivo: [
            //         // "All",
            //         "头发",
            //         "Skin"
            //     ]
            // },
            {
                mmdCharacter: mmdCharacter.Xiaye1,
                noBlendingMaterialNamesInVivo: [
                    "Body",
                    "hair00",
                    "hair01",
                    // "hairshadow",
                    "前发=============",
                    "前发丝",
                    "呆毛",
                    "前长发",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Xiaye2,
                noBlendingMaterialNamesInVivo: [
                    "Leg",
                    "後髪",
                    "hair00",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Nero,
                noBlendingMaterialNamesInVivo: [
                    "◎Skin",
                    "◆后盘发",
                    "◆后发",
                    "◆前髮",
                    "◆前細髮",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Changee,
                noBlendingMaterialNamesInVivo: [
                    "Skin",
                    "发辫",
                    "hair00",
                    "hair01",
                    "额前长发",
                ]
            },
            // {
            //     mmdCharacter: mmdCharacter.Luotianyi,
            //     noBlendingMaterialNamesInVivo: [
            //         "Skin",
            //         "Leg",
            //         "8字辫 系发 组1",
            //         "8字辫 组1",
            //         "8字辫后发辫 组1",
            //         "hair00",
            //         "後髪",
            //     ]
            // },
            {
                mmdCharacter: mmdCharacter.Miku1,
                noBlendingMaterialNamesInVivo: [
                    "skin",
                    "body00",
                    "body01",
                    "body_pink",
                    "body_green",
                    "body_green2",
                    "body02",
                    "hair00",
                    "hair01",
                    // "hairshadow",
                    "leg",
                    "wing",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Vanilla,
                noBlendingMaterialNamesInVivo: [
                    "skin (Instance)",
                    "Hair_Aho006a-HairAho (Instance)",
                    "Hair_Twin030-HairTwin (Instance)",
                    "Hair_R069-HairR (Instance)",
                    "Hair_R069-HairAcc (Instance)",
                    "Hair_F077-HairF (Instance)",

                    // "Face007_EyeL (Instance)",
                    // "Face007_EyeR (Instance)",
                    // "Face007_Mayu (Instance)",
                    // "Face007_Mouth (Instance)",
                    "Face007_Skin (Instance)",
                    // "Face007_SkinAlpha (Instance)",
                    // "Face007_SkinHi (Instance)",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Meibiwusi,
                noBlendingMaterialNamesInVivo: [
                    "身体",
                    "头发",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Moye,
                noBlendingMaterialNamesInVivo: [
                    "体",
                    "体（パンツ）",
                    "体（手袋）",
                    "体（靴下）",
                    "前髪１",
                    "髪",
                ]
            },

            {
                mmdCharacter: mmdCharacter.Lipusi,
                noBlendingMaterialNamesInVivo: [
                    "颜",
                    "体",
                    "右胸",
                    "髪-中刘海",
                    "头-头纱",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Ciming,
                noBlendingMaterialNamesInVivo: [
                    "颜",
                    "颜2",
                    "体",
                    "发",
                    "前发",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Youye,
                noBlendingMaterialNamesInVivo: [
                    "颜",
                    "前髮",
                    "髮",
                    // "髮+",
                    "体",
                    "肌",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Kongzhilvzhe,
                noBlendingMaterialNamesInVivo: [
                    "身体",
                    "hair",
                    "脸",
                    "羽翼",
                    "羽翼甲",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Noah,
                noBlendingMaterialNamesInVivo: [
                    // "赤面",
                    "身体",
                    "顔",
                    "顔_口周辺",
                    "首",
                    "髪",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Qiyana,
                noBlendingMaterialNamesInVivo: [
                    "头发",
                    "皮肤",
                    "脸",
                ]
            },
            {
                mmdCharacter: mmdCharacter.Sunxiaomei,
                noBlendingMaterialNamesInVivo: [
                    "2000_Body",
                    "2000_Body all",
                    "2000_Hair",
                    "2000_Alpha",
                ]
            },
        ])
    }

    return result
}


export let getClothCollisionData = (shoeDamagePart): clothCollisionData<collisionPart> => {
    return [
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            data: [
                {
                    collisionPart: [
                        collisionPart.Torso,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "旗袍",
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,
                            ],
                            damagePart: "胖次",
                            children: []
                        }
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: shoeDamagePart,
                    damageParts: [
                        "鞋底",
                        "鞋面",
                    ],
                    children: [
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            data: [
                {
                    collisionPart: [
                        collisionPart.Head,
                    ],
                    damagePart: "帽子",
                    damageParts: ["帽子", "帽子白色蕾丝花边", "帽子黑色边", "帽子蕾丝内衬", "帽子黑纱蕾丝"],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: shoeDamagePart,
                    damageParts: [
                        "高跟拖鞋",
                        "高跟鞋玫瑰",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftUpperArm,
                        collisionPart.RightUpperArm,
                        collisionPart.LeftLowerArm,
                        collisionPart.RightLowerArm,
                    ],
                    damagePart: "袖子",
                    damageParts: ["袖子", "西服扣子"],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.Torso,
                    ],
                    damagePart: "西服",
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                    ],
                    damagePart: "衬衫",
                    children: [
                        {
                            collisionPart: [
                                collisionPart.LeftBreast,
                                collisionPart.RightBreast,
                            ],
                            damagePart: "奶罩",
                            damageParts: ["奶罩", "奶罩蕾丝"],
                            children: [
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftThigh,
                        collisionPart.RightThigh,
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "裙子包腿",
                    damageParts: ["裙子包腿部分", "裙子包腿部蕾丝"],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,
                            ],
                            damagePart: "三角区蕾丝",
                            damageParts: ["裙子最外层背部蕾丝边", "裙子最外层背部蕾丝黑色"],
                            children: [
                                {
                                    collisionPart: [
                                        collisionPart.TrigoneAndButt,
                                    ],
                                    damagePart: "裤头",
                                    children: [
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.XiaHui,
            data: [
                {
                    collisionPart: [
                        collisionPart.Head,
                    ],
                    damagePart: "头饰",
                    damageParts: ["hat", "glasses"],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: shoeDamagePart,
                    damageParts: [
                        "shoes",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                    ],
                    damagePart: "奶罩",
                    damageParts: ["Bra", "tie"],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "裤子",
                    damageParts: ["jeans1"],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,
                            ],
                            damagePart: "胖次",
                            damageParts: ["jeans2"],
                            children: [
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Xiaye1,
            data: [
                {
                    collisionPart: [
                        collisionPart.Head,
                    ],
                    damagePart: "头饰",
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftThigh,
                        collisionPart.RightThigh,
                        collisionPart.LeftShank,
                        collisionPart.RightShank,
                    ],
                    damagePart: "丝袜",
                    damageParts: [
                        "丝袜",
                        "丝袜足尖",
                    ],
                    children: [
                    ]
                },
                // {
                //     collisionPart: [
                //         collisionPart.LeftFoot,
                //         collisionPart.RightFoot,
                //     ],
                //     damagePart: shoeDamagePart,
                //     damageParts: [
                //         "高跟鞋",
                //     ],
                //     children: [
                //     ]
                // },
                {
                    collisionPart: [
                        collisionPart.LeftLowerArm,
                        collisionPart.RightLowerArm,
                    ],
                    damagePart: "手套",
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                        collisionPart.TrigoneAndButt,
                        collisionPart.Torso
                    ],
                    damagePart: "衣服",
                    damageParts: ["发辫饰带", "礼服内层薄纱", "礼服内层薄纱1"],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt
                            ],
                            damagePart: "胖次",
                            damageParts: ["胖次", "系带", "系带孔", "吊带夹扣"],
                            children: [
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Xiaye2,
            data: [
                {
                    collisionPart: [
                        collisionPart.Torso,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "衣服",
                    damageParts: ["服装 表层", "服装 里层", "兰草1"],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,
                            ],
                            damagePart: "胖次外",
                            damageParts: ["C型胖次1"],
                            children: [
                                {
                                    collisionPart: [
                                        collisionPart.TrigoneAndButt,
                                    ],
                                    damagePart: "胖次内",
                                    damageParts: ["C型胖次"],
                                    children: [
                                    ]
                                },
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: shoeDamagePart,
                    damageParts: [
                        "鞋",
                    ],
                    children: [
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Nero,
            data: [
                {
                    collisionPart: [
                        collisionPart.Head,
                    ],
                    damagePart: "头纱发箍",
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftHand,
                        collisionPart.RightHand,
                        collisionPart.LeftUpperArm,
                        collisionPart.RightUpperArm,
                        collisionPart.LeftLowerArm,
                        collisionPart.RightLowerArm,

                        collisionPart.LeftThigh,
                        collisionPart.RightThigh,
                        collisionPart.LeftShank,
                        collisionPart.RightShank,
                    ],
                    damagePart: "四肢衣服",
                    damageParts: ["手袖", "●金属材質3",],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.LeftThigh,
                                collisionPart.RightThigh,
                                collisionPart.LeftShank,
                                collisionPart.RightShank,
                            ],
                            damagePart: "白丝",
                            damageParts: [
                                "腿 束带",
                                "白丝",
                                "●金属材質4",

                            ],
                            children: [
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: shoeDamagePart,
                    damageParts: [
                        "■高跟鞋",
                        "■鞋跟",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                        collisionPart.Torso,
                    ],
                    damagePart: "衣服",
                    damageParts: [
                        "吊带", "吊带金属夹扣", "服 束缚带",
                        "●金属材質1",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "三角区",
                    damageParts: [
                        "●金属材質2",
                        "●金属材質9",
                        "束带套口"
                    ],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,
                            ],
                            damagePart: "服 束腰带",
                            children: [
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Changee,
            data: [
                {
                    collisionPart: [
                        collisionPart.LeftUpperArm,
                        collisionPart.RightUpperArm,
                        collisionPart.LeftLowerArm,
                        collisionPart.RightLowerArm,

                        collisionPart.Torso,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,

                    ],
                    damagePart: "服装 上衣",
                    damageParts: ["服装 上衣", "袖 扣饰"],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.LeftBreast,
                                collisionPart.RightBreast,
                            ],
                            damagePart: "奶罩",
                            damageParts: ["围颈1"],
                            children: [
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: shoeDamagePart,
                    damageParts: [
                        "围颈 饰物",
                        "鞋 内侧",
                        "鞋底",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "服装 裙",
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,
                            ],
                            damagePart: "胖次",
                            damageParts: [
                                "疑似C裤？",
                            ],
                            children: [
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            data: [
                {
                    collisionPart: [
                        collisionPart.Torso,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,

                    ],
                    damagePart: "上衣",
                    damageParts: ["上衣-内"],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.LeftBreast,
                                collisionPart.RightBreast,
                            ],
                            damagePart: "胸罩",
                            children: [
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: shoeDamagePart,
                    damageParts: [
                        "鞋子",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftThigh,
                        collisionPart.RightThigh,
                        collisionPart.LeftShank,
                        collisionPart.RightShank,

                    ],
                    damagePart: "裤袜",
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "包臀裙",
                    children: [
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Moye,
            data: [
                {
                    collisionPart: [
                        collisionPart.Torso,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,

                    ],
                    damagePart: "胸襟",
                    damageParts: ["服（ネクタイ）"],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.Torso,
                                collisionPart.LeftBreast,
                                collisionPart.RightBreast,
                            ],
                            damagePart: "上衣",
                            damageParts: ["服"],
                            children: [
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Qiyana,
            data: [
                {
                    collisionPart: [
                        collisionPart.RightUpperArm,

                    ],
                    damagePart: "臂甲",
                    damageParts: [
                        "臂甲",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.Head,
                    ],
                    damagePart: "头饰",
                    damageParts: [
                        "头冠",
                        "耳环",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "裙装饰",
                    damageParts: [
                        "裙装饰",
                        "裙装饰带",
                    ],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,
                            ],
                            damagePart: "裙带",
                            damageParts: [
                                "裙带",
                                "裙带1",
                            ],
                            children: [
                                {
                                    collisionPart: [
                                        collisionPart.TrigoneAndButt,
                                    ],
                                    damagePart: "裙子",
                                    damageParts: [
                                        "裙子",
                                    ],
                                    children: [
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Noah,
            data: [
                {
                    collisionPart: [
                        collisionPart.Torso,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                        collisionPart.TrigoneAndButt,

                    ],
                    damagePart: "衣服",
                    damageParts: [
                        "バニースーツ",
                        "バニーしっぽ",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.Head,

                    ],
                    damagePart: "耳",
                    damageParts: [
                        "バニーイヤーバンド",
                    ],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.Head,

                            ],
                            damagePart: "头饰",
                            damageParts: [
                                // "バニーイヤーバンド",
                                "ヘイロー_黒",
                                "ヘイロー_青",
                                "ヘイロー_白",
                                "髪アクセ_白",
                                "髪アクセ_黒",
                                "髪アクセ_青",
                            ],
                            children: [
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftLowerArm,
                        collisionPart.RightLowerArm,
                    ],
                    damagePart: "袖",
                    damageParts: [
                        "バニー袖",
                        "バニー袖ボタン",
                    ],
                    children: [
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Lipusi,
            data: [
                {
                    collisionPart: [
                        collisionPart.Head,

                    ],
                    damagePart: "头纱",
                    damageParts: [
                        "头-头纱",
                        "头-头纱花边"
                    ],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.Head,

                            ],
                            damagePart: "侧头纱",
                            damageParts: [
                                "头-侧头纱",
                                "头-侧头纱花边",
                                "头-头纱结",
                                "头-头纱星",
                            ],
                            children: [
                                {
                                    collisionPart: [
                                        collisionPart.Head,

                                    ],
                                    damagePart: "耳",
                                    damageParts: [
                                        "头-耳",
                                    ],
                                    children: [
                                    ]
                                },
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftLowerArm,
                        collisionPart.RightLowerArm,

                    ],
                    damagePart: "袖口",
                    damageParts: [
                        "袖-袖口",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftUpperArm,
                        collisionPart.RightUpperArm,

                    ],
                    damagePart: "上袖",
                    damageParts: [
                        "袖-上袖结",
                        "袖-上袖花边",
                        "袖-上袖结",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,

                    ],
                    damagePart: "胸花边",
                    damageParts: [
                        "衣-胸花边",
                        "衣-胸花边2",
                        "衣-胸花边2+",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.TrigoneAndButt,

                    ],
                    damagePart: "裙",
                    damageParts: [
                        "裙-黑衬",
                        "裙-裙带",
                        "裙-裙花边1",
                        "衣-裙白衬",
                        "衣-裙白衬2",
                    ],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.TrigoneAndButt,

                            ],
                            damagePart: "皮带",
                            damageParts: [
                                "衣-中皮带前",
                                "衣-中皮带后",
                                "衣-皮带兔尾",
                                "衣-皮带后结",
                            ],
                            children: [
                                {
                                    collisionPart: [
                                        collisionPart.TrigoneAndButt,

                                    ],
                                    damagePart: "兔兔",
                                    damageParts: [
                                        "衣-皮带兔兔",
                                    ],
                                    children: [
                                    ]
                                },
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.Torso,

                    ],
                    damagePart: "衣",
                    damageParts: [
                        "衣-衣下结",
                        "衣-衣侧结",
                        "衣-衣花边带",
                        "衣-贴身",
                        "衣-衣绑绳",
                    ],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.Torso,

                            ],
                            damagePart: "腰带",
                            damageParts: [
                                "衣-腰带",
                                "衣-腰带金属",
                                "衣-下腰带",
                                "衣-下腰带金属",
                            ],
                            children: [
                            ]
                        },
                    ]
                },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Ciming,
            data: [
                {
                    collisionPart: [
                        collisionPart.Head,

                    ],
                    damagePart: "机甲帽",
                    damageParts: [
                        "机甲帽",
                        "机甲帽2"
                    ],
                    children: [
                        {
                            collisionPart: [
                                collisionPart.Head,

                            ],
                            damagePart: "头饰",
                            damageParts: [
                                "头饰",
                            ],
                            children: [
                            ]
                        },
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.RightFoot,
                        collisionPart.LeftFoot,

                    ],
                    damagePart: "鞋",
                    damageParts: [
                        "鞋",
                        "鞋布",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,

                    ],
                    damagePart: "带1",
                    damageParts: [
                        "带1",
                    ],
                    children: [
                    ]
                },
                {
                    collisionPart: [
                        collisionPart.TrigoneAndButt,

                    ],
                    damagePart: "带2",
                    damageParts: [
                        "带2",
                    ],
                    children: [
                    ]
                },
            ]
        },
    ]
}

// export let getClothHpData = (state: state, usedGirl): clothHpData => {
export let getClothHpData = (fullHp, body, shoeDamagePart): clothHpData => {
    // let fullHp = getFullHpByUsedGirl(state, usedGirl)
    return [
        {
            mmdCharacter: mmdCharacter.Meiko,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorStrength: armorStrength.Low,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
            },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Haku_QP,
            data: [{
                damagePart: body,
                hp: fullHp,
                // defenseFactor: defenseFactor.VeryHigh,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.Middle,
            },
            {
                damagePart: shoeDamagePart,
                // hp: fullHp * 0.2,
                hp: fullHp * 0.3,
                armorStrength: armorStrength.Low,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "旗袍",
                hp: fullHp * 0.2,
                armorStrength: armorStrength.Middle,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "胖次",
                hp: fullHp * 0.4,
                armorType: armorType.Giantess, armorRatio: armorRatio.Heavy,
                armorStrength: armorStrength.VeryHigh,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            }]
        },


        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            data: [{
                damagePart: body,
                hp: fullHp,
                // defenseFactor: defenseFactor.High,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.Middle,
            },
            {
                damagePart: shoeDamagePart,
                hp: fullHp * 0.3,
                // hp: fullHp * 0.2,
                //                 armorType: armorType.Giantess,armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "帽子",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            {
                damagePart: "袖子",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "西服",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "衬衫",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "奶罩",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "裙子包腿",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "三角区蕾丝",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "裤头",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },

        // {
        //     mmdCharacter: mmdCharacter.Baixi_Maid,
        //     data: [{
        //         damagePart: body,
        //         hp: fullHp,
        //         armorType: armorType.Giantess,armorRatio: armorRatio.Light,
        //         armorStrength: armorStrength.Low,
        //     },
        //     ]
        // },

        {
            mmdCharacter: mmdCharacter.XiaHui,
            data: [
                {
                    damagePart: body,
                    hp: fullHp,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                    armorStrength: armorStrength.Low,
                },
                {
                    damagePart: shoeDamagePart,
                    hp: fullHp * 0.2,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                    armorStrength: armorStrength.Low,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
                },
                {
                    damagePart: "头饰",
                    hp: fullHp * 0.1,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                    armorStrength: armorStrength.Low,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
                },
                {
                    damagePart: "奶罩",
                    hp: fullHp * 0.2,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                    armorStrength: armorStrength.Middle,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
                },
                {
                    damagePart: "裤子",
                    hp: fullHp * 0.1,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                    armorStrength: armorStrength.Low,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
                },
                {
                    damagePart: "胖次",
                    hp: fullHp * 0.3,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                    armorStrength: armorStrength.High,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
                },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: "头饰",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            {
                damagePart: "丝袜",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            // {
            //     damagePart: shoeDamagePart,
            //     hp: fullHp * 0.2,
            //     armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
            //     armorStrength: armorStrength.Middle,
            //     stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            // },
            {
                damagePart: "手套",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: shoeDamagePart,
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次外",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次内",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Middle,
            },
            {
                damagePart: "头纱发箍",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "四肢衣服",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "白丝",
                hp: fullHp * 0.35,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: shoeDamagePart,
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "三角区",
                hp: fullHp * 0.4,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "服 束腰带",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.VeryHigh,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: shoeDamagePart,
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "服装 上衣",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "奶罩",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "服装 裙",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        // {
        //     mmdCharacter: mmdCharacter.Luotianyi,
        //     data: [{
        //         damagePart: body,
        //         hp: fullHp,
        //     },
        //     ]
        // },
        {
            mmdCharacter: mmdCharacter.Miku1,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: shoeDamagePart,
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "上衣",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胸罩",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "裤袜",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "包臀裙",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: "胸襟",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "上衣",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Qiyana,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: "裙装饰",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "裙带",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Middle,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "裙子",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "头饰",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "臂甲",
                hp: fullHp * 0.2,
                armorType: armorType.Heavy, armorRatio: armorRatio.VeryHeavy,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.5,
                armorType: armorType.Giantess, armorRatio: armorRatio.Middle,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "耳",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "头饰",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "袖",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Low,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.5,
                armorType: armorType.Giantess, armorRatio: armorRatio.Middle,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "头纱",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "侧头纱",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "耳",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "袖口",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            {
                damagePart: "上袖",
                hp: fullHp * 0.1,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                armorStrength: armorStrength.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            {
                damagePart: "胸花边",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "裙",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "皮带",
                hp: fullHp * 0.4,
                armorType: armorType.Giantess, armorRatio: armorRatio.Heavy,
                armorStrength: armorStrength.VeryHigh,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "兔兔",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "衣",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light3,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "腰带",
                hp: fullHp * 0.4,
                armorType: armorType.Giantess, armorRatio: armorRatio.Middle,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Ciming,
            data: [{
                damagePart: body,
                hp: fullHp,
                // armorType: armorType.Giantess, armorRatio: armorRatio.Middle,
                armorType: armorType.Mech, armorRatio: armorRatio.Middle,
                armorStrength: armorStrength.Middle,
            },
            {
                damagePart: "机甲帽",
                hp: fullHp * 0.3,
                armorType: armorType.Mech, armorRatio: armorRatio.Heavy,
                armorStrength: armorStrength.VeryHigh,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "头饰",
                hp: fullHp * 0.2,
                armorType: armorType.Mech, armorRatio: armorRatio.Heavy,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "带1",
                hp: fullHp * 0.2,
                armorType: armorType.Giantess, armorRatio: armorRatio.Heavy,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "带2",
                hp: fullHp * 0.3,
                armorType: armorType.Giantess, armorRatio: armorRatio.Heavy,
                armorStrength: armorStrength.High,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            {
                damagePart: "鞋",
                hp: fullHp * 0.3,
                armorType: armorType.Mech, armorRatio: armorRatio.Middle,
                armorStrength: armorStrength.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryHigh,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Youye,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorStrength: armorStrength.Low,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorStrength: armorStrength.Low,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorStrength: armorStrength.Low,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            data: [{
                damagePart: body,
                hp: fullHp,
                armorStrength: armorStrength.Middle,
                armorType: armorType.Giantess, armorRatio: armorRatio.Light,
            },
            ]
        },
    ]
}

// let _computeVector = (api: api, girl, bone1Name, bone2Name, factor, isNormalize = false) => {
let _computeVector = (api: api, girl, bone1Name, bone2Name, factor) => {
    let bone1 = api.gameObject.getGameObjectByName(girl, bone1Name)
    let p1 = api.gameObject.getWorldPosition(bone1)
    let bone2 = api.gameObject.getGameObjectByName(girl, bone2Name)
    let p2 = api.gameObject.getWorldPosition(bone2)

    let result = api.vector3.sub(
        api.vector3.clone(p2), p1
    )
    // if (isNormalize) {
    //     result = api.vector3.normalize(result)
    // }

    return api.vector3.multiplyScalar(
        result,
        factor
    )
}

let _getMiddlePoint1 = (api: api, girl) => {
    let bone1 = api.gameObject.getGameObjectByName(girl, "左目")
    let p1 = api.gameObject.getWorldPosition(bone1)
    // let bone2 = api.gameObject.getGameObjectByName(girl, "右目")
    // let p2 = api.gameObject.getWorldPosition(bone2)

    return api.vector3.add(api.vector3.clone(p1),
        // api.vector3.multiplyScalar(
        //     api.vector3.sub(
        //         api.vector3.clone(p2), p1
        //     ),
        //     0.5
        // )
        _computeVector(api, girl, "左目", "右目", 0.5)
    )
}

let _getMiddlePoint2 = (api, girl) => {
    let bone1 = api.gameObject.getGameObjectByName(girl, "左目戻")
    let p1 = api.gameObject.getWorldPosition(bone1)
    // let bone2 = api.gameObject.getGameObjectByName(girl, "右目戻")
    // let p2 = api.gameObject.getWorldPosition(bone2)

    return api.vector3.add(api.vector3.clone(p1),
        // api.vector3.multiplyScalar(
        //     api.vector3.sub(
        //         api.vector3.clone(p2), p1
        //     ),
        //     0.5
        // )
        _computeVector(api, girl, "左目戻", "右目戻", 0.5)
    )
}

let _getCameraPositionForFirstPersonControls1 = (api, girl) => {
    let middlePoint = _getMiddlePoint1(api, girl)

    let bone3 = api.gameObject.getGameObjectByName(girl, "メガネ")
    let p3 = api.gameObject.getWorldPosition(bone3)

    // return middlePoint.clone().add(middlePoint.clone().sub(p3).multiplyScalar(10))
    return api.vector3.add(api.vector3.clone(middlePoint),
        api.vector3.multiplyScalar(
            api.vector3.sub(
                api.vector3.clone(middlePoint), p3
            ),
            10
        )
    )
}

let _getCameraPositionForFirstPersonControls2 = (api, girl, backBoneName, frontBoneName, factor) => {
    let middlePoint = _getMiddlePoint1(api, girl)

    // let bone3 = api.gameObject.getGameObjectByName(girl, backBoneName)
    // let p3 = api.gameObject.getWorldPosition(bone3)
    // let bone4 = api.gameObject.getGameObjectByName(girl, frontBoneName)
    // let p4 = api.gameObject.getWorldPosition(bone4)


    // let frontVector = api.vector3.multiplyScalar(
    //     api.vector3.normalize(
    //         api.vector3.sub(
    //             api.vector3.clone(p4), p3
    //         )
    //     ),
    //     factor
    // )
    // let frontVector = _computeVector(api, girl, backBoneName, frontBoneName, factor, true)
    let frontVector = _computeVector(api, girl, backBoneName, frontBoneName, factor)

    return api.vector3.add(api.vector3.clone(middlePoint),
        frontVector
    )
}

let _getCameraPositionForFirstPersonControls3 = (api, girl, factor = 1) => {
    let middlePoint = _getMiddlePoint2(api, girl)

    // let bone1 = api.gameObject.getGameObjectByName(girl, "左目戻")
    // let p1 = api.gameObject.getWorldPosition(bone1)
    // let bone2 = api.gameObject.getGameObjectByName(girl, "左目")
    // let p2 = api.gameObject.getWorldPosition(bone2)

    return api.vector3.add(api.vector3.clone(middlePoint),
        // api.vector3.multiplyScalar(
        //     api.vector3.sub(
        //         api.vector3.clone(p1), p2
        //     ),
        //     factor
        // )
        _computeVector(api, girl, "左目", "左目戻", factor)
    )
}

let _getCameraPositionForFirstPersonControls41 = (api, girl, bone1Name, bone2Name, bone3Name, bone4Name, factor1, factor2, isMiddlePoint1) => {
    let middlePoint
    if (isMiddlePoint1) {
        middlePoint = _getMiddlePoint1(api, girl)
    }
    else {
        middlePoint = _getMiddlePoint2(api, girl)
    }

    let vec1 = _computeVector(api, girl, bone1Name, bone2Name, factor1)
    let vec2 = _computeVector(api, girl, bone3Name, bone4Name, factor2)


    let result = api.vector3.add(api.vector3.clone(middlePoint),
        vec1
    )
    result = api.vector3.add(result,
        vec2
    )

    return result

}

// let _getCameraPositionForFirstPersonControls4 = (api, girl, factor = 1.5) => {
let _getCameraPositionForFirstPersonControls4 = (api, girl, factor1 = 1.5, factor2 = 1) => {
    return _getCameraPositionForFirstPersonControls41(api, girl, "左目", "左目戻", "首", "頭", factor1, factor2, false)
    // let middlePoint = _getMiddlePoint2(api, girl)

    // let vec1 = _computeVector(api, girl, "左目", "左目戻", factor, true)
    // let vec2 = _computeVector(api, girl, "首", "頭", factor, true)


    // let result = api.vector3.add(api.vector3.clone(middlePoint),
    //     vec1
    // )
    // result = api.vector3.add(result,
    //     vec2
    // )

    // return result

}



export let getFirstPersonControlsData = (): firstPersonControlsData => {
    return [
        {
            mmdCharacter: mmdCharacter.Meiko,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    let middlePoint = _getMiddlePoint1(api, girl)

                    let bone3 = api.gameObject.getGameObjectByName(girl, "後髪")
                    let p3 = api.gameObject.getWorldPosition(bone3)

                    // return middlePoint.clone().add(middlePoint.clone().sub(p3).multiplyScalar(0.6))
                    return api.vector3.add(api.vector3.clone(middlePoint),
                        api.vector3.multiplyScalar(
                            api.vector3.sub(
                                api.vector3.clone(middlePoint), p3
                            ),
                            0.6
                        )
                    )
                },
                hideMaterialNames: [
                    "材质2",
                    "材质6",
                    "材质12",
                    "材质13",
                ]
            }

        },
        // {
        //     mmdCharacter: mmdCharacter.Baixi_Maid,
        //     data: {
        //         getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
        //             return girl.getObjectByName("第一視角").getWorldPosition(_v1)
        //         },
        //         hideMaterialNames: [
        //             "脸",
        //             "牙齿",
        //             "眼睛",
        //             "表情"
        //         ]
        //     }

        // },
        {
            mmdCharacter: mmdCharacter.Nero,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api: api, girl) => {
                    let middlePoint = _getMiddlePoint1(api, girl)

                    let bone3 = api.gameObject.getGameObjectByName(girl, "ヘッドセット先")
                    let p3 = api.gameObject.getWorldPosition(bone3)
                    let bone4 = api.gameObject.getGameObjectByName(girl, "両目")
                    let p4 = api.gameObject.getWorldPosition(bone4)

                    // return middlePoint.clone().add(p4.clone().sub(p3).multiplyScalar(6))
                    return api.vector3.add(api.vector3.clone(middlePoint),
                        api.vector3.multiplyScalar(
                            api.vector3.sub(
                                api.vector3.clone(p4), p3
                            ),
                            6
                        )
                    )
                },
                hideMaterialNames: [
                    "◆目",
                    "◆eye_hi",
                    "◆eye_hi2",
                    "◆まつ毛",
                    "◆メガネ",
                    "◆レンズ",
                    "◆顔",
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Changee,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls1,
                hideMaterialNames: [
                    "DumbEyes",
                    "Eyelashes",
                    "Eyes",
                    "New",
                    "eye_hi",
                    "face00",
                    "Eyebrows",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls1,
                hideMaterialNames: [
                    "eye",
                    "eye_hi",
                    "eye_hi2",
                    "face00",
                    "face00R",
                    "face01",
                    "face02",
                    "frame",
                    "cheek",
                    "前发=============",
                    "前发丝",
                    "呆毛",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls1,
                hideMaterialNames: [
                    "目",
                    "eye_hi",
                    "hair00",
                    "顔",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Miku1,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls1,
                hideMaterialNames: [
                    "face00",
                    "face01",
                    "eye_hi",
                    "eye_hi2",
                    "eye_hi2",
                    "lens",
                    "body02",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.XiaHui,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    // let middlePoint = _getMiddlePoint1(api, girl)

                    // let bone3 = girl.getObjectByName("メガネ")
                    // let p3 = bone3.getWorldPosition(_v3)
                    // let bone4 = girl.getObjectByName("頭")
                    // let p4 = bone4.getWorldPosition(_v4)

                    // return middlePoint.clone().add(
                    //     middlePoint.clone().sub(p3).multiplyScalar(10)
                    // ).add(
                    //     p4.clone().sub(p3).multiplyScalar(8)
                    // )
                    let middlePoint = _getMiddlePoint1(api, girl)

                    let bone3 = api.gameObject.getGameObjectByName(girl, "メガネ")
                    let p3 = api.gameObject.getWorldPosition(bone3)
                    let bone4 = api.gameObject.getGameObjectByName(girl, "頭")
                    let p4 = api.gameObject.getWorldPosition(bone4)

                    return api.vector3.add(
                        api.vector3.add(api.vector3.clone(middlePoint),
                            api.vector3.multiplyScalar(
                                api.vector3.sub(
                                    api.vector3.clone(middlePoint), p3
                                ),
                                10
                            )
                        ),
                        api.vector3.multiplyScalar(
                            api.vector3.sub(
                                api.vector3.clone(p4),
                                p3
                            ),
                            8
                        )
                    )

                },
                hideMaterialNames: [
                    "eye",
                    "eye extra",
                    "eye hi",
                    "eye+",
                    "eyebrow",
                    "eyewhite",
                    "face",
                    "mouth",
                    "glasses",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls3,
                hideMaterialNames: [
                    "刘海",
                    "玻璃体",
                    "眉毛",
                    "眼光",
                    "脸",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls3,
                hideMaterialNames: [
                    "眼睛",
                    "眼睛2",
                    "eye_hi",
                    "eye_hi2",
                    "嘴",
                    "前发",
                    "发影",
                    "眼困",
                    "眼白",
                    "睫毛眉毛",
                    "细发",
                    "脸",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    // let middlePoint = _getMiddlePoint1(api, girl)

                    // let bone3 = girl.getObjectByName("Eyepos_R")
                    // let p3 = bone3.getWorldPosition(_v3)
                    // let bone4 = girl.getObjectByName("右目")
                    // let p4 = bone4.getWorldPosition(_v4)

                    // return middlePoint.clone().add(
                    //     p4.clone().sub(p3).multiplyScalar(6)
                    // )

                    let middlePoint = _getMiddlePoint1(api, girl)

                    let bone3 = api.gameObject.getGameObjectByName(girl, "Eyepos_R")
                    let p3 = api.gameObject.getWorldPosition(bone3)
                    let bone4 = api.gameObject.getGameObjectByName(girl, "右目")
                    let p4 = api.gameObject.getWorldPosition(bone4)

                    return api.vector3.add(api.vector3.clone(middlePoint),
                        api.vector3.multiplyScalar(
                            api.vector3.sub(
                                api.vector3.clone(p4), p3
                            ),
                            6
                        )
                    )

                },
                hideMaterialNames: [
                    "Face007_EyeL (Instance)",
                    "Face007_EyeR (Instance)",
                    "Face007_Mayu (Instance)",
                    "Face007_Mouth (Instance)",
                    "Face007_Skin (Instance)",
                    "Face007_SkinAlpha (Instance)",
                    "Face007_SkinHi (Instance)",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    // let middlePoint = _getMiddlePoint1(api, girl)

                    // let bone3 = girl.getObjectByName("メガネ")
                    // let p3 = bone3.getWorldPosition(_v3)

                    // return middlePoint.clone().add(middlePoint.clone().sub(p3).multiplyScalar(10))

                    let middlePoint = _getMiddlePoint1(api, girl)

                    let bone3 = api.gameObject.getGameObjectByName(girl, "メガネ")
                    let p3 = api.gameObject.getWorldPosition(bone3)

                    return api.vector3.add(api.vector3.clone(middlePoint),
                        api.vector3.multiplyScalar(
                            api.vector3.sub(
                                api.vector3.clone(middlePoint), p3
                            ),
                            10
                        )
                    )

                },
                hideMaterialNames: [
                    "眼睛",
                    "脸",
                    "眉毛",
                    "表情",
                    "首",
                ]
            }
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    // let middlePoint = _getMiddlePoint1(api, girl)

                    // let bone3 = girl.getObjectByName("スカート_0_4")
                    // let p3 = bone3.getWorldPosition(_v3)
                    // let bone4 = girl.getObjectByName("スカート_0_0")
                    // let p4 = bone4.getWorldPosition(_v4)

                    // return middlePoint.clone().add(p4.clone().sub(p3).multiplyScalar(1))


                    let middlePoint = _getMiddlePoint1(api, girl)

                    let bone3 = api.gameObject.getGameObjectByName(girl, "スカート_0_4")
                    let p3 = api.gameObject.getWorldPosition(bone3)
                    let bone4 = api.gameObject.getGameObjectByName(girl, "スカート_0_0")
                    let p4 = api.gameObject.getWorldPosition(bone4)

                    return api.vector3.add(api.vector3.clone(middlePoint),
                        api.vector3.multiplyScalar(
                            api.vector3.sub(
                                api.vector3.clone(p4), p3
                            ),
                            1
                        )
                    )
                },
                hideMaterialNames: [
                    "モーフ",
                    "前髪１",
                    "顔（まゆ・まつげ・鼻）",
                    "顔（ハイライト2）",
                    "顔（ハイライト）",
                    "顔（口内）",
                    "顔（歯）",
                    "顔（耳）",
                    "目",
                    "目（ぐるぐる）",
                    "目（しいたけ）",
                    "目（ハート）",
                    "顔（影なし）",
                ]
            }
        },

        {
            mmdCharacter: mmdCharacter.Youye,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    return _getCameraPositionForFirstPersonControls2(api, girl, "左目", "左目光", 1)
                },
                hideMaterialNames: [
                    "颜",
                    "口舌",
                    "齿",
                    "眉",
                    "睫",
                    "白目",
                    "目",
                    "目影",
                    "前髮",
                    "髮+",
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls4,
                hideMaterialNames: [
                    "首",
                    "脸",
                    "口舌",
                    "齿",
                    "眉",
                    "睫",
                    "白目",
                    "目",
                    "二重",
                    "口",
                    "舌",
                    "hair"
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls4,
                hideMaterialNames: [
                    "脸",
                    "眼睛",
                    "表情",
                    "眼白",
                    "头发",
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Noah,
            data: {
                getCameraPositionForFirstPersonControlsFunc: _getCameraPositionForFirstPersonControls4,
                hideMaterialNames: [
                    "まぶた影",
                    "ハイライト",
                    "眉・まぶた",
                    "舌",
                    "表情",
                    "顔",
                    "顔_口周辺",
                    "首",
                    "髪",
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    // let middlePoint = _getMiddlePoint1(api, girl)

                    // let factor = 1

                    // let vec1 = _computeVector(api, girl, "左目", "中劉海三3", 2, true)
                    // let vec2 = _computeVector(api, girl, "首", "頭", factor, true)


                    // let result = api.vector3.add(api.vector3.clone(middlePoint),
                    //     vec1
                    // )
                    // result = api.vector3.add(result,
                    //     vec2
                    // )

                    // return result

                    return _getCameraPositionForFirstPersonControls41(api, girl, "左目", "中劉海三3", "首", "頭", 4, 1, true)
                },
                hideMaterialNames: [
                    "颜",
                    "舌",
                    "口",
                    "白目.001",
                    "目",
                    "眉睫",
                    "齿",
                    "髪-中刘海",
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Ciming,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    return _getCameraPositionForFirstPersonControls41(api, girl, "左胸1", "左胸2", "首", "頭", 5, 1, true)
                },
                hideMaterialNames: [
                    "颜",
                    "颜2",
                    "首",
                    "口舌",
                    "白目",
                    "目",
                    "目光",
                    "眉",
                    "睫",
                    "齿",
                    "前发",
                    "alpha+",
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (api, girl) => {
                    // let middlePoint = _getMiddlePoint1(api, girl)

                    // let vec1 = _computeVector(api, girl, "Hips_R_end", "Hips_R_3", 2, true)

                    // return api.vector3.add(api.vector3.clone(middlePoint),
                    //     vec1
                    // )
                    return _getCameraPositionForFirstPersonControls2(api, girl, "Hips_R_end", "Hips_R_3", 1)
                },
                hideMaterialNames: [
                    "2000_Alpha",
                    "2000_Body",
                    "2000_Hair",
                ]
            }

        },
    ]
}

export let getShoeData = (): shoeData => {
    return [
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            data: {
                shoeType: shoeType.Heel,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -0.9
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +1.15
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            data: {
                shoeType: shoeType.Heel,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -0.9
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +1.5
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            data: {
                shoeType: shoeType.Heel,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -1.3
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +2.1
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            data: {
                shoeType: shoeType.Heel,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -1
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +1.5
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.XiaHui,
            data: {
                shoeType: shoeType.Common,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -1
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +1.0
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            data: {
                shoeType: shoeType.Heel,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -1
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +1.15
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            data: {
                shoeType: shoeType.Heel,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -0.7
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +1
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.Miku1,
            data: {
                shoeType: shoeType.None,
            }
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            data: {
                shoeType: shoeType.Heel,
            }
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            data: {
                shoeType: shoeType.Heel,
            }
        },
        // {
        //     mmdCharacter: mmdCharacter.Baixi_Maid,
        //     data: {
        //         shoeType: shoeType.Common,
        //     }
        // },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            data: {
                shoeType: shoeType.Heel,
                notIKBones: [
                    {
                        name: "全ての親",
                        yOffset: -1
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        yOffset: +1.15
                    }
                ],
            }
        },

        {
            mmdCharacter: mmdCharacter.Youye,
            data: {
                shoeType: shoeType.Common,
            }
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            data: {
                shoeType: shoeType.Common,
            }
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            data: {
                shoeType: shoeType.Heel,
            }
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            data: {
                shoeType: shoeType.Heel,
            }
        },
        {
            mmdCharacter: mmdCharacter.Ciming,
            data: {
                shoeType: shoeType.RearHeel,
                notIKBones: [
                    {
                        name: "全ての親",
                        // yOffset: -1.3
                        yOffset: -1.82
                    }
                ],
                ikBones: [
                    {
                        names: ["右つま先ＩＫ", "左つま先ＩＫ"],
                        // yOffset: +1.15
                        yOffset: +1.4
                    }
                ],
            }
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            data: {
                shoeType: shoeType.None,
            }
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            data: {
                shoeType: shoeType.Common,
            }
        },
    ]
}


export let getBoneNameForLightStressing = (): boneNameForLightStressing => {
    return [
        {
            mmdCharacter: mmdCharacter.Vanilla,
            boneName: {
                [collisionPart.RightBreast]: "右胸操作",
                [collisionPart.LeftBreast]: "左胸操作",
            }
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            }
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            }
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            }
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            }
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            },
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            },
            boneAmplitude: {
                [collisionPart.RightBreast]: 30,
                [collisionPart.LeftBreast]: 30,
            }
        },
        // {
        //     mmdCharacter: mmdCharacter.Baixi_Maid,
        //     boneName: {
        //         [collisionPart.RightBreast]: "右胸上2",
        //         [collisionPart.LeftBreast]: "左胸上2",
        //     }
        // },
        {
            mmdCharacter: mmdCharacter.Changee,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            }
        },

        {
            mmdCharacter: mmdCharacter.Miku1,
            boneName: {
                [collisionPart.RightBreast]: "右胸１",
                [collisionPart.LeftBreast]: "左胸１",
            },
            boneAmplitude: {
                [collisionPart.RightBreast]: 8,
                [collisionPart.LeftBreast]: 8,
            }
        },

        {
            mmdCharacter: mmdCharacter.Moye,
            boneName: {
                [collisionPart.RightBreast]: "右胸",
                [collisionPart.LeftBreast]: "左胸",

                [collisionPart.TrigoneAndButt]: "下半身",
            }
        },

        {
            mmdCharacter: mmdCharacter.Youye,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            },
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            },
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            },
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            boneName: {
                [collisionPart.RightBreast]: "右胸",
                [collisionPart.LeftBreast]: "左胸",
            },
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            boneName: {
                [collisionPart.RightBreast]: "右胸２",
                [collisionPart.LeftBreast]: "左胸２",
            },
            // boneAmplitude: {
            //     [collisionPart.RightBreast]: 30,
            //     [collisionPart.LeftBreast]: 30,
            // }
        },
        {
            mmdCharacter: mmdCharacter.Ciming,
            boneName: {
                [collisionPart.RightBreast]: "右胸4",
                [collisionPart.LeftBreast]: "左胸4",
            },
            // boneAmplitude: {
            //     [collisionPart.RightBreast]: 40,
            //     [collisionPart.LeftBreast]: 40,
            // }
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            boneName: {
                [collisionPart.RightBreast]: "breast_R.002_2",
                [collisionPart.LeftBreast]: "breast_L.002_2",

                [collisionPart.TrigoneAndButt]: "下半身",
            },
        },

    ]
}

export let getDataForPartialScale = (): dataForPartialScale => {
    return [
        {
            mmdCharacter: mmdCharacter.Ciming,
            scaleZForBreast: 0.9,
            scaleXYForBreast: 0.6,
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            scaleZForBreast: 1.25,
            scaleXYForBreast: 0.6,
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            scaleZForBreast: 1.25,
            scaleXYForBreast: 0.6,
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            scaleZForBreast: 6,
            scaleXYForBreast: 0.2,
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            scaleZForBreast: 3,
            scaleXYForBreast: 0.2,
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            scaleZForBreast: 3,
            scaleXYForBreast: 0.2,
        },
        {
            mmdCharacter: mmdCharacter.Youye,
            scaleZForBreast: 1.8,
            scaleXYForBreast: 0.4,
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            scaleZForBreast: 1.8,
            scaleXYForBreast: 0.4,
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            scaleZForBreast: 1.25,
            scaleXYForBreast: 0.6,
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            scaleZForBreast: 6,
            scaleXYForBreast: 0.2,
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            scaleZForBreast: 3,
            scaleXYForBreast: 0.2,
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            scaleZForBreast: 1.25,
            scaleXYForBreast: 0.6,
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            scaleZForBreast: 1.25,
            scaleXYForBreast: 0.6,
        },
        // {
        //     mmdCharacter: mmdCharacter.XiaHui,
        //     scaleZForBreast: 1.25,
        //     scaleXYForBreast: 0.6,
        // },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            // scaleZForBreast: 1.25,
            scaleZForBreast: 2,
            // scaleXYForBreast: 0.6,
            scaleXYForBreast: 0.8,
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            scaleZForBreast: 3,
            scaleXYForBreast: 0.4,
        },
        // {
        //     mmdCharacter: mmdCharacter.Sunxiaomei,
        //     scaleZForBreast: 1.25,
        //     scaleXYForBreast: 0.6,
        // },
    ]
}


export let getPickedTransform = (): pickControlledTransformData => {
    // let positionOffset: [number, number, number] = [-0.5, -0.7, 0]
    let positionOffset: [number, number, number] = [-0.5, -0.6, 0]

    return [
        {
            mmdCharacter: mmdCharacter.Ciming,
            positionOffset: [-0.6, -0.7, 0]
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            positionOffset: [-0.7, -0.7, 0]
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.XiaHui,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Miku1,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Youye,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            positionOffset: [-0.5, -0.8, 0]
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            positionOffset: [-0.5, -0.9, 0]
        },
    ]
}

export let getUBControlledTransform = (): pickControlledTransformData => {
    // let positionOffset: [number, number, number] = [0, -1.7, 0.2]
    let positionOffset: [number, number, number] = [0, -1.7, 0.1]

    return [
        {
            mmdCharacter: mmdCharacter.Ciming,
            positionOffset: [0, -1.4, 0]
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            positionOffset: [0, -2.6, 0.2]
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.XiaHui,
            positionOffset: [0, -1.4, 0]
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            positionOffset: [0, -0.9, 0]
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            positionOffset: [0, -1.6, 0]
        },
        {
            mmdCharacter: mmdCharacter.Miku1,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            positionOffset: [0, -1.5, -0.37]
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            positionOffset: [0, -2.1, 0]
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            positionOffset: [0, -2.0, 0.1]
        },
        {
            mmdCharacter: mmdCharacter.Youye,
            positionOffset: [0, -1.4, 0]
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            positionOffset: [0, -1.6, 0.1]
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            positionOffset
        },
    ]
}

export let getPutToBreastTransform = (): pickControlledTransformData => {
    let positionOffset: [number, number, number] = [0, 1.3, 0.9]
    return [
        {
            mmdCharacter: mmdCharacter.Ciming,
            positionOffset: [0, 1.12, 1.12]
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            positionOffset: [0, 1.6, 1.6]
        },


        // // {
        // //     mmdCharacter: mmdCharacter.Haku_Lady,
        // //     positionOffset: [0, 0, 0.1]
        // // },
        // // {
        // //     mmdCharacter: mmdCharacter.Haku_QP,
        // //     positionOffset: [0, 0, 0.1]
        // // },
        // {
        //     mmdCharacter: mmdCharacter.Nero,
        //     positionOffset: [0, 0, 0.1]
        // },
        // {
        //     mmdCharacter: mmdCharacter.Xiaye1,
        //     positionOffset: [0, 0, 0.1]
        // },
        // {
        //     mmdCharacter: mmdCharacter.XiaHui,
        //     positionOffset: [0, 0.4, 0.2]
        // },
        // {
        //     mmdCharacter: mmdCharacter.Miku1,
        //     positionOffset: [0, 0.4, 0.2]
        // },
        // {
        //     mmdCharacter: mmdCharacter.Kongzhilvzhe,
        //     positionOffset: [0, 0.1, 0.1]
        // },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            // positionOffset: [0, 1.2, 0.9]
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.XiaHui,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            // positionOffset: [0, 1.3, 1]
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            positionOffset: [0, 1.3, 0.75]
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            positionOffset: [0, 1.4, 1.1]
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Miku1,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            positionOffset: [0, 1.4, 0.8]
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            positionOffset: [0, 1.9, 1.1]
        },
        {
            mmdCharacter: mmdCharacter.Youye,
            positionOffset: [0, 1.15, 0.65]
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            positionOffset: [0, 1.1, 0.75]
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            positionOffset
        },
    ]
}

export let getPutToShoeTransform = (): shoeControlledTransformData => {
    let positionOffset: [number, number, number] = [0, -0.6, -0.2]
    let positionOffsetForToe: [number, number, number] = [0.02, -1.28, 1.4]

    return [
        {
            mmdCharacter: mmdCharacter.Ciming,
            // positionOffset: [0, -1.2, -0.2]
            positionOffset: [0.2, -1.8, 1.4],
            isToToe: true
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,
            positionOffset: [0, -0.9, 0]
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            positionOffset: positionOffsetForToe,
            isToToe: true
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,
            positionOffset: positionOffsetForToe,
            isToToe: true
        },
        {
            mmdCharacter: mmdCharacter.XiaHui,
            // positionOffset: [0, -0.5, -0.4]
            positionOffset: [0, -1.1, 1.2],
            isToToe: true
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            positionOffset: [0, -0.6, -0.3]
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Youye,
            positionOffset: [0.07, -1.4, 1.5],
            isToToe: true
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,
            positionOffset
        },
        {
            mmdCharacter: mmdCharacter.Miku1,
            positionOffset: [0.03, -0.68, 1.7],
            isToToe: true
        },
        {
            mmdCharacter: mmdCharacter.Noah,
            positionOffset: [0.12, -0.68, 1.75],
            isToToe: true
        },
    ]
}


export let getSelectCharacterData = (api, state): Array<selectCharacterData> => {
    return [
        [
            `./mmd-character-extend/src/asset/image/XiaHui.png`,
            mmdCharacter.XiaHui,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.XiaHui),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Nero.png`,
            mmdCharacter.Nero,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Nero),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Xiaye1.png`,
            mmdCharacter.Xiaye1,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Xiaye1),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Xiaye2.png`,
            mmdCharacter.Xiaye2,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Xiaye2),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Haku_Lady.png`,
            mmdCharacter.Haku_Lady,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Haku_Lady),
            true,
            resourceLevel.Green,
        ],
        [
            "./mmd-character-extend/src/asset/image/Haku_QP.png",
            mmdCharacter.Haku_QP,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Haku_QP),
            true,
            resourceLevel.Blue,
        ],
        [
            `./mmd-character-extend/src/asset/image/Changee.png`,
            mmdCharacter.Changee,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Changee),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Meibiwusi.png`,
            mmdCharacter.Meibiwusi,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Meibiwusi),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Miku1.png`,
            mmdCharacter.Miku1,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Miku1),
            true,
            resourceLevel.White,
        ],
        [
            `./mmd-character-extend/src/asset/image/Vanilla.png`,
            mmdCharacter.Vanilla,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Vanilla),
            true,
            resourceLevel.White,
        ],
        [
            `./mmd-character-extend/src/asset/image/Moye.png`,
            mmdCharacter.Moye,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Moye),
            true,
            resourceLevel.White,
        ],
        [
            `./mmd-character-extend/src/asset/image/Lipusi.png`,
            mmdCharacter.Lipusi,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Lipusi),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Ciming.png`,
            mmdCharacter.Ciming,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Ciming),
            true,
            resourceLevel.Green,
        ],
        [
            `./mmd-character-extend/src/asset/image/Youye.png`,
            mmdCharacter.Youye,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Youye),
            true,
            resourceLevel.White,
        ],
        [
            `./mmd-character-extend/src/asset/image/Kongzhilvzhe.png`,
            mmdCharacter.Kongzhilvzhe,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Kongzhilvzhe),
            true,
            resourceLevel.White,
        ],
        [
            `./mmd-character-extend/src/asset/image/Noah.png`,
            mmdCharacter.Noah,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Noah),
            true,
            resourceLevel.Blue,
        ],
        [
            `./mmd-character-extend/src/asset/image/Sunxiaomei.png`,
            mmdCharacter.Sunxiaomei,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Sunxiaomei),
            true,
            resourceLevel.White,
        ],
        [
            `./mmd-character-extend/src/asset/image/Qiyana.png`,
            mmdCharacter.Qiyana,
            api.getLanguageDataByData(state, _getTextData(), mmdCharacter.Qiyana),
            true,
            resourceLevel.Green,
        ],
    ]
}

export let getSnapshotData = (name): Array<[mmdCharacter, string]> => {
    return [
        [
            mmdCharacter.XiaHui,
            `./mmd-character-extend/src/asset/image/snapshot/XiaHui.png`,
        ],
        [
            mmdCharacter.Nero,
            `./mmd-character-extend/src/asset/image/snapshot/Nero.png`,
        ],
        [
            mmdCharacter.Xiaye1,
            `./mmd-character-extend/src/asset/image/snapshot/Xiaye1.png`,
        ],
        [
            mmdCharacter.Xiaye2,
            `./mmd-character-extend/src/asset/image/snapshot/Xiaye2.png`,
        ],
        [
            mmdCharacter.Haku_Lady,
            `./mmd-character-extend/src/asset/image/snapshot/Haku_Lady.png`,
        ],
        [
            mmdCharacter.Haku_QP,
            `./mmd-character-extend/src/asset/image/snapshot/Haku_QP.png`,
        ],
        [
            mmdCharacter.Changee,
            `./mmd-character-extend/src/asset/image/snapshot/Changee.png`,
        ],
        [
            mmdCharacter.Meibiwusi,
            `./mmd-character-extend/src/asset/image/snapshot/Meibiwusi.png`,
        ],
        [
            mmdCharacter.Miku1,
            `./mmd-character-extend/src/asset/image/snapshot/Miku1.png`,
        ],
        [
            mmdCharacter.Vanilla,
            `./mmd-character-extend/src/asset/image/snapshot/Vanilla.png`,
        ],
        [
            mmdCharacter.Moye,
            `./mmd-character-extend/src/asset/image/snapshot/Moye.png`,
        ],
        [
            mmdCharacter.Lipusi,
            `./mmd-character-extend/src/asset/image/snapshot/Lipusi.png`,
        ],
        [
            mmdCharacter.Ciming,
            `./mmd-character-extend/src/asset/image/snapshot/Ciming.png`,
        ],
        [
            mmdCharacter.Youye,
            `./mmd-character-extend/src/asset/image/snapshot/Youye.png`,
        ],
        [
            mmdCharacter.Kongzhilvzhe,
            `./mmd-character-extend/src/asset/image/snapshot/Kongzhilvzhe.png`,
        ],
        [
            mmdCharacter.Qiyana,
            `./mmd-character-extend/src/asset/image/snapshot/Qiyana.png`,
        ],
        [
            mmdCharacter.Noah,
            `./mmd-character-extend/src/asset/image/snapshot/Noah.png`,
        ],
        [
            mmdCharacter.Sunxiaomei,
            `./mmd-character-extend/src/asset/image/snapshot/Sunxiaomei.png`,
        ],
    ]
}

export let getAttributeData = (): attributeData => {
    return [
        {
            mmdCharacter: mmdCharacter.Vanilla,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.VeryLow,

            // scaleIncrease: initialScale.Low,
            scaleIncrease: initialScale.High,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            // hp: hp.Middle1,
            hp: hp.Middle,

            restoreHpTime: restoreHpTime.Low,
            // restoreHpSpeedRate: restoreHpSpeedRate.High,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Nero,

            defenseFactor: defenseFactor.VeryLow2,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            // excitementIncreaseFactor: excitementIncreaseFactor.Middle,
            excitementIncreaseFactor: excitementIncreaseFactor.Middle2,

            hp: hp.Middle1,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Heavy1,
            armorStrength: armorStrength.VeryLow1,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.Middle1,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.Middle1,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Haku_Lady,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.Middle1,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Haku_QP,

            defenseFactor: defenseFactor.VeryLow3,
            // attackFactor: attackFactor.VeryLow,
            attackFactor: attackFactor.Low3,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.High3,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            // biggerMaxTime: biggerMaxTime.Middle,
            biggerMaxTime: biggerMaxTime.High,

            luck: luck.Middle,
            // armorRatio: armorRatio.Middle,
            armorRatio: armorRatio.Middle1,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle2,
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.VeryHigh,

            scaleIncrease: initialScale.Low,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            // excitementIncreaseFactor: excitementIncreaseFactor.Middle,
            excitementIncreaseFactor: excitementIncreaseFactor.High2,

            hp: hp.Middle,

            // restoreHpTime: restoreHpTime.Middle,
            // restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Low,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Changee,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.Low3,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.High,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            // excitementIncreaseFactor: excitementIncreaseFactor.Middle,
            excitementIncreaseFactor: excitementIncreaseFactor.High2,

            hp: hp.Middle,

            // restoreHpTime: restoreHpTime.Middle,
            restoreHpTime: restoreHpTime.High,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },

        {
            mmdCharacter: mmdCharacter.Miku1,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.Middle1,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },

        {
            mmdCharacter: mmdCharacter.Moye,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.Low3,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Low,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.Middle1,

            // restoreHpTime: restoreHpTime.Middle,
            // restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            restoreHpTime: restoreHpTime.Low,
            restoreHpSpeedRate: restoreHpSpeedRate.High,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow2,
            stressingRateFactor: stressingRateFactor.Middle2,
        },

        {
            mmdCharacter: mmdCharacter.XiaHui,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.Middle1,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },

        {
            mmdCharacter: mmdCharacter.Youye,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.VeryLow,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.Middle,

            hp: hp.Middle,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Kongzhilvzhe,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Middle,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            // excitementIncreaseFactor: excitementIncreaseFactor.Middle,
            excitementIncreaseFactor: excitementIncreaseFactor.Middle2,

            hp: hp.Middle1,

            // restoreHpTime: restoreHpTime.Middle,
            // restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            restoreHpTime: restoreHpTime.VeryHigh,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow2,
            stressingRateFactor: stressingRateFactor.Low,
        },
        {
            mmdCharacter: mmdCharacter.Qiyana,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.Low4,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.High,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            // excitementIncreaseFactor: excitementIncreaseFactor.Middle,
            excitementIncreaseFactor: excitementIncreaseFactor.Middle1,

            hp: hp.Middle1,

            restoreHpTime: restoreHpTime.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow4,
            // stressingRateFactor: stressingRateFactor.Middle,
            stressingRateFactor: stressingRateFactor.Middle,
        },
        {
            mmdCharacter: mmdCharacter.Noah,

            defenseFactor: defenseFactor.VeryLow4,
            attackFactor: attackFactor.Low4,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.Low,

            // scaleIncrease: initialScale.Middle,
            scaleIncrease: initialScale.VeryHigh,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.High,

            hp: hp.Middle1,

            // restoreHpTime: restoreHpTime.Middle,
            // restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            restoreHpTime: restoreHpTime.Low,
            restoreHpSpeedRate: restoreHpSpeedRate.High,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Light,
            armorStrength: armorStrength.VeryLow4,
            stressingRateFactor: stressingRateFactor.High,
        },
        {
            mmdCharacter: mmdCharacter.Lipusi,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.Low3,
            critRatioFactor: critRatioFactor.VeryLow,

            initialScale: initialScale.High,

            scaleIncrease: initialScale.High,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            excitementIncreaseFactor: excitementIncreaseFactor.High1,

            hp: hp.High3,

            // restoreHpTime: restoreHpTime.Middle,
            // restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            restoreHpTime: restoreHpTime.High,
            restoreHpSpeedRate: restoreHpSpeedRate.Low,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle,
            armorStrength: armorStrength.VeryLow1,
            stressingRateFactor: stressingRateFactor.Middle2,
        },
        {
            mmdCharacter: mmdCharacter.Ciming,

            defenseFactor: defenseFactor.VeryLow3,
            attackFactor: attackFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            // initialScale: 8,
            initialScale: initialScale.VeryHigh,

            scaleIncrease: initialScale.Middle,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            // excitementIncreaseFactor: excitementIncreaseFactor.Middle,
            excitementIncreaseFactor: excitementIncreaseFactor.Low,

            // hp: hp.High2,
            hp: hp.Middle1,

            // restoreHpTime: restoreHpTime.Middle,
            // restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            restoreHpTime: restoreHpTime.VeryHigh,
            restoreHpSpeedRate: restoreHpSpeedRate.VeryLow,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Heavy,
            // armorRatio: armorRatio.VeryHeavy,
            armorStrength: armorStrength.VeryLow,
            stressingRateFactor: stressingRateFactor.Middle2,
        },
        {
            mmdCharacter: mmdCharacter.Sunxiaomei,

            defenseFactor: defenseFactor.VeryLow2,
            attackFactor: attackFactor.Low2,
            critRatioFactor: critRatioFactor.VeryLow,

            // initialScale: 8,
            initialScale: initialScale.High,

            // scaleIncrease: 8,
            scaleIncrease: initialScale.High,
            maxScale: 200,
            minScale: initialScale.VeryLow,

            // excitementIncreaseFactor: excitementIncreaseFactor.Middle,
            excitementIncreaseFactor: excitementIncreaseFactor.High2,

            // hp: hp.Middle1,
            hp: hp.Middle,

            restoreHpTime: restoreHpTime.Middle,
            // restoreHpSpeedRate: restoreHpSpeedRate.Middle,
            restoreHpSpeedRate: restoreHpSpeedRate.Low,
            abstorbHpRate: abstorbHpRate.Middle,

            biggerMaxTime: biggerMaxTime.Middle,

            luck: luck.Middle,
            armorRatio: armorRatio.Middle1,
            armorStrength: armorStrength.VeryLow5,
            stressingRateFactor: stressingRateFactor.Middle,
        },
    ]
}