import { usedGirl } from "meta3d-jiehuo-abstract/src/type/StateType"
import { state } from "../../../../../type/StateType"
import { attackRange, pose, targetType } from "../../type/StateType"

export enum controlNode {
    Selector = "Selector",
    Sequence = "Sequence",
    Parrel = "Parrel",
}

export enum actionNode {
    SelectTarget = "SelectTarget",
    SelectAttackAction = "SelectAttackAction",

    WalkToTarget = "WalkToTarget",

    Stomp = "Stomp",
    StompRub = "StompRub",
    LeftStomp = "LeftStomp",
    JumpStomp = "JumpStomp",

    SprayMilk = "SprayMilk",

    FreeUB = "FreeUB",
    FreeBreast = "FreeBreast",
    FreeShoe = "FreeShoe",

    BreastPress = "BreastPress",
    BreastPressRub = "BreastPressRub",
    CrawlLick = "CrawlLick",
    CrawlBeat = "CrawlBeat",

    SitRub = "SitRub",
    TightenLeg = "TightenLeg",

    Pickup = "Pickup",
    Pinch = "Pinch",
    Eat = "Eat",
    Pickdown = "Pickdown",
    PutToBreast = "PutToBreast",
    PutToShoe = "PutToShoe",
    Thrust = "Thrust",
    Insert = "Insert",
    // FallByQTE = "FallByQTE",

    ChangePose = "ChangePose",

    Bigger = "Bigger",

    Rest = "Rest",


    ClearTarget = "ClearTarget",




    // Hard = "Hard",


    // ResetGiantessControllerBlockState = "ResetGiantessControllerBlockState",
}

export type behaviourTreeData<actionNode> = {
    name?: string,
    config?: (state: state, usedGirl: usedGirl) => any,
    conditionReturnSuccess?: (state: state, usedGirl: usedGirl) => boolean,
    conditionReturnFail?: (state: state, usedGirl: usedGirl) => boolean,
    node: actionNode | controlNode,
    children: Array<behaviourTreeData<actionNode>>
}
