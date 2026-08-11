import { state } from "../../../../../../../type/StateType"
import { buildingAndTreeAndInteractionConfig, buildingTileCount, rate, resourceId, tileConfig } from "procedural_city/src/Main.gen1"
import { buildEmptyResourceId } from "procedural_city"
import { Matrix4, Quaternion, Vector3 } from "three"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract"
import { MutableNumberMapUtils } from "meta3d-jiehuo-abstract"
import { getName } from "../../../../CityScene"
import { resourceType } from "meta3d-jiehuo-abstract/src/type/StateType"
import { getAbstractState } from "../../../../../../../state/State"
import { getIsDebug, getIsNotTestPerf } from "../../../../../Scene"
import { NumberUtils } from "meta3d-jiehuo-abstract"
import { getRenderAccuracy, getRenderSetting } from "../../../../../../../mod/SettingMod"
import { mapSize, renderAccuracyLevel } from "setting-default/src/Type"
import { getAllInteractionConfig, getAllLoadResourceIdData, getAllServices } from "../../../../../../../mod/InteractionMod"
import { getLoadResourceIdData as getLoadResourceIdDataMapData, buildAllTileResourceIds, getTileGrassResourceId, getTileConcreteResourceId, getTileRoadLaneVerticalResourceId, getTileRoadTUpResourceId, getTileRoadIntersectResourceId, getTileRoadCorner2DownLeftResourceId, getTileRoadCorner3UpResourceId, getTileEmptyResourceId } from "../../../MapData"
import { ArrayUtils } from "meta3d-jiehuo-abstract"

const _q = new Quaternion();
const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _v4 = new Vector3();


export enum buildingTileType {
    Grass,
    Concrete,
    GrassAndConcrete,
}

export enum direction {
    Up,
    Down,
    Left,
    Right
}

// export enum interactionName {
//     ChestBox,
// }

// export type singleInteractionData = {
//     name: interactionName,
//     rate: rate
//     intervalGrid: number,
// }


// export type mapData = {}

// export let getMapData = (): mapData => {

// }




let _getChestBoxResourceId = () => "chestBox"

let _getTradeGirlResourceId = () => "tradeGirl"

// let _getWarGirlResourceId = () => "warGirl"

// let _getBlessGirlResourceId = () => "blessGirl"

let _getFateGirlResourceId = () => "fateGirl"







export let getTileResourcePath = (resourceId) => {
    return `./resource/${getName()}/map/tile/${resourceId}.glb`
}

export let getInteractionResourcePath = (resourceId) => {
    return `./resource/${getName()}/map/interaction/${resourceId}.glb`
}


