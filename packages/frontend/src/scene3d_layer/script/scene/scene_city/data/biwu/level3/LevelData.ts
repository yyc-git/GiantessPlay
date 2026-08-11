import { Vector3 } from "three";
import { state } from "../../../../../../type/StateType"
import { getPositionY } from "../../../manage/city1/Army";
import { getLittleManPositionYKey } from "../../../manage/biwu/level3/ArmyManager";
import { getCollisionPartCenter } from "../../../girl/Collision";
import { collisionPart } from "./CollisionShapeData";

const _v1 = new Vector3();


// export let getPositionYOnTorsor = () => {
//     return 37.68274099989556
// }

/*! in some PC and Mobile, girl will move along -x a little(10?). so need offet in this case!

this may be caused by boss's scale not right because of increaseGiantessAttribute bug(already fixed)!
* 
*/
let _getRectifyOffset = (state: state, usedGirl) => {
    let center = getCollisionPartCenter(state,usedGirl,  collisionPart.LowBreast)

    return center.clone().sub(new Vector3(
        // return new Vector3(
        //     // -198.8835,
        //     -210,
        //     23.6434,
        //     // 69.9127
        //     79.9127
        // ).sub(new Vector3(
        -198.8835,
        23.6434,
        69.9127
    )).setY(0)
}

let _fixRangeOffset = (state: state, usedGirl, range) => {
    let offset = _getRectifyOffset(state, usedGirl)

    return {
        minX: range.minX + offset.x,
        maxX: range.maxX + offset.x,
        minZ: range.minZ + offset.z,
        maxZ: range.maxZ + offset.z,
    }
}

export let fixPositionOffset = (state: state, usedGirl, position: Vector3) => {
    let offset = _getRectifyOffset(state, usedGirl)

    return position.add(offset)
}

export let getLevelData = (state: state, usedGirl) => {
    return {
        torsorRange: _fixRangeOffset(state, usedGirl, {
            minX: -207,
            maxX: -133,
            minZ: 41,
            maxZ: 97,
        }),
        addArmyRange: _fixRangeOffset(state, usedGirl, {
            minX: -180,
            maxX: -146,
            minZ: 55,
            maxZ: 85,
        }),

        movableRange: [
            _fixRangeOffset(state, usedGirl,
                {
                    minX: -157,
                    maxX: -140,
                    minZ: 41,
                    maxZ: 97,
                }
            ),
            _fixRangeOffset(state, usedGirl,
                {
                    // minX: -210,
                    minX: -203,
                    maxX: -157,
                    minZ: 52,
                    maxZ: 85,
                }
            ),
        ],
        getLittleManInitPosition: state => {
            let pos = _v1.set(-140, 0, 66)
            pos = fixPositionOffset(state, usedGirl, pos)

            return pos.setY(getPositionY(state, getLittleManPositionYKey(), pos.x, pos.z))
            // return _v1.set(-140, getPositionYOnTorsor(), 66)
        },


        switchFromRightHandOnePointAttackRateToRightHandAddArmyRate: 0.4,
        switchFromRightHandAddArmyRateToRightHandOnePointAttackRate: 0.6,

        switchFromRightHandBeatAttackRateToRightHandAddArmyRate: 0.4,
        switchFromRightHandAddArmyRateToRightHandBeatAttackRate: 0.6,


        switchFromTwoHandsOnePointAttackRateToRightHandAddArmyRate: 0.4,
        switchFromRightHandAddArmyRateToTwoHandsOnePointAttackRate: 0.6,
        switchFromTwoHandsOnePointAttackRateToLeftHandRightHandRate: 0.1,
        switchFromLeftHandRightHandRateToTwoHandsOnePointAttackRate: 0.4,


        switchFromTwoHandsBeatAttackRateToRightHandAddArmyRate: 0.3,
        switchFromRightHandAddArmyRateToTwoHandsBeatAttackRate: 0.6,
        switchFromTwoHandsBeatAttackRateToLeftHandRightHandRate: 0.2,
        switchFromLeftHandRightHandRateToTwoHandsBeatAttackRate: 0.4,


        triggerHitNippleSubGameEventRate: 0.2,

        hpRateToRightHandBeatAttack: 0.8,
        hpRateToTwoHandsOneFingerAttack: 0.5,
        hpRateToTwoHandsBeatAttack: 0.3,
    }
}