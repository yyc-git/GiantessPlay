'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Sinon = require("meta3d-bs-sinon/lib/js/src/sinon.bs.js");
var Sinon$1 = require("sinon");
var JestCucumber = require("jest-cucumber");
var Main$ProceduralCity = require("../../src/Main.bs.js");
var Operators$Meta3dBsJestCucumber = require("meta3d-bs-jest-cucumber/lib/js/src/Operators.bs.js");
var MutableSparseMap$Meta3dCommonlib = require("meta3d-commonlib/lib/js/src/structure/sparse_map/MutableSparseMap.bs.js");

var feature = JestCucumber.loadFeature("./test/features/generate_tiles.feature");

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
                var tileRelations = {
                  contents: 1
                };
                var output = {
                  contents: 1
                };
                var _buildNeighbour = function (up, down, left, right) {
                  return {
                          up: up,
                          down: down,
                          left: left,
                          right: right
                        };
                };
                Curry._2(param.given, "prepare", (function (param) {
                        sandbox.contents = Sinon$1.sandbox.create();
                        randomFuncStub.contents = Sinon.createEmptyStub(sandbox.contents);
                        Sinon.returns(0.1, Sinon.onCall(0, randomFuncStub.contents));
                        Sinon.returns(0.6, Sinon.onCall(1, randomFuncStub.contents));
                        Sinon.returns(0.9, randomFuncStub.contents);
                        config.contents = {
                          tiles: [
                            1,
                            6,
                            7,
                            20,
                            30
                          ],
                          tileRates: MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined), 1, 0.1), 6, 0.2), 7, 0.2), 20, 0.5), 30, 0.6),
                          wholeSize: [
                            5,
                            5
                          ]
                        };
                        tileRelations.contents = MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.set(MutableSparseMap$Meta3dCommonlib.createEmpty(undefined, undefined), 1, _buildNeighbour([
                                                  {
                                                    rate: 0.9,
                                                    resourceId: 7
                                                  },
                                                  {
                                                    rate: 0.1,
                                                    resourceId: 1
                                                  }
                                                ], [
                                                  {
                                                    rate: 0.9,
                                                    resourceId: 7
                                                  },
                                                  {
                                                    rate: 0.1,
                                                    resourceId: 1
                                                  }
                                                ], [
                                                  {
                                                    rate: 0.9,
                                                    resourceId: 6
                                                  },
                                                  {
                                                    rate: 0.1,
                                                    resourceId: 1
                                                  }
                                                ], [
                                                  {
                                                    rate: 0.9,
                                                    resourceId: 6
                                                  },
                                                  {
                                                    rate: 0.1,
                                                    resourceId: 1
                                                  }
                                                ])), 6, _buildNeighbour([
                                              {
                                                rate: 0.5,
                                                resourceId: 20
                                              },
                                              {
                                                rate: 0.5,
                                                resourceId: 30
                                              }
                                            ], [
                                              {
                                                rate: 0.5,
                                                resourceId: 20
                                              },
                                              {
                                                rate: 0.5,
                                                resourceId: 30
                                              }
                                            ], [
                                              {
                                                rate: 0.5,
                                                resourceId: 6
                                              },
                                              {
                                                rate: 0.1,
                                                resourceId: 1
                                              }
                                            ], [
                                              {
                                                rate: 0.5,
                                                resourceId: 6
                                              },
                                              {
                                                rate: 0.1,
                                                resourceId: 1
                                              }
                                            ])), 7, _buildNeighbour([
                                          {
                                            rate: 0.5,
                                            resourceId: 7
                                          },
                                          {
                                            rate: 0.1,
                                            resourceId: 1
                                          }
                                        ], [
                                          {
                                            rate: 0.5,
                                            resourceId: 7
                                          },
                                          {
                                            rate: 0.1,
                                            resourceId: 1
                                          }
                                        ], [
                                          {
                                            rate: 0.5,
                                            resourceId: 20
                                          },
                                          {
                                            rate: 0.5,
                                            resourceId: 30
                                          }
                                        ], [
                                          {
                                            rate: 0.5,
                                            resourceId: 20
                                          },
                                          {
                                            rate: 0.5,
                                            resourceId: 30
                                          }
                                        ])), 20, _buildNeighbour([
                                      {
                                        rate: 0.5,
                                        resourceId: 20
                                      },
                                      {
                                        rate: 0.3,
                                        resourceId: 30
                                      },
                                      {
                                        rate: 0.1,
                                        resourceId: 6
                                      }
                                    ], [
                                      {
                                        rate: 0.5,
                                        resourceId: 20
                                      },
                                      {
                                        rate: 0.3,
                                        resourceId: 30
                                      },
                                      {
                                        rate: 0.1,
                                        resourceId: 6
                                      }
                                    ], [
                                      {
                                        rate: 0.5,
                                        resourceId: 20
                                      },
                                      {
                                        rate: 0.5,
                                        resourceId: 30
                                      },
                                      {
                                        rate: 0.1,
                                        resourceId: 7
                                      }
                                    ], [
                                      {
                                        rate: 0.5,
                                        resourceId: 20
                                      },
                                      {
                                        rate: 0.5,
                                        resourceId: 30
                                      },
                                      {
                                        rate: 0.1,
                                        resourceId: 7
                                      }
                                    ])), 30, _buildNeighbour([
                                  {
                                    rate: 0.5,
                                    resourceId: 30
                                  },
                                  {
                                    rate: 0.3,
                                    resourceId: 20
                                  },
                                  {
                                    rate: 0.1,
                                    resourceId: 6
                                  }
                                ], [
                                  {
                                    rate: 0.5,
                                    resourceId: 30
                                  },
                                  {
                                    rate: 0.3,
                                    resourceId: 20
                                  },
                                  {
                                    rate: 0.1,
                                    resourceId: 6
                                  }
                                ], [
                                  {
                                    rate: 0.5,
                                    resourceId: 20
                                  },
                                  {
                                    rate: 0.5,
                                    resourceId: 30
                                  },
                                  {
                                    rate: 0.1,
                                    resourceId: 7
                                  }
                                ], [
                                  {
                                    rate: 0.5,
                                    resourceId: 20
                                  },
                                  {
                                    rate: 0.5,
                                    resourceId: 30
                                  },
                                  {
                                    rate: 0.1,
                                    resourceId: 7
                                  }
                                ]));
                      }));
                Curry._2(param.when, "generate", (function (param) {
                        output.contents = Main$ProceduralCity.generateTiles(randomFuncStub.contents, config.contents, tileRelations.contents);
                      }));
                Curry._2(param.then, "should output right", (function (param) {
                        Operators$Meta3dBsJestCucumber.$eq(expect(output.contents), [
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
                              ]
                            ]);
                      }));
              }));
      }));

exports.feature = feature;
/* feature Not a pure module */
