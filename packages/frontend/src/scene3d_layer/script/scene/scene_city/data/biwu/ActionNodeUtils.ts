import { Box3, Vector3 } from "three";
import { state } from "../../../../../type/StateType"
import { computeForce, updateAllCollisionShapes } from "../../girl/Collision"
import * as Girl from "../../girl/Girl"
import { makeBoxHeightMax } from "../../utils/Box3Utils"
import { damage, getBox, getName } from "../../little_man/LittleMan";
import { damageType } from "../../type/StateType";
import { getGirlWeaponType } from "../../girl/Utils";
import { getWorldPosition } from "../../little_man/Transform";
import { TupleUtils } from "meta3d-jiehuo-abstract";

const _v1 = /*@__PURE__*/ new Vector3();
const _b1 = /*@__PURE__*/ new Box3();


export let computeDamage = (state: state, box, direction, force): Promise<[state, boolean]> => {
    state = updateAllCollisionShapes(state, Girl.getGirl(state))

    if (box.intersectsBox3(
        makeBoxHeightMax(_b1.copy(getBox(state)))
    )) {
        return damage(
            state,
            [
                [
                    computeForce(state, force),
                    direction,
                ],
                [
                    damageType.Direct,
                    getGirlWeaponType()
                ]
            ],
            Girl.getName(),
            getWorldPosition(state),
            [], [],
            [
                getName()
            ]
        ).then(TupleUtils.getTuple2First).then(state => [state, true])
    }

    return Promise.resolve([state, false])
}