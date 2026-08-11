import * as Const from "../Const"
import * as MMDData from "../../../mmd/MMDData"
// import { getName } from "../../../../girl/Girl"
import { getName } from "../../../../CityScene"
import { animationName } from "../DataType"
import { language, state } from "../../../../../../../type/StateType"
import { getCurrentMMDCharacterName, getFullHp } from "../../../../girl/Girl"
import { collisionPart } from "../CollisionShapeData"
import { requireCheck, test } from "meta3d-jiehuo-abstract/src/utils/Contract"
import { getIsDebug } from "../../../../../Scene"
import { usedGirlEnum } from "../../../../type/StateType"
import { armorStrength, armorRatio, armorType } from "../../../DataType"
import { dataForPartialScale, stressingFactorWhenDestroyed } from "mmd-character-protocol/src/service/ServiceType"
import { getLanguageDataByData } from "../../../../../../../internation/Data"
// import { mmdCharacter } from "mmd-character-extend/src/json/Type"


// export enum extendMMDCharacter {
//     Haku_QP2 = "Haku_QP2",
// }

// export type mmdCharacter = mmdCharacter | extendMMDCharacter
// export const mmdCharacter = { ...mmdCharacter, ...extendMMDCharacter }


export enum mmdCharacter {
    Haku_QP2 = "Haku_QP2",
}


// let _handleVMDPath = (mmdCharacter_: mmdCharacter, originPath) => {
//     let name = getName()

//     switch (mmdCharacter_) {
//         case mmdCharacter.Haku_QP2:
//             return originPath.replace(`${name}/`, `${name}/旗袍 Haku/`)
//         default:
//             throw new Error("err")
//     }
// }

let _getVMDRawData = (state) => {
    return [
        [
            animationName.KeepLie,

            Const.getKeepLieAnimationResourcePath(getName())
        ],
        [
            animationName.HangRightHand,

            Const.getHangRightHandAnimationResourcePath(getName())
        ],
        [
            animationName.HangTwoHands,

            Const.getHangTwoHandsAnimationResourcePath(getName())
        ],
        [
            animationName.HangLeftHandRightHand,

            Const.getHangLeftHandRightHandAnimationResourcePath(getName())
        ],
        [
            animationName.BackRightHand,

            Const.getBackRightHandAnimationResourcePath(getName())
        ],
        [
            animationName.BackTwoHands,

            Const.getBackTwoHandsAnimationResourcePath(getName())
        ],
        [
            animationName.BackLeftHandRightHand,

            Const.getBackLeftHandRightHandAnimationResourcePath(getName())
        ],
        [
            animationName.RightHandDefaultToOneFinger,

            Const.getRightHandDefaultToOneFingerAnimationResourcePath(getName())
        ],
        [
            animationName.RightHandDefaultToBeat,

            Const.getRightHandDefaultToBeatAnimationResourcePath(getName())
        ],
        [
            animationName.RightHandDefaultToAdd,

            Const.getRightHandDefaultToAddAnimationResourcePath(getName())
        ],
        [
            animationName.TwoHandsDefaultToOneFinger,

            Const.getTwoHandsDefaultToOneFingerAnimationResourcePath(getName())
        ],
        [
            animationName.TwoHandsDefaultToBeat,

            Const.getTwoHandsDefaultToBeatAnimationResourcePath(getName())
        ],
        [
            animationName.RightHandOneFingerToDefault,

            Const.getRightHandOneFingerToDefaultAnimationResourcePath(getName())
        ],
        [
            animationName.RightHandBeatToDefault,

            Const.getRightHandBeatToDefaultAnimationResourcePath(getName())
        ],
        [
            animationName.RightHandAddToDefault,

            Const.getRightHandAddToDefaultAnimationResourcePath(getName())
        ],
        [
            animationName.TwoHandsOneFingerToDefault,

            Const.getTwoHandsOneFingerToDefaultAnimationResourcePath(getName())
        ],
        [
            animationName.TwoHandsBeatToDefault,

            Const.getTwoHandsBeatToDefaultAnimationResourcePath(getName())
        ],
        [
            animationName.KeepRightHandDefault,

            Const.getKeepRightHandDefaultAnimationResourcePath(getName())
        ],
        [
            animationName.KeepTwoHandsDefault,

            Const.getKeepTwoHandsDefaultAnimationResourcePath(getName())
        ],
        [
            animationName.KeepRightHandOneFinger,

            Const.getKeepRightHandOneFingerAnimationResourcePath(getName())
        ],
        [
            animationName.KeepTwoHandsOneFinger,

            Const.getKeepTwoHandsOneFingerAnimationResourcePath(getName())
        ],
        [
            animationName.KeepTwoHandsBeat,

            Const.getKeepTwoHandsBeatAnimationResourcePath(getName())
        ],
        [
            animationName.KeepRightHandBeat,

            Const.getKeepRightHandBeatAnimationResourcePath(getName())
        ],
        [
            animationName.KeepRightHandAdd,

            Const.getKeepRightHandAddAnimationResourcePath(getName())
        ],
        [
            animationName.KeepLeftHandRightHand,

            Const.getKeepLeftHandRigthHandAnimationResourcePath(getName())
        ],
        [
            animationName.HeavyStressingLie,

            Const.getHeavyStressingLieAnimationResourcePath(getName())
        ],
    ].concat(
        MMDData.getVMDRawData(state)
    )
}

