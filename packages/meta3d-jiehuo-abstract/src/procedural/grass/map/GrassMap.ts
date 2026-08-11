import { Mesh, Texture, PlaneGeometry, MeshBasicMaterial, TextureLoader, NearestFilter, DoubleSide } from "three"

let _createGeometry = ({ width, height }) => {
    let planeGeom = new PlaneGeometry(width, height)
    planeGeom.translate(0, height / 2, 0)


    return planeGeom
}

let _createMaterial = (texture) => {
    return new MeshBasicMaterial({ map: texture, alphaTest: 0.9, side: DoubleSide })
}

export let loadGrass1Texture = () => {
    return new TextureLoader().load("meta3d-jiehuo-abstract/grass/grass.png", t => {
        t.minFilter = NearestFilter;
        t.magFilter = NearestFilter;
    })

}

export let create = (config, texture: Texture): Mesh => {
    return new Mesh(_createGeometry(config), _createMaterial(texture))
}