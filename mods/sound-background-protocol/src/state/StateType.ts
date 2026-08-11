import { nullable } from "block/src/Type"
import { resourceId } from "type-api/src/Type"

export type state = {
    // loadedPlayingResourceIds: Array<resourceId>,
    loadedPlayingResourceId: nullable<resourceId>,
    playingResourceId: nullable<resourceId>
}

