import { BufferGeometry, Float32BufferAttribute, ImageLoader, Texture, TextureLoader, Vector2 } from "three";

export class TerrainGeometry {
	private _rangeWidth: number = null;
	get rangeWidth() {
		if (this._rangeWidth !== null) {
			return this._rangeWidth;
		}

		if (this._heightMapImageDataCacheWidth !== null) {
			if (this.isHeightMapStoreHeightInEachPixel) {
				return this._heightMapImageDataCacheWidth * 4;
			}
			else {
				return this._heightMapImageDataCacheWidth;
			}
		}

		return 256;
	}
	set rangeWidth(rangeWidth: number) {
		this._rangeWidth = rangeWidth;
	}

	private _rangeHeight: number = null;
	get rangeHeight() {
		if (this._rangeHeight !== null) {
			return this._rangeHeight;
		}

		if (this._heightMapImageDataCacheHeight !== null) {
			return this._heightMapImageDataCacheHeight;
		}

		return 256;
	}
	set rangeHeight(rangeHeight: number) {
		this._rangeHeight = rangeHeight;
	}

	get heightMapImageDataWidth() {
		return this._heightMapImageDataCacheWidth;
	}

	get heightMapImageDataHeight() {
		return this._heightMapImageDataCacheHeight;
	}

	// public _heightMapAsset: ImageTextureAsset = null;
	public subdivisions: number = 2;
	public minHeight: number = 0;
	public maxHeight: number = 10;
	public isHeightMapStoreHeightInEachPixel: boolean = true;

	private _heightMapAsset: HTMLImageElement = null;
	private _heightMapImageDataCache: Uint8Array = null;
	private _heightMapImageDataCacheWidth: number = null;
	private _heightMapImageDataCacheHeight: number = null;
	private _heightCache: Array<number> = [];

	private _colorMapAsset: HTMLImageElement = null;
	private _colorMapImageDataCache: Uint8Array = null;
	private _colorMapImageDataCacheWidth: number = null;
	private _colorMapImageDataCacheHeight: number = null;
	private _colorCache: Array<number> = [];


	constructor() {
	}

	// public loadHeightMap(url) {
	// 	let loader = new ImageLoader();
	// 	let self = this

	// 	return new Promise<this>((resolve, reject) => {
	// 		loader.load(url, (data) => {
	// 			self._heightMapAsset = data

	// 			resolve(self)
	// 		});
	// 	})
	// }

	// public loadColorMap(url) {
	// 	// TODO ensure check: width, height should equal to height map


	// 	let loader = new ImageLoader();
	// 	let self = this

	// 	return new Promise<this>((resolve, reject) => {
	// 		loader.load(url, (data) => {
	// 			self._colorMapAsset = data

	// 			resolve(self)
	// 		});
	// 	})
	// }


	public setMapData(heightMap, colorMap) {
		// TODO require check: color map's width, height should equal to height map

		this._heightMapAsset = heightMap
		this._colorMapAsset = colorMap
	}

	// public getHeightAtCoordinates(x: number, z: number): number {
	public getHeightAtCoordinates(x: number, z: number, scaleY = 1, positionY = 0): number {
		// var transform = this.entityObject.transform,
		let heightFromHeightMapData: number = null;

		x += this.rangeWidth / 2;
		z += this.rangeHeight / 2;

		if (x > this.rangeWidth || z > this.rangeHeight || x < 0 || z < 0) {
			return 0;
		}

		if (!this._isReadHeightMapData()) {
			this._readHeightMapData();
		}


		//todo optimize:use temp array, vector2
		let quadSubdivisionsCoordinateArr: Array<Vector2> = this._getQuadHeightMapCoordinateArr(this._getQuadSubdivisionsCoordinateArr(x, z)),
			heightMinXMinZ = this._getCacheHeight(quadSubdivisionsCoordinateArr[0]),
			heightMaxXMinZ = this._getCacheHeight(quadSubdivisionsCoordinateArr[1]),
			heightMaxXMaxZ = this._getCacheHeight(quadSubdivisionsCoordinateArr[2]),
			heightMinXMaxZ = this._getCacheHeight(quadSubdivisionsCoordinateArr[3]);

		heightFromHeightMapData = this._getBilinearInterpolatedHeight(quadSubdivisionsCoordinateArr[4], heightMinXMinZ, heightMaxXMinZ, heightMaxXMaxZ, heightMinXMaxZ);

		// return heightFromHeightMapData * transform.scale.y + transform.position.y;
		return heightFromHeightMapData * scaleY + positionY
	}

