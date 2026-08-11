open Type

open Meta3dCommonlib

open Meta3dCommonlibType

let createState = (): addState => {
  {isUsedTileMap: ImmutableSparseMap.createEmpty()}
}

let isNotUsed = (addState: addState, widthIndex, depthIndex) => {
  switch addState.isUsedTileMap->ImmutableSparseMap.get(widthIndex) {
  | None => true
  | Some(map) =>
    switch map->ImmutableSparseMap.get(depthIndex) {
    | None => true
    | Some(isUsed) => !isUsed
    }
  }
}

let markUsed = (addState: addState, widthIndex, depthIndex) => {
  {
    ...addState,
    isUsedTileMap: addState.isUsedTileMap->ImmutableSparseMap.set(
      widthIndex,
      OptionSt.getWithDefault(
        addState.isUsedTileMap->ImmutableSparseMap.get(widthIndex),
        ImmutableSparseMap.createEmpty(),
      )->ImmutableSparseMap.set(depthIndex, true),
    ),
  }
}

let markUsedWithCount = (addState: addState, widthIndex, widthCount, depthIndex, depthCount) => {
  let depthRange = ArraySt.range(depthIndex, depthIndex + depthCount - 1)

  ArraySt.range(widthIndex, widthIndex + widthCount - 1)->ArraySt.reduceOneParam(
    (. addState, widthIndex) => {
      depthRange->ArraySt.reduceOneParam((. addState, depthIndex) => {
        markUsed(addState, widthIndex, depthIndex)
      }, addState)
    },
    addState,
  )
}
