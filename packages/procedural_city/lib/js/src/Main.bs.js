'use strict';

var AddProp$ProceduralCity = require("./AddProp.bs.js");
var ArraySt$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/ArraySt.bs.js");
var OptionSt$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/OptionSt.bs.js");
var GenerateTile$ProceduralCity = require("./GenerateTile.bs.js");
var ResourceUtils$ProceduralCity = require("./ResourceUtils.bs.js");
var ImmutableSparseMap$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/sparse_map/ImmutableSparseMap.bs.js");
var AddBuildingAndTreeAndInteraction$ProceduralCity = require("./AddBuildingAndTreeAndInteraction.bs.js");

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

exports.generateTiles = generateTiles;
exports.addBuildingAndTreeAndInteraction = addBuildingAndTreeAndInteraction;
exports.addProp = addProp;
exports.isEmptyResourceId = isEmptyResourceId;
exports.buildEmptyResourceId = buildEmptyResourceId;
/* No side effect */
