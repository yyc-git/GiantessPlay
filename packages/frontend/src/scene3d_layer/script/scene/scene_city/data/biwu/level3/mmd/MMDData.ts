import * as Const from "../Const"
import * as MMDData from "../../../mmd/MMDData"
// import { getName } from "../../../../girl/Girl"
import { getName } from "../../../../CityScene"
import { animationName } from "../DataType"
import { getHakuLadyResourceId, getHakuLadyResourcePath, getHakuQPResourceId, getHakuQPResourcePath } from "../../../Const"
import { state } from "../../../../../../../type/StateType"
import { getCurrentMMDCharacterName, getFullHp } from "../../../../girl/Girl"
import { collisionPart } from "../CollisionShapeData"


// export enum extendMMDCharacter {
//     Haku_QP = "Haku_QP",
// }

// export type mmdCharacter = MMDData.mmdCharacter | extendMMDCharacter
// export const mmdCharacter = { ...MMDData.mmdCharacter, ...extendMMDCharacter }


// let _handleVMDPath = (mmdCharacter_: MMDData.mmdCharacter, originPath) => {
//     let name = getName()

//     switch (mmdCharacter_) {
//         case MMDData.mmdCharacter.Haku_QP:
//             return originPath.replace(`${name}/`, `${name}/旗袍 Haku/`)
//         default:
//             throw new Error("err")
//     }
// }

let _getVMDRawData = () => {
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
        MMDData.getVMDRawData()
    )
}

let _handleVMDPath = (mmdCharacter_, originPath) => {
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

            return MMDData.handleVMDPath(mmdCharacter_, [
                path => {
                    return "vmd_160/"
                },
                path => {
                    return `${getName()}/`
                }
            ], originPath)
        default:
            return MMDData.handleVMDPath(mmdCharacter_, [path => path, path => path], originPath)
    }
}

let _getVMDData = (mmdCharacter_) => {
    return _getVMDRawData().map(([animationName_, originPath]) => {
        return [
            animationName_,
            _handleVMDPath(mmdCharacter_, originPath)
        ]
    })
}

export let getAllMMDData = (): MMDData.allMMDData => {
    return [
        [
            MMDData.mmdCharacter.Haku_QP,
            getHakuQPResourceId(),
            [
                getHakuQPResourcePath(getName()),
                _getVMDData(
                    MMDData.mmdCharacter.Haku_QP,
                )
            ],
            {
                heightScale: 1
            }
        ],
        // [
        //     MMDData.mmdCharacter.Haku_Lady,
        //     getHakuLadyResourceId(),
        //     [
        //         getHakuLadyResourcePath(getName()),
        //         _getVMDData(
        //             MMDData.mmdCharacter.Haku_Lady,
        //         )
        //     ],
        //     {
        //         heightScale: 1
        //     }
        // ],
    ]
    // return MMDData.getAllMMDDataWithVMDData(_getVMDData).filter(d => {
    //     switch (d[0]) {
    //         default:
    //             return true
    //     }
    // })
}

export let getDamageParts = (state: state) => {
    switch (getCurrentMMDCharacterName(state)) {
        case MMDData.mmdCharacter.Haku_QP:
            return ["旗袍"]
        case MMDData.mmdCharacter.Haku_Lady:
            return ["西服", "衬衫", "奶罩"]
        default:
            throw new Error("err")
    }
}

