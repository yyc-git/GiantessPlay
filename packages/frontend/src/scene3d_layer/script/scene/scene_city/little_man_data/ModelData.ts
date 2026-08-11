import { resourceId, resourceType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getName } from "../CityScene"
import { getMouseyResourceId, getMouseyResourcePath, getNinjaResourceId, getNinjaResourcePath, getAbeResourceId, getAbeResourcePath, getElyResourceId, getElyResourcePath, getMariaResourceId, getMariaResourcePath, getMutantResourceId, getMutantResourcePath, getInfantryResourceId, getInfantryResourcePath } from "./Const"
import * as LittleManConst from "./Const"
import * as LittleManDataType from "./DataType"
import { armorStrength, armorRatio, attackFactor, critRatioFactor, defenseFactor, emitSpeedFactor, speed, lieKeepTime, hp, emitterLifeFactor, stressingRateFactor, armorType } from "../data/DataType"
import { language } from "../../../../type/StateType"


export enum modelName {
    Infantry = "Infantry",
    // Ch09,
    Mousey = "Mousey",
    Ninja = "Ninja",
    // Ch36,
    Abe = "Abe",
    // Ch45,
    Dreyar = "Dreyar",
    Ely = "Ely",
    Maria = "Maria",
    Mutant = "Mutant",
}

export let getTextData = () => {
    return {
        [language.Chinese]: {
            [modelName.Infantry]: "步兵",
            [modelName.Mousey]: "卡通老鼠",
            [modelName.Ninja]: "忍者",
            [modelName.Abe]: "老者",
            [modelName.Dreyar]: "德雷亚尔",
            [modelName.Ely]: "伊利",
            [modelName.Maria]: "玛丽亚",
            [modelName.Mutant]: "突变体",
        },
        [language.English]: {
            [modelName.Infantry]: modelName.Infantry,
            [modelName.Mousey]: modelName.Mousey,
            [modelName.Ninja]: modelName.Ninja,
            [modelName.Abe]: modelName.Abe,
            [modelName.Dreyar]: modelName.Dreyar,
            [modelName.Ely]: modelName.Ely,
            [modelName.Maria]: modelName.Maria,
            [modelName.Mutant]: modelName.Mutant,
        },
    }
}

// export let getModelData = () => {
//     return [
//         {
//             name: modelName.Soldier1,
//             resourceId: getInfantryResourceId(),
//             resourcePath: getInfantryResourcePath(getName()),
//             scalar: 1,
//             gunScalar: 100,
//             positionYOffset: 1000
//         },
//         {
//             name: modelName.Mousey,
//             resourceId: getMouseyResourceId(),
//             resourcePath: getMouseyResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//         {
//             name: modelName.Ninja,
//             resourceId: getNinjaResourceId(),
//             resourcePath: getNinjaResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//         {
//             name: modelName.Ch36,
//             resourceId: getCh36ResourceId(),
//             resourcePath: getCh36ResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//         {
//             name: modelName.Abe,
//             resourceId: getAbeResourceId(),
//             resourcePath: getAbeResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//         {
//             name: modelName.Ch45,
//             resourceId: getCh45ResourceId(),
//             resourcePath: getCh45ResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//         {
//             name: modelName.Ely,
//             resourceId: getElyResourceId(),
//             resourcePath: getElyResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//         {
//             name: modelName.Maria,
//             resourceId: getMariaResourceId(),
//             resourcePath: getMariaResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//         {
//             name: modelName.Rocketeer,
//             resourceId: getMutantResourceId(),
//             resourcePath: getMutantResourcePath(getName()),
//             scalar: 0.02,
//             gunScalar: 20,
//             positionYOffset: 18 + _getPoisitionYOffsetIncrease()
//         },
//     ]
// }

let _getPoisitionYOffsetIncrease = () => 57

