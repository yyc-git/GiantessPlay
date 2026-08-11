import { name, resourceId } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../type/StateType"
import { propName } from "../../type/StateType"
import { Vector3 } from "three"
import { getNamePrefixCommander, getNamePrefixInfantry, getNamePrefixLaserer, getNamePrefixMelee, getNamePrefixRocketeer } from "../../manage/city1/soldier/utils/SoldierUtils"
import { getNamePrefixFlameVehicle, getNamePrefixMissileVehicle, getNamePrefixTank } from "../../manage/city1/milltary_vehicle/MilltaryVehicleUtils"
import { getNamePrefixMissileTurret, getNamePrefixShellTurret } from "../../manage/city1/milltary_building/MilltaryBuildingUtils"
// import { getNamePrefix as getNamePrefixInfantry } from "../../manage/city1/soldier/Infantry"
// import { getNamePrefix as getNamePrefixMelee } from "../../manage/city1/soldier/Melee"
// import { getNamePrefix as getNamePrefixRocketeer } from "../../manage/city1/soldier/Rocketeer"
// import { getNamePrefix as getNamePrefixLaserer } from "../../manage/city1/soldier/Laserer"
// import { getNamePrefix as getNamePrefixCommander } from "../../manage/city1/soldier/Commander"
// import { getNamePrefixFlameVehicle, getNamePrefixMissileVehicle, getNamePrefixTank } from "../../manage/city1/milltary_vehicle/MilltaryVehicleUtils"
// import { getNamePrefixMissileTurret, getNamePrefixShellTurret } from "../../manage/city1/milltary_building/MilltaryBuildingUtils"
// import { getNamePrefix as getNamePrefixBuilding } from "../../manage/city1/Buildings"
import { getBigBuildingName, getMiddleBuildingName, getSmallBuildingName } from "../../manage/city1/Buildings"
import { getNamePrefix as getNamePrefixCar } from "../../manage/city1/Cars"
import { mergeAllRewardData, mergeRewardData } from "../../reward/RewardGenerator"
import { getRewardData as getRewardDataEliteGiantess } from "../../../../../mod/EliteGiantessMod"
import { coin, count, experienceValue, gem, rate, rewardData } from "./RewardDataType"
import { getWeaponBiggerBulletBlockService, getWeaponShotBulletBlockService, getWeaponSmallerBulletBlockService, getWeaponSubMachineBulletBlockService } from "../../../../../mod/PropBulletMod"
import { getRewardDataFSM } from "../../../../../mod/FSMMod"
import { getCaptureBlockService, getRewardDataPropOther, getRunBlockService, getSmallerWaterBlockService } from "../../../../../mod/PropOtherMod"
import { getRateByHasCount } from "../../reward/RewardUtils"

