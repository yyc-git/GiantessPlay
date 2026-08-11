

import * as Curry from "./../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Log$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/log/Log.bs.js";
import * as ArraySt$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/ArraySt.bs.js";
import * as Contract$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/contract/Contract.bs.js";
import * as OptionSt$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/OptionSt.bs.js";
import * as RandomUtils$ProceduralCity from "./RandomUtils.bs.js";
import * as ResourceUtils$ProceduralCity from "./ResourceUtils.bs.js";
import * as MutableSparseMap$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/sparse_map/MutableSparseMap.bs.js";

function _generateAllPossibility(tileState, tileConfig, tileRelations) {
  var wholeSize = tileConfig.wholeSize;
  var tileRates = tileConfig.tileRates;
  var possibility = ArraySt$Meta3dCommonlib.map(tileConfig.tiles, (function (resourceId) {
          return {
                  rate: MutableSparseMap$Meta3dCommonlib.getExn(tileRates, resourceId),
                  resourceId: resourceId
                };
        }));
  var widthArr = ArraySt$Meta3dCommonlib.range(0, wholeSize[0] - 1 | 0);
  var depthArr = ArraySt$Meta3dCommonlib.range(0, wholeSize[1] - 1 | 0);
  return {
          allPossibility: ArraySt$Meta3dCommonlib.reduceOneParam(widthArr, (function (map, widthIndex) {
                  return MutableSparseMap$Meta3dCommonlib.set(map, widthIndex, ArraySt$Meta3dCommonlib.reduceOneParam(depthArr, (function (map, depthIndex) {
                                    return MutableSparseMap$Meta3dCommonlib.set(map, depthIndex, possibility);
                                  }), MutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined)));
                }), tileState.allPossibility),
          centaintyCount: tileState.centaintyCount
        };
}

function _isNotCollapse(possibility) {
  return ArraySt$Meta3dCommonlib.length(possibility) > 1;
}

function _computeExtropy(possibility) {
  return ArraySt$Meta3dCommonlib.reduceOneParam(possibility, (function (sum, param) {
                return sum + param.rate;
              }), 0);
}

function _findMinExtropy(param) {
  var match = MutableSparseMap$Meta3dCommonlib.reducei(param.allPossibility, (function (param, map, widthIndex) {
          return MutableSparseMap$Meta3dCommonlib.reducei(map, (function (param, possibility, depthIndex) {
                        var extropy = param[2];
                        var resultDepthIndex = param[1];
                        var resultWidthIndex = param[0];
                        if (ArraySt$Meta3dCommonlib.length(possibility) <= 1) {
                          return [
                                  resultWidthIndex,
                                  resultDepthIndex,
                                  extropy
                                ];
                        }
                        var e = _computeExtropy(possibility);
                        if (e < extropy) {
                          return [
                                  widthIndex,
                                  depthIndex,
                                  e
                                ];
                        } else {
                          return [
                                  resultWidthIndex,
                                  resultDepthIndex,
                                  extropy
                                ];
                        }
                      }), [
                      param[0],
                      param[1],
                      param[2]
                    ]);
        }), [
        -1,
        -1,
        10000.0
      ]);
  return [
          match[0],
          match[1]
        ];
}

function _randomSelectOnePossibility(randomFunc, possibility) {
  return [ArraySt$Meta3dCommonlib.getExn(possibility, RandomUtils$ProceduralCity.randomSelectOneWithRate(randomFunc, ArraySt$Meta3dCommonlib.map(possibility, (function (param) {
                          return param.rate;
                        }))))];
}

function _getPossibility(allPossibility, widthIndex, depthIndex) {
  return MutableSparseMap$Meta3dCommonlib.getExn(MutableSparseMap$Meta3dCommonlib.getExn(allPossibility, widthIndex), depthIndex);
}

function _getCollapsedPossibility(allPossibility, widthIndex, depthIndex) {
  return OptionSt$Meta3dCommonlib.getExn(ArraySt$Meta3dCommonlib.getFirst(MutableSparseMap$Meta3dCommonlib.getExn(MutableSparseMap$Meta3dCommonlib.getExn(allPossibility, widthIndex), depthIndex)));
}

function _setPossibility(allPossibility, widthIndex, depthIndex, possibility) {
  Contract$Meta3dCommonlib.requireCheck((function (param) {
          Contract$Meta3dCommonlib.test(Log$Meta3dCommonlib.buildAssertMessage("possibility's length > 0", "not"), (function (param) {
                  return Contract$Meta3dCommonlib.Operators.$great(ArraySt$Meta3dCommonlib.length(possibility), 0);
                }));
        }), true);
  return MutableSparseMap$Meta3dCommonlib.set(allPossibility, widthIndex, MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.getExn(allPossibility, widthIndex), depthIndex, possibility));
}

function _setPossibilityByFunc(allPossibility, func, widthIndex, depthIndex) {
  var widthMap = MutableSparseMap$Meta3dCommonlib.getExn(allPossibility, widthIndex);
  return MutableSparseMap$Meta3dCommonlib.set(allPossibility, widthIndex, MutableSparseMap$Meta3dCommonlib.set(widthMap, depthIndex, Curry._1(func, MutableSparseMap$Meta3dCommonlib.getExn(widthMap, depthIndex))));
}

function _collapse(tileState, randomFunc, param) {
  return {
          allPossibility: _setPossibilityByFunc(tileState.allPossibility, (function (param) {
                  return _randomSelectOnePossibility(randomFunc, param);
                }), param[0], param[1]),
          centaintyCount: tileState.centaintyCount + 1 | 0
        };
}

