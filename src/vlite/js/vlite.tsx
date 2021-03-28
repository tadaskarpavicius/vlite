/**
 * @license MIT
 * @name vlitejs
 * @version 4.0.0
 * @author: Yoriiis aka Joris DANIEL <joris.daniel@gmail.com>
 * @description: vLitejs is a fast and lightweight Javascript library for customizing HTML5 and Youtube video players in Javascript with a minimalist theme
 * {@link https://yoriiis.github.io/vlitejs}
 * @copyright 2021 Joris DANIEL <https://yoriiis.github.io/vlitejs>
 **/

import PlayerHtml5 from '../../providers/html5'
import Player from './player'
import { createElement, Fragment } from 'jsx-dom'
import validateTarget from 'validate-target'
import { capitalized, isTouch, checkSupportFullScreen } from 'shared/utils/utils'
import LoaderTemplate from 'shared/loader/assets/scripts/loader'
import BigPlayTemplate from 'shared/big-play/assets/scripts/big-play'
import OverlayTemplate from 'shared/overlay/assets/scripts/overlay'
import PosterTemplate from 'shared/poster/assets/scripts/poster'
import ControlBar from 'shared/control-bar/assets/scripts/control-bar'
import {
	interfaceVliteProviders,
	interfaceVlitePlugins,
	interfaceDefaultOptions,
	Options,
	FullScreenSupport,
	interfacePluginsInstance
} from 'shared/assets/interfaces/interfaces'

const vliteProviders: interfaceVliteProviders = {
	html5: PlayerHtml5
}
const vlitePlugins: interfaceVlitePlugins = {}
const DEFAULT_OPTIONS: interfaceDefaultOptions = {
	audio: {
		autoplay: false,
		controls: true,
		playPause: true,
		progressBar: true,
		time: true,
		volume: true,
		loop: false
	},
	video: {
		autoplay: false,
		controls: true,
		playPause: true,
		progressBar: true,
		time: true,
		volume: true,
		fullscreen: true,
		poster: null,
		bigPlay: true,
		autoHide: false,
		playsinline: true,
		loop: false,
		muted: false
	}
}

type TimerHandle = number

/**
 * vlitejs entrypoint
 * @module vLite/entrypoint
 */
class vlitejs {
	Player: any
	element: HTMLElement
	plugins: Array<string>
	onReady: Function
	delayAutoHide: number
	mode: string
	touchSupport: Boolean
	supportFullScreen: FullScreenSupport
	options: Options
	isPaused: Boolean
	autoHideGranted: Boolean
	container: HTMLElement
	playerInstance: any
	controlBar: any
	registerPlugin: any
	registerProvider: any
	timerAutoHide!: TimerHandle

	/**
	 * @constructor
	 * @param {Object} options
	 * @param {(String|HTMLElement)} options.selector CSS selector or HTML element
	 * @param {Object} options.options Player options
	 * @param {String} options.provider Player provider
	 * @param {Object} options.plugins Player plugins
	 * @param {Function} options.onReady Callback function when the player is ready
	 */
	constructor({
		selector,
		options,
		provider = 'html5',
		plugins = [],
		onReady
	}: {
		selector: string | HTMLElement
		options: Options
		provider: string
		plugins: Array<string>
		onReady: Function
	}) {
		// Detect the type of the selector (string or HTMLElement)
		if (typeof selector === 'string') {
			// @ts-ignore: Object is possibly 'null'.
			this.element = document.querySelector(selector)
		} else if (selector instanceof HTMLElement) {
			this.element = selector
		} else {
			throw new TypeError('vlitejs :: The element or selector supplied is not valid.')
		}

		this.plugins = plugins
		this.onReady = onReady
		this.isPaused = true
		this.delayAutoHide = 3000
		this.mode = this.element instanceof HTMLAudioElement ? 'audio' : 'video'
		this.touchSupport = isTouch()

		// Check fullscreen support API on different browsers and cached prefixs
		this.supportFullScreen = checkSupportFullScreen()

		// Update config from element attributes
		if (this.element.hasAttribute('autoplay')) {
			options.autoplay = true
		}
		if (this.element.hasAttribute('playsinline')) {
			options.playsinline = true
		}
		if (this.element.hasAttribute('muted')) {
			options.muted = true
		}
		if (this.element.hasAttribute('loop')) {
			options.loop = true
		}

		this.options = { ...DEFAULT_OPTIONS[this.mode], ...options }
		this.autoHideGranted =
			this.mode === 'video' && !!this.options.autoHide && !!this.options.controls

		// Add play inline attribute
		if (this.options.playsinline) {
			this.element.setAttribute('playsinline', '')
			this.element.setAttribute('webkit-playsinline', '')
		}

		this.onClickOnPlayer = this.onClickOnPlayer.bind(this)
		this.onDoubleClickOnPlayer = this.onDoubleClickOnPlayer.bind(this)
		this.onKeyup = this.onKeyup.bind(this)
		this.onMousemove = this.onMousemove.bind(this)
		this.onChangeFullScreen = this.onChangeFullScreen.bind(this)

		const ProviderInstance: any = vliteProviders[provider]
		if (!ProviderInstance) {
			throw new Error(`vlitejs :: Unknown provider "${provider}"`)
		}

		this.wrapElement()
		this.container = this.element.parentNode as HTMLElement

		this.playerInstance = new ProviderInstance({
			element: this.element,
			container: this.container,
			options: this.options,
			onCallbackReady: this.onCallbackReady.bind(this),
			instanceParent: this
		})
		this.playerInstance.init()

		if (this.options.controls) {
			this.controlBar = new ControlBar({
				container: this.container,
				options: this.options,
				mode: this.mode,
				playerInstance: this.playerInstance
			})
		}

		this.render()
		this.addEvents()
		this.getPluginInstance(this.plugins).forEach((item: any) => {
			const plugin = new item.Plugin({ player: this.playerInstance })
			if (plugin.providers.includes(provider) && plugin.types.includes(this.mode)) {
				plugin.init()
			} else {
				throw new Error(
					`vlitejs :: The "${item.id}" plugin is only compatible with providers:"${plugin.providers}" and types:"${plugin.types}"`
				)
			}
		})
	}

