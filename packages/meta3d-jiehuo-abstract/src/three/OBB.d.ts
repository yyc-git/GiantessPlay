import { Box3, Matrix3, Matrix4, Plane, Ray, Sphere, Vector3 } from 'three';

export class OBB {
	center: Vector3;
	halfSize: Vector3;
	rotation: Matrix3;

	constructor(center?: Vector3, halfSize?: Vector3, rotation?: Matrix3);
	set(center: Vector3, halfSize: Vector3, rotation: Matrix3): this;
	copy(obb: OBB): this;
	clone(): this;
	getSize(result: Vector3): Vector3;
	clampPoint(point: Vector3, result: Vector3): Vector3;
	containsPoint(point: Vector3): boolean;

	intersectsBox3(box3: Box3): boolean;
	intersectsSphere(sphere: Sphere): boolean;
	intersectsOBB(obb: OBB, epsilon?: number): boolean;
	intersectsPlane(plane: Plane): boolean;

	/*! edit by meta3d */
	// intersectRay(ray: Ray, result: Vector3): Vector3 | null;
	intersectRay(ray: Ray, result: [Vector3, Vector3]): [Vector3, Vector3] | null;
	isEqual(obb: OBB): boolean;



	intersectsRay(ray: Ray): boolean;
	fromBox3(box3: Box3): this;
	equals(obb: OBB): boolean;
	applyMatrix4(matrix: Matrix4): this;

	/*!edit by meta3d */
	toBox3(): Box3;
}
