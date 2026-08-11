'use strict';

var ArraySt$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/ArraySt.bs.js");
var OptionSt$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/OptionSt.bs.js");
var ImmutableSparseMap$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/sparse_map/ImmutableSparseMap.bs.js");

function createState(param) {
  return {
          isUsedTileMap: ImmutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined)
        };
}

function isNotUsed(addState, widthIndex, depthIndex) {
  var map = ImmutableSparseMap$Meta3dCommonlib.get(addState.isUsedTileMap, widthIndex);
  if (map === undefined) {
    return true;
  }
  var isUsed = ImmutableSparseMap$Meta3dCommonlib.get(map, depthIndex);
  if (isUsed !== undefined) {
    return !isUsed;
  } else {
    return true;
  }
}

function markUsed(addState, widthIndex, depthIndex) {
  return {
          isUsedTileMap: ImmutableSparseMap$Meta3dCommonlib.set(addState.isUsedTileMap, widthIndex, ImmutableSparseMap$Meta3dCommonlib.set(OptionSt$Meta3dCommonlib.getWithDefault(ImmutableSparseMap$Meta3dCommonlib.get(addState.isUsedTileMap, widthIndex), ImmutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined)), depthIndex, true))
        };
}

function markUsedWithCount(addState, widthIndex, widthCount, depthIndex, depthCount) {
  var depthRange = ArraySt$Meta3dCommonlib.range(depthIndex, (depthIndex + depthCount | 0) - 1 | 0);
  return ArraySt$Meta3dCommonlib.reduceOneParam(ArraySt$Meta3dCommonlib.range(widthIndex, (widthIndex + widthCount | 0) - 1 | 0), (function (addState, widthIndex) {
                return ArraySt$Meta3dCommonlib.reduceOneParam(depthRange, (function (addState, depthIndex) {
                              return markUsed(addState, widthIndex, depthIndex);
                            }), addState);
              }), addState);
}

exports.createState = createState;
exports.isNotUsed = isNotUsed;
exports.markUsed = markUsed;
exports.markUsedWithCount = markUsedWithCount;
/* No side effect */
