import * as THREE from "three"
import { mergeGeometries } from "../../../Merge";
import * as noise from "./Noise"

let _randomColor = () => {
	return new THREE.Color('rgb(' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ',' + (Math.floor(Math.random() * 255)) + ')');
}

let _generateBulb = (radius, widthSeg, heightSeg) => {
	let sphereGeometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
	let material = new THREE.MeshPhongMaterial({ color: _randomColor().getHex() });

	return new THREE.Mesh(sphereGeometry, material);
}

let _generateStalk = (startPt, endPt, nbControlPts, segments, radius, radiusSegments, stalkMidScale) => {
	let points = [];

	let midPt0 = new THREE.Vector3();
	midPt0.lerpVectors(startPt, endPt, 0.35);
	midPt0.add(new THREE.Vector3(noise.simplex3(20 * 4, 20 * 4, 0) * + 1, 0, noise.simplex3(20 * 4, 20 * 4, 0) * 2 + 1).multiplyScalar(stalkMidScale));


	let curve = new THREE.CatmullRomCurve3
		([
			startPt,
			midPt0,
			endPt
		]);

	let tubeGeometry = new THREE.TubeGeometry(curve, segments, radius, radiusSegments, false);
	let material = new THREE.MeshPhongMaterial({ color: _randomColor().getHex() });

	return new THREE.Mesh(tubeGeometry, material);
}

//Generate flower vertices
let _generateDeformedFlowerVertices = (vList, nbMeshSeg, radius, freq, mag, seed, heightOffset) => {
	let twoPI = 2 * Math.PI;

	let heightNoise = noise.simplex3(-0.0006, 0.0056, 1.5) + 0.05;

	for (let i = 0; i < nbMeshSeg; ++i) {
		let alpha = Math.cos(i * twoPI / nbMeshSeg);
		let beta = Math.sin(i * twoPI / nbMeshSeg);

		let deform = noise.simplex3(alpha * freq, beta * freq, seed) + 1;
		let deformRadius = radius * (1 + mag * deform);

		let scale = deformRadius;

		for (let j = 1; j <= 3; ++j) {
			let yfactor = (Number(j) / 3);

			let yHeight = j * heightNoise * 0.25;

			let subScale = yfactor * scale;

			if (j == 2)
				yHeight *= -1;

			// vList.push(new THREE.Vector3(alpha * subScale, yHeight + heightOffset, beta * subScale));
			vList.push(alpha * subScale, yHeight + heightOffset, beta * subScale);
		}

	}
}

// //generate face
// let _genFace = (v1, v2, v3, color1 = 0x7777ff, color2 = 0x7777ff, color3 = 0x7777ff) => {
// 	let face = new THREE.Face3(v1, v2, v3);
// 	face.vertexColors[0] = new THREE.Color(color1);
// 	face.vertexColors[1] = new THREE.Color(color2);
// 	face.vertexColors[2] = new THREE.Color(color3);

// 	return face;
// }


let _genFace = ([indices, colors], v1, v2, v3, color1 = 0x7777ff, color2 = 0x7777ff, color3 = 0x7777ff) => {
	indices.push(v1, v2, v3)

	let c1 = new THREE.Color(color1)
	colors[v1 * 3] = c1.r
	colors[v1 * 3 + 1] = c1.g
	colors[v1 * 3 + 2] = c1.b

	let c2 = new THREE.Color(color2)
	colors[v2 * 3] = c2.r
	colors[v2 * 3 + 1] = c2.g
	colors[v2 * 3 + 2] = c2.b

	let c3 = new THREE.Color(color3)
	colors[v3 * 3] = c3.r
	colors[v3 * 3 + 1] = c3.g
	colors[v3 * 3 + 2] = c3.b
}