export let getTileLoadData = (state: state) => {
    return [
        {
            id: getTileEmptyResourceId(),
            path: getTileResourcePath(getTileEmptyResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileGrassResourceId(),
            path: getTileResourcePath(getTileGrassResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileConcreteResourceId(),
            path: getTileResourcePath(getTileConcreteResourceId()),
            type: resourceType.ArrayBuffer
        },

        {
            id: getTileRoadLaneVerticalResourceId(),
            path: getTileResourcePath(getTileRoadLaneVerticalResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadTUpResourceId(),
            path: getTileResourcePath(getTileRoadTUpResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadIntersectResourceId(),
            path: getTileResourcePath(getTileRoadIntersectResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadCorner2DownLeftResourceId(),
            path: getTileResourcePath(getTileRoadCorner2DownLeftResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadCorner3UpResourceId(),
            path: getTileResourcePath(getTileRoadCorner3UpResourceId()),
            type: resourceType.ArrayBuffer
        },
    ]
}


export let getBuildingLoadData = () => {
    return [
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.One_One, count: 3 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.One_Two, count: 3 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.One_Three, count: 0 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.Two_One, count: 1 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.Two_Two, count: 4 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.Two_Three, count: 0 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.Three_One, count: 0 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.Three_Two, count: 0 },
        { tileType: buildingTileType.Grass, buildingTileCount: buildingTileCount.Three_Three, count: 1 },


        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.One_One, count: 9 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.One_Two, count: 0 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.One_Three, count: 0 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.Two_One, count: 2 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.Two_Two, count: 9 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.Two_Three, count: 0 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.Three_One, count: 0 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.Three_Two, count: 0 },
        { tileType: buildingTileType.Concrete, buildingTileCount: buildingTileCount.Three_Three, count: 2 },


        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.One_One, count: 9 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.One_Two, count: 0 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.One_Three, count: 0 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.Two_One, count: 0 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.Two_Two, count: 7 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.Two_Three, count: 0 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.Three_One, count: 0 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.Three_Two, count: 0 },
        { tileType: buildingTileType.GrassAndConcrete, buildingTileCount: buildingTileCount.Three_Three, count: 0 }
    ]
}

export let getTreeLoadData = () => {
    return {
        bigTreeCount: 1,
        smallTreeCount: 1
    }
}

export let getInteractionLoadData = (state: state) => {
    return [
        {
            id: _getChestBoxResourceId(),
            path: getInteractionResourcePath(_getChestBoxResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: _getTradeGirlResourceId(),
            path: getInteractionResourcePath(_getTradeGirlResourceId()),
            type: resourceType.ArrayBuffer
        },
        // {
        //     id: _getWarGirlResourceId(),
        //     path: getInteractionResourcePath(_getWarGirlResourceId()),
        //     type: resourceType.ArrayBuffer
        // },
        // {
        //     id: _getBlessGirlResourceId(),
        //     path: getInteractionResourcePath(_getBlessGirlResourceId()),
        //     type: resourceType.ArrayBuffer
        // },
        {
            id: _getFateGirlResourceId(),
            path: getInteractionResourcePath(_getFateGirlResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileGrassResourceId(),
            path: getTileResourcePath(getTileGrassResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileConcreteResourceId(),
            path: getTileResourcePath(getTileConcreteResourceId()),
            type: resourceType.ArrayBuffer
        },

        {
            id: getTileRoadLaneVerticalResourceId(),
            path: getTileResourcePath(getTileRoadLaneVerticalResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadTUpResourceId(),
            path: getTileResourcePath(getTileRoadTUpResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadIntersectResourceId(),
            path: getTileResourcePath(getTileRoadIntersectResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadCorner2DownLeftResourceId(),
            path: getTileResourcePath(getTileRoadCorner2DownLeftResourceId()),
            type: resourceType.ArrayBuffer
        },
        {
            id: getTileRoadCorner3UpResourceId(),
            path: getTileResourcePath(getTileRoadCorner3UpResourceId()),
            type: resourceType.ArrayBuffer
        },
    ]
}


export let buildAllBuildingAndTreeResourceIds = () => {
    let building_0_1_1_1 = 100
    let building_0_1_1_2 = 101
    let building_0_1_1_3 = 102
    let building_0_1_2_1 = 110
    let building_0_1_2_2 = 111
    let building_0_1_2_3 = 112
    let building_0_2_1_1 = 130
    let building_0_2_2_1 = 140
    let building_0_2_2_2 = 141
    let building_0_2_2_3 = 142
    let building_0_2_2_4 = 143
    let building_0_3_3_1 = 180

    let building_1_1_1_1 = 200
    let building_1_1_1_2 = 201
    let building_1_1_1_3 = 202
    let building_1_1_1_4 = 203
    let building_1_1_1_5 = 204
    let building_1_1_1_6 = 205
    let building_1_1_1_7 = 206
    let building_1_1_1_8 = 207
    let building_1_1_1_9 = 208
    let building_1_2_1_1 = 230
    let building_1_2_1_2 = 231
    let building_1_2_2_1 = 240
    let building_1_2_2_2 = 241
    let building_1_2_2_3 = 242
    let building_1_2_2_4 = 243
    let building_1_2_2_5 = 244
    let building_1_2_2_6 = 245
    let building_1_2_2_7 = 246
    let building_1_2_2_8 = 247
    let building_1_2_2_9 = 248

    // let building_1_2_2_10 = 249
    // let building_1_2_2_11 = 250
    // let building_1_2_2_12 = 251
    // let building_1_2_2_13 = 252
    // let building_1_2_2_14 = 253
    // let building_1_2_2_15 = 254

    let building_1_3_3_1 = 280
    let building_1_3_3_2 = 281

    let building_2_1_1_1 = 300
    let building_2_1_1_2 = 301
    let building_2_1_1_3 = 302
    let building_2_1_1_4 = 303
    let building_2_1_1_5 = 304
    let building_2_1_1_6 = 305
    let building_2_1_1_7 = 306
    let building_2_1_1_8 = 307
    let building_2_1_1_9 = 308
    let building_2_2_2_1 = 340
    let building_2_2_2_2 = 341
    let building_2_2_2_3 = 342
    let building_2_2_2_4 = 343
    let building_2_2_2_5 = 344
    let building_2_2_2_6 = 345
    let building_2_2_2_7 = 346


    let tree_small_1 = 50
    let tree_big_1 = 60

    return {
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
    }
}

export let getChestBoxResourceId = () => 1001

export let getTradeGirlResourceId = () => 1011

// export let getWarGirlResourceId = () => 1021

// export let getBlessGirlResourceId = () => 1031

export let getFateGirlResourceId = () => 1041

export let buildAllInteractionResourceIds = () => {
    let chestBox = getChestBoxResourceId()
    let tradeGirl = getTradeGirlResourceId()
    // let warGirl = getWarGirlResourceId()
    // let blessGirl = getBlessGirlResourceId()
    let fateGirl = getFateGirlResourceId()

    return {
        chestBox,
        tradeGirl,
        // warGirl,
        // blessGirl,
        fateGirl,
    }
}

export let getLoadResourceIdData = (state: state): Record<resourceId, { loadResourceId: string, quaternion?: Quaternion }> => {
    let {
        chestBox,
        tradeGirl,
        // warGirl,
        // blessGirl,
        fateGirl,
    } = buildAllInteractionResourceIds()

    return MutableRecordUtils.concat(
        MutableRecordUtils.concat(
            getLoadResourceIdDataMapData(state, getAllServices(state)),
            {
                [chestBox]: {
                    loadResourceId: _getChestBoxResourceId()
                },
                [tradeGirl]: {
                    loadResourceId: _getTradeGirlResourceId()
                },
                // [warGirl]: {
                //     loadResourceId: _getWarGirlResourceId()
                // },
                // [blessGirl]: {
                //     loadResourceId: _getBlessGirlResourceId()
                // },
                [fateGirl]: {
                    loadResourceId: _getFateGirlResourceId()
                }
            },
        ),
        getAllLoadResourceIdData(state)
    )
}


export let getWholeSize = (state: state): [number, number] => {
    if (getIsDebug(state) && getIsNotTestPerf(state)) {
        return [25, 10]
    }

    switch (getRenderSetting(state).mapSize) {
        case mapSize.Small:
            // return [100, 25]
            return [50, 50]
        case mapSize.Middle:
            return [100, 50]
        case mapSize.Big:
            // return [200, 50]
            return [100, 100]
        // case mapSize.VeryBig:
        //     return [200, 200]
    }
}

// let _getGrassAndConcreteAndRoadRate = () => {
//     return {
//         grass:3,
//         concrete:3,

//     }
// }

export let getTileConfig = (state): tileConfig => {
    let {
        road_intersect,
        road_t_up,
        road_t_right,
        road_t_left,
        road_t_down,
        road_lane_horrizon,
        road_lane_vertical,
        road_corner_2_up_right,
        road_corner_2_up_left,
        road_corner_2_down_right,
        road_corner_2_down_left,
        road_corner_3_up,
        road_corner_3_right,
        road_corner_3_left,
        road_corner_3_down,
        grass,
        concrete,
    } = buildAllTileResourceIds()

    return {
        tiles: MutableRecordUtils.toArray(buildAllTileResourceIds()),
        tileRates: MutableNumberMapUtils.fromMutableMap({
            [grass]: 1.0,
            [concrete]: 1.0,

            [road_lane_horrizon]: 1,
            [road_lane_vertical]: 1,
            // [road_lane_vertical]: 10.01,
            [road_t_up]: 0.1,
            [road_t_right]: 0.1,
            [road_t_left]: 0.1,
            [road_t_down]: 0.1,
            [road_intersect]: 0.1,
            [road_corner_2_up_left]: 0.1,
            [road_corner_2_up_right]: 0.1,
            [road_corner_2_down_left]: 0.1,
            [road_corner_2_down_right]: 0.1,
            [road_corner_3_up]: 0.1,
            [road_corner_3_left]: 0.1,
            [road_corner_3_right]: 0.1,
            [road_corner_3_down]: 0.1,
        }),
        // wholeSize: [2, 2]
        // wholeSize: [5, 5]
        // wholeSize: [10, 10]
        wholeSize: getWholeSize(state)
    }
}


let _buildSinglePossibility = (resourceId, rate,) => {
    return {
        rate,
        resourceId,
    }
}

let _buildNeighbour = (up, down, left, right) => {
    return {
        up,
        down,
        left,
        right,
    }
}

let _buildNeighbourOfGrassOrConcrete = (grassRate, concreteRate, laneRate) => {
    return _buildNeighbour(
        _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down, grassRate, concreteRate, laneRate),
        _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up, grassRate, concreteRate, laneRate),
        _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right, grassRate, concreteRate, laneRate),
        _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left, grassRate, concreteRate, laneRate),
    )
}

let _buildNeighbourOfRoadIntersectWithBlockDirection = (blockDirection: direction, grassRate = 0.5, concreteRate = 0.5, laneRate = 0.1) => {
    let {
        road_intersect,
        road_t_up,
        road_t_right,
        road_t_left,
        road_t_down,
        road_lane_horrizon,
        road_lane_vertical,
        road_corner_2_up_right,
        road_corner_2_up_left,
        road_corner_2_down_right,
        road_corner_2_down_left,
        road_corner_3_up,
        road_corner_3_right,
        road_corner_3_left,
        road_corner_3_down,
        grass,
        concrete,
    } = buildAllTileResourceIds()

    switch (blockDirection) {
        case direction.Up:
            return [
                _buildSinglePossibility(concrete, concreteRate),
                _buildSinglePossibility(grass, grassRate),
                _buildSinglePossibility(road_lane_horrizon, laneRate),
                _buildSinglePossibility(road_t_up, 0.1),
                _buildSinglePossibility(road_corner_3_right, 0.1),
                _buildSinglePossibility(road_corner_3_left, 0.1),
                _buildSinglePossibility(road_corner_3_down, 0.1),
                _buildSinglePossibility(road_corner_2_down_right, 0.1),
                _buildSinglePossibility(road_corner_2_down_left, 0.1),
            ]
        case direction.Down:
            return [
                _buildSinglePossibility(concrete, concreteRate),
                _buildSinglePossibility(grass, grassRate),
                _buildSinglePossibility(road_lane_horrizon, laneRate),
                _buildSinglePossibility(road_t_down, 0.1),
                _buildSinglePossibility(road_corner_3_right, 0.1),
                _buildSinglePossibility(road_corner_3_left, 0.1),
                _buildSinglePossibility(road_corner_3_up, 0.1),
                _buildSinglePossibility(road_corner_2_up_right, 0.1),
                _buildSinglePossibility(road_corner_2_up_left, 0.1),
            ]
        case direction.Left:
            return [
                _buildSinglePossibility(concrete, concreteRate),
                _buildSinglePossibility(grass, grassRate),
                _buildSinglePossibility(road_lane_vertical, laneRate),
                _buildSinglePossibility(road_t_left, 0.1),
                _buildSinglePossibility(road_corner_3_right, 0.1),
                _buildSinglePossibility(road_corner_3_up, 0.1),
                _buildSinglePossibility(road_corner_3_down, 0.1),
                _buildSinglePossibility(road_corner_2_up_right, 0.1),
                _buildSinglePossibility(road_corner_2_down_right, 0.1),
            ]
        case direction.Right:
            return [
                _buildSinglePossibility(concrete, concreteRate),
                _buildSinglePossibility(grass, grassRate),
                _buildSinglePossibility(road_lane_vertical, laneRate),
                _buildSinglePossibility(road_t_right, 0.1),
                _buildSinglePossibility(road_corner_3_left, 0.1),
                _buildSinglePossibility(road_corner_3_up, 0.1),
                _buildSinglePossibility(road_corner_3_down, 0.1),
                _buildSinglePossibility(road_corner_2_up_left, 0.1),
                _buildSinglePossibility(road_corner_2_down_left, 0.1),
            ]
    }
}

let _buildNeighbourOfRoadIntersectWithOpenDirection = (openDirection: direction) => {
    let {
        road_intersect,
        road_t_up,
        road_t_right,
        road_t_left,
        road_t_down,
        road_lane_horrizon,
        road_lane_vertical,
        road_corner_2_up_right,
        road_corner_2_up_left,
        road_corner_2_down_right,
        road_corner_2_down_left,
        road_corner_3_up,
        road_corner_3_right,
        road_corner_3_left,
        road_corner_3_down,
        grass,
        concrete,
    } = buildAllTileResourceIds()

    switch (openDirection) {
        case direction.Up:
            return [
                _buildSinglePossibility(road_lane_vertical, 1),
                _buildSinglePossibility(road_intersect, 0.1),

                _buildSinglePossibility(road_t_down, 0.1),
                _buildSinglePossibility(road_t_left, 0.1),
                _buildSinglePossibility(road_t_right, 0.1),
                _buildSinglePossibility(road_corner_3_up, 0.1),
                _buildSinglePossibility(road_corner_2_up_right, 0.1),
                _buildSinglePossibility(road_corner_2_up_left, 0.1),
            ]
        case direction.Down:
            return [
                _buildSinglePossibility(road_lane_vertical, 1),
                _buildSinglePossibility(road_intersect, 0.1),

                _buildSinglePossibility(road_t_up, 0.1),
                _buildSinglePossibility(road_t_left, 0.1),
                _buildSinglePossibility(road_t_right, 0.1),
                _buildSinglePossibility(road_corner_3_down, 0.1),
                _buildSinglePossibility(road_corner_2_down_right, 0.1),
                _buildSinglePossibility(road_corner_2_down_left, 0.1),
            ]
        case direction.Left:
            return [
                _buildSinglePossibility(road_lane_horrizon, 1),
                _buildSinglePossibility(road_intersect, 0.1),

                _buildSinglePossibility(road_t_up, 0.1),
                _buildSinglePossibility(road_t_down, 0.1),
                _buildSinglePossibility(road_t_right, 0.1),
                _buildSinglePossibility(road_corner_3_left, 0.1),
                _buildSinglePossibility(road_corner_2_up_left, 0.1),
                _buildSinglePossibility(road_corner_2_down_left, 0.1),
            ]
        case direction.Right:
            return [
                _buildSinglePossibility(road_lane_horrizon, 1),
                _buildSinglePossibility(road_intersect, 0.1),

                _buildSinglePossibility(road_t_up, 0.1),
                _buildSinglePossibility(road_t_down, 0.1),
                _buildSinglePossibility(road_t_left, 0.1),
                _buildSinglePossibility(road_corner_3_right, 0.1),
                _buildSinglePossibility(road_corner_2_up_right, 0.1),
                _buildSinglePossibility(road_corner_2_down_right, 0.1),
            ]
    }
}

export let getTileRelations = () => {
    let {
        road_intersect,
        road_t_up,
        road_t_right,
        road_t_left,
        road_t_down,
        road_lane_horrizon,
        road_lane_vertical,
        road_corner_2_up_right,
        road_corner_2_up_left,
        road_corner_2_down_right,
        road_corner_2_down_left,
        road_corner_3_up,
        road_corner_3_right,
        road_corner_3_left,
        road_corner_3_down,
        grass,
        concrete,
    } = buildAllTileResourceIds()

    return MutableNumberMapUtils.fromMutableMap({
        [grass]: _buildNeighbourOfGrassOrConcrete(2, 1, 1),
        [concrete]: _buildNeighbourOfGrassOrConcrete(1, 3, 1),

        [road_lane_horrizon]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Left),
        ),
        [road_lane_vertical]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left),
        ),

        [road_t_up]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Left)
        ),
        [road_t_down]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Left)
        ),
        [road_t_left]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Left),
        ),
        [road_t_right]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left),
        ),

        [road_intersect]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
        ),

        [road_corner_2_up_left]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left),
        ),
        [road_corner_2_up_right]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Left),
        ),
        [road_corner_2_down_left]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left),
        ),
        [road_corner_2_down_right]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Left),
        ),

        [road_corner_3_up]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left),
        ),
        [road_corner_3_down]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left),
        ),
        [road_corner_3_left]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Left),
        ),
        [road_corner_3_right]: _buildNeighbour(
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Down),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Up),
            _buildNeighbourOfRoadIntersectWithBlockDirection(direction.Right),
            _buildNeighbourOfRoadIntersectWithOpenDirection(direction.Left),
        ),

    })
}


