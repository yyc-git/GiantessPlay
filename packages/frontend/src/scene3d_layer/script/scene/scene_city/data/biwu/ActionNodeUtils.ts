import { Box3, Vector3 } from "three";
import { state } from "../../../../../type/StateType"
import { updateAllCollisionShapes } from "../../girl/Collision"
import * as Girl from "../../girl/Girl"
import { makeBoxHeightMax } from "../../utils/Box3Utils"
import { damage, getBox, getName } from "../../little_man/LittleMan";
import { damageType, forceSize, usedGirlEnum } from "../../type/StateType";
import { buildFakeGirlWeaponValue, getGirlWeaponType } from "../../girl/Utils";
import { getWorldPosition } from "../../little_man/Transform";
import { TupleUtils } from "meta3d-jiehuo-abstract";
import { computeBossSpecificSkillForceByFactor, computeGiantessForceByFactor } from "../../utils/DamageUtils";
import { useCamera } from "../../CityScene";
import { NullableUtils } from "meta3d-jiehuo-abstract";

const _v1 = /*@__PURE__*/ new Vector3();
const _b1 = /*@__PURE__*/ new Box3();


export let computeDamage = (state: state, usedGirl, box, direction, force: forceSize): Promise<[state, boolean]> => {
    state = updateAllCollisionShapes(state, usedGirl, Girl.getGirl(state, usedGirl))

    // let value = Girl.getValue(state)

    if (box.intersectsBox3(
        makeBoxHeightMax(_b1.copy(getBox(state)))
    )) {
        let weaponValue = buildFakeGirlWeaponValue(state, usedGirl, computeBossSpecificSkillForceByFactor(state, computeGiantessForceByFactor(state, usedGirl, force)))
        force = weaponValue.force

        return damage(
            state,
            [
                [
                    // computeForce(state, computeBossSpecificSkillForceByFactor(state, computeGiantessForceByFactor(state, force))),
                    force,
                    direction,
                ],
                [
                    damageType.Direct,
                    getGirlWeaponType()
                ]
            ],
            weaponValue,
            // Girl.getName(),
            Girl.buildNameByUsedGirl(usedGirl),
            NullableUtils.return_(
                getWorldPosition(state),
            ),
            // value.critRatioFactor,
            // value.attackFactor,
            [], [],
            [
                getName()
            ]
        ).then(TupleUtils.getTuple2First).then(state => [state, true])
    }

    return Promise.resolve([state, false])
}