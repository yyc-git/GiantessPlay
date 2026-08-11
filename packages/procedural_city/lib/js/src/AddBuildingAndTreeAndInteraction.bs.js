'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Caml_option = require("rescript/lib/js/caml_option.js");
var Tuple2$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/tuple/Tuple2.bs.js");
var AddUtils$ProceduralCity = require("./AddUtils.bs.js");
var ArraySt$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/ArraySt.bs.js");
var OptionSt$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/OptionSt.bs.js");
var RandomUtils$ProceduralCity = require("./RandomUtils.bs.js");
var MutableHashMap$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/hash_map/MutableHashMap.bs.js");
var MutableSparseMap$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/sparse_map/MutableSparseMap.bs.js");
var ImmutableSparseMap$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/sparse_map/ImmutableSparseMap.bs.js");

function _getTileResourceIdOpt(outputTileData, widthIndex, depthIndex) {
  return OptionSt$Meta3dCommonlib.bind(ImmutableSparseMap$Meta3dCommonlib.get(outputTileData, widthIndex), (function (widthMap) {
                return OptionSt$Meta3dCommonlib.map(ImmutableSparseMap$Meta3dCommonlib.get(widthMap, depthIndex), (function (d) {
                              return d.resourceId;
                            }));
              }));
}

function _search(validTileCounts, isTileFunc, addState, outputTileData, widthIndex, depthIndex, buildingTileCount) {
  if (OptionSt$Meta3dCommonlib.getWithDefault(OptionSt$Meta3dCommonlib.map(_getTileResourceIdOpt(outputTileData, widthIndex, depthIndex), isTileFunc), false) && AddUtils$ProceduralCity.isNotUsed(addState, widthIndex, depthIndex)) {
    return ArraySt$Meta3dCommonlib.push(validTileCounts, buildingTileCount);
  } else {
    return validTileCounts;
  }
}

function _searchValidTileCounts(validTileCounts, isTileFunc, addState, outputTileData, widthIndex, depthIndex) {
  var validTileCounts$1 = _search(_search(validTileCounts, isTileFunc, addState, outputTileData, widthIndex + 1 | 0, depthIndex, /* Two_One */3), isTileFunc, addState, outputTileData, widthIndex, depthIndex + 1 | 0, /* One_Two */1);
  var result = validTileCounts$1;
  if (ArraySt$Meta3dCommonlib.includes(result, /* One_Two */1)) {
    result = _search(result, isTileFunc, addState, outputTileData, widthIndex, depthIndex + 2 | 0, /* One_Three */2);
  }
  if (ArraySt$Meta3dCommonlib.includes(result, /* Two_One */3)) {
    result = _search(result, isTileFunc, addState, outputTileData, widthIndex + 2 | 0, depthIndex, /* Three_One */6);
  }
  if (ArraySt$Meta3dCommonlib.includes(result, /* One_Two */1) && ArraySt$Meta3dCommonlib.includes(result, /* Two_One */3)) {
    result = _search(result, isTileFunc, addState, outputTileData, widthIndex + 1 | 0, depthIndex + 1 | 0, /* Two_Two */4);
  }
  if (ArraySt$Meta3dCommonlib.includes(result, /* Two_Two */4) && ArraySt$Meta3dCommonlib.includes(result, /* One_Three */2)) {
    result = _search(result, isTileFunc, addState, outputTileData, widthIndex + 1 | 0, depthIndex + 2 | 0, /* Two_Three */5);
  }
  if (ArraySt$Meta3dCommonlib.includes(result, /* Two_Two */4) && ArraySt$Meta3dCommonlib.includes(result, /* Three_One */6)) {
    result = _search(result, isTileFunc, addState, outputTileData, widthIndex + 2 | 0, depthIndex + 1 | 0, /* Three_Two */7);
  }
  if (ArraySt$Meta3dCommonlib.includes(result, /* Three_Two */7) && ArraySt$Meta3dCommonlib.includes(result, /* Two_Three */5)) {
    result = _search(result, isTileFunc, addState, outputTileData, widthIndex + 2 | 0, depthIndex + 2 | 0, /* Three_Three */8);
  }
  return result;
}