let _computeCompute = (count, factor) => {
    return Math.round(count * factor)
}

let _randomLimitBuildingUsedResources = (state: state, buildingCountMap) => {
    let factor
    switch (getRenderAccuracy(state)) {
        // case renderAccuracyLevel.MostHigh2:
        // case renderAccuracyLevel.MostHigh:
        case renderAccuracyLevel.VeryHigh:
            factor = 6
            break
        case renderAccuracyLevel.High:
            factor = 3
            break
        case renderAccuracyLevel.Middle:
        case renderAccuracyLevel.Low:
            factor = 1
            break
        case renderAccuracyLevel.Low:
        default:
            factor = 0.5
            break
    }

    let countMap = MutableNumberMapUtils.fromMutableMap({
        [buildingTileCount.One_One]: _computeCompute(3, factor),
        [buildingTileCount.One_Two]: _computeCompute(2, factor),
        [buildingTileCount.One_Three]: _computeCompute(1, factor),
        [buildingTileCount.Two_One]: _computeCompute(2, factor),
        [buildingTileCount.Two_Two]: _computeCompute(4, factor),
        [buildingTileCount.Two_Three]: _computeCompute(1, factor),
        [buildingTileCount.Three_One]: _computeCompute(1, factor),
        [buildingTileCount.Three_Two]: _computeCompute(1, factor),
        [buildingTileCount.Three_Three]: _computeCompute(2, factor),
    })


    return MutableNumberMapUtils.map(buildingCountMap, (val, key) => {
        return NumberUtils.randomSelectCount(val, MutableNumberMapUtils.getExn(countMap, key))
    })
}