	private _getQuadSubdivisionsCoordinateArr(x: number, z: number) {
		var quadSubdivisionsCoordinateArr: Array<Vector2> = [],
			subdivisions = this.subdivisions,
			sx = x / this.rangeWidth * subdivisions,
			sz = z / this.rangeHeight * subdivisions,
			sFloorX = Math.floor(sx),
			sFloorZ = Math.floor(sz),
			sMinX: number = null,
			sMaxX: number = null,
			sMinZ: number = null,
			sMaxZ: number = null;

		if (sFloorX < subdivisions) {
			sMinX = sFloorX;
			sMaxX = sFloorX + 1;
		}
		else {
			sMinX = sFloorX - 1;
			sMaxX = sFloorX;
		}

		if (sFloorZ < subdivisions) {
			sMinZ = sFloorZ;
			sMaxZ = sFloorZ + 1;
		}
		else {
			sMinZ = sFloorZ - 1;
			sMaxZ = sFloorZ;
		}

		quadSubdivisionsCoordinateArr.push(new Vector2(sMinX, sMinZ));
		quadSubdivisionsCoordinateArr.push(new Vector2(sMaxX, sMinZ));
		quadSubdivisionsCoordinateArr.push(new Vector2(sMaxX, sMaxZ));
		quadSubdivisionsCoordinateArr.push(new Vector2(sMinX, sMaxZ));

		quadSubdivisionsCoordinateArr.push(new Vector2(sx - sMinX, sz - sMinZ));

		return quadSubdivisionsCoordinateArr;
	}

	private _getQuadHeightMapCoordinateArr(quadSubdivisionsCoordinateArr: Array<Vector2>) {
		for (let i = 0; i <= 3; i++) {
			let quadSubdivisionsCoordinate: Vector2 = quadSubdivisionsCoordinateArr[i];

			quadSubdivisionsCoordinate.x = this._computeHeightMapColInCanvasCoordinate(quadSubdivisionsCoordinate.x);


			quadSubdivisionsCoordinate.y = this._computeHeightMapRowInCanvasCoordinate(quadSubdivisionsCoordinate.y);
		}

		return quadSubdivisionsCoordinateArr;
	}

	private _getBilinearInterpolatedHeight(offset: Vector2, heightMinXMinZ: number, heightMaxXMinZ: number, heightMaxXMaxZ: number, heightMinXMaxZ: number) {
		return (heightMinXMinZ * (1 - offset.x) + heightMaxXMinZ * offset.x) * (1 - offset.y) + (heightMaxXMaxZ * offset.x + heightMinXMaxZ * (1 - offset.x)) * offset.y;
	}

	private _getCacheHeight(coordinate: Vector2) {
		var col = coordinate.x,
			row = coordinate.y,
			heightMapIndex = this._computeHeightMapIndex(row, col),
			cacheHeight: number = this._heightCache[heightMapIndex];

		if (cacheHeight !== void 0) {
			return cacheHeight;
		}

		let heightFromHeightMapData = this._getHeightByReadHeightMapData(heightMapIndex);

		this._heightCache[heightMapIndex] = heightFromHeightMapData;

		return heightFromHeightMapData;
	}

	// public computeData() {
	public createBufferGeometry(): BufferGeometry {
		if (!this._isReadHeightMapData()) {
			this._readHeightMapData();
		}

		if (!this._isReadColorMapData()) {
			this._readColorMapData();
		}


		let {
			vertices,
			indices,
			texCoords,
			vertexColors
		} = this._createGroundFromHeightMap();


		let geometry = new BufferGeometry()
		geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		geometry.setAttribute('uv', new Float32BufferAttribute(texCoords, 2));
		geometry.setAttribute('color', new Float32BufferAttribute(vertexColors, 3));

		geometry.setIndex(indices);

		geometry.computeVertexNormals()

		return geometry
	}

	private _isReadHeightMapData() {
		return this._heightMapImageDataCache !== null;
	}

	private _readHeightMapData() {
		// var image: HTMLImageElement = this._heightMapAsset.source,
		var image: HTMLImageElement = this._heightMapAsset,
			heightMapImageDataWidth = image.width,
			heightMapImageDataHeight = image.height,
			canvas = document.createElement("canvas"),
			context = canvas.getContext("2d");

		canvas.width = heightMapImageDataWidth;
		canvas.height = heightMapImageDataHeight;

		context.drawImage(image, 0, 0);

		this._heightMapImageDataCache = context.getImageData(0, 0, heightMapImageDataWidth, heightMapImageDataHeight).data as any as Uint8Array;
		this._heightMapImageDataCacheWidth = heightMapImageDataWidth;
		this._heightMapImageDataCacheHeight = heightMapImageDataHeight;
	}

	private _isReadColorMapData() {
		return this._colorMapImageDataCache !== null;
	}

