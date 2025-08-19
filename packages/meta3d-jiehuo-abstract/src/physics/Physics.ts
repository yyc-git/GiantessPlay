// import Ammo from "three/examples/jsm/libs/ammo.wasm"
// import Ammo from "../three/ammo"
// import Ammo from "../three/ammo-es"
// import Ammo from "ammojs3"
// import "three/examples/js/libs/ammo"
import { state } from "../type/StateType";
import type Ammo from "ammojs-typed"

export let init = (state: state) => {
	return globalThis.Ammo().then(function (AmmoLib) {

		globalThis.Ammo = AmmoLib;

		return state
	});
}