export let getLevelGirlDestroyProp = (state: state) => {
    return [
        {
            name: propName.AddHp3,

            getCountFunc: state => count.Low,
            getRateFunc: state => rate.High,
        },

        // {
        //     name: propName.LaserBullet,

        //     getCountFunc: state => count.VeryHigh,
        //     getRateFunc: state => rate.High,
        // },
        // {
        //     name: propName.RocketBullet,

        //     getCountFunc: state => count.High,
        //     getRateFunc: state => rate.High
        // },
        // {
        //     name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

        //     getCountFunc: state => count.VeryHigh,
        //     getRateFunc: state => rate.Middle2
        // },
        // {
        //     name: getWeaponShotBulletBlockService(state).getWeaponName(),

        //     getCountFunc: state => count.VeryHigh,
        //     getRateFunc: state => rate.Middle2
        // },
        {
            name: propName.LaserBullet,

            getCountFunc: state => count.VeryHigh,
            getRateFunc: state => rate.VeryHigh,
        },
        {
            name: propName.RocketBullet,

            getCountFunc: state => count.VeryHigh,
            getRateFunc: state => rate.VeryHigh
        },
        {
            name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.MostHigh,
            getRateFunc: state => rate.VeryHigh
        },
        {
            name: getWeaponShotBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.VeryHigh,
            getRateFunc: state => rate.VeryHigh
        },



        {
            // name: propName.BiggerBullet,
            name: getWeaponBiggerBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.Low,
            // getRateFunc: state => rate.High,
            getRateFunc: state => rate.Middle2,
        },
        {
            // name: propName.SmallerToLastBiggerCount,
            name: getWeaponSmallerBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.VeryLow,
            // getRateFunc: state => rate.High,
            getRateFunc: state => rate.Middle2,
        },


        {
            name: propName.CallGiantess,

            getCountFunc: state => count.VeryLow,
            // getRateFunc: state => rate.Middle2,
            getRateFunc: state => rate.Middle1,
        },
        {
            name: propName.ClearHatred,

            getCountFunc: state => count.VeryLow,
            getRateFunc: state => rate.Middle2,
        },
        // {
        //     name: getRunBlockService(state).getName(),

        //     getCountFunc: state => count.VeryLow,
        //     getRateFunc: state => rate.Middle2,
        // },
        // {
        //     name: getSmallerWaterBlockService(state).getName(),

        //     getCountFunc: state => count.VeryLow,
        //     getRateFunc: state => rate.Middle2,
        // },

        // {
        //     name: getCaptureBlockService(state).getName(),

        //     getCountFunc: state => count.VeryLow,
        //     // getRateFunc: state => rate.Low,
        //     getRateFunc: state => rate.Middle1,
        // },

        {
            name: propName.Revive,

            getCountFunc: state => count.VeryLow,
            // getRateFunc: state => rate.VeryLow,
            // getRateFunc: state => rate.Low,
            getRateFunc: state => {
                return getRateByHasCount(state, propName.Revive,
                    [1, rate.Low],
                    [6, rate.VeryLow2],
                    rate.VeryLow
                )
            }
            // getRateFunc: state => rate.Low,
            // getRateFunc: state => rate.Low1,
        },
    ]
}

export let getBossDestroyProp = (state: state) => {
    return [
        {
            name: propName.AddHp3,

            getCountFunc: state => count.Low,
            getRateFunc: state => rate.High,
        },

        {
            name: propName.LaserBullet,

            getCountFunc: state => count.MostHigh,
            getRateFunc: state => rate.Must,
        },
        {
            name: propName.RocketBullet,

            getCountFunc: state => count.MostHigh,
            getRateFunc: state => rate.Must
        },
        {
            name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.MostHigh,
            getRateFunc: state => rate.VeryHigh
        },
        {
            name: getWeaponShotBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.MostHigh,
            getRateFunc: state => rate.VeryHigh
        },


        {
            // name: propName.BiggerBullet,
            name: getWeaponBiggerBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.Low,
            // getRateFunc: state => rate.VeryHigh,
            getRateFunc: state => rate.High,
        },
        {
            // name: propName.SmallerToLastBiggerCount,
            name: getWeaponSmallerBulletBlockService(state).getWeaponName(),

            getCountFunc: state => count.VeryLow,
            // getRateFunc: state => rate.VeryHigh,
            getRateFunc: state => rate.Middle3,
        },


        {
            name: propName.CallGiantess,

            getCountFunc: state => count.VeryLow,
            // getRateFunc: state => rate.VeryHigh,
            getRateFunc: state => rate.High,
        },
        {
            name: propName.ClearHatred,

            getCountFunc: state => count.VeryLow,
            getRateFunc: state => rate.VeryHigh,
        },
        // {
        //     name: getRunBlockService(state).getName(),

        //     getCountFunc: state => count.VeryLow,
        //     getRateFunc: state => rate.VeryHigh,
        // },
        // {
        //     name: getSmallerWaterBlockService(state).getName(),

        //     getCountFunc: state => count.VeryLow,
        //     getRateFunc: state => rate.VeryHigh,
        // },

        // {
        //     name: getCaptureBlockService(state).getName(),

        //     getCountFunc: state => count.VeryLow,
        //     getRateFunc: state => rate.Middle2,
        //     // getRateFunc: state => rate.Middle3,
        // },

        {
            name: propName.Revive,

            getCountFunc: state => count.VeryLow,
            getRateFunc: state => {
                return getRateByHasCount(state, propName.Revive,
                    [1, rate.Middle1],
                    [6, rate.Low1],
                    rate.Low
                )
            }
            // getRateFunc: state => rate.Low,
        },
    ]
}