	private _readColorMapData() {
		// var image: HTMLImageElement = this._colorMapAsset.source,
		var image: HTMLImageElement = this._colorMapAsset,
			colorMapImageDataWidth = image.width,
			colorMapImageDataHeight = image.height,
			canvas = document.createElement("canvas"),
			context = canvas.getContext("2d");

		canvas.width = colorMapImageDataWidth;
		canvas.height = colorMapImageDataHeight;

		context.drawImage(image, 0, 0);

		this._colorMapImageDataCache = context.getImageData(0, 0, colorMapImageDataWidth, colorMapImageDataHeight).data as any as Uint8Array;
		this._colorMapImageDataCacheWidth = colorMapImageDataWidth;
		this._colorMapImageDataCacheHeight = colorMapImageDataHeight;
	}


	private _createGroundFromHeightMap() {
		var vertices = [],
			normals = [],
			texCoords = [],
			vertexColors = [],
			subdivisions = this.subdivisions,
			width = this.rangeWidth,
			height = this.rangeHeight,
			heightCache = this._heightCache;

		for (let row = 0; row < subdivisions; row++) {
			for (let col = 0; col < subdivisions; col++) {
				let x: number = (col * width) / subdivisions - (width / 2.0),
					z: number = ((subdivisions - row) * height) / subdivisions - (height / 2.0),
					heightMapRow = this._computeHeightMapRowInTexCoordCoordinate(row),
					heightMapCol = this._computeHeightMapColInTexCoordCoordinate(col),
					heightMapIndex = this._computeHeightMapIndex(heightMapRow, heightMapCol),
					y: number = null;

				y = this._getHeightByReadHeightMapData(heightMapIndex);

				heightCache[heightMapIndex] = y;

				vertices.push(x, y, z);
				texCoords.push(col / subdivisions, 1.0 - row / subdivisions);




				let colorMapIndex = heightMapIndex

				let [r, g, b] = this._getColorByReadColorMapData(colorMapIndex);
				vertexColors.push(r, g, b);
			}
		}

		return {
			vertices: vertices,
			vertexColors: vertexColors,
			// faces: GeometryUtils.convertToFaces(this._getIndices(), normals),
			indices: this._getIndices(),
			texCoords: texCoords
		};
	}

	private _computeHeightMapColInCanvasCoordinate(x: number) {
		var col = Math.floor(x / this.subdivisions * this._heightMapImageDataCacheWidth);

		if (col > 0) {
			col -= 1;
		}

		return col;
	}

	private _computeHeightMapRowInCanvasCoordinate(z: number) {
		var row = Math.floor((z / this.subdivisions) * this._heightMapImageDataCacheHeight);


		if (row > 0) {
			row -= 1;
		}

		return row;
	}

	private _computeHeightMapColInTexCoordCoordinate(x: number) {
		return this._computeHeightMapColInCanvasCoordinate(x);
	}

	private _computeHeightMapRowInTexCoordCoordinate(z: number) {
		var row = Math.floor((1 - z / this.subdivisions) * this._heightMapImageDataCacheHeight);


		if (row > 0) {
			row -= 1;
		}

		return row;
	}

	private _computeHeightMapIndex(heightMapRow: number, heightMapCol: number) {
		var index = (heightMapCol + heightMapRow * this._heightMapImageDataCacheWidth) * 4;

		return index;
	}

	private _getHeightByReadHeightMapData(heightMapIndex: number) {
		var heightMapImageData = this._heightMapImageDataCache,
			/*!
			 compute gradient from rgb heightMap->r,g,b components
			 */
			r = heightMapImageData[heightMapIndex] / 256.0,
			g = heightMapImageData[heightMapIndex + 1] / 256.0,
			b = heightMapImageData[heightMapIndex + 2] / 256.0,
			gradient = r * 0.3 + g * 0.59 + b * 0.11,
			minHeight = this.minHeight,
			maxHeight = this.maxHeight;

		return minHeight + (maxHeight - minHeight) * gradient;
	}

	private _getColorByReadColorMapData(colorMapIndex: number) {
		var colorMapImageData = this._colorMapImageDataCache,
			/*!
			 compute gradient from rgb colorMap->r,g,b components
			 */
			r = colorMapImageData[colorMapIndex] / 256.0,
			g = colorMapImageData[colorMapIndex + 1] / 256.0,
			b = colorMapImageData[colorMapIndex + 2] / 256.0
		// gradient = r * 0.3 + g * 0.59 + b * 0.11,
		// minColor = this.minColor,
		// maxColor = this.maxColor;

		return [r, g, b]
	}

	private _getIndices() {
		var indices = [],
			subdivisions = this.subdivisions;

		for (let row = 0; row < subdivisions - 1; row++) {
			for (let col = 0; col < subdivisions - 1; col++) {
				indices.push(col + row * subdivisions);
				indices.push(col + 1 + row * subdivisions);
				indices.push(col + 1 + (row + 1) * subdivisions);

				indices.push(col + row * subdivisions);
				indices.push(col + 1 + (row + 1) * subdivisions);
				indices.push(col + (row + 1) * subdivisions);
			}
		}

		return indices;
	}
}