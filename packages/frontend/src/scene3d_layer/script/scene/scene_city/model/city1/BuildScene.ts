import { NewThreeInstance } from "meta3d-jiehuo-abstract"
import { state } from "../../../../../type/StateType"
import { setState, getState, getDynamicGroupName, getName, getGridResourceId, getBaseMapResourceId } from "../../CityScene"
import { NullableUtils } from "meta3d-jiehuo-abstract"
import { getGirl, getGirlState } from "../../girl/Girl"
import { Matrix4, PCFSoftShadowMap, Vector3, Quaternion, Material, Box3, Box3Helper, Color, TextureLoader, Texture, RepeatWrapping, SRGBColorSpace, AxesHelper } from "three"
// import { setControlsConfig } from "./Camera"
import { Scene } from "meta3d-jiehuo-abstract"
import { getAbstractState, setAbstractState } from "../../../../../state/State"
import { SceneUtils } from "meta3d-jiehuo-abstract"
import { addDirectionLight } from "../../Light"
import { ArrayUtils } from "meta3d-jiehuo-abstract"
// import * as Tree1 from "../../manage/city1/Tree1"
import * as MapWall from "../../manage/city1/MapWall"
// import * as Animated from "../../manage/city1/Animated"
import * as TreesAndProps from "../../manage/city1/TreesAndProps"
import * as Cars from "../../manage/city1/Cars"
import * as Buildings from "../../manage/city1/Buildings"
import { Instance } from "meta3d-jiehuo-abstract"
import { Object3DUtils } from "meta3d-jiehuo-abstract"
import { Device } from "meta3d-jiehuo-abstract"
import { SkyBox } from "meta3d-jiehuo-abstract"
// import { Terrain } from "meta3d-jiehuo-abstract/src/terrain/Terrain"
import { CSM } from "meta3d-jiehuo-abstract"
import { getCurrentCamera } from "meta3d-jiehuo-abstract/src/scene/Camera"
import { InstancedLOD2 } from "meta3d-jiehuo-abstract"
import { Shadow } from "meta3d-jiehuo-abstract"
import { getIsDebug } from "../../../Scene"
import { Terrain } from "meta3d-jiehuo-abstract"
import { isInGroups } from "meta3d-jiehuo-abstract/src/terrain/Terrain"
import { Loader } from "meta3d-jiehuo-abstract"
import { addBuilding } from "../../manage/city1/Mission"
import { isMobile } from "meta3d-jiehuo-abstract/src/Device"
import { RenderSetting } from "meta3d-jiehuo-abstract"
import { shadowLevel } from "meta3d-jiehuo-abstract/src/type/StateType"

let _addTerrain = (scene, state: state) => {
    // //let lodContainerGroup = NullableUtils.getExn(Scene.findObjectByName(scene, getLODContainerGroupName()))

    let terrainMesh = NullableUtils.getExn(getState(state).terrain.terrainMesh)

    scene.add(terrainMesh)

    CSM.setupMaterial(getAbstractState(state), terrainMesh.material as Material);

    return scene
}

let _addLight = (state: state, scene, renderer, camera) => {
    scene = SceneUtils.addAmbientLight(scene)

    let csmConfig = {
        // maxFar: 500,
        maxFar: 300,
        // cascades: 2,
        cascades: 2,
        shadowMapSize: 1024,
        // shadowBias:0.0001,
        fade: false,
        mode: "practical",
        parent: scene,
        lightDirection: new Vector3(-1, -1, -1).normalize(),
        lightIntensity: 1,
        camera: camera,
    }

    switch (RenderSetting.getRenderSetting(getAbstractState(state)).shadow) {
        case shadowLevel.High:
            csmConfig = {
                ...csmConfig,
                maxFar: 1000,
                cascades: 3,
                shadowMapSize: 4096,
                // fade: true,
            }
            break
        case shadowLevel.Middle:
            break
        case shadowLevel.Low:
            csmConfig = {
                ...csmConfig,
                // maxFar: 200,
                // shadowMapSize: 512,
                maxFar: 100,
                cascades: 1,
                shadowMapSize: 512,
            }
            break
    }

    state = setAbstractState(state, CSM.create(getAbstractState(state), csmConfig as any))


    // if (RenderSetting.getRenderSetting(getAbstractState(state)).isEnableShadow) {
    //     renderer.shadowMap.enabled = true;
    //     renderer.shadowMap.type = PCFSoftShadowMap;
    // }
    // else {
    //     renderer.shadowMap.enabled = false;
    // }

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    return [state, scene]
}


let _addSkyBox = (scene) => {
    let name = getName()

    return SkyBox.addToScene(scene, SkyBox.create([
        `./resource/${name}/sky box/right.jpg`,
        `./resource/${name}/sky box/left.jpg`,
        `./resource/${name}/sky box/top.jpg`,
        `./resource/${name}/sky box/bottom.jpg`,
        `./resource/${name}/sky box/front.jpg`,
        `./resource/${name}/sky box/back.jpg`,
    ]))
}

export let build = (state: state, renderer) => {

    let scene = Scene.createScene(getName())

    state = setState(state, {
        ...getState(state),
        // damageData: {
        //     ...getState(state).damageData,
        //     lodContainerGroup: NullableUtils.return_(lodContainerGroup),
        // },
        scene: NullableUtils.return_(scene),
        // girl: {
        //     ...getGirlState(state),
        //     position: new Vector3(0, 0, 5)
        // }
    })

    // state = setControlsConfig(state)

    let data

    // scene = _addGroups(scene, [lodContainerGroup, dynamicGroup])


    data = _addLight(state, scene, renderer, getCurrentCamera(getAbstractState(state)))
    state = data[0]
    scene = data[1]


    scene = _addTerrain(scene, state)

    scene = _addSkyBox(scene)

    Scene.getScene(getAbstractState(state)).add(scene)

    return state
}