// export let getRewardData = (state): rewardData => {
//     return {
//         gem: {
//             [getNamePrefixInfantry()]: state => 1,
//             [getNamePrefixMelee()]: state => 2,
//             [getNamePrefixRocketeer()]: state => 3,
//             [getNamePrefixCommander()]: state => 3,
//             [getNamePrefixLaserer()]: state => 2,
//         },
//         prop: {
//             [getNamePrefixInfantry()]: [],
//             [getNamePrefixMelee()]: [],
//             [getNamePrefixRocketeer()]: [],
//             [getNamePrefixCommander()]: [],
//             [getNamePrefixLaserer()]: [
//                 {
//                     name: propName.LaserBullet,
//                     imageResourceId: getLaserBulletResourceId(),
//                     getCountFunc: state => count.Low,
//                 }
//             ],
//         }
//     }
// }
export let getRewardData = (state: state): rewardData => {
    return mergeAllRewardData({
        [getNamePrefixInfantry()]: {
            gem: state => gem.VeryLow,
            // gem: state => gem.Zero,
            coin: state => coin.VeryLow,
            prop: [
                {
                    name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Middle2
                },
                {
                    name: getWeaponShotBulletBlockService(state).getWeaponName(),

                    getCountFunc: state => count.Middle,
                    getRateFunc: state => rate.Middle2
                },
            ],
            experienceValue: experienceValue.Low,
        },
        [getNamePrefixMelee()]: {
            // gem: state => gem.Low,
            gem: state => gem.VeryLow,
            coin: state => coin.Low,
            prop: [],
            experienceValue: experienceValue.Middle1,
        },
        [getNamePrefixRocketeer()]: {
            // gem: state => gem.Middle1,
            // gem: state => gem.VeryLow,
            gem: state => gem.Low,
            coin: state => coin.Middle1,
            prop: [
                {
                    name: propName.RocketBullet,

                    getCountFunc: state => count.Middle,
                    getRateFunc: state => rate.Middle2
                }
            ],
            experienceValue: experienceValue.Middle2,
        },
        [getNamePrefixCommander()]: {
            gem: state => gem.Middle1,
            // gem: state => gem.Low,
            // coin: state => coin.Middle1,
            coin: state => coin.Middle2,
            prop: [
                {
                    name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Low
                },
                {
                    name: getWeaponShotBulletBlockService(state).getWeaponName(),

                    getCountFunc: state => count.Middle,
                    getRateFunc: state => rate.Low
                },
            ],
            experienceValue: experienceValue.Middle2,
        },
        [getNamePrefixLaserer()]: {
            // gem: state => gem.Middle1,
            gem: state => gem.Low,
            coin: state => coin.Middle1,
            prop: [
                {
                    name: propName.LaserBullet,

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Middle2
                }
            ],
            experienceValue: experienceValue.Middle1,
        },

        [getNamePrefixTank()]: {
            // gem: state => gem.Middle2,
            // gem: state => gem.Low,
            gem: state => gem.Middle1,
            coin: state => coin.Middle2,
            prop: [
                // {
                //     name: propName.LaserBullet,

                //     getCountFunc: state => count.High,
                //     getRateFunc: state => rate.Low,
                // },
                // {
                //     name: propName.RocketBullet,

                //     getCountFunc: state => count.Middle,
                //     getRateFunc: state => rate.Low
                // },
                {
                    name: getWeaponSubMachineBulletBlockService(state).getWeaponName(),

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Low
                },
                {
                    name: getWeaponShotBulletBlockService(state).getWeaponName(),

                    getCountFunc: state => count.Middle,
                    getRateFunc: state => rate.Low
                },

            ],
            experienceValue: experienceValue.Middle2,
        },
        [getNamePrefixFlameVehicle()]: {
            // gem: state => gem.Middle2,
            gem: state => gem.Low,
            coin: state => coin.Middle2,
            prop: [
                {
                    name: propName.LaserBullet,

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Low,
                },
                {
                    name: propName.RocketBullet,

                    getCountFunc: state => count.Middle,
                    getRateFunc: state => rate.Low
                }
            ],
            experienceValue: experienceValue.Middle3,
        },
        [getNamePrefixMissileVehicle()]: {
            // gem: state => gem.Middle2,
            // gem: state => gem.Low,
            gem: state => gem.Middle2,
            coin: state => coin.Middle3,
            prop: [
                {
                    name: propName.LaserBullet,

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Low,
                },
                {
                    name: propName.RocketBullet,

                    getCountFunc: state => count.Middle,
                    getRateFunc: state => rate.Low
                }
            ],
            experienceValue: experienceValue.Middle3,
        },


        [getNamePrefixShellTurret()]: {
            // gem: state => gem.High,
            // gem: state => gem.Middle2,
            gem: state => gem.Middle3,
            coin: state => coin.High,
            prop: [
                {
                    name: propName.LaserBullet,

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Middle2,
                },
                {
                    name: propName.RocketBullet,

                    getCountFunc: state => count.Middle,
                    getRateFunc: state => rate.Middle2
                }
            ],
            experienceValue: experienceValue.High,
        },
        [getNamePrefixMissileTurret()]: {
            gem: state => gem.High,
            // gem: state => gem.Middle2,
            coin: state => coin.VeryHigh,
            prop: [
                {
                    name: propName.LaserBullet,

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Middle2,
                },
                {
                    name: propName.RocketBullet,

                    getCountFunc: state => count.High,
                    getRateFunc: state => rate.Middle2
                }
            ],
            experienceValue: experienceValue.High,
        },



        // [getNamePrefixEliteGiantess()]: {
        //     gem: state => gem.VeryHigh,
        //     coin: state => coin.VeryHigh,
        //     prop: [
        //         {
        //             name: propName.BiggerBullet,

        //             getCountFunc: state => count.VeryLow,
        //             getRateFunc: state => rate.Middle2,
        //         },
        //         {
        //             name: propName.SmallerToLastBiggerCount,

        //             getCountFunc: state => count.VeryLow,
        //             getRateFunc: state => rate.Middle2,
        //         }
        //     ],
        //     experienceValue: experienceValue.VeryHigh,
        // },



        // [getNamePrefixBuilding()]: {
        //     // gem: state => gem.Low,
        //     gem: state => gem.VeryLow,
        //     coin: state => coin.Low,
        //     prop: [
        //     ],
        //     experienceValue: experienceValue.Low,
        // },
        [getSmallBuildingName()]: {
            gem: state => gem.VeryLow,
            coin: state => coin.Low,
            prop: [
            ],
            experienceValue: experienceValue.Low,
        },
        [getMiddleBuildingName()]: {
            gem: state => gem.Low,
            coin: state => coin.Middle1,
            prop: [
            ],
            experienceValue: experienceValue.Middle1,
        },
        [getBigBuildingName()]: {
            gem: state => gem.Low,
            coin: state => coin.Middle2,
            prop: [
            ],
            experienceValue: experienceValue.Middle2,
        },

        [getNamePrefixCar()]: {
            // gem: state => gem.VeryLow,
            gem: state => gem.Zero,
            coin: state => coin.VeryLow,
            prop: [
            ],
            experienceValue: experienceValue.VeryLow,
        },
    },
        [
            getRewardDataEliteGiantess(state),
            getRewardDataFSM(state),
            getRewardDataPropOther(state),
        ]
    )
}