let _replaceVMDPath = ([getNewPathFunc1, getNewPathFunc2], originPath, prefix) => {
    let pOld = "vmd/"
    let pNew = "vmd_bake_physics/"

    let name = getName()

    originPath = originPath.replace(pOld, getNewPathFunc1(pNew))

    if (!originPath.includes(pNew)) {
        return originPath
    }

    // return originPath.replace(`resource_girl/${name}/`, getNewPathFunc2(`mmd-character-extend/src/asset/${prefix}/`))
    return originPath.replace(/.+\/(vmd_bake_physics\/.+\.vmd)$/, getNewPathFunc2(`mmd-character-extend/src/asset/${prefix}/$1`))
}

let _handleVMDPath2 = (mmdCharacter_: mmdCharacter, [getNewPathFunc1, getNewPathFunc2], originPath) => {
    if (originPath.includes("vmd_scenario/")) {
        return originPath
    }

    let pOld = "vmd/"
    // let pNew = "vmd_bake_physics/"

    // let prefix = "mmd-character-extend/src/asset/"

    let p150 = `vmd_150/`
    let p160 = `vmd_160/`
    let p166 = `vmd_166/`

    // let name = getName()

    // if (originPath.includes("vmd_scenario/")) {
    //     return originPath
    // }

    switch (mmdCharacter_) {
        case mmdCharacter.Haku_QP2:
            return _replaceVMDPath([getNewPathFunc1, getNewPathFunc2], originPath, "旗袍 Haku")
        default:
            // throw new Error("err")
            return originPath
    }

}

let _handleVMDPath = (state, mmdCharacter_, originPath) => {
    switch (originPath) {
        case Const.getKeepLieAnimationResourcePath(getName()):
        case Const.getHangRightHandAnimationResourcePath(getName()):
        case Const.getHangTwoHandsAnimationResourcePath(getName()):
        case Const.getHangLeftHandRightHandAnimationResourcePath(getName()):

        case Const.getBackRightHandAnimationResourcePath(getName()):
        case Const.getBackTwoHandsAnimationResourcePath(getName()):
        case Const.getBackLeftHandRightHandAnimationResourcePath(getName()):

        case Const.getRightHandDefaultToOneFingerAnimationResourcePath(getName()):
        case Const.getRightHandDefaultToBeatAnimationResourcePath(getName()):
        case Const.getRightHandDefaultToAddAnimationResourcePath(getName()):

        case Const.getTwoHandsDefaultToOneFingerAnimationResourcePath(getName()):
        case Const.getTwoHandsDefaultToBeatAnimationResourcePath(getName()):

        case Const.getRightHandOneFingerToDefaultAnimationResourcePath(getName()):
        case Const.getRightHandBeatToDefaultAnimationResourcePath(getName()):
        case Const.getRightHandAddToDefaultAnimationResourcePath(getName()):

        case Const.getTwoHandsOneFingerToDefaultAnimationResourcePath(getName()):
        case Const.getTwoHandsBeatToDefaultAnimationResourcePath(getName()):

        case Const.getKeepRightHandDefaultAnimationResourcePath(getName()):
        case Const.getKeepTwoHandsDefaultAnimationResourcePath(getName()):
        case Const.getKeepRightHandOneFingerAnimationResourcePath(getName()):
        case Const.getKeepTwoHandsOneFingerAnimationResourcePath(getName()):
        case Const.getKeepTwoHandsBeatAnimationResourcePath(getName()):
        case Const.getKeepRightHandBeatAnimationResourcePath(getName()):
        case Const.getKeepRightHandAddAnimationResourcePath(getName()):
        case Const.getKeepLeftHandRigthHandAnimationResourcePath(getName()):
        case Const.getHeavyStressingLieAnimationResourcePath(getName()):
            return _handleVMDPath2(mmdCharacter_, [
                path => {
                    return "vmd_160/"
                },
                path => {
                    return `${getName()}/`
                }
            ], originPath)
        default:
            return _handleVMDPath2(mmdCharacter_, [path => path, path => path], originPath)
    }
}

