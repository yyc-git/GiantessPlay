import * as Const from "../Const"
import * as MMDData from "../../../mmd/MMDData"
// import { getName } from "../../../../girl/Girl"
import { getName } from "../../../../CityScene"
import { animationName } from "../DataType"
import { getHakuQPResourceId, getHakuQPResourcePath } from "../../../Const"
import { state } from "../../../../../../../type/StateType"
import { getFullHp } from "../../../../girl/Girl"

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
            animationName.PickdownFromIdle,

            Const.getPickdownFromIdleAnimationResourcePath(getName())
        ],
        [
            animationName.Welcome,

            Const.getWelcomeAnimationResourcePath(getName())
        ],
    ].concat(
        MMDData.getVMDRawData()
    )
}

let _handleVMDPath = (mmdCharacter_, originPath) => {
    switch (originPath) {
        // case Const.getPickdownFromIdleAnimationResourcePath(getName()):
        // if (mmdCharacter_ == MMDData.mmdCharacter.Vanilla) {
        //     return MMDData.handleVMDPath(mmdCharacter_, [
        //         path => {
        //             return "vmd_150/"
        //         },
        //         path => {
        //             return `${getName()}/`
        //         }
        //     ], originPath)
        // }

        case Const.getWelcomeAnimationResourcePath(getName()):
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
    // return [
    //     // [
    //     //     MMDData.mmdCharacter.Haku_QP,
    //     //     getHakuQPResourceId(),
    //     //     [
    //     //         getHakuQPResourcePath(getName()),
    //     //         _getVMDData(
    //     //             MMDData.mmdCharacter.Haku_QP,
    //     //         )
    //     //     ],
    //     //     {
    //     //         heightScale: 1
    //     //     }
    //     // ]

    // ]

    return MMDData.getAllMMDDataWithVMDData(_getVMDData).filter(d => {
        switch (d[0]) {
            case MMDData.mmdCharacter.Meiko:
            case MMDData.mmdCharacter.Moye:
                // case MMDData.mmdCharacter.Nero:
                // case MMDData.mmdCharacter.Xiaye2:
                // case MMDData.mmdCharacter.Moye:
                // case MMDData.mmdCharacter.Haku_QP:
                return false
            default:
                return true
        }
    })
}

export let getClothHpData = (state: state): MMDData.clothHpData => {
    // let fullHp = getFullHp(state)

    // return [
    //     {
    //         mmdCharacter: MMDData.mmdCharacter.Haku_QP,
    //         data: [
    //             {
    //                 damagePart: MMDData.getBody(),
    //                 hp: fullHp,
    //                 defenseFactor: MMDData.defenseFactor.High,
    //             },
    //         ]
    //     },
    // ]

    return MMDData.getClothHpData(state)
}
