open Meta3dCommonlibType

open Meta3dCommonlib

type resourceId = int

// type tileCategory =
//   // | Empty
//   | Road
//   | Grass
//   | Concrete
// // | Concrete2

type size = (int, int)

type rate = float

type tileConfig = {
  // tileCategorys: MutableSparseMapType.t<resourceId, tileCategory>,
  tiles: array<resourceId>,
  // tileRatios: MutableSparseMapType.t<tileCategory, float>,
  tileRates: MutableSparseMapType.t<resourceId, rate>,
  // continuedTileCount: MutableSparseMapType.t<resourceId, int>,
  //   continuedTileSizeRange: MutableSparseMapType.t<resourceId, ( size, size )>,
  wholeSize: size,
}

/* not support "L" shape tile count */
@genType
type buildingTileCount =
  | One_One
  | One_Two
  | One_Three
  | Two_One
  | Two_Two
  | Two_Three
  | Three_One
  | Three_Two
  | Three_Three

type interaction = {
  resourceId: resourceId,
  rate: rate,
}

@genType
type buildingAndTreeInteractionConfig = {
  buildingOfGrassTileCountMap: MutableSparseMapType.t<buildingTileCount, array<resourceId>>,
  buildingOfConcreteTileCountMap: MutableSparseMapType.t<buildingTileCount, array<resourceId>>,
  smallTrees: array<resourceId>,
  bigTrees: array<resourceId>,
  interactions: array<interaction>,
  buildingTileCountRates: MutableSparseMapType.t<buildingTileCount, rate>,
}

// @genType
// type propConfig = {
// horrizonUpStreetLights: array<resourceId>,
// horrizonDownStreetLights: array<resourceId>,
// verticalLeftStreetLights: array<resourceId>,
// verticalRightStreetLights: array<resourceId>,
// trafficLight1s: array<resourceId>,
// trafficLight2s: array<resourceId>,
// }

// @genType
// type config = {
//   tile: tileConfig,
//   buildingAndTree: buildingAndTreeInteractionConfig,
// }

type singlePossibility = {
  rate: rate,
  resourceId: resourceId,
}
// type singlePossibility = resourceId

type possibility = array<singlePossibility>

type neighbour = {
  up: possibility,
  down: possibility,
  left: possibility,
  right: possibility,
}

// type tileRelations = {
//   //   possibility: possibility,
//   resourceId: resourceId,
//   neighbours: neighbour,
// }
@genType
type tileRelations = MutableSparseMapType.t<resourceId, neighbour>

@genType
type singleOutputData = {
  resourceId: resourceId,
  // position:
  // index
}

type widthIndex = int

type depthIndex = int

@genType
type outputTileData = MutableSparseMapType.t<
  widthIndex,
  MutableSparseMapType.t<depthIndex, singleOutputData>,
>

type tileState = {
  // initialPossibility: possibility,

  allPossibility: MutableSparseMapType.t<
    widthIndex,
    MutableSparseMapType.t<depthIndex, possibility>,
  >,
  // allCentainty: ImmutableSparseMapType.t<
  //   widthIndex,
  //   ImmutableSparseMapType.t<depthIndex, singleOutputData>,
  // >,
  centaintyCount: int,
}

type addState = {
  // validTileCounts: array<buildingTileCount>,
  isUsedTileMap: ImmutableSparseMapType.t<widthIndex, ImmutableSparseMapType.t<depthIndex, bool>>,
}

// type addPropState = {
//   isUsedTileMap: ImmutableSparseMapType.t<widthIndex, ImmutableSparseMapType.t<depthIndex, bool>>,
// }

type widthCount = int

type depthCount = int

type outputSingleAddBuildingAndTreeAndInteractionData = (
  widthIndex,
  depthIndex,
  widthCount,
  depthCount,
)

@genType
type outputAddBuildingAndTreeAndInteractionData = MutableHashMapType.t<
  resourceId,
  array<outputSingleAddBuildingAndTreeAndInteractionData>,
>

// @genType
// type direction =
//   | Up
//   | Down
//   | Left
//   | Right

// type outputSingleAddPropData = (widthIndex, depthIndex, direction)
type outputSingleAddPropData = (widthIndex, depthIndex)

// @genType
// type outputAddPropData = MutableHashMapType.t<resourceId, array<outputSingleAddBuildingAndTreeAndInteractionData>>

@genType
type outputAddPropData = {
  roadLaneHorrizonIndices: array<outputSingleAddPropData>,
  roadLaneVerticalIndices: array<outputSingleAddPropData>,
  roadLaneIntersectIndices: array<outputSingleAddPropData>,
}
