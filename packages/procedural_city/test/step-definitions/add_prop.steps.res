open Meta3dBsJestCucumber
open Cucumber
open Expect
open Operators

open Sinon

open Type

open Main

open Meta3dCommonlib

let feature = loadFeature("./test/features/add_prop.feature")

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

  let grass = 20
  let concrete = 30

  test(."case1", ({given, \"when", \"and", then}) => {
    // _prepare(given)
    // let config = ref(Obj.magic(1))
    let output = ref(Obj.magic(1))

    let _isRoadIntersect = resourceId => {
      resourceId === road_intersect
    }

    let _isRoadLaneHorrizon = resourceId => {
      resourceId === road_lane_horrizon
    }

    let _isRoadLaneVertical = resourceId => {
      resourceId === road_lane_vertical
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
        randomFuncStub := createEmptyStub(refJsObjToSandbox(sandbox.contents))->returns(0.4, _)
        // randomFuncStub := Js.Math.random
      },
    )

    \"when"(
      "add",
      () => {
        output :=
          addProp(
            [
              [{"resourceId": 6}, {"resourceId": 7}],
              [{"resourceId": 20}, {"resourceId": 30}],
              [{"resourceId": -1}, {"resourceId": 1}],
            ]->Obj.magic,
            (
              _isRoadIntersect,
              _isRoadLaneHorrizon,
              _isRoadLaneVertical,
              randomFuncStub.contents->Obj.magic,
            ),
          )
      },
    )

    then(
      "should output right",
      () => {
        output.contents->expect ==
          {
            "roadLaneHorrizonIndices": [[0, 0]],
            "roadLaneIntersectIndices": [[2, 1]],
            "roadLaneVerticalIndices": [[0, 1]],
          }
        // 1
      },
    )
  })
})