export type modelData = {
    name: modelName,
    resourceId: resourceId,
    resourcePath: string,

    // swipingForce: forceSize,
    // swipingWeaponType: weaponType,
    hp: hp,
    defenseFactor: defenseFactor,
    armorType: armorType, armorRatio: armorRatio,
    armorStrength: armorStrength,
    emitterLifeFactor: emitterLifeFactor,
    stressingRateFactor: stressingRateFactor,
    attackFactor: attackFactor,
    emitSpeedFactor: emitSpeedFactor,
    critRatioFactor: critRatioFactor,
    //missRatio: missRatio,
    moveSpeed: speed,
    lieKeepTime: lieKeepTime,

    scalar: number,
    gunScalar: number,
    positionYOffset: number,
}

export let getModelData = (): Array<modelData> => {
    return [
        {
            name: modelName.Infantry,
            resourceId: getInfantryResourceId(),
            resourcePath: getInfantryResourcePath(getName()),

            // swipingForce: forceSize.Low,
            // swipingWeaponType: weaponType.Heavy,
            // hp: hp.VeryLow,
            // hp: hp.Middle1,
            hp: hp.Low,
            // defenseFactor: defenseFactor.VeryLow,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            // armorRatio: armorRatio.None,
            // armorStrength: armorStrength.Zero,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            // stressingRateFactor: stressingRateFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            // attackFactor: attackFactor.VeryLow2,
            // attackFactor: attackFactor.VeryLow2,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,
            //missRatio: missRatio.VeryLow,

            // moveSpeed: speed.VeryLow,
            moveSpeed: speed.Low,
            lieKeepTime: lieKeepTime.Middle,

            scalar: 1,
            gunScalar: 100,
            positionYOffset: 420 + _getPoisitionYOffsetIncrease(),
        },
        {
            name: modelName.Mousey,
            resourceId: getMouseyResourceId(),
            resourcePath: getMouseyResourcePath(getName()),

            hp: hp.Low,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            moveSpeed: speed.Low,
            lieKeepTime: lieKeepTime.Middle,

            scalar: 0.02,
            gunScalar: 20,
            // positionYOffset: -30
            positionYOffset: -30 + _getPoisitionYOffsetIncrease()
        },
        {
            name: modelName.Ninja,
            resourceId: getNinjaResourceId(),
            resourcePath: getNinjaResourcePath(getName()),

            // swipingForce: forceSize.Low,
            // swipingWeaponType: weaponType.Heavy,
            hp: hp.Low,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            moveSpeed: speed.Low,
            lieKeepTime: lieKeepTime.Middle,

            scalar: 0.02,
            gunScalar: 20,
            // positionYOffset: 18,
            positionYOffset: 18 + _getPoisitionYOffsetIncrease()
        },
        // {
        //     name: modelName.Ch36,
        //     resourceId: getCh36ResourceId(),
        //     resourcePath: getCh36ResourcePath(getName()),
        //     scalar: 0.02,
        //     gunScalar: 20,
        //     positionYOffset: 18 + _getPoisitionYOffsetIncrease()
        // },
        {
            name: modelName.Abe,
            resourceId: getAbeResourceId(),
            resourcePath: getAbeResourcePath(getName()),

            // swipingForce: forceSize.Low,
            // swipingWeaponType: weaponType.Heavy,
            hp: hp.Low,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            moveSpeed: speed.Low,
            lieKeepTime: lieKeepTime.Middle,

            scalar: 0.02,
            gunScalar: 20,
            positionYOffset: 18 + _getPoisitionYOffsetIncrease()
        },
        // {
        //     name: modelName.Ch45,
        //     resourceId: getCh45ResourceId(),
        //     resourcePath: getCh45ResourcePath(getName()),
        //     scalar: 0.02,
        //     gunScalar: 20,
        //     positionYOffset: 18 + _getPoisitionYOffsetIncrease()
        // },
        {
            name: modelName.Dreyar,
            resourceId: LittleManConst.getDreyarResourceId(),
            resourcePath: LittleManConst.getDreyarResourcePath(getName()),

            // swipingForce: forceSize.Low,
            // swipingWeaponType: weaponType.Heavy,
            hp: hp.Low,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            moveSpeed: speed.Low,
            lieKeepTime: lieKeepTime.Middle,

            // scalar: 0.02,
            scalar: 0.002,
            gunScalar: 200,
            positionYOffset: 850 + _getPoisitionYOffsetIncrease()
        },
        {
            name: modelName.Maria,
            resourceId: getMariaResourceId(),
            resourcePath: getMariaResourcePath(getName()),

            // swipingForce: forceSize.Low,
            // swipingWeaponType: weaponType.Heavy,
            hp: hp.Low,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            moveSpeed: speed.Low,
            lieKeepTime: lieKeepTime.Middle,

            scalar: 0.02,
            gunScalar: 20,
            positionYOffset: 30 + _getPoisitionYOffsetIncrease()
        },

        {
            name: modelName.Ely,
            resourceId: getElyResourceId(),
            resourcePath: getElyResourcePath(getName()),

            // swipingForce: forceSize.Low,
            // swipingWeaponType: weaponType.VeryHeavy,
            hp: hp.Low,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            moveSpeed: speed.Middle,
            lieKeepTime: lieKeepTime.Short,

            scalar: 0.02,
            gunScalar: 20,
            positionYOffset: 18 + _getPoisitionYOffsetIncrease()
        },
        {
            name: modelName.Mutant,
            resourceId: getMutantResourceId(),
            resourcePath: getMutantResourcePath(getName()),

            // swipingForce: forceSize.Low,
            // swipingWeaponType: weaponType.VeryHeavy,
            hp: hp.Low,
            defenseFactor: defenseFactor.VeryLow2,
            armorType: armorType.LittleMan,
            armorRatio: armorRatio.Light5,
            armorStrength: armorStrength.VeryLow3,
            emitterLifeFactor: emitterLifeFactor.Middle,
            stressingRateFactor: stressingRateFactor.High,
            attackFactor: attackFactor.VeryLow,
            emitSpeedFactor: emitSpeedFactor.Low,
            critRatioFactor: critRatioFactor.VeryLow,

            moveSpeed: speed.Middle,
            lieKeepTime: lieKeepTime.Short,

            scalar: 0.02,
            gunScalar: 20,
            positionYOffset: 18 + _getPoisitionYOffsetIncrease()
        },
    ]
}

