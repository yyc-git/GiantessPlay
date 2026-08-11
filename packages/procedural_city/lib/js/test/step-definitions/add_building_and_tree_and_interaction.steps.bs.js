'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Sinon = require("meta3d-bs-sinon/lib/js/src/sinon.bs.js");
var Sinon$1 = require("sinon");
var JestCucumber = require("jest-cucumber");
var Main$ProceduralCity = require("../../src/Main.bs.js");
var Operators$Meta3dBsJestCucumber = require("meta3d-bs-jest-cucumber/lib/js/src/Operators.bs.js");
var MutableSparseMap$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/sparse_map/MutableSparseMap.bs.js");

var feature = JestCucumber.loadFeature("./test/features/add_building_and_tree_and_interaction.feature");

JestCucumber.defineFeature(feature, (function (test) {
        var randomFuncStub = {
          contents: 1
        };
        var sandbox = {
          contents: 1
        };
        test("case1", (function (param) {
                var config = {
                  contents: 1
                };
                var output = {
                  contents: 1
                };
                var _isGrass = function (resourceId) {
                  return resourceId === 20;
                };
                var _isConcrete = function (resourceId) {
                  return resourceId === 30;
                };
                Curry._2(param.given, "prepare", (function (param) {
                        sandbox.contents = Sinon$1.sandbox.create();
                        randomFuncStub.contents = Sinon.createEmptyStub(sandbox.contents);
                        Sinon.returns(0.01, Sinon.onCall(0, randomFuncStub.contents));
                        Sinon.returns(0.4, randomFuncStub.contents);
                        config.contents = {
                          buildingOfGrassTileCountMap: MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined), /* One_One */0, [
                                        40,
                                        41
                                      ]), /* Two_Two */4, [
                                    61,
                                    62
                                  ]), /* Three_Three */8, [
                                70,
                                71
                              ]),
                          buildingOfConcreteTileCountMap: MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined), /* One_One */0, [
                                            40,
                                            41
                                          ]), /* Two_One */3, [50]), /* Two_Two */4, [
                                    60,
                                    62
                                  ]), /* Three_Three */8, [
                                70,
                                71
                              ]),
                          smallTrees: [
                            80,
                            81
                          ],
                          bigTrees: [
                            90,
                            91
                          ],
                          interactions: [{
                              resourceId: 1001,
                              rate: 0.3
                            }],
                          buildingTileCountRates: MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined), /* One_One */0, 0.1), /* Two_One */3, 0.1), /* Two_Two */4, 0.3), /* Three_Three */8, 0.5)
                        };
                      }));
                Curry._2(param.when, "add", (function (param) {
                        output.contents = Main$ProceduralCity.addBuildingAndTreeAndInteraction([
                              [
                                {
                                  resourceId: 6
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 20
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                }
                              ],
                              [
                                {
                                  resourceId: 6
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                }
                              ],
                              [
                                {
                                  resourceId: -1
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                }
                              ],
                              [
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                }
                              ],
                              [
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                },
                                {
                                  resourceId: 30
                                }
                              ]
                            ], [
                              _isGrass,
                              _isConcrete,
                              randomFuncStub.contents
                            ], config.contents);
                      }));
                Curry._2(param.then, "should output right", (function (param) {
                        Operators$Meta3dBsJestCucumber.$eq(expect(output.contents), {
                              "1001": [[
                                  0,
                                  1,
                                  1,
                                  1
                                ]],
                              "40": [
                                [
                                  0,
                                  4,
                                  1,
                                  1
                                ],
                                [
                                  1,
                                  2,
                                  1,
                                  1
                                ],
                                [
                                  1,
                                  4,
                                  1,
                                  1
                                ],
                                [
                                  2,
                                  4,
                                  1,
                                  1
                                ],
                                [
                                  3,
                                  1,
                                  1,
                                  1
                                ],
                                [
                                  3,
                                  4,
                                  1,
                                  1
                                ],
                                [
                                  4,
                                  1,
                                  1,
                                  1
                                ],
                                [
                                  4,
                                  2,
                                  1,
                                  1
                                ],
                                [
                                  4,
                                  3,
                                  1,
                                  1
                                ],
                                [
                                  4,
                                  4,
                                  1,
                                  1
                                ]
                              ],
                              "50": [
                                [
                                  0,
                                  3,
                                  2,
                                  1
                                ],
                                [
                                  1,
                                  1,
                                  2,
                                  1
                                ],
                                [
                                  3,
                                  0,
                                  2,
                                  1
                                ]
                              ],
                              "60": [[
                                  2,
                                  2,
                                  2,
                                  2
                                ]],
                              "80": [[
                                  0,
                                  2,
                                  1,
                                  1
                                ]]
                            });
                      }));
              }));
      }));

exports.feature = feature;
/* feature Not a pure module */
