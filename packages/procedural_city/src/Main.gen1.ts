/* TypeScript file generated from Main.res by genType. */
/* eslint-disable import/first */


import type { t as Meta3dCommonlibType_MutableSparseMapType_t } from 'meta3d-commonlib-type/src/structure/sparse_map/MutableSparseMapType';
import type { t as Meta3dCommonlibType_MutableHashMapType_t } from 'meta3d-commonlib-type/src/structure/hash_map/MutableHashMapType';

// tslint:disable-next-line:interface-over-type-literal
export type resourceId = number;

// tslint:disable-next-line:interface-over-type-literal
export type size = [number, number];

// tslint:disable-next-line:interface-over-type-literal
export type rate = number;

// tslint:disable-next-line:interface-over-type-literal
export type tileConfig = {
  readonly tiles: resourceId[];
  readonly tileRates: Meta3dCommonlibType_MutableSparseMapType_t<resourceId, rate>;
  readonly wholeSize: size
};


// tslint:disable-next-line:interface-over-type-literal
export enum buildingTileCount {
  One_One,
  One_Two,
  One_Three,
  Two_One,
  Two_Two,
  Two_Three,
  Three_One,
  Three_Two,
  Three_Three
}

type interaction = {
  resourceId: resourceId,
  rate: rate
}

// tslint:disable-next-line:interface-over-type-literal
export type buildingAndTreeAndInteractionConfig = {
  readonly buildingOfGrassTileCountMap: Meta3dCommonlibType_MutableSparseMapType_t<buildingTileCount, resourceId[]>;
  readonly buildingOfConcreteTileCountMap: Meta3dCommonlibType_MutableSparseMapType_t<buildingTileCount, resourceId[]>;
  readonly smallTrees: resourceId[];
  readonly bigTrees: resourceId[];
  readonly interactions: Array<interaction>;
  readonly buildingTileCountRates: Meta3dCommonlibType_MutableSparseMapType_t<buildingTileCount, rate>
};



// tslint:disable-next-line:interface-over-type-literal
// export type config = { readonly tile: tileConfig };

// tslint:disable-next-line:interface-over-type-literal
export type singlePossibility = { readonly rate: rate; readonly resourceId: resourceId };

// tslint:disable-next-line:interface-over-type-literal
export type possibility = singlePossibility[];

// tslint:disable-next-line:interface-over-type-literal
export type neighbour = {
  readonly up: possibility;
  readonly down: possibility;
  readonly left: possibility;
  readonly right: possibility
};

// tslint:disable-next-line:interface-over-type-literal
export type tileRelations = Meta3dCommonlibType_MutableSparseMapType_t<resourceId, neighbour>;

// tslint:disable-next-line:interface-over-type-literal
export type singleOutputData = { readonly resourceId: resourceId };

// tslint:disable-next-line:interface-over-type-literal
export type widthIndex = number;

export type depthIndex = number;

// tslint:disable-next-line:interface-over-type-literal
export type outputTileData = Meta3dCommonlibType_MutableSparseMapType_t<widthIndex, Meta3dCommonlibType_MutableSparseMapType_t<depthIndex, singleOutputData>>;

// tslint:disable-next-line:interface-over-type-literal
export type widthCount = number;

// tslint:disable-next-line:interface-over-type-literal
export type depthCount = number;

// tslint:disable-next-line:interface-over-type-literal
export type outputSingleAddBuildingAndTreeAndInteractionData = [widthIndex, depthIndex, widthCount, depthCount];

// tslint:disable-next-line:interface-over-type-literal
export type outputAddBuildingAndTreeAndInteractionData = Meta3dCommonlibType_MutableHashMapType_t<resourceId, outputSingleAddBuildingAndTreeAndInteractionData[]>;


// tslint:disable-next-line:interface-over-type-literal
export type outputSingleAddPropData = [widthIndex, depthIndex];

// tslint:disable-next-line:interface-over-type-literal
export type outputAddPropData = {
  readonly roadLaneHorrizonIndices: outputSingleAddPropData[];
  readonly roadLaneVerticalIndices: outputSingleAddPropData[];
  readonly roadLaneIntersectIndices: outputSingleAddPropData[]
};
