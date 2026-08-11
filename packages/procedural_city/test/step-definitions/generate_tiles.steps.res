open Meta3dBsJestCucumber
open Cucumber
open Expect
open Operators

open Sinon

open Type

open Main

open Meta3dCommonlib

let feature = loadFeature("./test/features/generate_tiles.feature")

defineFeature(feature, test => {
  let randomFuncStub = ref(Obj.magic(1))
  let sandbox = ref(Obj.magic(1))

  let road_intersect = 1
  // let road_t_up = 2
  // let road_t_right = 3
  // let road_t_left = 4
  // let road_t_down = 5
  let road_lane_horrizon = 6
  let road_lane_vertical = 7
  // let road_corner_2_up_right = 8
  // let road_corner_2_up_left = 9
  // let road_corner_2_down_right = 10
  // let road_corner_2_down_left = 11
  // let road_corner_3_up = 12
  // let road_corner_3_right = 13
  // let road_corner_3_left = 14
  // let road_corner_3_down = 15

  let grass = 20
  let concrete = 30

  // let _prepare = given => {
  //   given("prepare", () => {
  //     FileTool.buildFakeTextDecoder(FileTool.convertUint8ArrayToBuffer)
  //     FileTool.buildFakeTextEncoder(.)
  //   })
  // }

  test(."case1", ({given, \"when", \"and", then}) => {
    // _prepare(given)
    let config = ref(Obj.magic(1))
    let tileRelations = ref(Obj.magic(1))
    let output = ref(Obj.magic(1))

    let _buildSinglePossibility = (~rate, ~resourceId): singlePossibility => {
      {
        rate,
        resourceId,
      }
    }

    let _buildNeighbour = (~up, ~down, ~left, ~right): neighbour => {
      {
        up,
        down,
        left,
        right,
      }
    }

    given(
      "prepare",
      () => {
        sandbox := createSandbox()
        randomFuncStub := createEmptyStub(refJsObjToSandbox(sandbox.contents))

        randomFuncStub.contents->Obj.magic->onCall(0, _)->returns(0.1, _)->ignore
        randomFuncStub.contents->Obj.magic->onCall(1, _)->returns(0.6, _)->ignore
        randomFuncStub.contents->Obj.magic->returns(0.9, _)->ignore
        // randomFuncStub := createEmptyStub(refJsObjToSandbox(sandbox.contents))->returns(0.6, _)

        config :=
          (
            {
              tiles: [
                road_intersect,
                // road_t_up,
                // road_t_right,
                // road_t_left,
                // road_t_down,
                road_lane_horrizon,
                road_lane_vertical,
                // road_corner_2_up_right,
                // road_corner_2_up_left,
                // road_corner_2_down_right,
                // road_corner_2_down_left,
                // road_corner_3_up,
                // road_corner_3_right,
                // road_corner_3_left,
                // road_corner_3_down,
                grass,
                concrete,
              ],
              tileRates: MutableSparseMap.createEmpty()
              ->MutableSparseMap.set(road_intersect, 0.1)
              // ->MutableSparseMap.set(road_t_up, 0.1)
              // ->MutableSparseMap.set(road_t_right, 0.1)
              // ->MutableSparseMap.set(road_t_left, 0.1)
              // ->MutableSparseMap.set(road_t_down, 0.1)
              ->MutableSparseMap.set(road_lane_horrizon, 0.2)
              ->MutableSparseMap.set(road_lane_vertical, 0.2)
              // ->MutableSparseMap.set(road_corner_2_up_right, 0.1)
              // ->MutableSparseMap.set(road_corner_2_up_left, 0.1)
              // ->MutableSparseMap.set(road_corner_2_down_right, 0.1)
              // ->MutableSparseMap.set(road_corner_2_down_left, 0.1)
              // ->MutableSparseMap.set(road_corner_3_up, 0.1)
              // ->MutableSparseMap.set(road_corner_3_right, 0.1)
              // ->MutableSparseMap.set(road_corner_3_left, 0.1)
              // ->MutableSparseMap.set(road_corner_3_down, 0.1)
              ->MutableSparseMap.set(grass, 0.5)
              ->MutableSparseMap.set(concrete, 0.6),
              // wholeSize: (3, 3),
              wholeSize: (5, 5),
              // wholeSize: (50,50),
              // wholeSize: (2,2),
              // wholeSize: (10,10),
            }: tileConfig
          )

        tileRelations :=
          MutableSparseMap.createEmpty()
          ->MutableSparseMap.set(
            road_intersect,
            _buildNeighbour(
              ~up=[
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.9),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
              ],
              ~down=[
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.9),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
              ],
              ~right=[
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.9),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
              ],
              ~left=[
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.9),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
              ],
            ),
          )
          // ->MutableSparseMap.set(road_t_up, 0.1)
          // ->MutableSparseMap.set(road_t_right, 0.1)
          // ->MutableSparseMap.set(road_t_left, 0.1)
          // ->MutableSparseMap.set(road_t_down, 0.1)
          ->MutableSparseMap.set(
            road_lane_horrizon,
            _buildNeighbour(
              ~up=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
              ],
              ~down=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
              ],
              ~right=[
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
                // _buildSinglePossibility(~resourceId=grass, ~rate=0.1),
                // _buildSinglePossibility(~resourceId=concrete, ~rate=0.1),
              ],
              ~left=[
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
              ],
            ),
          )
          ->MutableSparseMap.set(
            road_lane_vertical,
            _buildNeighbour(
              ~up=[
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
              ],
              ~down=[
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_intersect, ~rate=0.1),
              ],
              ~right=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
              ],
              ~left=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
              ],
            ),
          )
          // ->MutableSparseMap.set(road_corner_2_up_right, 0.1)
          // ->MutableSparseMap.set(road_corner_2_up_left, 0.1)
          // ->MutableSparseMap.set(road_corner_2_down_right, 0.1)
          // ->MutableSparseMap.set(road_corner_2_down_left, 0.1)
          // ->MutableSparseMap.set(road_corner_3_up, 0.1)
          // ->MutableSparseMap.set(road_corner_3_right, 0.1)
          // ->MutableSparseMap.set(road_corner_3_left, 0.1)
          // ->MutableSparseMap.set(road_corner_3_down, 0.1)
          ->MutableSparseMap.set(
            grass,
            _buildNeighbour(
              ~up=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.3),
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.1),
                // _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
              ~down=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.3),
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.1),
                // _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
              ~right=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
              ~left=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
            ),
          )
          ->MutableSparseMap.set(
            concrete,
            _buildNeighbour(
              ~up=[
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
                _buildSinglePossibility(~resourceId=grass, ~rate=0.3),
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.1),
                // _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
              ~down=[
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
                _buildSinglePossibility(~resourceId=grass, ~rate=0.3),
                _buildSinglePossibility(~resourceId=road_lane_horrizon, ~rate=0.1),
                // _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
              ~right=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
              ~left=[
                _buildSinglePossibility(~resourceId=grass, ~rate=0.5),
                _buildSinglePossibility(~resourceId=concrete, ~rate=0.5),
                _buildSinglePossibility(~resourceId=road_lane_vertical, ~rate=0.1),
              ],
            ),
          )
      },
    )

    \"when"(
      "generate",
      () => {
        output :=
          generateTiles(randomFuncStub.contents->Obj.magic, config.contents, tileRelations.contents)
        // generateCity(Js.Math.random, config.contents, tileRelations.contents)
      },
    )

    then(
      "should output right",
      () => {
        output.contents->expect == // [
          //     [
          //       {"resourceId": 6},
          //       {"resourceId": 30},
          //       {"resourceId": 20},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //     ],
          //     [
          //       {"resourceId": 6},
          //       {
          //         "resourceId": 30,
          //       },
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //     ],
          //     [
          //       {"resourceId": -1},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //       {
          //         "resourceId": 30,
          //       },
          //     ],
          //     [
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //     ],
          //     [
          //       {"resourceId": 30},
          //       {
          //         "resourceId": 30,
          //       },
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //       {"resourceId": 30},
          //     ],
          //   ]
          [
            [
              {"resourceId": 6},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
            ],
            [
              {"resourceId": 6},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
            ],
            [
              {"resourceId": 6},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
            ],
            [
              {"resourceId": 6},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
            ],
            [
              {"resourceId": 6},
              {
                "resourceId": 30,
              },
              {"resourceId": 30},
              {"resourceId": 30},
              {"resourceId": 30},
            ],
          ]
        // 1
      },
    )
  })
})
