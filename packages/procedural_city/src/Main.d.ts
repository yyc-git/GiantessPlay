import { tileConfig, tileRelations, outputTileData, resourceId, buildingAndTreeAndInteractionConfig, outputAddBuildingAndTreeAndInteractionData, outputAddPropData } from "./Main.gen1";

export function generateTiles(randomFunc: () => number, tileConfig: tileConfig, tileRelations: tileRelations): outputTileData

export function addBuildingAndTreeAndInteraction(outputTileData: outputTileData, [isGrassFunc, isConcreteFunc, randomFunc]: [(resourceId: resourceId) => boolean, (resourceId: resourceId) => boolean, () => number,], buildingAndTreeAndInteractionConfig: buildingAndTreeAndInteractionConfig): outputAddBuildingAndTreeAndInteractionData

export function addProp(outputTileData: outputTileData, [isRoadIntersectFunc, isRoadLaneHorrizonFunc, isRoadLaneVerticalFunc, randomFunc]: [(resourceId: resourceId) => boolean, (resourceId: resourceId) => boolean, (resourceId: resourceId) => boolean, () => number,]): outputAddPropData

export function isEmptyResourceId(resourceId: number): boolean

export function buildEmptyResourceId(): number
