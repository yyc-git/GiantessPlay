import { state } from "../../../../../type/StateType"
import { attackRange, pose, targetPrior, targetType } from "../../type/StateType"

export enum controlNode {
    Selector = "Selector",
    Sequence = "Sequence",
    Parrel = "Parrel",
}

export type behaviourTreeData<actionNode> = {
    name?: string,
    config?: (state: state) => any,
    returnSuccessCondition?: (state: state) => boolean,
    returnFailCondition?: (state: state) => boolean,
    node: actionNode | controlNode,
    children: Array<behaviourTreeData<actionNode>>
}
