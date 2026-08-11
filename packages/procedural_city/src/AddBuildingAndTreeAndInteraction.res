open Type

open Meta3dCommonlib

open Meta3dCommonlibType

open AddUtils

// let _createState = (): addState => {
//   {isUsedTileMap: ImmutableSparseMap.createEmpty()}
// }

// let isNotUsed = (addState: addState, widthIndex, depthIndex) => {
//   switch addState.isUsedTileMap->ImmutableSparseMap.get(widthIndex) {
//   | None => true
//   | Some(map) =>
//     switch map->ImmutableSparseMap.get(depthIndex) {
//     | None => true
//     | Some(isUsed) => !isUsed
//     }
//   }
// }

// let markUsed = (addState: addState, widthIndex, depthIndex) => {
//   {
//     ...addState,
//     isUsedTileMap: addState.isUsedTileMap->ImmutableSparseMap.set(
//       widthIndex,
//       OptionSt.getWithDefault(
//         addState.isUsedTileMap->ImmutableSparseMap.get(widthIndex),
//         ImmutableSparseMap.createEmpty(),
//       )->ImmutableSparseMap.set(depthIndex, true),
//     ),
//   }
// }

// let markUsedWithCount = (
//   addState: addState,
//   widthIndex,
//   widthCount,
//   depthIndex,
//   depthCount,
// ) => {
//   let depthRange = ArraySt.range(depthIndex, depthIndex + depthCount - 1)

//   ArraySt.range(
//     widthIndex,
//     widthIndex + widthCount - 1,
//   )->ArraySt.reduceOneParam((. addState, widthIndex) => {
//     depthRange->ArraySt.reduceOneParam((. addState, depthIndex) => {
//       markUsed(addState, widthIndex, depthIndex)
//     }, addState)
//   }, addState)
// }

let _getTileResourceIdOpt = (outputTileData, widthIndex, depthIndex) => {
  outputTileData
  ->ImmutableSparseMap.get(widthIndex)
  ->OptionSt.bind(widthMap => {
    widthMap->ImmutableSparseMap.get(depthIndex)->OptionSt.map(d => d.resourceId)
  })
}

let _search = (
  validTileCounts,
  isTileFunc,
  addState: addState,
  outputTileData,
  widthIndex,
  depthIndex,
  buildingTileCount,
) => {
  if (
    OptionSt.getWithDefault(
      _getTileResourceIdOpt(outputTileData, widthIndex, depthIndex)->OptionSt.map(isTileFunc),
      false,
    ) &&
    isNotUsed(addState, widthIndex, depthIndex)
  ) {
    // (validTileCounts->ArraySt.push(buildingTileCount), true)
    validTileCounts->ArraySt.push(buildingTileCount)
  } else {
    // (validTileCounts, false)
    validTileCounts
  }
}

// let _searchOnWidthDirection = (
//   validTileCounts,
//   isTileFunc,
//   addState: addState,
//   outputTileData,
//   widthIndex,
//   widthCount,
//   depthIndex,
//   buildingTileCounts,
// ) => {
//   ArraySt.range(widthIndex, widthIndex + widthCount)
//   ->ArraySt.reduceOneParami((. (validTileCounts, isSuccess), index, i) => {
//     if isSuccess {
//       _search(
//         validTileCounts,
//         isTileFunc,
//         addState,
//         outputTileData,
//         index,
//         depthIndex,
//         buildingTileCounts->ArraySt.getExn(i),
//       )
//     } else {
//       (validTileCounts, false)
//     }
//   }, (validTileCounts, true))
//   ->Tuple2.getFirst
// }