let _getVMDData = (state, mmdCharacter_) => {
    return _getVMDRawData(state).map(([animationName_, originPath]) => {
        return [
            animationName_,
            _handleVMDPath(state, mmdCharacter_, originPath)
        ]
    })
}

// export let getAllMMDData = (state: state) => {
//     return [
//         [
//             mmdCharacter.Haku_QP2,
//             getHakuQPResourceId(),
//             [
//                 getHakuQPResourcePath(getName()),
//                 _getVMDData(
//                     state,
//                     mmdCharacter.Haku_QP2,
//                 )
//             ],
//             {
//                 heightScale: 1
//             }
//         ],
//         // [
//         //     mmdCharacter.Haku_Lady,
//         //     getHakuLadyResourceId(),
//         //     [
//         //         getHakuLadyResourcePath(getName()),
//         //         _getVMDData(
//         //             mmdCharacter.Haku_Lady,
//         //         )
//         //     ],
//         //     {
//         //         heightScale: 1
//         //     }
//         // ],
//     ]
//     // return MMDData.getAllMMDDataWithVMDData(_getVMDData).filter(d => {
//     //     switch (d[0]) {
//     //         default:
//     //             return true
//     //     }
//     // })
// }


// export let getHakuQPResourcePath = (name) => `./mmd-character-extend/src/asset/旗袍 Haku/tda haku QP.pmx`
export let getHakuQPResourcePath = (name) => `./resource_girl/city/旗袍 Haku/tda haku QP.pmx`

export let getAllMMDData = (state) => {
    return [
        [
            mmdCharacter.Haku_QP2,
            mmdCharacter.Haku_QP2,
            [
                getHakuQPResourcePath(getName()),
                _getVMDData(
                    state,
                    mmdCharacter.Haku_QP2,
                )
            ],
            {
                heightScale: 1
            }
        ]
    ]
    // return MMDData.getAllMMDDataWithVMDData(state, _getVMDData).filter(d => {
    //     return d[0] == mmdCharacter.Haku_QP2
    // })
}

export let getDamageParts = (state: state, usedGirl) => {
    switch (getCurrentMMDCharacterName(state, usedGirl)) {
        case mmdCharacter.Haku_QP2:
            return ["旗袍"]
        // case mmdCharacter.Haku_Lady:
        //     return ["西服", "衬衫", "奶罩"]
        default:
            throw new Error("err")
    }
}

