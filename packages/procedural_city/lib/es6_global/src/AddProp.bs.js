

import * as Curry from "./../../../../../node_modules/rescript/lib/es6/curry.js";
import * as ArraySt$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as MutableSparseMap$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/sparse_map/MutableSparseMap.bs.js";

function add(outputTileData, param) {
  var isRoadLaneVerticalFunc = param[2];
  var isRoadLaneHorrizonFunc = param[1];
  var isRoadIntersectFunc = param[0];
  return MutableSparseMap$Meta3dCommonlib.reducei(outputTileData, (function (output, widthMap, widthIndex) {
                return MutableSparseMap$Meta3dCommonlib.reducei(widthMap, (function (output, param, depthIndex) {
                              var resourceId = param.resourceId;
                              if (Curry._1(isRoadLaneHorrizonFunc, resourceId)) {
                                return {
                                        roadLaneHorrizonIndices: ArraySt$Meta3dCommonlib.push(output.roadLaneHorrizonIndices, [
                                              widthIndex,
                                              depthIndex
                                            ]),
                                        roadLaneVerticalIndices: output.roadLaneVerticalIndices,
                                        roadLaneIntersectIndices: output.roadLaneIntersectIndices
                                      };
                              } else if (Curry._1(isRoadLaneVerticalFunc, resourceId)) {
                                return {
                                        roadLaneHorrizonIndices: output.roadLaneHorrizonIndices,
                                        roadLaneVerticalIndices: ArraySt$Meta3dCommonlib.push(output.roadLaneVerticalIndices, [
                                              widthIndex,
                                              depthIndex
                                            ]),
                                        roadLaneIntersectIndices: output.roadLaneIntersectIndices
                                      };
                              } else if (Curry._1(isRoadIntersectFunc, resourceId)) {
                                return {
                                        roadLaneHorrizonIndices: output.roadLaneHorrizonIndices,
                                        roadLaneVerticalIndices: output.roadLaneVerticalIndices,
                                        roadLaneIntersectIndices: ArraySt$Meta3dCommonlib.push(output.roadLaneIntersectIndices, [
                                              widthIndex,
                                              depthIndex
                                            ])
                                      };
                              } else {
                                return output;
                              }
                            }), output);
              }), {
              roadLaneHorrizonIndices: [],
              roadLaneVerticalIndices: [],
              roadLaneIntersectIndices: []
            });
}

export {
  add ,
}
/* No side effect */