let _searchValidTileCounts = (
  validTileCounts,
  isTileFunc,
  addState: addState,
  outputTileData,
  widthIndex,
  depthIndex,
) => {
  let validTileCounts =
    validTileCounts
    // ->_search(isTileFunc, addState, outputTileData, widthIndex, depthIndex, One_One)
    ->_search(isTileFunc, addState, outputTileData, widthIndex + 1, depthIndex, Two_One)
    // ->_search(isTileFunc, addState, outputTileData, widthIndex + 2, depthIndex, Three_One)
    ->_search(isTileFunc, addState, outputTileData, widthIndex, depthIndex + 1, One_Two)
  // ->_search(isTileFunc, addState, outputTileData, widthIndex, depthIndex + 2, One_Three)

  let result = ref(validTileCounts)

  if result.contents->ArraySt.includes(One_Two) {
    result :=
      result.contents->_search(
        isTileFunc,
        addState,
        outputTileData,
        widthIndex,
        depthIndex + 2,
        One_Three,
      )
  }

  if result.contents->ArraySt.includes(Two_One) {
    result :=
      result.contents->_search(
        isTileFunc,
        addState,
        outputTileData,
        widthIndex + 2,
        depthIndex,
        Three_One,
      )
  }

  if result.contents->ArraySt.includes(One_Two) && result.contents->ArraySt.includes(Two_One) {
    result :=
      result.contents->_search(
        isTileFunc,
        addState,
        outputTileData,
        widthIndex + 1,
        depthIndex + 1,
        Two_Two,
      )
  }

  if result.contents->ArraySt.includes(Two_Two) && result.contents->ArraySt.includes(One_Three) {
    result :=
      result.contents->_search(
        isTileFunc,
        addState,
        outputTileData,
        widthIndex + 1,
        depthIndex + 2,
        Two_Three,
      )
  }

  if result.contents->ArraySt.includes(Two_Two) && result.contents->ArraySt.includes(Three_One) {
    result :=
      result.contents->_search(
        isTileFunc,
        addState,
        outputTileData,
        widthIndex + 2,
        depthIndex + 1,
        Three_Two,
      )
  }

  if result.contents->ArraySt.includes(Three_Two) && result.contents->ArraySt.includes(Two_Three) {
    result :=
      result.contents->_search(
        isTileFunc,
        addState,
        outputTileData,
        widthIndex + 2,
        depthIndex + 2,
        Three_Three,
      )
  }

  result.contents

  // let validTileCounts =
  //   validTileCounts->_searchOnWidthDirection(
  //     isTileFunc,
  //     addState,
  //     outputTileData,
  //     widthIndex + 1,
  //     1,
  //     depthIndex,
  //     [Two_One, Three_One],
  //   )

  // let (validTileCounts, isSuccess) =
  //   validTileCounts->_search(
  //     isTileFunc,
  //     addState,
  //     outputTileData,
  //     widthIndex,
  //     depthIndex + 1,
  //     One_Two,
  //   )

  // if isSuccess {
  //   let validTileCounts =
  //     validTileCounts->_searchOnWidthDirection(
  //       isTileFunc,
  //       addState,
  //       outputTileData,
  //       widthIndex + 1,
  //       1,
  //       depthIndex + 1,
  //       [Two_Two, Three_Two],
  //     )

  //   let (validTileCounts, isSuccess) =
  //     validTileCounts->_search(
  //       isTileFunc,
  //       addState,
  //       outputTileData,
  //       widthIndex,
  //       depthIndex + 2,
  //       One_Three,
  //     )

  //   if isSuccess {
  //     validTileCounts->_searchOnWidthDirection(
  //       isTileFunc,
  //       addState,
  //       outputTileData,
  //       widthIndex + 1,
  //       1,
  //       depthIndex + 2,
  //       [Two_Three, Three_Three],
  //     )
  //   } else {
  //     validTileCounts
  //   }
  // } else {
  //   validTileCounts
  // }
}

let _randomSelectOneTileCount = (
  randomFunc,
  validTileCounts: array<buildingTileCount>,
  buildingTileCountRates: MutableSparseMapType.t<buildingTileCount, rate>,
) => {
  if validTileCounts->ArraySt.length == 0 {
    raise(Not_found)
  } else {
    validTileCounts->ArraySt.getExn(
      RandomUtils.randomSelectOneWithRate(
        randomFunc,
        validTileCounts->ArraySt.map(buildingTileCount => {
          OptionSt.getWithDefault(
            buildingTileCountRates->MutableSparseMap.get(buildingTileCount->Obj.magic),
            0.0,
          )
        }),
      ),
    )
  }
}

