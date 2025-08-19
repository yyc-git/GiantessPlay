import {
    MathUtils,
    Spherical,
    Vector3
} from 'three';
import { getPageX, getPageY } from "meta3d-utils/src/LandscapeUtils";
import { isNeedHandleLandscape } from 'meta3d-utils/src/View';
import { isMobile } from '../Device';

const _lookDirection = new Vector3();
const _spherical = new Spherical();
const _target = new Vector3();

class FirstPersonControls {

    constructor(object, domElement) {

        this.object = object;
        this.domElement = domElement;

        // API

        this.enabled = true;

        this.movementSpeed = 1.0;
        this.lookSpeed = 0.005;

        this.lookVertical = true;
        this.autoForward = false;

        this.activeLook = true;

        this.heightSpeed = false;
        this.heightCoef = 1.0;
        this.heightMin = 0.0;
        this.heightMax = 1.0;

        this.constrainVertical = false;
        this.verticalMin = 0;
        this.verticalMax = Math.PI;

        /*! edit by meta3d */
        this.constrainHorrizon = false;
        this.horrizonMin = 0;
        this.horrizonMax = Math.PI;
        this.lastPageX = -1
        this.lastPageY = -1




        this.mouseDragOn = false;

        // internals

        this.autoSpeedFactor = 0.0;

        this.pointerX = 0;
        this.pointerY = 0;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;

        this.viewHalfX = 0;
        this.viewHalfY = 0;

        // private variables

        let lat = 0;
        let lon = 0;



        /*! edit by meta3d */
        this.getAzimuthalAngle = function () {
            // setOrientation(this);
            const quaternion = this.object.quaternion;

            return new Spherical().setFromVector3(new Vector3(0, 0, - 1).applyQuaternion(quaternion)
            ).theta + Math.PI
        };


        //

        this.handleResize = function () {

            if (this.domElement === document) {

                this.viewHalfX = window.innerWidth / 2;
                this.viewHalfY = window.innerHeight / 2;

            } else {

                this.viewHalfX = this.domElement.offsetWidth / 2;
                this.viewHalfY = this.domElement.offsetHeight / 2;

            }

        };

        this.onPointerDown = function (event) {

            if (this.domElement !== document) {

                this.domElement.focus();

            }

            if (this.activeLook) {

                switch (event.button) {

                    case 0: this.moveForward = true; break;
                    case 2: this.moveBackward = true; break;

                }

            }

            this.mouseDragOn = true;

            if (isMobile()) {
                this.lastPageX = getPageX(event)
                this.lastPageY = getPageY(event)
                // console.log("pointer down: ", this.lastPageX, this.lastPageY,);
            }

        };

        this.onPointerUp = function (event) {

            if (this.activeLook) {

                switch (event.button) {

                    case 0: this.moveForward = false; break;
                    case 2: this.moveBackward = false; break;

                }

            }

            this.mouseDragOn = false;

        };

        this.onPointerMove = function (event) {

            /*! edit by meta3d */
            // if (this.domElement === document) {

            //     this.pointerX = event.pageX - this.viewHalfX;
            //     this.pointerY = event.pageY - this.viewHalfY;

            // } else {

            //     this.pointerX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            //     this.pointerY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

            // }
            if (!isMobile()) {
                this.pointerX = event.movementX
                this.pointerY = event.movementY
                return
            }

            let pageX, pageY
            // if (isNeedHandleLandscape()) {
            //     // pageX = getPageX(event) - this.domElement.offsetTop - this.viewHalfY;
            //     // pageY = getPageY(event) - this.domElement.offsetLeft - this.viewHalfX;
            //     pageX = getPageX(event)
            //     pageY = getPageY(event)
            // }
            // else {
            //     // pageX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
            //     // pageY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
            //     pageX = event.pageX
            //     pageY = event.pageY
            // }
            pageX = getPageX(event)
            pageY = getPageY(event)


            if (this.lastPageX == -1) {
                this.pointerX = 0
                this.pointerY = 0
            }
            else {
                /*! in ios, may trigger pointermove multiple times, then trigger update once. so need judge!
                * 
                */
                if (this.lastPageX != pageX) {
                    this.pointerX = pageX - this.lastPageX
                    this.pointerY = pageY - this.lastPageY
                }
            }

            this.lastPageX = pageX
            this.lastPageY = pageY


            // console.log("pointer move: ", this.pointerX, this.pointerY, this.lastPageX, this.lastPageY);
        };

        this.onKeyDown = function (event) {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW': this.moveForward = true; break;

                case 'ArrowLeft':
                case 'KeyA': this.moveLeft = true; break;

                case 'ArrowDown':
                case 'KeyS': this.moveBackward = true; break;

                case 'ArrowRight':
                case 'KeyD': this.moveRight = true; break;

                case 'KeyR': this.moveUp = true; break;
                case 'KeyF': this.moveDown = true; break;

            }

        };