function _randomSelectOneTileCount(randomFunc, validTileCounts, buildingTileCountRates) {
  if (ArraySt$Meta3dCommonlib.length(validTileCounts) === 0) {
    throw {
          RE_EXN_ID: "Not_found",
          Error: new Error()
        };
  }
  return ArraySt$Meta3dCommonlib.getExn(validTileCounts, RandomUtils$ProceduralCity.randomSelectOneWithRate(randomFunc, ArraySt$Meta3dCommonlib.map(validTileCounts, (function (buildingTileCount) {
                        return OptionSt$Meta3dCommonlib.getWithDefault(MutableSparseMap$Meta3dCommonlib.get(buildingTileCountRates, buildingTileCount), 0.0);
                      }))));
}

function _markTileUsedByCount(addState, validTileCount, widthIndex, depthIndex) {
  switch (validTileCount) {
    case /* One_One */0 :
        return AddUtils$ProceduralCity.markUsed(addState, widthIndex, depthIndex);
    case /* One_Two */1 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 1, depthIndex, 2);
    case /* One_Three */2 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 1, depthIndex, 3);
    case /* Two_One */3 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 2, depthIndex, 1);
    case /* Two_Two */4 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 2, depthIndex, 2);
    case /* Two_Three */5 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 2, depthIndex, 3);
    case /* Three_One */6 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 3, depthIndex, 1);
    case /* Three_Two */7 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 3, depthIndex, 2);
    case /* Three_Three */8 :
        return AddUtils$ProceduralCity.markUsedWithCount(addState, widthIndex, 3, depthIndex, 3);
    
  }
}

function _randomSelectOneResourceId(randomFunc, buildingOfTileCountMap, buildingTileCount) {
  var arr = MutableSparseMap$Meta3dCommonlib.getExn(buildingOfTileCountMap, buildingTileCount);
  if (ArraySt$Meta3dCommonlib.length(arr) === 0) {
    return ;
  } else {
    return Caml_option.some(RandomUtils$ProceduralCity.randomSelectOneFromArr(randomFunc, arr));
  }
}

function _getSizeCount(buildingTileCount) {
  switch (buildingTileCount) {
    case /* One_One */0 :
        return [
                1,
                1
              ];
    case /* One_Two */1 :
        return [
                1,
                2
              ];
    case /* One_Three */2 :
        return [
                1,
                3
              ];
    case /* Two_One */3 :
        return [
                2,
                1
              ];
    case /* Two_Two */4 :
        return [
                2,
                2
              ];
    case /* Two_Three */5 :
        return [
                2,
                3
              ];
    case /* Three_One */6 :
        return [
                3,
                1
              ];
    case /* Three_Two */7 :
        return [
                3,
                2
              ];
    case /* Three_Three */8 :
        return [
                3,
                3
              ];
    
  }
}

function _addResourceIdToOutput(outputAddBuildingAndTreeAndInteractionData, resourceId, widthIndex, depthIndex, validTileCount) {
  if (resourceId === undefined) {
    return outputAddBuildingAndTreeAndInteractionData;
  }
  var match = _getSizeCount(validTileCount);
  var arr = MutableHashMap$Meta3dCommonlib.get(outputAddBuildingAndTreeAndInteractionData, String(resourceId));
  return MutableHashMap$Meta3dCommonlib.set(outputAddBuildingAndTreeAndInteractionData, String(resourceId), ArraySt$Meta3dCommonlib.push(arr !== undefined ? arr : [], [
                  widthIndex,
                  depthIndex,
                  match[0],
                  match[1]
                ]));
}

function _addBuilding(param, param$1, outputTileData, buildingOfTileCountMap, buildingTileCountRates, widthIndex, depthIndex) {
  var randomFunc = param$1[0];
  var addState = param[0];
  var validTileCount = _randomSelectOneTileCount(randomFunc, ArraySt$Meta3dCommonlib.filter(_searchValidTileCounts([/* One_One */0], param$1[1], addState, outputTileData, widthIndex, depthIndex), (function (validTileCount) {
              return MutableSparseMap$Meta3dCommonlib.has(buildingOfTileCountMap, validTileCount);
            })), buildingTileCountRates);
  var addState$1 = _markTileUsedByCount(addState, validTileCount, widthIndex, depthIndex);
  var output = _addResourceIdToOutput(param[1], _randomSelectOneResourceId(randomFunc, buildingOfTileCountMap, validTileCount), widthIndex, depthIndex, validTileCount);
  return [
          addState$1,
          output
        ];
}

