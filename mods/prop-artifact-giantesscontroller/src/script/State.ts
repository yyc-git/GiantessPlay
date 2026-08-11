import { personality } from "frontend/src/scene3d_layer/script/scene/scene_city/type/StateType"
import { state as blockState } from "prop-other-protocol/src/state/StateType"
import { api } from "type-api/src/Type"

// export enum personalityPrior {
//     Strategic = "Strategic",
//     Aggressive = "Aggressive",
//     Defensive = "Defensive",
//     Playful = "Playful",

//     // Random = "Random",
// }
export type personalityPrior = personality
export const personalityPrior = { ...personality }


export enum targetPrior {
    None,
    LittleMan,
    Building,
    // Cityzen,
    Soldier,
    MilltaryVehicle,
    MilltaryBuilding,
    EliteGiantess,
}

export enum actionPrior {
    None,
    Rest,
    Stomp,
    JumpStomp,
    LeftStomp,
    StompRub,
    SprayMilk,
    // Pickup,
    Pinch,
    Eat,
    BreastPress,
    BreastPressRub,
    CrawlLick,
    CrawlBeat,

    StandToCrawl,
    CrawlToStand,

    StandToSit,
    SitToStand,
    SitRub,
    TightenLeg,

    PickToUB,
    UBToPick,
    Thrust,
    Insert,

    Bigger,

    PutToBreast,
    PutToShoe,

    FreePick,
    FreeBreast,
    FreeShoe,
    FreeUB,
}

export let createState = (api: api): blockState => {
    return {
        // selectPersonalityPrior: personalityPrior.Strategic,
        // selectTargetPrior: targetPrior.None,
        // selectActionPrior: actionPrior.None,
        selectPersonalityPriors: api.MutableRecordUtils.create(),
        selectTargetPriors: api.MutableRecordUtils.create(),
        selectActionPriors: api.MutableRecordUtils.create(),

    }
}