'use strict';

var Curry = require("rescript/lib/js/curry.js");
var Sinon = require("meta3d-bs-sinon/lib/js/src/sinon.bs.js");
var Sinon$1 = require("sinon");
var JestCucumber = require("jest-cucumber");
var Main$ProceduralCity = require("../../src/Main.bs.js");
var Operators$Meta3dBsJestCucumber = require("meta3d-bs-jest-cucumber/lib/js/src/Operators.bs.js");

var feature = JestCucumber.loadFeature("./test/features/add_prop.feature");

JestCucumber.defineFeature(feature, (function (test) {
        var randomFuncStub = {
          contents: 1
        };
        var sandbox = {
          contents: 1
        };
        test("case1", (function (param) {
                var output = {
                  contents: 1
                };
                var _isRoadIntersect = function (resourceId) {
                  return resourceId === 1;
                };
                var _isRoadLaneHorrizon = function (resourceId) {
                  return resourceId === 6;
                };
                var _isRoadLaneVertical = function (resourceId) {
                  return resourceId === 7;
                };
                Curry._2(param.given, "prepare", (function (param) {
                        sandbox.contents = Sinon$1.sandbox.create();
                        randomFuncStub.contents = Sinon.createEmptyStub(sandbox.contents);
                        randomFuncStub.contents = Sinon.returns(0.4, Sinon.createEmptyStub(sandbox.contents));
                      }));
                Curry._2(param.when, "add", (function (param) {
                        output.contents = Main$ProceduralCity.addProp([
                              [
                                {
                                  resourceId: 6
                                },
                                {
                                  resourceId: 7
                                }
                              ],
                              [
                                {
                                  resourceId: 20
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
                                  resourceId: 1
                                }
                              ]
                            ], [
                              _isRoadIntersect,
                              _isRoadLaneHorrizon,
                              _isRoadLaneVertical,
                              randomFuncStub.contents
                            ]);
                      }));
                Curry._2(param.then, "should output right", (function (param) {
                        Operators$Meta3dBsJestCucumber.$eq(expect(output.contents), {
                              roadLaneHorrizonIndices: [[
                                  0,
                                  0
                                ]],
                              roadLaneIntersectIndices: [[
                                  2,
                                  1
                                ]],
                              roadLaneVerticalIndices: [[
                                  0,
                                  1
                                ]]
                            });
                      }));
              }));
      }));

exports.feature = feature;
/* feature Not a pure module */
