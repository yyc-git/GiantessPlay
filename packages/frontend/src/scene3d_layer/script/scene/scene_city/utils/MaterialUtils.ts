import { api } from "type-api/src/Type"

export let fixGiantessModelMaterial = (api: api) => (material) => {
    material = api.material.setSide(material, api.material.getFrontSide())
    material = api.material.setAlphaTest(material, 0.9)
    material = api.material.setBlending(material, api.material.getNoBlending())
    material = api.material.setColor(material, api.material.createColor(1.3, 1.3, 1.3))
    // material = api.material.setSpecular(material, api.material.createColor(1, 1, 1))
    material = api.material.setSpecular(material, api.material.createColor(0.2, 0.2, 0.2))
    material = api.material.setShininess(material, 5)

    return material
}