let _markTileUsedByCount = (addState: addState, validTileCount, widthIndex, depthIndex) => {
  switch validTileCount {
  | One_One => markUsed(addState, widthIndex, depthIndex)
  | One_Two => markUsedWithCount(addState, widthIndex, 1, depthIndex, 2)

  | One_Three => markUsedWithCount(addState, widthIndex, 1, depthIndex, 3)
  | Two_One => markUsedWithCount(addState, widthIndex, 2, depthIndex, 1)

  | Two_Two => markUsedWithCount(addState, widthIndex, 2, depthIndex, 2)

  | Two_Three => markUsedWithCount(addState, widthIndex, 2, depthIndex, 3)

  | Three_One => markUsedWithCount(addState, widthIndex, 3, depthIndex, 1)

  | Three_Two => markUsedWithCount(addState, widthIndex, 3, depthIndex, 2)

  | Three_Three => markUsedWithCount(addState, widthIndex, 3, depthIndex, 3)
  }
}

let _randomSelectOneResourceId = (randomFunc, buildingOfTileCountMap, buildingTileCount) => {
  // buildingOfTileCountMap
  // ->MutableSparseMap.getExn(buildingTileCount)
  // ->RandomUtils.randomSelectOneFromArr(randomFunc, _)
  switch buildingOfTileCountMap->MutableSparseMap.getExn(buildingTileCount) {
  | arr if ArraySt.length(arr) == 0 => None
  | arr => arr->RandomUtils.randomSelectOneFromArr(randomFunc, _) -> Some
  }
  //   ->Log.printForDebug
}

let _getSizeCount = (buildingTileCount: buildingTileCount) => {
  switch buildingTileCount {
  | One_One => (1, 1)
  | One_Two => (1, 2)
  | One_Three => (1, 3)
  | Two_One => (2, 1)
  | Two_Two => (2, 2)
  | Two_Three => (2, 3)
  | Three_One => (3, 1)
  | Three_Two => (3, 2)
  | Three_Three => (3, 3)
  }
}

let _addResourceIdToOutput = (
  outputAddBuildingAndTreeAndInteractionData: outputAddBuildingAndTreeAndInteractionData,
  resourceId: option<resourceId>,
  widthIndex,
  depthIndex,
  validTileCount: buildingTileCount,
) => {
  switch resourceId {
  | None => outputAddBuildingAndTreeAndInteractionData
  | Some(resourceId) =>
    let (widthCount, depthCount) = _getSizeCount(validTileCount)

    outputAddBuildingAndTreeAndInteractionData->MutableHashMap.set(
      Belt_Int.toString(resourceId),
      switch outputAddBuildingAndTreeAndInteractionData->MutableHashMap.get(
        Belt_Int.toString(resourceId),
      ) {
      | None => []
      | Some(arr) => arr
      }->ArraySt.push((widthIndex, depthIndex, widthCount, depthCount)),
    )
  }
}

let _addBuilding = (
  (addState: addState, output),
  (randomFunc, isTileFunc),
  outputTileData,
  buildingOfTileCountMap,
  buildingTileCountRates,
  widthIndex,
  depthIndex,
) => {
  // switch(
  // _searchValidTileCounts(
  //     [One_One],
  //     isTileFunc,
  //     addState,
  //     outputTileData,
  //     widthIndex,
  //     depthIndex,
  //   ) ->ArraySt.filter(validTileCount =>{
  // buildingOfTileCountMap->MutableSparseMap.has(buildingTileCount)
  //   })
  // ){
  //   | d when d->ArraySt.length == 0=>
  // }

  //   Log.log((widthIndex, depthIndex))
  let validTileCount =
    _searchValidTileCounts([One_One], isTileFunc, addState, outputTileData, widthIndex, depthIndex)
    ->ArraySt.filter(validTileCount => {
      buildingOfTileCountMap->MutableSparseMap.has(validTileCount->Obj.magic)
    })
    // ->Log.printForDebug
    ->_randomSelectOneTileCount(randomFunc, _, buildingTileCountRates)

  // ->Log.printForDebug

  let addState = _markTileUsedByCount(addState, validTileCount, widthIndex, depthIndex)
  // ->Log.printForDebug

  let output =
    _randomSelectOneResourceId(
      randomFunc,
      buildingOfTileCountMap,
      validTileCount,
    )->_addResourceIdToOutput(output, _, widthIndex, depthIndex, validTileCount)
  // ->Log.printForDebug

  (addState, output)
}

