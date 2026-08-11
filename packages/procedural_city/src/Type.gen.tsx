/* TypeScript file generated from Type.res by genType. */
/* eslint-disable import/first */


import type {MutableHashMapType_t as Meta3dCommonlibType_MutableHashMapType_t} from 'meta3d-commonlib-type/Meta3dCommonlibType.gen';

import type {MutableSparseMapType_t as Meta3dCommonlibType_MutableSparseMapType_t} from 'meta3d-commonlib-type/Meta3dCommonlibType.gen';

// tslint:disable-next-line:interface-over-type-literal
export type resourceId = number;

// tslint:disable-next-line:interface-over-type-literal
export type rate = number;

// tslint:disable-next-line:interface-over-type-literal
export type buildingTileCount = 
    "One_One"
  | "One_Two"
  | "One_Three"
  | "Two_One"
  | "Two_Two"
  | "Two_Three"
  | "Three_One"
  | "Three_Two"
  | "Three_Three";

// tslint:disable-next-line:interface-over-type-literal
export type interaction = { readonly resourceId: resourceId; readonly rate: rate };

// tslint:disable-next-line:interface-over-type-literal
export type buildingAndTreeInteractionConfig = {
  readonly buildingOfGrassTileCountMap: Meta3dCommonlibType_MutableSparseMapType_t<buildingTileCount,resourceId[]>; 
  readonly buildingOfConcreteTileCountMap: Meta3dCommonlibType_MutableSparseMapType_t<buildingTileCount,resourceId[]>; 
  readonly smallTrees: resourceId[]; 
  readonly bigTrees: resourceId[]; 
  readonly interactions: interaction[]; 
  readonly buildingTileCountRates: Meta3dCommonlibType_MutableSparseMapType_t<buildingTileCount,rate>
};

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
export type tileRelations = Meta3dCommonlibType_MutableSparseMapType_t<resourceId,neighbour>;

// tslint:disable-next-line:interface-over-type-literal
export type singleOutputData = { readonly resourceId: resourceId };

// tslint:disable-next-line:interface-over-type-literal
export type widthIndex = number;

// tslint:disable-next-line:interface-over-type-literal
export type depthIndex = number;

// tslint:disable-next-line:interface-over-type-literal
export type outputTileData = Meta3dCommonlibType_MutableSparseMapType_t<widthIndex,Meta3dCommonlibType_MutableSparseMapType_t<depthIndex,singleOutputData>>;

// tslint:disable-next-line:interface-over-type-literal
export type widthCount = number;

// tslint:disable-next-line:interface-over-type-literal
export type depthCount = number;

// tslint:disable-next-line:interface-over-type-literal
export type outputSingleAddBuildingAndTreeAndInteractionData = [widthIndex, depthIndex, widthCount, depthCount];

// tslint:disable-next-line:interface-over-type-literal
export type outputAddBuildingAndTreeAndInteractionData = Meta3dCommonlibType_MutableHashMapType_t<resourceId,outputSingleAddBuildingAndTreeAndInteractionData[]>;

// tslint:disable-next-line:interface-over-type-literal
export type outputSingleAddPropData = [widthIndex, depthIndex];

// tslint:disable-next-line:interface-over-type-literal
export type outputAddPropData = {
  readonly roadLaneHorrizonIndices: outputSingleAddPropData[]; 
  readonly roadLaneVerticalIndices: outputSingleAddPropData[]; 
  readonly roadLaneIntersectIndices: outputSingleAddPropData[]
};
