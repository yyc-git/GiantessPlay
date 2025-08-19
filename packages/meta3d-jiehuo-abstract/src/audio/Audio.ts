import { Howl } from "howler";

export let loadAudio = (path: Array<string>) => {
	return new Promise((resolve, reject) => {
		let sound = new Howl({
			src: path,
			onload: (id) => {
				resolve([sound, id])
			},
			onloaderror: (id, error) => {
				reject(error)
			}
		})
	})
}