export let randomLimitAllBuildingUsedResources = (state, buildingAndTreeAndInteractionConfig: buildingAndTreeAndInteractionConfig) => {
    return {
        ...buildingAndTreeAndInteractionConfig,
        buildingOfGrassTileCountMap: _randomLimitBuildingUsedResources(state, buildingAndTreeAndInteractionConfig.buildingOfGrassTileCountMap),
        buildingOfConcreteTileCountMap: _randomLimitBuildingUsedResources(state, buildingAndTreeAndInteractionConfig.buildingOfConcreteTileCountMap),
    }
}

export let buildBuildingAndTreeAndInteractionConfig = (state): buildingAndTreeAndInteractionConfig => {
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

    } = buildAllBuildingAndTreeResourceIds()

    let {
        chestBox,
        tradeGirl,
        // warGirl,
        // blessGirl,
        fateGirl,
    } = buildAllInteractionResourceIds()

    return randomLimitAllBuildingUsedResources(state, {
        buildingOfGrassTileCountMap: MutableNumberMapUtils.fromMutableMap({
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
        buildingOfConcreteTileCountMap: MutableNumberMapUtils.fromMutableMap({
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
        interactions: [
            {
                resourceId: chestBox,
                rate: 0.04,
            },
            {
                resourceId: tradeGirl,
                // rate: 0.015,
                rate: 0.02,
                // rate: 0.5,
            },
            // {
            //     resourceId: warGirl,
            //     rate: 0.1
            // },
            // {
            //     resourceId: blessGirl,
            //     rate: 0.01
            //     // rate: 0.3
            // },
            {
                resourceId: fateGirl,
                rate: 0.01
                // rate: 0.5
            }
        ].concat(
            getAllInteractionConfig(state)
        ),
        buildingTileCountRates: MutableNumberMapUtils.fromMutableMap({
            [buildingTileCount.One_One]: 0.1,
            [buildingTileCount.One_Two]: 0.1,
            [buildingTileCount.Two_One]: 0.1,
            [buildingTileCount.Two_Two]: 0.5,
            [buildingTileCount.Three_Three]: 0.4,
        })
    })
}

// export let buildInteractionData = (): Array<singleInteractionData> => {
//     return [
//         {
//             name: interactionName.ChestBox,
//             rate: 0.1,
//             intervalGrid: 3
//         }
//     ]
// }


export let getPlayerInitialPosition = () => {
    return new Vector3(-12, 0, -12)
}
