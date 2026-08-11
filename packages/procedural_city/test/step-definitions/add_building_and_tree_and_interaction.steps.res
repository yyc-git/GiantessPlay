open Meta3dBsJestCucumber
open Cucumber
open Expect
open Operators

open Sinon

open Type

open Main

open Meta3dCommonlib

let feature = loadFeature("./test/features/add_building_and_tree_and_interaction.feature")

defineFeature(feature, test => {
  let randomFuncStub = ref(Obj.magic(1))
  let sandbox = ref(Obj.magic(1))

  let grass = 20
  let concrete = 30

  let building1_1_1 = 40
  let building1_1_2 = 41
  let building2_1_1 = 50
  let building2_2_1 = 60
  let building2_2_2 = 61
  let building2_2_3 = 62
  let building3_3_1 = 70
  let building3_3_2 = 71

  let smallTree1 = 80
  let smallTree2 = 81
  let bigTree1 = 90
  let bigTree2 = 91

  let chestBox = 1001

  // let _prepare = given => {
  //   given("prepare", () => {
  //     FileTool.buildFakeTextDecoder(FileTool.convertUint8ArrayToBuffer)
  //     FileTool.buildFakeTextEncoder(.)
  //   })
  // }

  test(."case1", ({given, \"when", \"and", then}) => {
    // _prepare(given)
    let config = ref(Obj.magic(1))
    // let tileRelations = ref(Obj.magic(1))
    let output = ref(Obj.magic(1))

    // let _buildSinglePossibility = (~rate, ~resourceId): singlePossibility => {
    //   {
    //     rate,
    //     resourceId,
    //   }
    // }

    // let _buildNeighbour = (~up, ~down, ~left, ~right): neighbour => {
    //   {
    //     up,
    //     down,
    //     left,
    //     right,
    //   }
    // }

    let _isGrass = resourceId => {
      // resourceId >= 80
      resourceId === grass
    }

    let _isConcrete = resourceId => {
      // resourceId < 80 && resourceId >= 30
      resourceId === concrete
    }

    given(
      "prepare",
      () => {
        sandbox := createSandbox()
        randomFuncStub := createEmptyStub(refJsObjToSandbox(sandbox.contents))

        // randomFuncStub.contents->Obj.magic->onCall(0, _)->returns(0.1, _)->ignore
        // randomFuncStub.contents->Obj.magic->onCall(1, _)->returns(0.6, _)->ignore
        // randomFuncStub.contents->Obj.magic->returns(0.9, _)->ignore
        // randomFuncStub := createEmptyStub(refJsObjToSandbox(sandbox.contents))->returns(0.6, _)

        randomFuncStub.contents->Obj.magic->onCall(0, _)->returns(0.01, _)->ignore
        randomFuncStub.contents->Obj.magic->returns(0.4, _)->ignore
        // randomFuncStub := createEmptyStub(refJsObjToSandbox(sandbox.contents))->returns(0.4, _)
        // randomFuncStub := Js.Math.random

        config :=
          (
            {
              buildingOfGrassTileCountMap: MutableSparseMap.createEmpty()
              ->MutableSparseMap.set(One_One->Obj.magic, [building1_1_1, building1_1_2])
              ->MutableSparseMap.set(Two_Two->Obj.magic, [building2_2_2, building2_2_3])
              ->MutableSparseMap.set(Three_Three->Obj.magic, [building3_3_1, building3_3_2]),
              buildingOfConcreteTileCountMap: MutableSparseMap.createEmpty()
              ->MutableSparseMap.set(One_One->Obj.magic, [building1_1_1, building1_1_2])
              ->MutableSparseMap.set(Two_One->Obj.magic, [building2_1_1])
              ->MutableSparseMap.set(Two_Two->Obj.magic, [building2_2_1, building2_2_3])
              ->MutableSparseMap.set(Three_Three->Obj.magic, [building3_3_1, building3_3_2]),
              smallTrees: [smallTree1, smallTree2],
              bigTrees: [bigTree1, bigTree2],
              interactions: [
                {
                  resourceId: chestBox,
                  // rate: 0.1,
                  rate: 0.3,
                },
              ],
              buildingTileCountRates: MutableSparseMap.createEmpty()
              ->MutableSparseMap.set(One_One->Obj.magic, 0.1)
              ->MutableSparseMap.set(Two_One->Obj.magic, 0.1)
              ->MutableSparseMap.set(Two_Two->Obj.magic, 0.3)
              ->MutableSparseMap.set(Three_Three->Obj.magic, 0.5),
            }: buildingAndTreeInteractionConfig
          )
      },
    )

    \"when"(
      "add",
      () => {
        output :=
          addBuildingAndTreeAndInteraction(
            [
              [
                {"resourceId": 6},
                {"resourceId": 30},
                {"resourceId": 20},
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
              [
                {"resourceId": -1},
                {"resourceId": 30},
                {"resourceId": 30},
                {"resourceId": 30},
                {
                  "resourceId": 30,
                },
              ],
              [
                {"resourceId": 30},
                {"resourceId": 30},
                {"resourceId": 30},
                {"resourceId": 30},
                {"resourceId": 30},
              ],
              [
                {"resourceId": 30},
                {
                  "resourceId": 30,
                },
                {"resourceId": 30},
                {"resourceId": 30},
                {"resourceId": 30},
              ],
            ]->Obj.magic,
            (_isGrass, _isConcrete, randomFuncStub.contents->Obj.magic),
            config.contents,
          )
      },
    )

    then(
      "should output right",
      () => {
        output.contents->expect ==
          // {
          //   "40": [
          //     [0, 1, 1, 1],
          //     [0, 4, 1, 1],
          //     [1, 2, 1, 1],
          //     [1, 4, 1, 1],
          //     [2, 4, 1, 1],
          //     [3, 1, 1, 1],
          //     [3, 4, 1, 1],
          //     [4, 1, 1, 1],
          //     [4, 2, 1, 1],
          //     [4, 3, 1, 1],
          //     [4, 4, 1, 1],
          //   ],
          //   "50": [[0, 3, 2, 1], [1, 1, 2, 1], [3, 0, 2, 1]],
          //   "60": [[2, 2, 2, 2]],
          //   "80": [[0, 2, 1, 1]],
          // }
          // {
          //   "40": [
          //     [0, 1, 1, 1],
          //     [0, 4, 1, 1],
          //     [1, 4, 1, 1],
          //     [2, 4, 1, 1],
          //     [3, 2, 1, 1],
          //     [3, 4, 1, 1],
          //     [4, 2, 1, 1],
          //     [4, 3, 1, 1],
          //     [4, 4, 1, 1],
          //   ],
          //   "50": [[0, 3, 2, 1], [2, 3, 2, 1], [3, 0, 2, 1], [3, 1, 2, 1]],
          //   "60": [[1, 1, 2, 2]],
          //   "80": [[0, 2, 1, 1]],
          // }
          // {
          //   "40": [
          //     [0, 1, 1, 1],
          //     [0, 4, 1, 1],
          //     [1, 2, 1, 1],
          //     [1, 4, 1, 1],
          //     [2, 4, 1, 1],
          //     [3, 1, 1, 1],
          //     [3, 4, 1, 1],
          //     [4, 1, 1, 1],
          //     [4, 2, 1, 1],
          //     [4, 3, 1, 1],
          //     [4, 4, 1, 1],
          //   ],
          //   "50": [[0, 3, 2, 1], [1, 1, 2, 1], [3, 0, 2, 1]],
          //   "60": [[2, 2, 2, 2]],
          //   "80": [[0, 2, 1, 1]],
          // }
          {
            "1001": [[0, 1, 1, 1]],
            "40": [
              [0, 4, 1, 1],
              [1, 2, 1, 1],
              [1, 4, 1, 1],
              [2, 4, 1, 1],
              [3, 1, 1, 1],
              [3, 4, 1, 1],
              [4, 1, 1, 1],
              [4, 2, 1, 1],
              [4, 3, 1, 1],
              [4, 4, 1, 1],
            ],
            "50": [[0, 3, 2, 1], [1, 1, 2, 1], [3, 0, 2, 1]],
            "60": [[2, 2, 2, 2]],
            "80": [[0, 2, 1, 1]],
          }
        // 1
      },
    )
  })
})