let _addTree = (
  (addState: addState, output),
  randomFunc,
  buildingAndTreeInteractionConfig,
  widthIndex,
  depthIndex,
) => {
  let addState = markUsed(addState, widthIndex, depthIndex)

  let output = RandomUtils.randomSelectOneFromArr(
    randomFunc,
    if randomFunc() < 0.5 {
      buildingAndTreeInteractionConfig.smallTrees
    } else {
      buildingAndTreeInteractionConfig.bigTrees
    },
  )->_addResourceIdToOutput(output, _, widthIndex, depthIndex, One_One)

  (addState, output)
}

let _addInteraction = (
  (addState: addState, output),
  randomFunc,
  // interactions: array<interaction>,
  interactionRates,
  interactionResourceIds,
  widthIndex,
  depthIndex,
) => {
  switch RandomUtils.randomSelectOneOrNoneWithRate(randomFunc, interactionRates) {
  | -1 => None
  | index =>
    let addState = markUsed(addState, widthIndex, depthIndex)

    let output =
      ArraySt.getExn(interactionResourceIds, index)->_addResourceIdToOutput(
        output,
        _,
        widthIndex,
        depthIndex,
        One_One,
      )

    (addState, output)->Some
  }
}

let add = (
  outputTileData: outputTileData,
  (isGrassFunc, isConcreteFunc, randomFunc),
  buildingAndTreeInteractionConfig: buildingAndTreeInteractionConfig,
): outputAddBuildingAndTreeAndInteractionData => {
  let interactions = buildingAndTreeInteractionConfig.interactions
  let interactionRates = interactions->ArraySt.map(({rate, resourceId}) => {
    rate
  })
  let interactionResourceIds = interactions->ArraySt.map(({rate, resourceId}) => {
    resourceId
  })

  outputTileData->MutableSparseMap.reducei((. (addState, output), widthMap, widthIndex) => {
    widthMap->MutableSparseMap.reducei((. (addState, output), {resourceId}, depthIndex) => {
      if !isNotUsed(addState, widthIndex, depthIndex) {
        (addState, output)
      } else {
        switch isConcreteFunc(resourceId) || isGrassFunc(resourceId)
          ? {
              _addInteraction(
                (addState, output),
                randomFunc,
                interactionRates,
                interactionResourceIds,
                widthIndex,
                depthIndex,
              )
            }
          : None {
        | Some(data) => data
        | None =>
          if isConcreteFunc(resourceId) {
            _addBuilding(
              (addState, output),
              (randomFunc, isConcreteFunc),
              outputTileData,
              buildingAndTreeInteractionConfig.buildingOfConcreteTileCountMap,
              buildingAndTreeInteractionConfig.buildingTileCountRates,
              widthIndex,
              depthIndex,
            )
          } else if isGrassFunc(resourceId) {
            if randomFunc() < 0.5 {
              _addTree(
                (addState, output),
                randomFunc,
                buildingAndTreeInteractionConfig,
                widthIndex,
                depthIndex,
              )
            } else {
              _addBuilding(
                (addState, output),
                (randomFunc, isGrassFunc),
                outputTileData,
                buildingAndTreeInteractionConfig.buildingOfGrassTileCountMap,
                buildingAndTreeInteractionConfig.buildingTileCountRates,
                widthIndex,
                depthIndex,
              )
            }
          } else {
            (addState, output)
          }
        }
      }
    }, (addState, output))
  }, (createState(), MutableHashMap.createEmpty()))->Tuple2.getLast
}
