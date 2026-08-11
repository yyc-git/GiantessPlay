import { state } from "frontend/src/scene3d_layer/type/StateType"
import { buildingAndTreeAndInteractionConfig, buildingTileCount } from "procedural_city/src/Main.gen1"
import { api } from "type-api/src/Type"
import { getAllInteractionServices } from "./Utils"

// export let getInteractionLoadData = (state: state) => {
//     return [
//     ]
// }

export let getLoadResourceIdData = (api: api, state: state) => {
    return api.getLoadResourceIdData(state, getAllInteractionServices(api, state))
}


export let buildBuildingAndTreeAndInteractionConfig = (api: api, state): buildingAndTreeAndInteractionConfig => {
    let {
        building_0_1_1_1,
        building_0_1_1_2,
        building_0_1_1_3,
        building_0_1_2_1,
        building_0_1_2_2,
        building_0_1_2_3,
        building_0_2_1_1,
        building_0_2_2_1,
        building_0_2_2_2,
        building_0_2_2_3,
        building_0_2_2_4,
        building_0_3_3_1,

        building_1_1_1_1,
        building_1_1_1_2,
        building_1_1_1_3,
        building_1_1_1_4,
        building_1_1_1_5,
        building_1_1_1_6,
        building_1_1_1_7,
        building_1_1_1_8,
        building_1_1_1_9,
        building_1_2_1_1,
        building_1_2_1_2,
        building_1_2_2_1,
        building_1_2_2_2,
        building_1_2_2_3,
        building_1_2_2_4,
        building_1_2_2_5,
        building_1_2_2_6,
        building_1_2_2_7,
        building_1_2_2_8,
        building_1_2_2_9,
        // building_1_2_2_10,
        // building_1_2_2_11,
        // building_1_2_2_12,
        // building_1_2_2_13,
        // building_1_2_2_14,
        // building_1_2_2_15,
        building_1_3_3_1,
        building_1_3_3_2,

        building_2_1_1_1,
        building_2_1_1_2,
        building_2_1_1_3,
        building_2_1_1_4,
        building_2_1_1_5,
        building_2_1_1_6,
        building_2_1_1_7,
        building_2_1_1_8,
        building_2_1_1_9,

        building_2_2_2_1,
        building_2_2_2_2,
        building_2_2_2_3,
        building_2_2_2_4,
        building_2_2_2_5,
        building_2_2_2_6,
        building_2_2_2_7,

        tree_small_1,
        tree_big_1,

    } = api.buildAllBuildingAndTreeResourceIds()

    // let {
    //     chestBox,
    //     tradeGirl,
    //     // warGirl,
    //     blessGirl,
    //     fateGirl,
    // } = buildAllInteractionResourceIds()

    return api.randomLimitAllBuildingUsedResources(state, {
        buildingOfGrassTileCountMap: api.MutableNumberMapUtils.fromMutableMap({
            [buildingTileCount.One_One]: [
                building_0_1_1_1,
                building_0_1_1_2,
                building_0_1_1_3,
                building_2_1_1_1,
                building_2_1_1_2,
                building_2_1_1_3,
            ],
            [buildingTileCount.One_Two]: [
                building_0_1_2_1,
                building_0_1_2_2,
                building_0_1_2_3,
            ],
            [buildingTileCount.Two_One]: [
                building_0_2_1_1,
            ],
            [buildingTileCount.Two_Two]: [
                building_0_2_2_1,
                building_0_2_2_2,
                building_0_2_2_3,
                building_0_2_2_4,
            ],
            [buildingTileCount.Three_Three]: [
                building_0_3_3_1,
            ],
        }),
        buildingOfConcreteTileCountMap: api.MutableNumberMapUtils.fromMutableMap({
            [buildingTileCount.One_One]: [
                building_1_1_1_1,
                building_1_1_1_2,
                building_1_1_1_3,
                building_1_1_1_4,
                building_1_1_1_5,
                building_1_1_1_6,
                building_1_1_1_7,
                building_1_1_1_8,
                building_1_1_1_9,
                building_2_1_1_1,
                building_2_1_1_2,
                building_2_1_1_3,
                building_2_1_1_4,
                building_2_1_1_5,
                building_2_1_1_6,
                building_2_1_1_7,
                building_2_1_1_8,
                building_2_1_1_9,
            ],
            [buildingTileCount.Two_One]: [
                building_1_2_1_1,
                building_1_2_1_2,
                building_1_2_2_1,
            ],
            [buildingTileCount.Two_Two]: [
                building_1_2_2_1,
                building_1_2_2_2,
                building_1_2_2_3,
                building_1_2_2_4,
                building_1_2_2_5,
                building_1_2_2_6,
                building_1_2_2_7,
                building_1_2_2_8,
                building_1_2_2_9,
                // building_1_2_2_10,
                // building_1_2_2_11,
                // building_1_2_2_12,
                // building_1_2_2_13,
                // building_1_2_2_14,
                // building_1_2_2_15,

                building_2_2_2_1,
                building_2_2_2_2,
                building_2_2_2_3,
                building_2_2_2_4,
                building_2_2_2_5,
                building_2_2_2_6,
                building_2_2_2_7,
            ],
            [buildingTileCount.Three_Three]: [
                building_1_3_3_1,
                building_1_3_3_2,
            ],
        }),
        smallTrees: [
            tree_small_1
        ],
        bigTrees: [
            tree_big_1
        ],
        interactions: api.getAllInteractionConfig(state,
            getAllInteractionServices(api, state)
        ),
        buildingTileCountRates: api.MutableNumberMapUtils.fromMutableMap({
            [buildingTileCount.One_One]: 0.1,
            [buildingTileCount.One_Two]: 0.1,
            [buildingTileCount.Two_One]: 0.1,
            [buildingTileCount.Two_Two]: 0.5,
            [buildingTileCount.Three_Three]: 0.4,
        })
    })
}

export let getAllMapData = (api: api, state: state) => {
    return api.getAllMapData(state, getAllInteractionServices(api, state))
}