	/**
	 * Get plugins instances from the registered list
	 * @param {Array} plugins List of plugins to enabled
	 * @returns {Array} List of plugins instances to enabled
	 */
	getPluginInstance(plugins: Array<string>): Array<interfacePluginsInstance> {
		const pluginsInstance: Array<interfacePluginsInstance> = []
		const pluginsIds = Object.keys(vlitePlugins)

		plugins.forEach((id: string) => {
			if (pluginsIds.includes(id)) {
				pluginsInstance.push({ id, Plugin: vlitePlugins[id] })
			} else {
				throw new Error(`vlitejs :: Unknown plugin "${id}".`)
			}
		})

		return pluginsInstance
	}

	/**
	 * The player is initialized and ready
	 * @param {Class} playerInstance Player instance
	 */
	onCallbackReady(playerInstance: any) {
		this.loading(false)
		this.onReady instanceof Function && this.onReady(playerInstance)
	}

	/**
	 * Build the DOM of the player
	 */
	render() {
		this.container.appendChild(
			<>{this.mode === 'audio' ? this.renderAudioElement() : this.renderVideoElement()}</>
		)
		this.options.controls && this.controlBar.init()
	}

	/**
	 * Render the video element
	 * @returns {HTMLElement} Generated HTML
	 */
	renderVideoElement(): Element {
		return (
			<>
				<OverlayTemplate />
				<LoaderTemplate />
				{this.options.poster && <PosterTemplate posterUrl={this.options.poster} />}
				{this.options.bigPlay && <BigPlayTemplate />}
				{this.options.controls && this.controlBar.getTemplate()}
			</>
		)
	}

	/**
	 * Render the aido element
	 * @returns {HTMLElement} Generated HTML
	 */
	renderAudioElement(): Element {
		return this.controlBar.getTemplate()
	}

	/**
	 * Add evnets listeners
	 */
	addEvents() {
		this.autoHideGranted && this.container.addEventListener('mousemove', this.onMousemove)
		this.container.addEventListener('click', this.onClickOnPlayer)
		this.container.addEventListener('dblclick', this.onDoubleClickOnPlayer)
		this.container.addEventListener('keyup', this.onKeyup)
		window.addEventListener(this.supportFullScreen.changeEvent, this.onChangeFullScreen)
	}

	/**
	 * On click on the player
	 * @param {Object} e Event data
	 */
	onClickOnPlayer(e: Event) {
		const target = e.target
		const validateTargetPlayPauseButton = validateTarget({
			target: target,
			selectorString: '.v-poster, .v-overlay, .v-bigPlay',
			nodeName: ['div', 'button']
		})

		if (validateTargetPlayPauseButton) {
			this.togglePlayPause(e)
		}
	}

	/**
	 * On keyup event on the media element
	 * @param {Object} e Event listener datas
	 */
	onKeyup(e: KeyboardEvent) {
		// Stop and start the auto hide timer on selected key code
		const validKeyCode = [9, 32, 37, 39]
		if (this.autoHideGranted && validKeyCode.includes(e.keyCode)) {
			this.stopAutoHideTimer()
			this.startAutoHideTimer()
		}

		if (e.keyCode === 32) {
			// Toggle the media element on spacebar press
			this.togglePlayPause(e)
		} else if (e.keyCode === 37) {
			// Backward the media element on arrow left press
			this.fastForward('backward')
		} else if (e.keyCode === 39) {
			// Forward the media element on arrow right press
			this.fastForward('forward')
		}
	}

