import { service } from "mmd-character-protocol/src/service/ServiceType";
import { buildAPI, getAllBlockServiceFuncWithDefault } from "../../../../mod/Mod";
import { modProtocolName } from "../../../../mod/data/ModData";
import { state } from "../../../../type/StateType";
import { getModAPI } from "../Mod";

export let getData = (state: state) => {
    return getAllBlockServiceFuncWithDefault<service>(state, service => service.getCollisionShapeData(getModAPI(state), state), modProtocolName.MMDCharacterProtocol, [])
}