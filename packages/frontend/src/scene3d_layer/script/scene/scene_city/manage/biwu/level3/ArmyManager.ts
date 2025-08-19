import { ArrayUtils } from "meta3d-jiehuo-abstract";
import { state } from "../../../../../../type/StateType";
// import * as ArmyManager from "../ArmyManager";
import { canOnCollisionPart, getAllCollisionShapeOBBData, getPositionY, intersect, isClimbing, setNotOnCollisionParts } from "../../../little_man/climb/ClimbManager";
import { Ray, Vector3 } from "three";
import { NullableUtils } from "meta3d-jiehuo-abstract";
import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable";
import { getGetPositionYFuncDefaultKey, getPositionY as getPositionYArmy, setGetPositionYFunc } from "../../city1/Army";
import { collisionPart } from "../../../data/biwu/level3/CollisionShapeData";
import { isMilltaryBuilding } from "../../city1/milltary_building/MilltaryBuilding";
import { isLittleMan } from "../../../little_man/LittleMan";
import { isGirl } from "../../../girl/Girl";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();


export let generate = (state: state, generateFuncData, count, point, offset, isOnBreast) => {
    let pointOnBody = _v1.set(point.x, getPositionYArmy(state, isOnBreast ? getArmyOnBreastPositionYKey() : getArmyOnTorsorPositionYKey(), point.x, point.z), point.z)

    return ArrayUtils.reducePromise(generateFuncData, (state, [generateFunc, generateFuncs]) => {
        return ArrayUtils.reducePromise(generateFuncs, (state, func) => {
            return generateFunc(state, func, count, pointOnBody, offset)
        }, state)
    }, state)
}

export let getLittleManPositionYKey = () => "LittleManPositionYKey"

export let getArmyOnBreastPositionYKey = () => "ArmyOnBreastPositionYKey"

export let getArmyOnTorsorPositionYKey = () => "ArmyOnTorsorPositionYKey"

export let getGirlPositionYKey = () => "GirlPositionYKey"

let _getPositionY = (state: state, canOnCollisionPartFunc, x, z) => {
    return getPositionY(state, canOnCollisionPartFunc, getAllCollisionShapeOBBData(state), x, z)
}

export let initWhenImportScene = (state: state) => {
    state = setGetPositionYFunc(state, getLittleManPositionYKey(), (state, x, z) => {
        if (
            !isClimbing(state)
        ) {
            return 0
        }

        return _getPositionY(state, canOnCollisionPart, x, z)
    })
    state = setGetPositionYFunc(state, getGirlPositionYKey(), (state, x, z) => {
        return _getPositionY(state, (state, collisionPart_) => true, x, z)
    })
    state = setGetPositionYFunc(state, getArmyOnBreastPositionYKey(), (state, x, z) => {
        return _getPositionY(state, (state, collisionPart_) => {
            switch (collisionPart_) {
                case collisionPart.RightHand:
                case collisionPart.LeftHand:
                case collisionPart.RightFinger:
                case collisionPart.LeftFinger:
                    return false
                default:
                    return true
            }
        }, x, z)
    })
    state = setGetPositionYFunc(state, getArmyOnTorsorPositionYKey(), (state, x, z) => {
        return _getPositionY(state, canOnCollisionPart, x, z)
    })
    state = setGetPositionYFunc(state, getGetPositionYFuncDefaultKey(), (state, x, z) => {
        return _getPositionY(state, canOnCollisionPart, x, z)
    })



    state = setNotOnCollisionParts(state, [
        collisionPart.LeftHand,
        collisionPart.RightHand,
        collisionPart.LeftLowerArm,
        collisionPart.RightLowerArm,
        collisionPart.LeftUpperArm,
        collisionPart.RightUpperArm,
        collisionPart.LeftBreast,
        collisionPart.RightBreast,

        collisionPart.RightFinger,
        collisionPart.LeftFinger,
    ])


    return Promise.resolve(state)
}