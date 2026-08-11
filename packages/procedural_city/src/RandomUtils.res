open Type

open Meta3dCommonlib

let randomSelectOneFromArr = (randomFunc, arr) => {
  arr->ArraySt.getExn(
    Js.Math.unsafe_round(randomFunc() *. Belt_Int.toFloat(arr->ArraySt.length - 1)),
  )
}

let randomSelectOneWithRate = (randomFunc, arrWithRate: array<rate>) => {
  let p1 = arrWithRate->ArraySt.map(rate => {
    Js.Math.floor_int(100.0 *. rate)
  })

  let rateCount = p1->ArraySt.reduceOneParam((. sum, rate) => sum + rate, 0)

  let randomRateCount = Js.Math.unsafe_round(randomFunc() *. Belt_Int.toFloat(rateCount))

  let (index, _) = p1->ArraySt.reduceOneParami((. (index, sum), rate, i) => {
    let newSum = sum + rate

    if index > -1 {
      (index, sum)
    } else if randomRateCount <= newSum {
      (i, newSum)
    } else {
      (index, newSum)
    }
  }, (-1, 0))

  // index == -1
  //   ? [arrWithRate->ArraySt.getFirst->OptionSt.getExn]
  //   : [arrWithRate->ArraySt.getExn(index)]

  index == -1 ? 0 : index
}

let randomSelectOneOrNoneWithRate = (randomFunc, arrWithRate: array<rate>) => {
  arrWithRate->ArraySt.reduceOneParami((. index, rate, i) => {
    if index >= 0 {
      index
    } else if randomFunc() < rate {
      i
    } else {
      index
    }
  }, -1)
}
