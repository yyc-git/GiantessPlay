import { nullable } from "meta3d-jiehuo-abstract/src/utils/nullable"
import { state } from "../../../../scene3d_layer/type/StateType"

// type networkError = {
//     error: Error,
//     retryFunc: (state: state) => Promise<state>, 
// }

export type store = {
    error: nullable<Error>,
    // networkError: nullable<networkError>,
}