//Generate Flower Geometry
let _generateFlowerGeometry = (radius, nbMeshSeg, freq, mag, seed, color1, color2, heightOffset, mult) => {
	// let geom = new THREE.Geometry();
	let geom = new THREE.BufferGeometry();

	// let positions = geom.vertices;
	let positions = []
	let indices = []
	let colors = []

	//adds the first vertex
	// positions.push(new THREE.Vector3(0, heightOffset, 0));
	positions.push(0, heightOffset, 0);

	//Generate deformed flower vertex
	_generateDeformedFlowerVertices(positions, nbMeshSeg, radius, freq, mag, seed, heightOffset + 0.75 * mult);

	let vertexListVector3Length = positions.length / 3

	for (let fi = 0; fi < ((vertexListVector3Length - 1) / 3) - 1; ++fi) {
		let ii = (fi * 3) + 1;
		_genFace([indices, colors], ii, ii + 3, 0, color2, color1, color2)
		_genFace([indices, colors], ii, ii + 4, ii + 3, color2, color2, color2)
		_genFace([indices, colors], ii, ii + 4, ii + 1, color2, color2, color2)
		_genFace([indices, colors], ii + 1, ii + 4, ii + 5, color2, color2, color2)
		_genFace([indices, colors], ii + 1, ii + 5, ii + 2, color2, color2, color2)

	}

	//last Big Face
	let faceCount = (vertexListVector3Length - 1) / 3;
	let ii = (faceCount - 1) * 3 + 1;
	_genFace([indices, colors], ii, 0, 1, color2, color1, color2)
	_genFace([indices, colors], ii, 2, 1, color2, color2, color2)
	_genFace([indices, colors], ii, 2, ii + 1, color2, color2, color2)
	_genFace([indices, colors], ii + 1, 2, 3, color2, color2, color2)
	_genFace([indices, colors], ii + 1, 3, ii + 2, color2, color2, color2)

	// for (let fi = 0; fi < ((vertexListVector3Length - 1) / 3) - 1; ++fi) {
	// 	let ii = (fi * 3) + 1;

	// 	indices.push(ii, ii + 3, 0)
	// 	indices.push(ii, ii + 4, ii + 3)
	// 	indices.push(ii, ii + 4, ii + 1)
	// 	indices.push(ii + 1, ii + 4, ii + 5)
	// 	indices.push(ii + 1, ii + 5, ii + 2)
	// }

	// //last Big Face
	// let faceCount = (vertexListVector3Length - 1) / 3;
	// let ii = (faceCount - 1) * 3 + 1;
	// indices.push(ii, 0, 1)
	// indices.push(ii, 2, 1)
	// indices.push(ii, 2, ii + 1)
	// indices.push(ii + 1, 2, 3)
	// indices.push(ii + 1, 3, ii + 2)


	// geom.computeFaceNormals();
	//create material
	// let flowerMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff, side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
	// let flowerMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff, side: THREE.DoubleSide, vertexColors: true });

	geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
	geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
	geom.setIndex(indices)

	// return new THREE.Mesh(geom, flowerMaterial);
	return geom;
}

//Generates total flower mesh
let _generateRandomFlower = (radius, nbMeshSeg, nbPods, x, y, indep) => {
	// let flowerObjects = new THREE.Object3D();

	let frequencyNoise = noise.simplex2((x * 100) / 100, (y * 100) / 100);
	let magNoise = noise.simplex2((x * 100) / 100, (y * 100) / 100);

	let minFreq = 1.05; let maxFreq = 10;
	let minMag = 0.133; let maxMag = 1;

	let frequency = minFreq + frequencyNoise * (maxFreq - minFreq);
	let mag = minMag + magNoise * (maxMag - minMag);

	let geometries = []

	for (let pod = 0; pod < nbPods; ++pod) {
		let n = Number(pod + 1) / nbPods;

		let rColor0 = _randomColor().getHex();
		let rColor1 = _randomColor().getHex();

		let padRadius = radius * Number(pod) / nbPods;

		let flowerGeo = _generateFlowerGeometry(padRadius, nbMeshSeg, frequency, mag, n * indep, rColor0, rColor1, -0.25, Number(pod) / nbPods * 0.85);
		// flower.castShadow = true;
		// flower.receiveShadow = true;
		// flowerObjects.add(flower);

		geometries.push(flowerGeo)
	}

	let mergedGeo = mergeGeometries(geometries)

	let flowerMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff, side: THREE.DoubleSide, vertexColors: true });

	return new THREE.Mesh(mergedGeo, flowerMaterial);
}

let _transform = (geometries, height) => {
	geometries.forEach(geometry => {
		geometry.translate(0, height, 0)
		geometry.scale(0.5, 0.5, 0.5)
		// geometry.scale(1, 0.2, 1)
	})
}


export let create = () => {
	let group = new THREE.Group();

	// let height = 30
	let height = 5
	let stalkMidScale = 0.2

	//add bulb to scene
	let bulb = _generateBulb(0.65, 20, 20);
	// bulb.geometry.translate(0, height, 0)
	// bulb.geometry.scale(1, 0.2, 1)
	// bulb.castShadow = true;
	// bulb.receiveShadow = true;
	group.add(bulb);

	//add stalk to scene
	let stalk = _generateStalk(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -height, 0), 5, 10, 0.25, 8, stalkMidScale);
	// stalk.castShadow = true;
	// stalk.receiveShadow = true;
	// stalk.geometry.translate(0, height, 0)
	// stalk.geometry.scale(1, 0.2, 1)
	group.add(stalk);


	//add the flower to the scene
	let rngControls = {
		// x: Math.floor(Math.random() * 200),
		// y: Math.floor(Math.random() * 200),
		x: 111,
		y: 222
	}
	let flower = _generateRandomFlower(4 + Math.random() * 4, 256, 4, rngControls.x, rngControls.y, 0.35);
	// flower.geometry.translate(0, height, 0)
	// flower.geometry.scale(1, 0.2, 1)
	// flower.geometry.rotateX(0.25)
	// flower.geometry.rotateZ(0.47)

	flower.geometry.rotateX(Math.PI)
	flower.geometry.rotateZ(Math.random() * Math.PI / 4)
	flower.geometry.rotateX(Math.random() * Math.PI / 8)

	_transform([bulb.geometry, stalk.geometry, flower.geometry], height)

	// flower.castShadow = true;
	// flower.receiveShadow = true;
	group.add(flower);


	return group;
}