export let getClothCollisionData = (): MMDData.clothCollisionData<collisionPart> => {
    // return MMDData.getClothCollisionData()
    return [
        {
            mmdCharacter: MMDData.mmdCharacter.Haku_QP,
            data: [
                {
                    collisionPart: [
                        collisionPart.Torso,
                        collisionPart.LowBreast,
                        collisionPart.LeftBreast,
                        collisionPart.RightBreast,
                        collisionPart.LeftNipple,
                        collisionPart.RightNipple, ,
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

        {
            mmdCharacter: MMDData.mmdCharacter.Haku_Lady,
            data: [
                // {
                //     collisionPart: [
                //         collisionPart.Head,
                //     ],
                //     damagePart: "帽子",
                //     damageParts: ["帽子", "帽子白色蕾丝花边", "帽子黑色边", "帽子蕾丝内衬", "帽子黑纱蕾丝"],
                //     children: [
                //     ]
                // },
                // {
                //     collisionPart: [
                //         collisionPart.LeftFoot,
                //         collisionPart.RightFoot,
                //     ],
                //     damagePart: buildShoeDamagePart(),
                //     damageParts: [
                //         "高跟拖鞋",
                //         "高跟鞋玫瑰",
                //     ],
                //     children: [
                //     ]
                // },
                // {
                //     collisionPart: [
                //         collisionPart.LeftUpperArm,
                //         collisionPart.RightUpperArm,
                //         collisionPart.LeftLowerArm,
                //         collisionPart.RightLowerArm,
                //     ],
                //     damagePart: "袖子",
                //     damageParts: ["袖子", "西服扣子"],
                //     children: [
                //     ]
                // },
                {
                    collisionPart: [
                        collisionPart.Torso,
                    ],
                    damagePart: "西服",
                    children: [
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
                        }
                    ]
                },
                // {
                //     collisionPart: [
                //         collisionPart.LeftThigh,
                //         collisionPart.RightThigh,
                //         collisionPart.TrigoneAndButt,
                //     ],
                //     damagePart: "裙子包腿",
                //     damageParts: ["裙子包腿部分", "裙子包腿部蕾丝"],
                //     children: [
                //         {
                //             collisionPart: [
                //                 collisionPart.TrigoneAndButt,
                //             ],
                //             damagePart: "三角区蕾丝",
                //             damageParts: ["裙子最外层背部蕾丝边", "裙子最外层背部蕾丝黑色"],
                //             children: [
                //                 {
                //                     collisionPart: [
                //                         collisionPart.TrigoneAndButt,
                //                     ],
                //                     damagePart: "裤头",
                //                     children: [
                //                     ]
                //                 },
                //             ]
                //         },
                //     ]
                // },
            ]
        },
    ]
}

export let getClothHpData = (state: state): MMDData.clothHpData => {
    let fullHp = getFullHp(state)

    // return MMDData.getClothHpData(state)
    return [
        {
            mmdCharacter: MMDData.mmdCharacter.Haku_QP,
            data: [
                {
                    damagePart: MMDData.getBody(),
                    hp: fullHp,
                    defenseFactor: MMDData.defenseFactor.VeryHigh,
                },
                {
                    damagePart: "旗袍",
                    hp: fullHp * 0.2,
                    defenseFactor: MMDData.defenseFactor.Low,
                    stressingFactorWhenDestroyed: MMDData.stressingFactorWhenDestroyed.Middle,
                },
                // {
                //     damagePart: "胖次",
                //     hp: fullHp * 0.3,
                //     defenseFactor: MMDData.defenseFactor.VeryLow2,
                //     stressingFactorWhenDestroyed: MMDData.stressingFactorWhenDestroyed.High,
                // }
            ]
        },

        {
            mmdCharacter: MMDData.mmdCharacter.Haku_Lady,
            data: [{
                damagePart: MMDData.getBody(),
                hp: fullHp,
                defenseFactor: MMDData.defenseFactor.High,
            },
            {
                damagePart: "西服",
                hp: fullHp * 0.1,
                defenseFactor: MMDData.defenseFactor.Low,
                stressingFactorWhenDestroyed: MMDData.stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "衬衫",
                hp: fullHp * 0.1,
                defenseFactor: MMDData.defenseFactor.Low,
                stressingFactorWhenDestroyed: MMDData.stressingFactorWhenDestroyed.Middle,
            },
            {
                damagePart: "奶罩",
                hp: fullHp * 0.2,
                defenseFactor: MMDData.defenseFactor.VeryLow,
                stressingFactorWhenDestroyed: MMDData.stressingFactorWhenDestroyed.High,
            },
            ]
        },
    ]
}

// export let getShoeData = (): MMDData.shoeData => {
//     return MMDData.getShoeData()
// }