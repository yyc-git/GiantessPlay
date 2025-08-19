import { state } from "../../../../../../../../type/StateType"
import { actionNodeFunc, behaviourTreeNodeExecuteResult, result } from "../../../../../type/StateType"
import { actionName } from "../../DataType"
import { getCustomData, getKey, setCustomData } from "../BehaviourTreeData"
import * as BehaviourTreeDataAll from "../../behaviour_tree_data_all/BehaviourTreeData"
import * as Girl from "../../../../../girl/Girl"
import { getBone } from "../../../../../utils/MMDUtils"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { Vector3 } from "three"
import { tween } from "meta3d-jiehuo-abstract/src/type/StateType"
import * as OneFingerAttackUtils from "../../OneFingerAttackUtils"
import { collisionPart } from "../../CollisionShapeData"

const _v1 = /*@__PURE__*/ new Vector3();

let _setCurrentTweens = (state: state, tweens: Array<tween>) => {
    return setCustomData(state, {
        ...getCustomData(state),
        tweens
    })
}

let _getHandIKBone = (state: state) => {
    return getBone(state, Girl.getGirl(state), "左腕ＩＫ")
}

let _isHandIKBone = (bone) => {
    return bone.name == "左腕ＩＫ"
}

export let oneFingerAttack: actionNodeFunc = OneFingerAttackUtils.attack(
    [
        _getHandIKBone,
        _isHandIKBone,
        state => NullableUtils.getExn(getCustomData(state).originBoneLocalPosition),
        (state, originBoneLocalPosition) => setCustomData(state, {
            ...getCustomData(state),
            originBoneLocalPosition: NullableUtils.return_(originBoneLocalPosition)
        }),
        state => BehaviourTreeDataAll.setCustomData(state, {
            ...BehaviourTreeDataAll.getCustomData(state),
            isLeftHandAction: true
        }),
        state => BehaviourTreeDataAll.setCustomData(state, {
            ...BehaviourTreeDataAll.getCustomData(state),
            isLeftHandAction: false
        }),
        _setCurrentTweens
    ],
    collisionPart.LeftFinger,
    actionName.LeftHandOneFingerAttack,
    getKey()
)

export let dispose = (state: state) => {
    state = OneFingerAttackUtils.dispose(state, actionName.LeftHandOneFingerAttack)

    return state
}

