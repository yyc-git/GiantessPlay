// import { Ray } from "three"
// import { StaticLODContainer } from "./lod/lod2/StaticLODContainer"
// import { LODQueue } from "./lod/lod2/LODQueue"

// export let queryLODQueueNeareastByRay = (octrees: Array<LODQueue>, ray: Ray) => {
//     return octrees.reduce(([distance, transform, box, name], octree) => {
//         let data = octree.queryByRay(ray, distance, transform, box, name)

//         if (data[0] < distance) {
//             return data
//         }

//         return [distance, transform, box, name]
//     }, [Infinity, null, null, null])
// }