        this.onKeyUp = function (event) {

            switch (event.code) {

                case 'ArrowUp':
                case 'KeyW': this.moveForward = false; break;

                case 'ArrowLeft':
                case 'KeyA': this.moveLeft = false; break;

                case 'ArrowDown':
                case 'KeyS': this.moveBackward = false; break;

                case 'ArrowRight':
                case 'KeyD': this.moveRight = false; break;

                case 'KeyR': this.moveUp = false; break;
                case 'KeyF': this.moveDown = false; break;

            }

        };

        this.lookAt = function (x, y, z) {

            if (x.isVector3) {

                _target.copy(x);

            } else {

                _target.set(x, y, z);

            }

            this.object.lookAt(_target);

            setOrientation(this);

            return this;

        };


        /*! edit by meta3d */
        this.setLookat = function (latValue, lonValue) {
            lat = latValue
            lon = lonValue
        };


        this.update = function () {

            const targetPosition = new Vector3();

            return function update(delta) {

                if (this.enabled === false) return;

                if (this.heightSpeed) {

                    const y = MathUtils.clamp(this.object.position.y, this.heightMin, this.heightMax);
                    const heightDelta = y - this.heightMin;

                    this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

                } else {

                    this.autoSpeedFactor = 0.0;

                }

                const actualMoveSpeed = delta * this.movementSpeed;

                if (this.moveForward || (this.autoForward && !this.moveBackward)) this.object.translateZ(- (actualMoveSpeed + this.autoSpeedFactor));
                if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

                if (this.moveLeft) this.object.translateX(- actualMoveSpeed);
                if (this.moveRight) this.object.translateX(actualMoveSpeed);

                if (this.moveUp) this.object.translateY(actualMoveSpeed);
                if (this.moveDown) this.object.translateY(- actualMoveSpeed);

                let actualLookSpeed = delta * this.lookSpeed;

                if (!this.activeLook) {

                    actualLookSpeed = 0;

                }

                let verticalLookRatio = 1;

                if (this.constrainVertical) {

                    verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

                }


                /*! edit by meta3d */
                let horrizonLookRatio = 1;
                if (this.constrainHorrizon) {
                    horrizonLookRatio = Math.PI / (this.horrizonMax - this.horrizonMin);
                }





                /*! edit by meta3d */
                // lon -= this.pointerX * actualLookSpeed;
                lon -= this.pointerX * actualLookSpeed * horrizonLookRatio



                if (this.lookVertical) lat -= this.pointerY * actualLookSpeed * verticalLookRatio;

                lat = Math.max(- 85, Math.min(85, lat));

                let phi = MathUtils.degToRad(90 - lat);




                /*! edit by meta3d */
                // const theta = MathUtils.degToRad(lon);
                let theta
                if (this.constrainHorrizon) {
                    lon = Math.max(- 85, Math.min(85, lon));
                    theta = MathUtils.degToRad(lon + 90);

                    theta = MathUtils.mapLinear(theta, 0, Math.PI, this.horrizonMin, this.horrizonMax);
                }
                else {
                    theta = MathUtils.degToRad(lon);
                }






                if (this.constrainVertical) {

                    phi = MathUtils.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);

                }



                const position = this.object.position;

                targetPosition.setFromSphericalCoords(1, phi, theta).add(position);

                this.object.lookAt(targetPosition);

                // console.log("update:", this.pointerX, this.pointerY, position, phi, theta);


                /*! edit by meta3d */
                this.pointerX = 0
                this.pointerY = 0
            };

        }();

        this.dispose = function () {

            this.domElement.removeEventListener('contextmenu', contextmenu);
            this.domElement.removeEventListener('pointerdown', _onPointerDown);
            this.domElement.removeEventListener('pointermove', _onPointerMove);
            this.domElement.removeEventListener('pointerup', _onPointerUp);

            window.removeEventListener('keydown', _onKeyDown);
            window.removeEventListener('keyup', _onKeyUp);

        };

        const _onPointerMove = this.onPointerMove.bind(this);
        const _onPointerDown = this.onPointerDown.bind(this);
        const _onPointerUp = this.onPointerUp.bind(this);
        const _onKeyDown = this.onKeyDown.bind(this);
        const _onKeyUp = this.onKeyUp.bind(this);

        this.domElement.addEventListener('contextmenu', contextmenu);
        this.domElement.addEventListener('pointerdown', _onPointerDown);
        this.domElement.addEventListener('pointermove', _onPointerMove);
        this.domElement.addEventListener('pointerup', _onPointerUp);

        window.addEventListener('keydown', _onKeyDown);
        window.addEventListener('keyup', _onKeyUp);

        function setOrientation(controls) {

            const quaternion = controls.object.quaternion;

            _lookDirection.set(0, 0, - 1).applyQuaternion(quaternion);
            _spherical.setFromVector3(_lookDirection);

            lat = 90 - MathUtils.radToDeg(_spherical.phi);
            lon = MathUtils.radToDeg(_spherical.theta);

        }

        this.handleResize();

        setOrientation(this);

    }

}

function contextmenu(event) {

    event.preventDefault();

}

export { FirstPersonControls };
