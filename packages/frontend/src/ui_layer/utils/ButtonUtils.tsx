import React from 'react';
import { Button, Image } from 'antd';
import { isMobile } from '../../business_layer/Device';
import { readState, writeState } from '../../business_layer/State';
import { buildNeedToPlaySoundData } from 'meta3d-jiehuo-abstract/src/audio/SoundManager';
import { getClickSmallSoundResourceId } from '../../business_layer/Loader';
import { getIsDebug } from 'meta3d-jiehuo-abstract/src/state/State';
import { getAbstractState } from '../../scene3d_layer/state/State';
import { play } from '../../business_layer/Sound';
import { NullableUtils } from 'meta3d-jiehuo-abstract';
import { state } from '../../scene3d_layer/type/StateType';
import { getSoundSetting } from '../../scene3d_layer/mod/SettingMod';
import { handleEventHandler } from './ErrorUtils';

export let renderButton = (handler: (state: state, event) => Promise<state>, key, text, className = "", soundId = getClickSmallSoundResourceId(), type = "primary") => {
	return <Button key={key} className={className} type={type}
		onClick={handleEventHandler(event => {
			if (isMobile()) {
				return
			}



			return handler(readState(), event).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

				writeState(state)
			})
		})}
		onTouchEnd={handleEventHandler(event => {
			return handler(readState(), event).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		})}
	>
		{text}
	</Button >
}

export let renderButton2 = (handler: (state: state) => Promise<void>, key, text, className = "", soundId = getClickSmallSoundResourceId(), type = "primary") => {
	return <Button key={key} className={className} type={type}
		onClick={handleEventHandler(_ => {
			if (isMobile()) {
				return
			}

			return handler(readState()).then(() => {
				let state = readState()
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
			})
		})}
		onTouchEnd={handleEventHandler(event => {
			return handler(readState()).then(() => {
				let state = readState()
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))

				event.preventDefault()
				event.stopPropagation()
			})
		})}
	>
		{text}
	</Button >
}

export let renderButton3 = (handler: (state: state) => Promise<state>, isDisabled: (state: state) => boolean, key, text, className = "", soundId = getClickSmallSoundResourceId(), type = "primary") => {
	return <Button key={key} className={className} type={type}
		disabled={isDisabled(readState())}
		onClick={handleEventHandler(_ => {
			// if (isMobile()) {
			// 	return
			// }

			return handler(readState()).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				writeState(state)
			})
		})}
	// onTouchEnd={event => {
	// 	handler(readState()).then(state => {
	// 		play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
	// 		writeState(state)

	// 		event.preventDefault()
	// 		event.stopPropagation()
	// 	})
	// }}
	>
		{text}
	</Button >
}

export let renderButton4 = (handler: (state: state) => Promise<state>, color, className, text, soundId = getClickSmallSoundResourceId(), type = "primary") => {
	return <Button key={text} className={className}
		color={color}
		type={type}
		onClick={handleEventHandler(_ => {
			if (isMobile()) {
				return
			}

			return handler(readState()).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				writeState(state)
			})
		})}
		onTouchEnd={handleEventHandler(event => {
			return handler(readState()).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		})}
	>
		{text}
	</Button >
}


export let renderButton5 = (handler: (state: state) => Promise<state>, key, text, className, style = "", soundId = getClickSmallSoundResourceId(), type = "primary") => {
	return <Button key={key} className={className} style={style} type={type}
		onClick={handleEventHandler(_ => {
			if (isMobile()) {
				return
			}



			return handler(readState()).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				writeState(state)
			})
		})}
		onTouchEnd={handleEventHandler(event => {
			return handler(readState()).then(state => {
				play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		})}
	>
		{text}
	</Button >
}



export let renderImage = (handler: (state: state) => Promise<state>, src, className = "", preview = false, soundId = null, style = {}) => {
	// @ts-ignore
	return <Image src={src} className={className}
		style={style}
		preview={preview}
		onClick={handleEventHandler(_ => {
			if (isMobile()) {
				return
			}

			return handler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				}, soundId)

				writeState(state)
			})
		})}
		onTouchEnd={handleEventHandler(event => {
			return handler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				}, soundId)

				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		})}
	/>
}


export let renderImage2 = (downHandler: (state: state) => Promise<state>,
	upHandler: (state: state) => Promise<state>,
	src, className = "", preview = false, soundId = null) => {
	// @ts-ignore
	return <Image src={src} className={className}
		preview={preview}
		onMouseDown={handleEventHandler(event => {
			event.stopPropagation()
			event.preventDefault()

			if (isMobile()) {
				return
			}

			return downHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				}, soundId)

				writeState(state)
			})
		})}
		onMouseUp={handleEventHandler(event => {
			event.stopPropagation()
			event.preventDefault()

			if (isMobile()) {
				return
			}

			return upHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				}, soundId)

				writeState(state)
			})
		})}

		onTouchStart={handleEventHandler(event => {
			event.stopPropagation()
			event.preventDefault()

			return downHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				}, soundId)

				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		})}
		onTouchEnd={handleEventHandler(event => {
			event.stopPropagation()
			event.preventDefault()

			return upHandler(readState()).then(state => {
				NullableUtils.forEach(soundId => {
					play(state, buildNeedToPlaySoundData(soundId, getIsDebug(getAbstractState(state)), Math.min(0.5 * getSoundSetting(state).pageSoundLevel, 1), false))
				}, soundId)

				writeState(state)

				event.preventDefault()
				event.stopPropagation()
			})
		})}
	/>
}

export let renderBackgroundImage = (
	src, className = "", soundId = null) => {
	return <div className={className} style={{
		backgroundImage: `url(${src})`,
		backgroundSize: "100% 100%"
	}}
	></div >
}