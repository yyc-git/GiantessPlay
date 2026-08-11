import { Howl } from "howler";

// export let loadAudio = (path: Array<string>) => {
export let loadAudio = (path: string, format) => {
	return new Promise((resolve, reject) => {
		let sound = new Howl({
			src: path,
			format,
			onload: (id) => {
				resolve([sound, id])
			},
			onloaderror: (id, error) => {
				reject(error)
			}
		})
	})
}