function _addTree(param, randomFunc, buildingAndTreeInteractionConfig, widthIndex, depthIndex) {
  var addState = AddUtils$ProceduralCity.markUsed(param[0], widthIndex, depthIndex);
  var output = _addResourceIdToOutput(param[1], RandomUtils$ProceduralCity.randomSelectOneFromArr(randomFunc, Curry._1(randomFunc, undefined) < 0.5 ? buildingAndTreeInteractionConfig.smallTrees : buildingAndTreeInteractionConfig.bigTrees), widthIndex, depthIndex, /* One_One */0);
  return [
          addState,
          output
        ];
}

function _addInteraction(param, randomFunc, interactionRates, interactionResourceIds, widthIndex, depthIndex) {
  var index = RandomUtils$ProceduralCity.randomSelectOneOrNoneWithRate(randomFunc, interactionRates);
  if (index === -1) {
    return ;
  }
  var addState = AddUtils$ProceduralCity.markUsed(param[0], widthIndex, depthIndex);
  var output = _addResourceIdToOutput(param[1], ArraySt$Meta3dCommonlib.getExn(interactionResourceIds, index), widthIndex, depthIndex, /* One_One */0);
  return [
          addState,
          output
        ];
}

function add(outputTileData, param, buildingAndTreeInteractionConfig) {
  var randomFunc = param[2];
  var isConcreteFunc = param[1];
  var isGrassFunc = param[0];
  var interactions = buildingAndTreeInteractionConfig.interactions;
  var interactionRates = ArraySt$Meta3dCommonlib.map(interactions, (function (param) {
          return param.rate;
        }));
  var interactionResourceIds = ArraySt$Meta3dCommonlib.map(interactions, (function (param) {
          return param.resourceId;
        }));
  return Tuple2$Meta3dCommonlib.getLast(MutableSparseMap$Meta3dCommonlib.reducei(outputTileData, (function (param, widthMap, widthIndex) {
                    return MutableSparseMap$Meta3dCommonlib.reducei(widthMap, (function (param, param$1, depthIndex) {
                                  var resourceId = param$1.resourceId;
                                  var output = param[1];
                                  var addState = param[0];
                                  if (!AddUtils$ProceduralCity.isNotUsed(addState, widthIndex, depthIndex)) {
                                    return [
                                            addState,
                                            output
                                          ];
                                  }
                                  var data = Curry._1(isConcreteFunc, resourceId) || Curry._1(isGrassFunc, resourceId) ? _addInteraction([
                                          addState,
                                          output
                                        ], randomFunc, interactionRates, interactionResourceIds, widthIndex, depthIndex) : undefined;
                                  if (data !== undefined) {
                                    return data;
                                  } else if (Curry._1(isConcreteFunc, resourceId)) {
                                    return _addBuilding([
                                                addState,
                                                output
                                              ], [
                                                randomFunc,
                                                isConcreteFunc
                                              ], outputTileData, buildingAndTreeInteractionConfig.buildingOfConcreteTileCountMap, buildingAndTreeInteractionConfig.buildingTileCountRates, widthIndex, depthIndex);
                                  } else if (Curry._1(isGrassFunc, resourceId)) {
                                    if (Curry._1(randomFunc, undefined) < 0.5) {
                                      return _addTree([
                                                  addState,
                                                  output
                                                ], randomFunc, buildingAndTreeInteractionConfig, widthIndex, depthIndex);
                                    } else {
                                      return _addBuilding([
                                                  addState,
                                                  output
                                                ], [
                                                  randomFunc,
                                                  isGrassFunc
                                                ], outputTileData, buildingAndTreeInteractionConfig.buildingOfGrassTileCountMap, buildingAndTreeInteractionConfig.buildingTileCountRates, widthIndex, depthIndex);
                                    }
                                  } else {
                                    return [
                                            addState,
                                            output
                                          ];
                                  }
                                }), [
                                param[0],
                                param[1]
                              ]);
                  }), [
                  AddUtils$ProceduralCity.createState(undefined),
                  MutableHashMap$Meta3dCommonlib.createEmpty(undefined, undefined)
                ]));
}

exports._getTileResourceIdOpt = _getTileResourceIdOpt;
exports._search = _search;
exports._searchValidTileCounts = _searchValidTileCounts;
exports._randomSelectOneTileCount = _randomSelectOneTileCount;
exports._markTileUsedByCount = _markTileUsedByCount;
exports._randomSelectOneResourceId = _randomSelectOneResourceId;
exports._getSizeCount = _getSizeCount;
exports._addResourceIdToOutput = _addResourceIdToOutput;
exports._addBuilding = _addBuilding;
exports._addTree = _addTree;
exports._addInteraction = _addInteraction;
exports.add = add;
/* No side effect */
