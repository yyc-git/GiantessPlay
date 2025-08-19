import { Vector3 } from "three";
import { state } from "../../../../../../type/StateType"
import { getPositionY } from "../../../manage/city1/Army";
import { getLittleManPositionYKey } from "../../../manage/biwu/level3/ArmyManager";

const _v1 = new Vector3();

export let getLevelData = (state: state) => {
    return {
        torsorRange: {
            minX: -207,
            maxX: -133,
            minZ: 41,
            maxZ: 97,
        },
        addArmyRange: {
            minX: -180,
            maxX: -146,
            minZ: 55,
            maxZ: 85,
        },

        movableRange: [
            {
                minX: -157,
                maxX: -140,
                minZ: 41,
                maxZ: 97,
            },
            {
                // minX: -207,
                minX: -210,
                maxX: -157,
                minZ: 52,
                maxZ: 85,
            }
        ],
        getLittleManInitPosition: state => {
            let pos = _v1.set(-140, 0, 66)

            return pos.setY(getPositionY(state, getLittleManPositionYKey(), pos.x, pos.z))
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