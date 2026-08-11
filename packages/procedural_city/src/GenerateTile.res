open Type

open Meta3dCommonlib

let _generateAllPossibility = (
  tileState: tileState,
  tileConfig: tileConfig,
  tileRelations: tileRelations,
): tileState => {
  //// - characterType at edge should be corner
  // - decide width, depth

  let {tiles, tileRates, wholeSize} = tileConfig
  let (width, depth) = wholeSize

  let allResourceIds = tiles
  // let rate = 1.0 /. Belt.Int.toFloat(allResourceIds->ArraySt.length)

  let possibility = allResourceIds->ArraySt.map(resourceId => {
    {
      rate: tileRates->MutableSparseMap.getExn(resourceId),
      resourceId,
    }
  })
  // ->ListSt.fromArray

  let widthArr = ArraySt.range(0, width - 1)
  let depthArr = ArraySt.range(0, depth - 1)

  {
    ...tileState,
    allPossibility: ArraySt.reduceOneParam(
      widthArr,
      (. map, widthIndex) => {
        map->MutableSparseMap.set(
          widthIndex,
          ArraySt.reduceOneParam(
            depthArr,
            (. map, depthIndex) => {
              map->MutableSparseMap.set(depthIndex, possibility)
            },
            MutableSparseMap.createEmpty(),
          ),
        )
      },
      tileState.allPossibility,
    ),
  }
}

let _isNotCollapse = (possibility: possibility) => {
  possibility->ArraySt.length > 1
}

let _computeExtropy = (possibility: possibility) => {
  possibility->ArraySt.reduceOneParam((. sum, {rate}) => {
    // sum +. rate *. Js.Math.log(rate)
    sum +. rate
  }, 0.)

  // possibility->ListSt.length
}

let _findMinExtropy = ({allPossibility}: tileState) => {
  let (resultWidthIndex, resultDepthIndex, extropy) =
    allPossibility->MutableSparseMap.reducei(
      (. (resultWidthIndex, resultDepthIndex, extropy): (int, int, float), map, widthIndex) => {
        map->MutableSparseMap.reducei(
          (.
            (resultWidthIndex, resultDepthIndex, extropy): (int, int, float),
            possibility,
            depthIndex,
          ) => {
            if !_isNotCollapse(possibility) {
              (resultWidthIndex, resultDepthIndex, extropy)
            } else {
              let e = _computeExtropy(possibility)
              if e < extropy {
                (widthIndex, depthIndex, e)
              } else {
                (resultWidthIndex, resultDepthIndex, extropy)
              }
            }
          },
          (resultWidthIndex, resultDepthIndex, extropy),
        )
      },
      (-1, -1, 10000.0),
    )

  (resultWidthIndex, resultDepthIndex)
}

let _randomSelectOnePossibility = (randomFunc, possibility: possibility) => {
  [
    possibility->ArraySt.getExn(
      RandomUtils.randomSelectOneWithRate(randomFunc, possibility->ArraySt.map(({rate}) => rate)),
    ),
  ]
}

let _getPossibility = (allPossibility, widthIndex, depthIndex) => {
  allPossibility->MutableSparseMap.getExn(widthIndex)->MutableSparseMap.getExn(depthIndex)
}

let _getCollapsedPossibility = (allPossibility, widthIndex, depthIndex) => {
  allPossibility
  ->MutableSparseMap.getExn(widthIndex)
  ->MutableSparseMap.getExn(depthIndex)
  //   ->Log.printForDebug
  // ->ListSt.head
  ->ArraySt.getFirst
  ->OptionSt.getExn
}

let _setPossibility = (allPossibility, widthIndex, depthIndex, possibility) => {
  Contract.requireCheck(() => {
    open Contract
    open Operators

    test(Log.buildAssertMessage(~expect=j`possibility's length > 0`, ~actual=j`not`), () =>
      possibility->ArraySt.length > 0
    )
  }, true)

  allPossibility->MutableSparseMap.set(
    widthIndex,
    allPossibility
    ->MutableSparseMap.getExn(widthIndex)
    ->MutableSparseMap.set(depthIndex, possibility),
  )
}

let _setPossibilityByFunc = (allPossibility, func, widthIndex, depthIndex) => {
  let widthMap = allPossibility->MutableSparseMap.getExn(widthIndex)

  allPossibility->MutableSparseMap.set(
    widthIndex,
    widthMap->MutableSparseMap.set(depthIndex, func(widthMap->MutableSparseMap.getExn(depthIndex))),
  )
}

