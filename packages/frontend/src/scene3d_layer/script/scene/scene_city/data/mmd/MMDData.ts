import { animationName, hp } from "../DataType"
import * as Const from "../Const"
import { getFullHp } from "../../girl/Girl"
import { collisionPart, damagePart } from "../../type/StateType"
import { mmd, resourceId } from "meta3d-jiehuo-abstract/src/type/StateType"
import { Device } from "meta3d-jiehuo-abstract"
import { getName } from "../../CityScene"
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { Mesh, Object3D, Vector3 } from "three"
import { state } from "../../../../../type/StateType"

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();


export enum mmdCharacter {
    // Miku = "Miku",
    // Neru = "Neru",

    // Luka = "Luka",
    Meiko = "Meiko",

    Haku_Lady = "Haku_Lady",
    // Luoli1 = "Luoli1",
    Baixi_Maid = "Baixi_Maid",

    XiaHui = "XiaHui",
    Xiaye1 = "Xiaye1",
    Xiaye2 = "Xiaye2",
    Nero = "Nero",
    Changee = "Changee",
    // Luotianyi = "Luotianyi",
    Miku1 = "Miku1",
    Vanilla = "Vanilla",
    Meibiwusi = "Meibiwusi",
    Moye = "Moye",



    Haku_QP = "Haku_QP",
}

export type mmdCharacterData = {
    heightScale: number
}


// export let handleVMDPath = (mmdCharacter_: mmdCharacter, originPath) => {
export let handleVMDPath = (mmdCharacter_: mmdCharacter, [getNewPathFunc1, getNewPathFunc2], originPath) => {
    let pOld = "vmd/"
    let pNew = "vmd_bake_physics/"

    let p150 = "vmd_150/"
    let p160 = "vmd_160/"
    let p166 = "vmd_166/"

    let name = getName()

    if (originPath.includes("vmd_scenario/")) {
        return originPath
    }

    switch (mmdCharacter_) {
        case mmdCharacter.Baixi_Maid:
            return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`${name}/`, getNewPathFunc2(`${name}/女仆白希/`))
        // case mmdCharacter.Luoli1:
        // 	return originPath.replace(`${name}/`, `${name}/ぷにる/` + p)


        case mmdCharacter.Xiaye1:
            return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`${name}/`, getNewPathFunc2(`${name}/Tda 夏夜1 HMS illustrious Prom Dress Ver1.00 [Silver]/`))
        case mmdCharacter.Xiaye2:
            return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`${name}/`, getNewPathFunc2(`${name}/TDA 夏夜2 MOON LIGHT DANCER LTY/`))
        case mmdCharacter.Moye:
            return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`${name}/`, getNewPathFunc2(`${name}/摩耶ver1.04/`))

        case mmdCharacter.Haku_QP:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`${name}/`, `${name}/旗袍 Haku/`)
            // return originPath.replace(`${name}/`, getNewPathFunc2(`${name}/旗袍 Haku/`))
            return originPath.replace(pOld, p160)
        case mmdCharacter.XiaHui:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`${name}/`, getNewPathFunc2(`${name}/TDA式宴 夏卉/`))
            return originPath.replace(pOld, p160)
        case mmdCharacter.Meiko:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`${name}/`, getNewPathFunc2(`${name}/Meiko/`))
            return originPath.replace(pOld, p160)
        case mmdCharacter.Haku_Lady:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`${name}/`, getNewPathFunc2(`${name}/The TDA Lady Haku Is Trump Ver2.00 [Silver]/`))
            return originPath.replace(pOld, p160)
        case mmdCharacter.Changee:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`${name}/`, getNewPathFunc2(`${name}/TDA 嫦娥123话OL装 Ver 1.00/`))
            return originPath.replace(pOld, p160)
        // case mmdCharacter.Luotianyi:
        case mmdCharacter.Miku1:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`${name}/`, getNewPathFunc2(`${name}/Tda初音Ver1.10/`))
            return originPath.replace(pOld, p160)
        case mmdCharacter.Meibiwusi:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`${name}/`, getNewPathFunc2(`${name}/梅比乌斯OL装/`))
            return originPath.replace(pOld, p166)
        case mmdCharacter.Vanilla:
            // return originPath.replace(pOld, getNewPathFunc1(pOld)).replace(`${name}/`, getNewPathFunc2(`${name}/Vanilla v1.0/`))
            return originPath.replace(pOld, p150)
        case mmdCharacter.Nero:
            // return originPath.replace(pOld, getNewPathFunc1(pNew)).replace(`${name}/`, getNewPathFunc2(`${name}/TDA Nero Claudius L2 bride Ver 1.00/`))
            return originPath.replace(pOld, p160)
        default:
            throw new Error("err")
    }
}


