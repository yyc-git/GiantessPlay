import * as Const from "../Const"
import * as MMDData from "../../../mmd/MMDData"
// import { getName } from "../../../../girl/Girl"
import { getName } from "../../../../CityScene"
import { animationName } from "../DataType"
import { collisionPart, usedGirlEnum } from "../../../../type/StateType"
import { state } from "../../../../../../../type/StateType"
import { getFullHp } from "../../../../girl/Girl"
import { getPickdownFromIdleAnimationResourcePath } from "../../level1/Const"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
import { mmdCharacter } from "mmd-character-extend/src/json/Type"


// export enum extendMMDCharacter {
//     Haku_QP = "Haku_QP",
// }

// export type mmdCharacter = mmdCharacter | extendMMDCharacter
// export const mmdCharacter = { ...mmdCharacter, ...extendMMDCharacter }


// let _handleVMDPath = (mmdCharacter_: mmdCharacter, originPath) => {
//     let name = getName()

//     switch (mmdCharacter_) {
//         case mmdCharacter.Haku_QP:
//             return originPath.replace(`${name}/`, `${name}/旗袍 Haku/`)
//         default:
//             throw new Error("err")
//     }
// }

let _getVMDRawData = (state) => {
    return [
        [
            animationName.PickdownFromIdle,

            getPickdownFromIdleAnimationResourcePath(getName())
        ],

        [
            animationName.HangRightLightStomp,

            Const.getHangRightLightStompAnimationResourcePath(getName())
        ],
        [
            animationName.HangLeftLightStomp,

            Const.getHangLeftLightStompAnimationResourcePath(getName())
        ],
        [
            animationName.BackRightLightStomp,

            Const.getBackRightLightStompAnimationResourcePath(getName())
        ],
        [
            animationName.BackLeftLightStomp,

            Const.getBackLeftLightStompAnimationResourcePath(getName())
        ],
        [
            animationName.KeepRightLightStomp,

            Const.getKeepRightLightStompAnimationResourcePath(getName())
        ],
        [
            animationName.KeepLeftLightStomp,

            Const.getKeepLeftLightStompAnimationResourcePath(getName())
        ],
        [
            animationName.HeavyStressingRightLightStomp,

            Const.getHeavyStressingRightLightStompAnimationResourcePath(getName())
        ],
        [
            animationName.HeavyStressingLeftLightStomp,

            Const.getHeavyStressingLeftLightStompAnimationResourcePath(getName())
        ],


        [
            animationName.Excitement,

            Const.getExcitementAnimationResourcePath(getName())
        ],
    ].concat(
        MMDData.getVMDRawData(state)
    )
}

