import { Quaternion, Vector3 } from "three"
import { state } from "../../../../type/StateType"
import { resourceId } from "procedural_city/src/Main.gen1"
import { MutableRecordUtils } from "meta3d-jiehuo-abstract";
import { buildEmptyResourceId } from "procedural_city";
import { getAllLoadResourceIdData } from "../../../../mod/InteractionMod";

// const _q = new Quaternion();
// const _m = new Matrix4();
const _v1 = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
// const _v4 = new Vector3();

export let getTileEmptyResourceId = () => "tile_empty"

export let getTileGrassResourceId = () => "tile_grass"

export let getTileConcreteResourceId = () => "tile_concrete"

export let getTileRoadLaneVerticalResourceId = () => "tile_road_lane_vertical"

export let getTileRoadTUpResourceId = () => "tile_road_t_up"

export let getTileRoadIntersectResourceId = () => "tile_road_intersect"

export let getTileRoadCorner2DownLeftResourceId = () => "tile_road_corner_2_down_left"

export let getTileRoadCorner3UpResourceId = () => "tile_road_corner_3_up"


export let buildAllTileResourceIds = () => {
    let road_intersect = 1
    let road_t_up = 2
    let road_t_right = 3
    let road_t_left = 4
    let road_t_down = 5
    let road_lane_horrizon = 6
    let road_lane_vertical = 7
    let road_corner_2_up_right = 8
    let road_corner_2_up_left = 9
    let road_corner_2_down_right = 10
    let road_corner_2_down_left = 11
    let road_corner_3_up = 12
    let road_corner_3_right = 13
    let road_corner_3_left = 14
    let road_corner_3_down = 15

    let grass = 20
    let concrete = 30

    return {
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
    }
}

export let getLoadResourceIdData = (state: state, allServices): Record<resourceId, { loadResourceId: string, quaternion?: Quaternion }> => {
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

    // let {
    //     chestBox,
    //     tradeGirl,
    //     // warGirl,
    //     // blessGirl,
    //     fateGirl,
    // } = buildAllInteractionResourceIds()


    let yAxis = _v1.set(0, 1, 0)
    let zAxis = _v2.set(0, 0, 1)
    let xAxis = _v3.set(1, 0, 0)

    return MutableRecordUtils.concat(
        {
            [buildEmptyResourceId()]: { loadResourceId: getTileEmptyResourceId() },
            [road_intersect]: { loadResourceId: getTileRoadIntersectResourceId() },
            [road_t_up]: { loadResourceId: getTileRoadTUpResourceId() },
            [road_t_right]: {
                loadResourceId: getTileRoadTUpResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(yAxis, -Math.PI / 2)
            },
            [road_t_left]: {
                loadResourceId: getTileRoadTUpResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(yAxis, Math.PI / 2)
            },
            [road_t_down]: {
                loadResourceId: getTileRoadTUpResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(yAxis, Math.PI)
            },
            [road_lane_horrizon]: {
                loadResourceId: getTileRoadLaneVerticalResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), Math.PI / 2)
            },
            [road_lane_vertical]: {
                loadResourceId: getTileRoadLaneVerticalResourceId()
            },
            [road_corner_2_up_right]: {
                loadResourceId: getTileRoadCorner2DownLeftResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), -Math.PI)
            },
            [road_corner_2_up_left]: {
                loadResourceId: getTileRoadCorner2DownLeftResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), -Math.PI / 2)
            },
            [road_corner_2_down_right]: {
                loadResourceId: getTileRoadCorner2DownLeftResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), Math.PI / 2)
            },
            [road_corner_2_down_left]: {
                loadResourceId: getTileRoadCorner2DownLeftResourceId(),
            },
            [road_corner_3_up]: {
                loadResourceId: getTileRoadCorner3UpResourceId()
            },
            [road_corner_3_right]: {
                loadResourceId: getTileRoadCorner3UpResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), -Math.PI / 2)
            },
            [road_corner_3_left]: {
                loadResourceId: getTileRoadCorner3UpResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), Math.PI / 2)
            },
            [road_corner_3_down]: {
                loadResourceId: getTileRoadCorner3UpResourceId(),
                quaternion: new Quaternion().setFromAxisAngle(_v1.set(0, 1, 0), Math.PI)
            },
            [grass]: {
                loadResourceId: getTileGrassResourceId()
            },
            [concrete]: {
                loadResourceId: getTileConcreteResourceId()
            },

            // [chestBox]: {
            //     loadResourceId: _getChestBoxResourceId()
            // },
            // [tradeGirl]: {
            //     loadResourceId: _getTradeGirlResourceId()
            // },
            // // [warGirl]: {
            // //     loadResourceId: _getWarGirlResourceId()
            // // },
            // // [blessGirl]: {
            // //     loadResourceId: _getBlessGirlResourceId()
            // // },
            // [fateGirl]: {
            //     loadResourceId: _getFateGirlResourceId()
            // }
        },
        getAllLoadResourceIdData(state, allServices)
    )
}