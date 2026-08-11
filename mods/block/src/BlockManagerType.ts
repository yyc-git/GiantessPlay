import { api as apiType } from "type-api/src/Type"

export type blockName = string

export type blockProtocolName = string

export type blockService = any

export type blockState = any

export type state = {
  blockServiceMap: Map<blockProtocolName, Map<blockName, blockService>>,
  blockStateMap: Map<blockProtocolName, Map<blockName, blockState>>
  // blockServiceMap: Record<blockProtocolName, Record<blockName, blockService>>,
  // blockStateMap: Record<blockProtocolName, Record<blockName, blockState>>
}

export type api = {
  getBlockService<blockService>(state: state, blockProtocolName: blockProtocolName, blockName: blockName): blockService,
  getAllBlockServicesOfBlockProtocolName<blockService>(state: state, blockProtocolName: blockProtocolName): Array<[blockName, blockService]>,
  getBlockState<blockState>(state: state, blockProtocolName: blockProtocolName, blockName: blockName): blockState,
  setBlockState<blockState>(state: state, blockProtocolName: blockProtocolName, blockName: blockName, blockState: blockState): state
}

export type getBlockService<blockService> = (api: apiType) => blockService

export type createBlockState<blockState> = (api: apiType) => blockState

export type info = {
  protocolName: blockProtocolName,
  blockName: blockName,

  title: string,
  version: string,
  category: string,
  author: string,

  // getBlockService: getBlockService<blockService>,
  // blockState: blockState,
}

export type getBlockInfo = (api: apiType) => info