export let buildAnimationResourceId = (animationName, resourceId) => {
    return `${animationName}_${resourceId}`
}

export let getModelRelatedLoadData = () => {
    return [
        {
            id: getElyResourceId(),
            path: getElyResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: LittleManConst.getDreyarResourceId(),
            path: LittleManConst.getDreyarResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        // {
        //     id: LittleManConst.getCh09ResourceId(),
        //     path: LittleManConst.getCh09ResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: getMouseyResourceId(),
            path: getMouseyResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getNinjaResourceId(),
            path: getNinjaResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        // {
        //     id: getCh36ResourceId(),
        //     path: getCh36ResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: getAbeResourceId(),
            path: getAbeResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        // {
        //     id: getCh45ResourceId(),
        //     path: getCh45ResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: getMariaResourceId(),
            path: getMariaResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getMutantResourceId(),
            path: getMutantResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getInfantryResourceId(),
            path: getInfantryResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
    ].concat(
        [
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, getInfantryResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Infantry),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, getMariaResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Maria),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, getMouseyResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Mousey),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, getNinjaResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Ninja),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, getAbeResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Abe),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, LittleManConst.getDreyarResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Dreyar),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, getElyResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Ely),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Lie, getMutantResourceId()),
                path: LittleManConst.getLieAnimationResourcePath(getName(), modelName.Mutant),
                type: resourceType.ArrayBuffer
            },


            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, getInfantryResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Infantry),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, getMariaResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Maria),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, getMouseyResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Mousey),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, getNinjaResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Ninja),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, getAbeResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Abe),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, LittleManConst.getDreyarResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Dreyar),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, getElyResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Ely),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Standup, getMutantResourceId()),
                path: LittleManConst.getStandupAnimationResourcePath(getName(), modelName.Mutant),
                type: resourceType.ArrayBuffer
            },


            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, getMariaResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Maria),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, getInfantryResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Infantry),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, getMutantResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Mutant),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, getAbeResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Abe),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, LittleManConst.getDreyarResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Dreyar),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, LittleManConst.getElyResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Ely),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, getMouseyResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Mousey),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToTop, getNinjaResourceId()),
                path: LittleManConst.getClimbToTopAnimationResourcePath(getName(), modelName.Ninja),
                type: resourceType.ArrayBuffer
            },

            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, getMariaResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Maria),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, getInfantryResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Infantry),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, getMutantResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Mutant),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, getAbeResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Abe),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, LittleManConst.getDreyarResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Dreyar),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, getElyResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Ely),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, getMouseyResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Mousey),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.ClimbToDown, getNinjaResourceId()),
                path: LittleManConst.getClimbToDownAnimationResourcePath(getName(), modelName.Ninja),
                type: resourceType.ArrayBuffer
            },





            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, getInfantryResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Infantry),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, getMariaResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Maria),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, getMouseyResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Mousey),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, getNinjaResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Ninja),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, getAbeResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Abe),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, LittleManConst.getDreyarResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Dreyar),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, getElyResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Ely),
                type: resourceType.ArrayBuffer
            },
            {
                id: buildAnimationResourceId(LittleManDataType.animationName.Death, getMutantResourceId()),
                path: LittleManConst.getDeathAnimationResourcePath(getName(), modelName.Mutant),
                type: resourceType.ArrayBuffer
            },
        ]
    )
}