let _handleVMDPath = (state, mmdCharacter_, originPath) => {
    switch (originPath) {
        // case getPickdownFromIdleAnimationResourcePath(getName()):
        // if (mmdCharacter_ == mmdCharacter.Vanilla) {
        //     return MMDData.handleVMDPath(mmdCharacter_, [
        //         path => {
        //             return "vmd_150/"
        //         },
        //         path => {
        //             return `${getName()}/`
        //         }
        //     ], originPath)
        // }

        case Const.getExcitementAnimationResourcePath(getName()):
        case Const.getHangLeftLightStompAnimationResourcePath(getName()):
        case Const.getHangRightLightStompAnimationResourcePath(getName()):
        case Const.getKeepLeftLightStompAnimationResourcePath(getName()):
        case Const.getKeepRightLightStompAnimationResourcePath(getName()):
        case Const.getBackLeftLightStompAnimationResourcePath(getName()):
        case Const.getBackRightLightStompAnimationResourcePath(getName()):
        case Const.getHeavyStressingLeftLightStompAnimationResourcePath(getName()):
        case Const.getHeavyStressingRightLightStompAnimationResourcePath(getName()):
            return MMDData.handleVMDPath(state, mmdCharacter_, [
                path => {
                    return "vmd_160/"
                },
                path => {
                    return `${getName()}/`
                }
            ], originPath)
        default:
            return MMDData.handleVMDPath(state, mmdCharacter_, [path => path, path => path], originPath)
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

// export let getAllMMDData = (): MMDData.allMMDData => {
//     // return [
//     //     // [
//     //     //     mmdCharacter.Haku_QP,
//     //     //     getHakuQPResourceId(),
//     //     //     [
//     //     //         getHakuQPResourcePath(getName()),
//     //     //         _getVMDData(
//     //     //             mmdCharacter.Haku_QP,
//     //     //         )
//     //     //     ],
//     //     //     {
//     //     //         heightScale: 1
//     //     //     }
//     //     // ]

//     // ]

//     return MMDData.getAllMMDDataWithVMDData(_getVMDData)
// }

export let getAllMMDData = (state) => {
    // return [
    //     // [
    //     //     mmdCharacter.Haku_QP,
    //     //     getHakuQPResourceId(),
    //     //     [
    //     //         getHakuQPResourcePath(getName()),
    //     //         _getVMDData(
    //     //             mmdCharacter.Haku_QP,
    //     //         )
    //     //     ],
    //     //     {
    //     //         heightScale: 1
    //     //     }
    //     // ]

    // ]

    return MMDData.getAllMMDDataWithVMDData(state, _getVMDData)
    // .filter(d => {
    //     // return [ArrayUtils.getLast(MMDData.getAllMMDDataWithVMDData(state, _getVMDData))].filter(d => {
    //     switch (d[0]) {
    //         case mmdCharacter.Meiko:
    //         case mmdCharacter.Moye:
    //             // case mmdCharacter.Nero:
    //             // case mmdCharacter.Xiaye2:
    //             // case mmdCharacter.Moye:
    //             // case mmdCharacter.Haku_QP:
    //             return false
    //         default:
    //             return true
    //     }
    // })
}

// let _buildShoeDamagePart = () => "鞋"

// export let isShoe = (damagePart) => {
//     return damagePart == _buildShoeDamagePart()
// }

export let getClothCollisionData = (state) => {
    // return [
    //     {
    //         mmdCharacter: mmdCharacter.Haku_QP,
    //         data: [
    //             {
    //                 collisionPart: [
    //                     collisionPart.LeftFoot,
    //                     collisionPart.RightFoot,
    //                 ],
    //                 damagePart: MMDData.buildShoeDamagePart(),
    //                 damageParts: [
    //                     "鞋面",
    //                     "鞋底",
    //                 ],
    //                 children: [
    //                 ]
    //             },
    //         ]
    //     },
    // ]

    return MMDData.getClothCollisionData(state)
}

// export let getClothHpData = (state: state) => {
//     let fullHp = getFullHp(state)

//     return [
//         {
//             mmdCharacter: mmdCharacter.Haku_QP,
//             data: [
//                 {
//                     damagePart: MMDData.getBody(),
//                     hp: fullHp,
//                     defenseFactor: MMDData.defenseFactor.High,
//                 },
//                 {
//                     damagePart: MMDData.buildShoeDamagePart(),
//                     hp: fullHp * 0.3,
//                     defenseFactor: MMDData.defenseFactor.Low,
//                     stressingFactorWhenDestroyed: MMDData.stressingFactorWhenDestroyed.High,
//                 },
//             ]
//         },
//     ]
// }
export let getClothHpData = (state: state, usedGirl) => {
    return MMDData.getClothHpData(state, usedGirlEnum.BossGiantess)
}

// export let getShoeData = (): MMDData.shoeData => {
//     // return [
//     //     {
//     //         mmdCharacter: mmdCharacter.Haku_QP,
//     //         data: {
//     //             notIKBones: [
//     //                 {
//     //                     name: "全ての親",
//     //                     // yOffset: -0.95
//     //                     yOffset: -0.9
//     //                 }
//     //             ],
//     //             ikBones: [
//     //                 {
//     //                     names: ["右つま先ＩＫ", "左つま先ＩＫ"],
//     //                     // yOffset: +1.3
//     //                     yOffset: +1.15
//     //                 }
//     //             ],
//     //             // hideMaterialNames: [
//     //             //     "鞋面",
//     //             //     "鞋底",
//     //             // ]
//     //         }
//     //     },
//     // ]
//     return MMDData.getShoeData(state)
// }