let _collapse = (tileState: tileState, randomFunc, (widthIndex, depthIndex)) => {
  // let widthMap = tileState.allPossibility->MutableSparseMap.getExn(widthIndex)
  {
    ...tileState,
    // allPossibility: tileState.allPossibility->MutableSparseMap.set(
    //   widthIndex,
    //   widthMap->MutableSparseMap.set(
    //     depthIndex,
    //     widthMap->MutableSparseMap.getExn(depthIndex)->_randomSelectOnePossibility(randomFunc, _),
    //   ),
    // ),
    allPossibility: _setPossibilityByFunc(
      tileState.allPossibility,
      _randomSelectOnePossibility(randomFunc),
      widthIndex,
      depthIndex,
    ),
    centaintyCount: tileState.centaintyCount + 1,
  }
}

let _unifyRateToMakeSureSumIsOne = (possibility: possibility) => {
  let sum = possibility->ArraySt.reduceOneParam((. sum, {rate}) => {
    sum +. rate
  }, 0.0)

  possibility->ArraySt.map(({rate, resourceId}) => {
    {
      resourceId,
      rate: rate /. sum,
    }
  })
}

let _getIntersectPossibility = (
  // allPossibility,
  // widthIndex,
  // depthIndex,
  oldPossibility: possibility,
  newPossibility: possibility,
) => {
  // oldPossibility->ListSt.reduce(list{}, (intersect, resourceId) => {
  //   if newPossibility->ListSt.includes(resourceId) {
  //     intersect->ListSt.push(resourceId)
  //   }

  //   intersect
  // })

  let result = oldPossibility->ArraySt.reduceOneParam((. intersect, {rate, resourceId}) => {
      switch newPossibility->ArraySt.find(d => {
        d.resourceId == resourceId
      }) {
      | None => intersect
      | Some(d) =>
        intersect->ArraySt.push({
          rate: rate *. d.rate,
          resourceId,
        })
      }
    }, [])->_unifyRateToMakeSureSumIsOne

  if result->ArraySt.length == 0 {
    [
      {
        resourceId: ResourceUtils.buildEmptyResourceId(),
        rate: 1.0,
      },
    ]
  } else {
    result
  }
}

let _updatePossibility = (
  tileState: tileState,
  propateByRelationsFunc,
  (widthSize, depthSize),
  widthIndex,
  depthIndex,
  newPossibility,
  tileConfig,
  tileRelations,
) => {
  // Log.log("a")
  if widthIndex < 0 || widthIndex >= widthSize || depthIndex < 0 || depthIndex >= depthSize {
    tileState
  } else {
    let oldPossibility = _getPossibility(tileState.allPossibility, widthIndex, depthIndex)

    if !_isNotCollapse(oldPossibility) {
      tileState
    } else {
      let intersectPossibility = _getIntersectPossibility(oldPossibility, newPossibility)

      // ->Log.printForDebug

      let tileState = {
        ...tileState,
        allPossibility: _setPossibility(
          tileState.allPossibility,
          widthIndex,
          depthIndex,
          intersectPossibility,
        ),
      }

      if !_isNotCollapse(intersectPossibility) {
        let tileState = {
          ...tileState,
          centaintyCount: tileState.centaintyCount + 1,
        }

        // Log.log(("bbb", widthIndex, depthIndex))
        propateByRelationsFunc(tileState, (widthIndex, depthIndex), tileConfig, tileRelations)
      } else {
        tileState
      }
    }
  }
}