export let getVMDRawData = () => {
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
        [
            animationName.Stomp,
            Const.getStompAnimationResourcePath(getName())
        ],


        [
            animationName.BreastPress,
            Const.getBreastPressAnimationResourcePath(getName())
        ],
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




        [
            animationName.Hello,
            Const.getHelloAnimationResourcePath(getName())
        ],
    ]
}

let _getVMDData = (mmdCharacter_) => {
    return getVMDRawData().map(([animationName_, originPath]) => {
        return [
            animationName_,
            handleVMDPath(mmdCharacter_, [path => path, path => path], originPath)
        ]
    })
}

export type allMMDData = Array<[mmdCharacter, resourceId, any, mmdCharacterData]>

export let getAllMMDDataWithVMDData = (getVMDDataFunc): allMMDData => {
    return [
        [
            mmdCharacter.Meiko,
            Const.getMeikoResourceId(),
            [
                Const.getMeikoResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Meiko,
                )
            ],
            {
                heightScale: 1
            }
        ],
        // [
        // 	mmdCharacter.Neru,
        // 	Const.getNeruResourceId(),
        // 	[
        // 		Const.getNeruResourcePath(getName()),
        // 		getVMDDataFunc(
        // 			mmdCharacter.Neru,
        // 		)
        // 	],
        // 	{
        // 		heightScale: 1
        // 	}
        // ],



        // [
        //     mmdCharacter.Haku_QP,
        //     Const.getHakuQPResourceId(),
        //     [
        //         Const.getHakuQPResourcePath(getName()),
        //         getVMDDataFunc(

        //             mmdCharacter.Haku_QP,
        //         )
        //     ],
        //     {
        //         heightScale: 1
        //     }
        // ],
        [
            mmdCharacter.Haku_Lady,
            Const.getHakuLadyResourceId(),
            [
                Const.getHakuLadyResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Haku_Lady,
                )
            ],
            {
                heightScale: 1
            }
        ],
        // [
        // 	mmdCharacter.Luoli1,
        // 	Const.getLuoli1ResourceId(),
        // 	[
        // 		Const.getLuoli1ResourcePath(getName()),
        // 		getVMDDataFunc(
        // 			mmdCharacter.Luoli1,
        // 		)
        // 	],
        // 	{
        // 		heightScale: 0.85
        // 	}
        // ],
        [
            mmdCharacter.Baixi_Maid,
            Const.getBaixiMaidResourceId(),
            [
                Const.getBaixiMaidResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Baixi_Maid,
                )
            ],
            {
                heightScale: 1
            }
        ],


        [
            mmdCharacter.XiaHui,
            Const.getXiahuiResourceId(),
            [
                Const.getXiahuiResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.XiaHui,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Xiaye1,
            Const.getXiaye1ResourceId(),
            [
                Const.getXiaye1ResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Xiaye1,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Xiaye2,
            Const.getXiaye2ResourceId(),
            [
                Const.getXiaye2ResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Xiaye2,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Nero,
            Const.getNeroResourceId(),
            [
                Const.getNeroResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Nero,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Changee,
            Const.getChangeeResourceId(),
            [
                Const.getChangeeResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Changee,
                )
            ],
            {
                heightScale: 1
            }
        ],
        // [
        //     mmdCharacter.Luotianyi,
        //     Const.getLuotianyiResourceId(),
        //     [
        //         Const.getLuotianyiResourcePath(getName()),
        //         getVMDDataFunc(
        //             mmdCharacter.Luotianyi,
        //         )
        //     ],
        //     {
        //         heightScale: 1
        //     }
        // ],
        [
            mmdCharacter.Miku1,
            Const.getMiku1ResourceId(),
            [
                Const.getMiku1ResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Miku1,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Vanilla,
            Const.getVanillaResourceId(),
            [
                Const.getVanillaResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Vanilla,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Meibiwusi,
            Const.getMeibiwusiResourceId(),
            [
                Const.getMeibiwusiResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Meibiwusi,
                )
            ],
            {
                heightScale: 1
            }
        ],
        [
            mmdCharacter.Moye,
            Const.getMoyeResourceId(),
            [
                Const.getMoyeResourcePath(getName()),
                getVMDDataFunc(
                    mmdCharacter.Moye,
                )
            ],
            {
                heightScale: 1
            }
        ],
    ]
}

export let getAllMMDData = (): allMMDData => {
    return getAllMMDDataWithVMDData(_getVMDData)
}

type materialName = string

export type mmdMaterialFixData = Array<{
    mmdCharacter: mmdCharacter,
    noBlendingMaterialNamesInVivo: Array<materialName>,
    diffuseFactor?: number
}>

export let getMMDMaterialFixData = (): mmdMaterialFixData => {
    let result: mmdMaterialFixData = [
        {
            mmdCharacter: mmdCharacter.Moye,
            noBlendingMaterialNamesInVivo: [],
            diffuseFactor: 1.2
        }
    ]

    // if (Device.isVivo()) {
    if (Device.isAndroid()) {
        /*! for vivo
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
            {
                mmdCharacter: mmdCharacter.Baixi_Maid,
                noBlendingMaterialNamesInVivo: [
                    // "All",
                    "头发",
                    "Skin"
                ]
            },


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
            {
                mmdCharacter: mmdCharacter.Baixi_Maid,
                noBlendingMaterialNamesInVivo: [
                    // "All",
                    "头发",
                    "Skin"
                ]
            },
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
        ])
    }

    return result
}

export let getBody = () => "本体"

export let buildShoeDamagePart = () => "鞋"

export let isShoe = (damagePart) => {
    return damagePart == buildShoeDamagePart()
}

type singleClothCollisionData<collisionPart> = {
    collisionPart: Array<collisionPart>,
    damagePart: damagePart,
    damageParts?: Array<damagePart>,
    children: Array<singleClothCollisionData<collisionPart>>

}

export type clothCollisionData<collisionPart> = Array<{
    mmdCharacter: mmdCharacter,
    data: Array<singleClothCollisionData<collisionPart>>
}>

export let getClothCollisionData = (): clothCollisionData<collisionPart> => {
    return [
        // {
        //     mmdCharacter: mmdCharacter.Haku_QP,
        //     data: [
        //         {
        //             collisionPart: [
        //                 collisionPart.Torso,
        //                 collisionPart.LeftBreast,
        //                 collisionPart.RightBreast,
        //                 collisionPart.TrigoneAndButt,
        //             ],
        //             damagePart: "旗袍",
        //             children: [
        //                 {
        //                     collisionPart: [
        //                         collisionPart.TrigoneAndButt,
        //                     ],
        //                     damagePart: "胖次",
        //                     children: []
        //                 }
        //             ]
        //         },
        //     ]
        // },

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
                    damagePart: buildShoeDamagePart(),
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
                    damagePart: buildShoeDamagePart(),
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
                {
                    collisionPart: [
                        collisionPart.LeftFoot,
                        collisionPart.RightFoot,
                    ],
                    damagePart: buildShoeDamagePart(),
                    damageParts: [
                        "高跟鞋",
                    ],
                    children: [
                    ]
                },
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
                    damagePart: buildShoeDamagePart(),
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
                    damagePart: buildShoeDamagePart(),
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
                    damagePart: buildShoeDamagePart(),
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
                    damagePart: buildShoeDamagePart(),
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
    ]
}

export type clothHpData = Array<{
    mmdCharacter: mmdCharacter,
    data: Array<{
        damagePart: damagePart,
        hp: hp,
        defenseFactor: number,
        stressingFactorWhenDestroyed?: number,
    }>
}>

export enum defenseFactor {
    VeryHigh = 2,
    High = 1.5,
    Middle = 1,
    Low = 0.5,
    VeryLow = 0.3,
    VeryLow2 = 0.1,
}

export enum stressingFactorWhenDestroyed {
    VeryHigh = 4,
    High = 3,
    Middle = 2.5,
    Low = 2,
    VeryLow = 1.5,
    VeryLow2 = 1,
}


export let getClothHpData = (state: state): clothHpData => {
    let fullHp = getFullHp(state)

    return [
        {
            mmdCharacter: mmdCharacter.Meiko,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            ]
        },

        // {
        //     mmdCharacter: mmdCharacter.Haku_QP,
        //     data: [{
        //         damagePart: getBody(),
        //         hp: fullHp,
        //         defenseFactor: defenseFactor.VeryHigh,
        //     },
        //     {
        //         damagePart: "旗袍",
        //         hp: fullHp * 0.2,
        //         defenseFactor: defenseFactor.Low,
        //         stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
        //     },
        //     {
        //         damagePart: "胖次",
        //         hp: fullHp * 0.3,
        //         defenseFactor: defenseFactor.VeryLow2,
        //         stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
        //     }]
        // },


        {
            mmdCharacter: mmdCharacter.Haku_Lady,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.High,
            },
            {
                damagePart: buildShoeDamagePart(),
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "帽子",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            {
                damagePart: "袖子",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "西服",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "衬衫",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "奶罩",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.VeryLow,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "裙子包腿",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "三角区蕾丝",
                hp: fullHp * 0.15,
                defenseFactor: defenseFactor.VeryLow,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "裤头",
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.VeryLow2,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },

        {
            mmdCharacter: mmdCharacter.Baixi_Maid,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            ]
        },

        {
            mmdCharacter: mmdCharacter.XiaHui,
            data: [
                {
                    damagePart: getBody(),
                    hp: fullHp,
                    defenseFactor: defenseFactor.Middle,
                },
                {
                    damagePart: buildShoeDamagePart(),
                    hp: fullHp * 0.3,
                    defenseFactor: defenseFactor.Low,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
                },
                {
                    damagePart: "头饰",
                    hp: fullHp * 0.1,
                    defenseFactor: defenseFactor.Low,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
                },
                {
                    damagePart: "奶罩",
                    hp: fullHp * 0.2,
                    defenseFactor: defenseFactor.Low,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
                },
                {
                    damagePart: "裤子",
                    hp: fullHp * 0.1,
                    defenseFactor: defenseFactor.VeryLow,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
                },
                {
                    damagePart: "胖次",
                    hp: fullHp * 0.3,
                    defenseFactor: defenseFactor.VeryLow2,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
                },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            {
                damagePart: "头饰",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.VeryLow,
            },
            {
                damagePart: "丝袜",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: buildShoeDamagePart(),
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "手套",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次",
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.VeryLow2,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Xiaye2,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            {
                damagePart: buildShoeDamagePart(),
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次外",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.VeryLow,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次内",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.VeryLow2,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Nero,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.High,
            },
            {
                damagePart: "头纱发箍",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Middle,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "四肢衣服",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: "白丝",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Low,
            },
            {
                damagePart: buildShoeDamagePart(),
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "衣服",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "三角区",
                hp: fullHp * 0.4,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "服 束腰带",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Changee,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            {
                damagePart: buildShoeDamagePart(),
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "服装 上衣",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "奶罩",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.VeryLow,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "服装 裙",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.VeryLow,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胖次",
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.VeryLow2,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        // {
        //     mmdCharacter: mmdCharacter.Luotianyi,
        //     data: [{
        //         damagePart: getBody(),
        //         hp: fullHp,
        //     },
        //     ]
        // },
        {
            mmdCharacter: mmdCharacter.Miku1,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Vanilla,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Meibiwusi,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.High,
            },
            {
                damagePart: buildShoeDamagePart(),
                hp: fullHp * 0.3,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "上衣",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "胸罩",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "裤袜",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "包臀裙",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
        {
            mmdCharacter: mmdCharacter.Moye,
            data: [{
                damagePart: getBody(),
                hp: fullHp,
                defenseFactor: defenseFactor.Middle,
            },
            {
                damagePart: "胸襟",
                hp: fullHp * 0.1,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            {
                damagePart: "上衣",
                hp: fullHp * 0.2,
                defenseFactor: defenseFactor.Low,
                stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.High,
            },
            ]
        },
    ]
}


export type firstPersonControlsData = Array<{
    mmdCharacter: mmdCharacter,
    data: {
        getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => Vector3,

        hideMaterialNames: Array<string>,
    }
}>

let _getMiddlePoint1 = (girl) => {
    let bone1 = girl.getObjectByName("左目")
    let p1 = bone1.getWorldPosition(_v1)
    let bone2 = girl.getObjectByName("右目")
    let p2 = bone2.getWorldPosition(_v2)

    return p1.clone().add(
        p2.clone().sub(p1).multiplyScalar(0.5)
    )
}

let _getMiddlePoint2 = (girl) => {
    let bone1 = girl.getObjectByName("左目戻")
    let p1 = bone1.getWorldPosition(_v1)
    let bone2 = girl.getObjectByName("右目戻")
    let p2 = bone2.getWorldPosition(_v2)

    return p1.clone().add(
        p2.clone().sub(p1).multiplyScalar(0.5)
    )
}

let _getCameraPositionForFirstPersonControls1 = (girl) => {
    let middlePoint = _getMiddlePoint1(girl)

    let bone3 = girl.getObjectByName("メガネ")
    let p3 = bone3.getWorldPosition(_v3)

    return middlePoint.clone().add(middlePoint.clone().sub(p3).multiplyScalar(10))
}

export let getFirstPersonControlsData = (): firstPersonControlsData => {
    return [
        {
            mmdCharacter: mmdCharacter.Meiko,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => {
                    let middlePoint = _getMiddlePoint1(girl)

                    let bone3 = girl.getObjectByName("後髪")
                    let p3 = bone3.getWorldPosition(_v3)

                    return middlePoint.clone().add(middlePoint.clone().sub(p3).multiplyScalar(0.6))
                },
                hideMaterialNames: [
                    "材质2",
                    "材质6",
                    "材质12",
                    "材质13",
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Baixi_Maid,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => {
                    return girl.getObjectByName("第一視角").getWorldPosition(_v1)
                },
                hideMaterialNames: [
                    "脸",
                    "牙齿",
                    "眼睛",
                    "表情"
                ]
            }

        },
        {
            mmdCharacter: mmdCharacter.Nero,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => {
                    let middlePoint = _getMiddlePoint1(girl)

                    let bone3 = girl.getObjectByName("ヘッドセット先")
                    let p3 = bone3.getWorldPosition(_v3)
                    let bone4 = girl.getObjectByName("両目")
                    let p4 = bone4.getWorldPosition(_v4)

                    return middlePoint.clone().add(p4.clone().sub(p3).multiplyScalar(6))
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
                getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => {
                    let middlePoint = _getMiddlePoint1(girl)

                    let bone3 = girl.getObjectByName("メガネ")
                    let p3 = bone3.getWorldPosition(_v3)
                    let bone4 = girl.getObjectByName("頭")
                    let p4 = bone4.getWorldPosition(_v4)

                    return middlePoint.clone().add(
                        middlePoint.clone().sub(p3).multiplyScalar(10)
                    ).add(
                        p4.clone().sub(p3).multiplyScalar(8)
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
                getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => {
                    let middlePoint = _getMiddlePoint2(girl)

                    let bone1 = girl.getObjectByName("左目戻")
                    let p1 = bone1.getWorldPosition(_v1)
                    let bone2 = girl.getObjectByName("左目")
                    let p2 = bone2.getWorldPosition(_v2)

                    return middlePoint.clone().add(
                        p1.clone().sub(p2).multiplyScalar(1)
                    )
                },
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
            mmdCharacter: mmdCharacter.Vanilla,
            data: {
                getCameraPositionForFirstPersonControlsFunc: (girl: Object3D) => {
                    let middlePoint = _getMiddlePoint1(girl)

                    let bone3 = girl.getObjectByName("Eyepos_R")
                    let p3 = bone3.getWorldPosition(_v3)
                    let bone4 = girl.getObjectByName("右目")
                    let p4 = bone4.getWorldPosition(_v4)

                    return middlePoint.clone().add(
                        p4.clone().sub(p3).multiplyScalar(6)
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
                getCameraPositionForFirstPersonControlsFunc: (girl) => {
                    let middlePoint = _getMiddlePoint1(girl)

                    let bone3 = girl.getObjectByName("メガネ")
                    let p3 = bone3.getWorldPosition(_v3)

                    return middlePoint.clone().add(middlePoint.clone().sub(p3).multiplyScalar(10))
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
                getCameraPositionForFirstPersonControlsFunc: (girl) => {
                    let middlePoint = _getMiddlePoint1(girl)

                    let bone3 = girl.getObjectByName("スカート_0_4")
                    let p3 = bone3.getWorldPosition(_v3)
                    let bone4 = girl.getObjectByName("スカート_0_0")
                    let p4 = bone4.getWorldPosition(_v4)

                    return middlePoint.clone().add(p4.clone().sub(p3).multiplyScalar(1))
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
    ]
}

type skeletonName = string

export type shoeData = Array<{
    mmdCharacter: mmdCharacter,
    data: {
        notIKBones: Array<{
            name: skeletonName,
            yOffset: number
        }>,
        ikBones: Array<{
            names: Array<skeletonName>,
            yOffset: number
        }>,
        // hideMaterialNames: Array<string>,
    }
}>

export let getShoeData = (): shoeData => {
    return [
        {
            mmdCharacter: mmdCharacter.Xiaye1,
            data: {
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
    ]
}