

import * as Curry from "./../../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Sinon from "./../../../../../../node_modules/meta3d-bs-sinon/lib/es6_global/src/sinon.bs.js";
import * as Sinon$1 from "sinon";
import * as JestCucumber from "jest-cucumber";
import * as Main$ProceduralCity from "../../src/Main.bs.js";
import * as Operators$Meta3dBsJestCucumber from "./../../../../../../node_modules/meta3d-bs-jest-cucumber/lib/es6_global/src/Operators.bs.js";

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

export {
  feature ,
}
/* feature Not a pure module */
