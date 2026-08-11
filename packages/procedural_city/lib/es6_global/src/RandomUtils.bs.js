

import * as Curry from "./../../../../../node_modules/rescript/lib/es6/curry.js";
import * as Js_math from "./../../../../../node_modules/rescript/lib/es6/js_math.js";
import * as ArraySt$Meta3dCommonlib from "./../../../../../node_modules/meta3d-commonlib/lib/es6_global/src/structure/ArraySt.bs.js";

function randomSelectOneFromArr(randomFunc, arr) {
  return ArraySt$Meta3dCommonlib.getExn(arr, Math.round(Curry._1(randomFunc, undefined) * (ArraySt$Meta3dCommonlib.length(arr) - 1 | 0)));
}

function randomSelectOneWithRate(randomFunc, arrWithRate) {
  var p1 = ArraySt$Meta3dCommonlib.map(arrWithRate, (function (rate) {
          return Js_math.floor_int(100.0 * rate);
        }));
  var rateCount = ArraySt$Meta3dCommonlib.reduceOneParam(p1, (function (sum, rate) {
          return sum + rate | 0;
        }), 0);
  var randomRateCount = Math.round(Curry._1(randomFunc, undefined) * rateCount);
  var match = ArraySt$Meta3dCommonlib.reduceOneParami(p1, (function (param, rate, i) {
          var sum = param[1];
          var index = param[0];
          var newSum = sum + rate | 0;
          if (index > -1) {
            return [
                    index,
                    sum
                  ];
          } else if (randomRateCount <= newSum) {
            return [
                    i,
                    newSum
                  ];
          } else {
            return [
                    index,
                    newSum
                  ];
          }
        }), [
        -1,
        0
      ]);
  var index = match[0];
  if (index === -1) {
    return 0;
  } else {
    return index;
  }
}

function randomSelectOneOrNoneWithRate(randomFunc, arrWithRate) {
  return ArraySt$Meta3dCommonlib.reduceOneParami(arrWithRate, (function (index, rate, i) {
                if (index >= 0 || Curry._1(randomFunc, undefined) >= rate) {
                  return index;
                } else {
                  return i;
                }
              }), -1);
}

export {
  randomSelectOneFromArr ,
  randomSelectOneWithRate ,
  randomSelectOneOrNoneWithRate ,
}
/* No side effect */
