import { careerFeatureName, careerFeatureValue } from "frontend/src/scene3d_layer/script/scene/scene_city/data/build/CareerFeatureData"

export type state = {
    // careerFeatureData?: Array<[careerFeatureName, careerFeatureValue]>,
    careerFeatureData?: Record<careerFeatureName, careerFeatureValue>,
}