let rec _propateByRelations = (
  tileState: tileState,
  (widthIndex, depthIndex),
  tileConfig: tileConfig,
  tileRelations: tileRelations,
) => {
  // let allPossibility = tileState.allPossibility
  let resourceId = // allPossibility
  // ->MutableSparseMap.getExn(widthIndex)
  // ->MutableSparseMap.getExn(depthIndex)
  // ->ListSt.head
  // ->OptionSt.getExn
  _getCollapsedPossibility(tileState.allPossibility, widthIndex, depthIndex).resourceId

  // ->Log.printForDebug

  if ResourceUtils.isEmptyResourceId(resourceId) {
    tileState
  } else {
    switch tileRelations->MutableSparseMap.get(resourceId) {
    | None => tileState
    | Some({up, down, left, right}) =>
      tileState
      ->_updatePossibility(
        _propateByRelations,
        tileConfig.wholeSize,
        widthIndex,
        depthIndex - 1,
        up,
        tileConfig,
        tileRelations,
      )
      ->_updatePossibility(
        _propateByRelations,
        tileConfig.wholeSize,
        widthIndex,
        depthIndex + 1,
        down,
        tileConfig,
        tileRelations,
      )
      ->_updatePossibility(
        _propateByRelations,
        tileConfig.wholeSize,
        widthIndex - 1,
        depthIndex,
        left,
        tileConfig,
        tileRelations,
      )
      ->_updatePossibility(
        _propateByRelations,
        tileConfig.wholeSize,
        widthIndex + 1,
        depthIndex,
        right,
        tileConfig,
        tileRelations,
      )
    }
    // {
    //   ...tileState,
    //   allPossibility,
    // }
  }
}

// let _computeTileCount = (allPossibility, resourceId) => {}

// let _removeTileFromAllPosibility = (tileState: tileState, resourceId) => {

//   // update centaintyCount
// }

// let _propateByLimitTileRatio = (
//   tileState: tileState,
//   (widthIndex, depthIndex),
//   {tileConfig}: tileConfig,
//   tileRelations: tileRelations,
// ) => {
//   // - 地块的比例
//   //     如道路占10%，草地占40%
//   ////     if characterType reach:
//   ////         neighbour use corner to end;
//   ////         other remove characterType;

//   let {tileCategorys, tileRatio, wholeSize} = tileConfig
//   let (width, depth) = wholeSize

//   tileCategorys->MutableSparseMap.getValues->ArraySt.reduceOneParam((. tileState, tileCategorys) => {
//     let tileMaxCount = Js.Math.unsafe_round(
//       tileRatio->MutableSparseMap.getExn(resourceId) *. Belt_Int.toFloat(width * depth),
//     )

//     if _computeTileCount(tileState.allPossibility, resourceId) >= tileMaxCount {
//       _removeTileFromAllPosibility(tileState, resourceId)
//     }

//     tileState
//   }, tileState)

// }

// let _propateByLimit = (
//   tileState: tileState,
//   (widthIndex, depthIndex),
//   {tileConfig}: tileConfig,
//   tileRelations: tileRelations,
// ) => {
//   //// - 一片相邻的相同地块，需要是长方形
//   ////     for concrete, grass, not characterType
//   // - 地块的比例
//   //     如道路占10%，草地占40%
//   //     if characterType reach:
//   //         neighbour use corner to end;
//   //         other remove characterType;
//   //// - 地块的个数
//   ////     // if neary count, genrate new not continued tileConfig's rate decrease

//   let {tileCategorys, tileRatio, wholeSize} = tileConfig

//   let allResourceIds = tileCategorys->_getAllResourceIds

//   // update centaintyCount
// }

// let _propate = (
//   tileState: tileState,
//   (widthIndex, depthIndex),
//   tileConfig: tileConfig,
//   tileRelations: tileRelations,
// ) => {}

let _isAllCentainty = (tileState: tileState, tileConfig: tileConfig) => {
  let (width, depth) = tileConfig.wholeSize
  tileState.centaintyCount == width * depth
}

let rec _wfc = (
  tileState: tileState,
  randomFunc,
  tileConfig: tileConfig,
  tileRelations: tileRelations,
) => {
  if _isAllCentainty(tileState, tileConfig) {
    tileState
  } else {
    let coord = _findMinExtropy(tileState)
    // ->Log.printForDebug

    let tileState = _collapse(tileState, randomFunc, coord)

    let tileState = _propateByRelations(tileState, coord, tileConfig, tileRelations)

    // Log.log(_getPossibility(tileState.allPossibility, 1, 0))

    _wfc(tileState, randomFunc, tileConfig, tileRelations)
  }
}

let generateTiles = (
  tileState: tileState,
  randomFunc,
  tileConfig: tileConfig,
  tileRelations: tileRelations,
) => {
  tileState
  ->_generateAllPossibility(tileConfig, tileRelations)
  // ->Log.printForDebug
  ->_wfc(randomFunc, tileConfig, tileRelations)
}

let createState = (): tileState => {
  {
    allPossibility: MutableSparseMap.createEmpty(),
    // allCentainty: MutableSparseMap.createEmpty(),
    centaintyCount: 0,
  }
}
