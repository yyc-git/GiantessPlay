

import * as AddProp$ProceduralCity from "./AddProp.bs.js";
import * as ArraySt$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as OptionSt$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/OptionSt.bs.js";
import * as GenerateTile$ProceduralCity from "./GenerateTile.bs.js";
import * as ResourceUtils$ProceduralCity from "./ResourceUtils.bs.js";
import * as ImmutableSparseMap$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/sparse_map/ImmutableSparseMap.bs.js";
import * as AddBuildingAndTreeAndInteraction$ProceduralCity from "./AddBuildingAndTreeAndInteraction.bs.js";

function generateTiles(randomFunc, tileConfig, tileRelations) {
  var tileState = GenerateTile$ProceduralCity.generateTiles(GenerateTile$ProceduralCity.createState(undefined), randomFunc, tileConfig, tileRelations);
  return ImmutableSparseMap$Meta3dCommonlib.map(tileState.allPossibility, (function (depthMap) {
                return ImmutableSparseMap$Meta3dCommonlib.map(depthMap, (function (possibility) {
                              return {
                                      resourceId: OptionSt$Meta3dCommonlib.getExn(ArraySt$Meta3dCommonlib.getFirst(possibility)).resourceId
                                    };
                            }));
              }));
}

var addBuildingAndTreeAndInteraction = AddBuildingAndTreeAndInteraction$ProceduralCity.add;

var addProp = AddProp$ProceduralCity.add;

var isEmptyResourceId = ResourceUtils$ProceduralCity.isEmptyResourceId;

var buildEmptyResourceId = ResourceUtils$ProceduralCity.buildEmptyResourceId;

export {
  generateTiles ,
  addBuildingAndTreeAndInteraction ,
  addProp ,
  isEmptyResourceId ,
  buildEmptyResourceId ,
}
/* No side effect */
