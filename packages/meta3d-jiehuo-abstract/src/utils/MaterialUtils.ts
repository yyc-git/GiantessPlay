import { Object3D, Color, FrontSide, DoubleSide, Material, Mesh, NoBlending, BackSide } from "three"
import { createMeshBasicMaterial, createMeshPhongMaterial } from "../NewThreeInstance"
import { nullable } from "./nullable"
import { NullableUtils } from "../Main"
import { isNullable } from "./NullableUtils"

export let fixZFighting = (material: Material) => {
	material.depthTest = true
	material.depthWrite = false
	material.polygonOffset = true
	material.polygonOffsetFactor = - 4

	return material
}

export let changeToPhongMaterial = (obj) => {
	let array = [];

	let materials
	if (obj.material.isMaterial) {
		materials = [obj.material]
	}
	else {
		materials = obj.material
	}

	for (let i = 0, il = materials.length; i < il; i++) {
		let material = materials[i]

		let m = createMeshPhongMaterial({})
		if (material.isMeshStandardMaterial) {
			m.color = material.color
			m.map = material.map
			m.emissiveMap = material.emissiveMap
			m.specularMap = material.specularMap

			m.transparent = material.transparent
			m.opacity = material.opacity
			if (m.opacity = 1) {
				m.transparent = false
			}

			m.blending = NoBlending
		}
		else {
			m.copy(material);
		}

		m.specular = new Color(0, 0, 0)


		m.needsUpdate = true;

		array.push(m);
	}

	if (array.length == 1) {
		obj.material = array[0]
	}
	else {
		obj.material = array
	}

	return obj
}




export let fixMaterial = (obj, fixData) => {
	let materials
	if (obj.material.isMaterial) {
		materials = [obj.material]
	}
	else {
		materials = obj.material
	}

	for (let i = 0, il = materials.length; i < il; i++) {
		let material = materials[i]

		// material.flatShading = true
		// material.gradientMap = null

		// material.emissive.set(0, 0, 0)
		// material.emissiveIntensity = 1
		// material.diffuse.set(0.1, 0.1, 0.1)
		// material.diffuse.multiplyScalar(0.6)
		material.diffuse.multiplyScalar(
			NullableUtils.getWithDefault(
				fixData.diffuseFactor,
				0.7
			)
		)
		// material.diffuse.multiplyScalar(0.3)
		// material.color.set(0.1, 0.1, 0.1)
		// material.shininess = 1
		// material.toneMapped = false

		// material.matcap  = null

		// if (material.name == "鞋面") {
		// material.opacity = 0.5
		// material.tranparency = true
		// }

		// if (material.opacity == 1) {
		// 	material.blending = NoBlending
		// }
		// material.side = FrontSide


		// if (material.opacity === 1) {
		// 	material.blending = NoBlending
		// }


		fixData.noBlendingMaterialNamesInVivo.forEach((name) => {
			// if (material.opacity == 1 && material.name == name) {
			if (material.name == name) {
				if (material.opacity !== 1) {
					throw new Error("err")
				}

				material.blending = NoBlending
			}
		})
		// if (material.name == "刘海" || material.name == "渣女大波浪用飘柔") {
		// 	// material.shininess = 1
		// 	// material.specular = new Color(0, 0, 0)
		// 	// material.emissive = new Color(0, 0, 0)
		// 	// material.gradientMap = null
		// 	material.blending = NoBlending
		// }
	}

	return obj
}

// export let findMeshByMaterialName = (obj: Object3D, name): nullable<Mesh> => {
// 	let result = NullableUtils.getEmpty<Mesh>()

// 	obj.traverse((object: any) => {
// 		if (!NullableUtils.isNullable(result)) {
// 			return
// 		}

// 		if (object.isMesh && object.material.name == name) {
// 			result = NullableUtils.return_(object)
// 		}
// 	})

// 	return NullableUtils.getExn(result)
// }