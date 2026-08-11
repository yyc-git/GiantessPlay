open Type

open Meta3dCommonlib

open Meta3dCommonlibType

let add = (
  outputTileData: outputTileData,
  (isRoadIntersectFunc, isRoadLaneHorrizonFunc, isRoadLaneVerticalFunc, randomFunc),
//   propConfig: propConfig,
): outputAddPropData => {
  outputTileData->MutableSparseMap.reducei(
    (. output, widthMap, widthIndex) => {
      widthMap->MutableSparseMap.reducei((. output, {resourceId}, depthIndex) => {
        if isRoadLaneHorrizonFunc(resourceId) {
          {
            ...output,
            roadLaneHorrizonIndices: output.roadLaneHorrizonIndices->ArraySt.push((
              widthIndex,
              depthIndex,
            )),
          }
        } else if isRoadLaneVerticalFunc(resourceId) {
          {
            ...output,
            roadLaneVerticalIndices: output.roadLaneVerticalIndices->ArraySt.push((
              widthIndex,
              depthIndex,
            )),
          }
        } else if isRoadIntersectFunc(resourceId) {
          {
            ...output,
            roadLaneIntersectIndices: output.roadLaneIntersectIndices->ArraySt.push((
              widthIndex,
              depthIndex,
            )),
          }
        } else {
          output
        }
      }, output)
    },
    {
      roadLaneHorrizonIndices: [],
      roadLaneVerticalIndices: [],
      roadLaneIntersectIndices: [],
    },
  )
}