export let getClothCollisionData = () => {
    // return MMDData.getClothCollisionData()
    return [
        {
            mmdCharacter: mmdCharacter.Haku_QP2,
            data: [
                {
                    collisionPart: [
                        collisionPart.Torso,
                        collisionPart.LowBreast,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                        collisionPart.LeftNipple,
                        collisionPart.RightNipple,
                        collisionPart.TrigoneAndButt,
                    ],
                    damagePart: "旗袍",
                    children: [
                        // {
                        //     collisionPart: [
                        //         collisionPart.TrigoneAndButt,
                        //     ],
                        //     damagePart: "胖次",
                        //     children: []
                        // }
                    ]
                },
            ]
        },

        // {
        //     mmdCharacter: mmdCharacter.Haku_Lady,
        //     data: [
        //         // {
        //         //     collisionPart: [
        //         //         collisionPart.Head,
        //         //     ],
        //         //     damagePart: "帽子",
        //         //     damageParts: ["帽子", "帽子白色蕾丝花边", "帽子黑色边", "帽子蕾丝内衬", "帽子黑纱蕾丝"],
        //         //     children: [
        //         //     ]
        //         // },
        //         // {
        //         //     collisionPart: [
        //         //         collisionPart.LeftFoot,
        //         //         collisionPart.RightFoot,
        //         //     ],
        //         //     damagePart: buildShoeDamagePart(),
        //         //     damageParts: [
        //         //         "高跟拖鞋",
        //         //         "高跟鞋玫瑰",
        //         //     ],
        //         //     children: [
        //         //     ]
        //         // },
        //         // {
        //         //     collisionPart: [
        //         //         collisionPart.LeftUpperArm,
        //         //         collisionPart.RightUpperArm,
        //         //         collisionPart.LeftLowerArm,
        //         //         collisionPart.RightLowerArm,
        //         //     ],
        //         //     damagePart: "袖子",
        //         //     damageParts: ["袖子", "西服扣子"],
        //         //     children: [
        //         //     ]
        //         // },
        //         {
        //             collisionPart: [
        //                 collisionPart.Torso,
        //             ],
        //             damagePart: "西服",
        //             children: [
        //                 {
        //                     collisionPart: [
        //                         collisionPart.LeftBreast,
        //                         collisionPart.RightBreast,
        //                     ],
        //                     damagePart: "衬衫",
        //                     children: [
        //                         {
        //                             collisionPart: [
        //                                 collisionPart.LeftBreast,
        //                                 collisionPart.RightBreast,
        //                             ],
        //                             damagePart: "奶罩",
        //                             damageParts: ["奶罩", "奶罩蕾丝"],
        //                             children: [
        //                             ]
        //                         },
        //                     ]
        //                 }
        //             ]
        //         },
        //         // {
        //         //     collisionPart: [
        //         //         collisionPart.LeftThigh,
        //         //         collisionPart.RightThigh,
        //         //         collisionPart.TrigoneAndButt,
        //         //     ],
        //         //     damagePart: "裙子包腿",
        //         //     damageParts: ["裙子包腿部分", "裙子包腿部蕾丝"],
        //         //     children: [
        //         //         {
        //         //             collisionPart: [
        //         //                 collisionPart.TrigoneAndButt,
        //         //             ],
        //         //             damagePart: "三角区蕾丝",
        //         //             damageParts: ["裙子最外层背部蕾丝边", "裙子最外层背部蕾丝黑色"],
        //         //             children: [
        //         //                 {
        //         //                     collisionPart: [
        //         //                         collisionPart.TrigoneAndButt,
        //         //                     ],
        //         //                     damagePart: "裤头",
        //         //                     children: [
        //         //                     ]
        //         //                 },
        //         //             ]
        //         //         },
        //         //     ]
        //         // },
        //     ]
        // },
    ]
}

export let getClothHpData = (state: state, usedGirl) => {
    requireCheck(() => {
        test("usedGirl should be Boss", () => {
            return usedGirl == usedGirlEnum.BossGiantess
        })
    }, getIsDebug(state))

    let fullHp = getFullHp(state, usedGirl)

    // return MMDData.getClothHpData(state)
    return [
        {
            mmdCharacter: mmdCharacter.Haku_QP2,
            data: [
                {
                    damagePart: MMDData.getBody(),
                    hp: fullHp,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light2,
                    armorStrength: armorStrength.Low,
                },
                {
                    damagePart: "旗袍",
                    hp: fullHp * 0.2,
                    armorType: armorType.Giantess, armorRatio: armorRatio.Light4,
                    armorStrength: armorStrength.Middle,
                    stressingFactorWhenDestroyed: stressingFactorWhenDestroyed.Middle,
                },
                // {
                //     damagePart: "胖次",
                //     hp: fullHp * 0.3,
                //     defenseFactor: MMDData.defenseFactor.VeryLow2,
                //     stressingFactorWhenDestroyed: MMDData.stressingFactorWhenDestroyed.High,
                // }
            ]
        },

    ]
}


export let getBoneNameForLightStressing = () => {
    return [
        {
            mmdCharacter: mmdCharacter.Haku_QP2,
            boneName: {
                [collisionPart.RightBreast]: "右胸上2",
                [collisionPart.LeftBreast]: "左胸上2",
            },
            boneAmplitude: {
                [collisionPart.RightBreast]: 8,
                [collisionPart.LeftBreast]: 8,
            }
        },
    ]
}

export let getDataForPartialScale = (): dataForPartialScale => {
    return [
        // {
        //     mmdCharacter: mmdCharacter.Haku_QP2,
        //     // TODO update
        //     scaleZForBreast:1.25
        // },
    ]
}

let _getTextData = () => {
    return {
        [language.Chinese]: {
            [mmdCharacter.Haku_QP2]: "弱音旗袍"
        },
        [language.English]: {
            [mmdCharacter.Haku_QP2]: mmdCharacter.Haku_QP2
        },
    }
}

export let getMMDName = (state: state, usedGirl) => {
    return getLanguageDataByData(state, _getTextData(), mmdCharacter.Haku_QP2)
}