function _unifyRateToMakeSureSumIsOne(possibility) {
  var sum = ArraySt$Meta3dCommonlib.reduceOneParam(possibility, (function (sum, param) {
          return sum + param.rate;
        }), 0.0);
  return ArraySt$Meta3dCommonlib.map(possibility, (function (param) {
                return {
                        rate: param.rate / sum,
                        resourceId: param.resourceId
                      };
              }));
}

function _getIntersectPossibility(oldPossibility, newPossibility) {
  var result = _unifyRateToMakeSureSumIsOne(ArraySt$Meta3dCommonlib.reduceOneParam(oldPossibility, (function (intersect, param) {
              var resourceId = param.resourceId;
              var d = ArraySt$Meta3dCommonlib.find(newPossibility, (function (d) {
                      return d.resourceId === resourceId;
                    }));
              if (d !== undefined) {
                return ArraySt$Meta3dCommonlib.push(intersect, {
                            rate: param.rate * d.rate,
                            resourceId: resourceId
                          });
              } else {
                return intersect;
              }
            }), []));
  if (ArraySt$Meta3dCommonlib.length(result) === 0) {
    return [{
              rate: 1.0,
              resourceId: ResourceUtils$ProceduralCity.buildEmptyResourceId(undefined)
            }];
  } else {
    return result;
  }
}

function _updatePossibility(tileState, propateByRelationsFunc, param, widthIndex, depthIndex, newPossibility, tileConfig, tileRelations) {
  if (widthIndex < 0 || widthIndex >= param[0] || depthIndex < 0 || depthIndex >= param[1]) {
    return tileState;
  }
  var oldPossibility = _getPossibility(tileState.allPossibility, widthIndex, depthIndex);
  if (ArraySt$Meta3dCommonlib.length(oldPossibility) <= 1) {
    return tileState;
  }
  var intersectPossibility = _getIntersectPossibility(oldPossibility, newPossibility);
  var tileState_allPossibility = _setPossibility(tileState.allPossibility, widthIndex, depthIndex, intersectPossibility);
  var tileState_centaintyCount = tileState.centaintyCount;
  var tileState$1 = {
    allPossibility: tileState_allPossibility,
    centaintyCount: tileState_centaintyCount
  };
  if (ArraySt$Meta3dCommonlib.length(intersectPossibility) > 1) {
    return tileState$1;
  }
  var tileState_allPossibility$1 = tileState_allPossibility;
  var tileState_centaintyCount$1 = tileState_centaintyCount + 1 | 0;
  var tileState$2 = {
    allPossibility: tileState_allPossibility$1,
    centaintyCount: tileState_centaintyCount$1
  };
  return Curry._4(propateByRelationsFunc, tileState$2, [
              widthIndex,
              depthIndex
            ], tileConfig, tileRelations);
}

function _propateByRelations(tileState, param, tileConfig, tileRelations) {
  var depthIndex = param[1];
  var widthIndex = param[0];
  var resourceId = _getCollapsedPossibility(tileState.allPossibility, widthIndex, depthIndex).resourceId;
  if (ResourceUtils$ProceduralCity.isEmptyResourceId(resourceId)) {
    return tileState;
  }
  var match = MutableSparseMap$Meta3dCommonlib.get(tileRelations, resourceId);
  if (match !== undefined) {
    return _updatePossibility(_updatePossibility(_updatePossibility(_updatePossibility(tileState, _propateByRelations, tileConfig.wholeSize, widthIndex, depthIndex - 1 | 0, match.up, tileConfig, tileRelations), _propateByRelations, tileConfig.wholeSize, widthIndex, depthIndex + 1 | 0, match.down, tileConfig, tileRelations), _propateByRelations, tileConfig.wholeSize, widthIndex - 1 | 0, depthIndex, match.left, tileConfig, tileRelations), _propateByRelations, tileConfig.wholeSize, widthIndex + 1 | 0, depthIndex, match.right, tileConfig, tileRelations);
  } else {
    return tileState;
  }
}

function _isAllCentainty(tileState, tileConfig) {
  var match = tileConfig.wholeSize;
  return tileState.centaintyCount === Math.imul(match[0], match[1]);
}

function _wfc(_tileState, randomFunc, tileConfig, tileRelations) {
  while(true) {
    var tileState = _tileState;
    if (_isAllCentainty(tileState, tileConfig)) {
      return tileState;
    }
    var coord = _findMinExtropy(tileState);
    var tileState$1 = _collapse(tileState, randomFunc, coord);
    var tileState$2 = _propateByRelations(tileState$1, coord, tileConfig, tileRelations);
    _tileState = tileState$2;
    continue ;
  };
}

function generateTiles(tileState, randomFunc, tileConfig, tileRelations) {
  return _wfc(_generateAllPossibility(tileState, tileConfig, tileRelations), randomFunc, tileConfig, tileRelations);
}

function createState(param) {
  return {
          allPossibility: MutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined),
          centaintyCount: 0
        };
}

export {
  _generateAllPossibility ,
  _isNotCollapse ,
  _computeExtropy ,
  _findMinExtropy ,
  _randomSelectOnePossibility ,
  _getPossibility ,
  _getCollapsedPossibility ,
  _setPossibility ,
  _setPossibilityByFunc ,
  _collapse ,
  _unifyRateToMakeSureSumIsOne ,
  _getIntersectPossibility ,
  _updatePossibility ,
  _propateByRelations ,
  _isAllCentainty ,
  _wfc ,
  generateTiles ,
  createState ,
}
/* No side effect */