	togglePlayPause(e: Event | KeyboardEvent) {
		e.preventDefault()

		this.container.classList.contains('v-paused')
			? this.playerInstance.play()
			: this.playerInstance.pause()
	}
	/**
	 * Trigger the video fast forward (front and rear)
	 * @param {String} direction Direction (backward|forward)
	 */
	fastForward(direction: string) {
		this.playerInstance.getCurrentTime().then((seconds: number) => {
			this.playerInstance.seekTo(direction === 'backward' ? seconds - 5 : seconds + 5)
		})
	}

	/**
	 * On double click on the player
	 * @param {Object} e Event data
	 */
	onDoubleClickOnPlayer(e: Event) {
		const target = e.target
		const validateTargetOverlay = validateTarget({
			target: target,
			selectorString: '.v-overlay',
			nodeName: ['div']
		})
		if (validateTargetOverlay) {
			this.playerInstance.toggleFullscreen(e)
		}
	}

	/**
	 * Wrapa the media element
	 */
	wrapElement() {
		const wrapper = document.createElement('div')
		wrapper.classList.add(
			'v-vlite',
			'v-firstStart',
			'v-paused',
			'v-loading',
			`v-style${capitalized(this.mode)}`
		)
		wrapper.setAttribute('tabindex', '0')
		const parentElement = this.element.parentNode as HTMLElement
		parentElement.insertBefore(wrapper, this.element)
		wrapper.appendChild(this.element)
	}

	/**
	 * On mousemove on the player
	 */
	onMousemove() {
		if (!this.isPaused) {
			this.stopAutoHideTimer()
			this.startAutoHideTimer()
		}
	}

	/**
	 * Stop the auto hide timer and show the video control bar
	 */
	stopAutoHideTimer() {
		if (this.mode === 'video') {
			// @ts-ignore: Object is possibly 'null'.
			this.container.querySelector('.v-controlBar').classList.remove('hidden')
			clearTimeout(this.timerAutoHide)
		}
	}

	/**
	 * Start the auto hide timer and hide the video control bar after a delay
	 */
	startAutoHideTimer() {
		if (this.mode === 'video' && !this.isPaused) {
			this.timerAutoHide = window.setTimeout(() => {
				// @ts-ignore: Object is possibly 'null'.
				this.container.querySelector('.v-controlBar').classList.add('hidden')
			}, this.delayAutoHide)
		}
	}

	/**
	 * On fullscreen change (espace key pressed)
	 * @doc https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
	 * @param {Object} e Event data
	 */
	onChangeFullScreen(e: Event) {
		if (!document[this.supportFullScreen.isFullScreen] && this.playerInstance.isFullScreen) {
			this.playerInstance.exitFullscreen({ escKey: true })
		}
	}

	/**
	 * Update the loader status
	 * @param {Boolean} state Status of the loader
	 */
	loading(state: Boolean) {
		this.container.classList[state ? 'add' : 'remove']('v-loading')
	}

	removeEvents() {
		this.autoHideGranted && this.container.removeEventListener('mousemove', this.onMousemove)
		this.container.removeEventListener('click', this.onClickOnPlayer)
		this.container.removeEventListener('dblclick', this.onDoubleClickOnPlayer)
		this.container.removeEventListener('keyup', this.onKeyup)
		window.removeEventListener(this.supportFullScreen.changeEvent, this.onChangeFullScreen)
	}

	/**
	 * Destroy the player instance
	 */
	destroy() {
		this.removeEvents()
		this.playerInstance.destroy()
		this.controlBar && this.controlBar.destroy()
	}
}

// Expose the Player instance, used by the provider API
// @ts-ignore
vlitejs.Player = Player

// Expose the provider registration
// @ts-ignore
vlitejs.registerProvider = (id: string, instance: any) => {
	if (typeof instance !== 'undefined') {
		if (!Object.keys(vliteProviders).includes(id)) {
			vliteProviders[id] = instance
			return
		}
		throw new Error(`vlitejs :: The provider id "${id}" is already registered.`)
	}
	throw new Error(`vlitejs :: The provider id "${id}" is undefined.`)
}

// Expose the plugin registration
// @ts-ignore
vlitejs.registerPlugin = (id: string, instance: any) => {
	if (typeof instance !== 'undefined') {
		if (!Object.keys(vlitePlugins).includes(id)) {
			vlitePlugins[id] = instance
			return
		}
		throw new Error(`vlitejs :: The plugin id "${id}" is already registered.`)
	}
	throw new Error(`vlitejs :: The plugin id "${id}" is undefined.`)
}

export default vlitejs
