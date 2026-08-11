// import { NumberUtils } from "meta3d-jiehuo-abstract"
// import { damageType, forceSize } from "../type/StateType"

// export let computeMiss = ([force, damageType_],): [forceSize, damageType] => {
//     switch (damageType_) {
//         case damageType.Range:
//         case damageType.Global:
//             return [force, damageType_]
//         default:
//             if (NumberUtils.isRandomRate(missRatio)) {
//                 return [0, damageType.Miss]
//             }

//             return [force, damageType_]
//     }
// }