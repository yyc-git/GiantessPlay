open Type

open Meta3dCommonlib

let generateTiles = (
  randomFunc,
  tileConfig: tileConfig,
  tileRelations: tileRelations,
): outputTileData => {
  let tileState =
    GenerateTile.createState()->GenerateTile.generateTiles(randomFunc, tileConfig, tileRelations)

  tileState.allPossibility->ImmutableSparseMap.map((. depthMap) => {
    depthMap->ImmutableSparseMap.map((. possibility) => {
      {
        resourceId: (possibility->ArraySt.getFirst->OptionSt.getExn).resourceId,
      }
    })
  })
}

let addBuildingAndTreeAndInteraction = AddBuildingAndTreeAndInteraction.add

let addProp = AddProp.add

let isEmptyResourceId = ResourceUtils.isEmptyResourceId

let buildEmptyResourceId = ResourceUtils.buildEmptyResourceId