export let getLoadData = () => {
    return [
        {
            id: LittleManDataType.animationName.Idle,
            path: LittleManConst.getIdleAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        // {
        //     id: LittleManDataType.animationName.Death,
        //     path: LittleManConst.getDeathAnimationResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: LittleManDataType.animationName.Run,
            path: LittleManConst.getRunningAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: LittleManDataType.animationName.Shake,
            path: LittleManConst.getShakeAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: LittleManDataType.animationName.Shoot,
            path: LittleManConst.getShootingAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        // {
        //     id: LittleManDataType.animationName.Swiping,
        //     path: LittleManConst.getSwipingAnimationResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },
        // {
        //     id: LittleManDataType.animationName.VeryFastShoot,
        //     path: LittleManConst.getVeryFastShootingAnimationResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: LittleManDataType.animationName.PickedControlled,
            path: LittleManConst.getControlledAnimationResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },





        // {
        //     id: LittleManConst.getBasicGunResourceId(),
        //     path: LittleManConst.getBasicGunResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: LittleManConst.getLaserGunResourceId(),
            path: LittleManConst.getLaserGunResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        {
            id: LittleManConst.getRocketGunResourceId(),
            path: LittleManConst.getRocketGunResourcePath(getName()),
            type: resourceType.ArrayBuffer
        },
        // {
        //     id: LittleManConst.getPropGunResourceId(),
        //     path: LittleManConst.getPropGunResourcePath(getName()),
        //     type: resourceType.ArrayBuffer
        // },



    ].concat([
        {
            id: LittleManConst.getBlinkSoundResourceId(),
            path: [`./resource/${getName()}/audio/littleman/${LittleManConst.getBlinkSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: LittleManConst.getQTESuccessSoundResourceId(),
            path: [`./resource/${getName()}/audio/littleman/${LittleManConst.getQTESuccessSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: LittleManConst.getQTEFailSoundResourceId(),
            path: [`./resource/${getName()}/audio/littleman/${LittleManConst.getQTEFailSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: LittleManConst.getQTEStartSoundResourceId(),
            path: [`./resource/${getName()}/audio/littleman/${LittleManConst.getQTEStartSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: LittleManConst.getClimbToTopSoundResourceId(),
            path: [`./resource/${getName()}/audio/littleman/${LittleManConst.getClimbToTopSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
        {
            id: LittleManConst.getClimbToDownSoundResourceId(),
            path: [`./resource/${getName()}/audio/littleman/${LittleManConst.getClimbToDownSoundResourceId()}.mp3`],
            type: resourceType.Audio
        },
    ] as any)
}