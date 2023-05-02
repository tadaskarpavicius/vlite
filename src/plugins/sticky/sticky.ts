import './sticky.css'
import svgClose from 'shared/assets/svgs/close.svg'
import { pluginParameter } from 'shared/assets/interfaces/interfaces'

interface WindowSizes {
	clientWidth: number
	innerHeight: number
}

/**
 * Vlitejs Sticky plugin
 * @module Vlitejs/plugins/sticky
 */
export default class Sticky {
	player: any
	options: any
	closeStickyButton!: HTMLElement
	windowSizes: WindowSizes
	isSticky: boolean
	isPlayerSeen: boolean
	stickyIsClosed: boolean
	isOutViewport: null | boolean
	observer!: IntersectionObserver
	resizeTimer!: number

	providers = ['html5', 'youtube', 'dailymotion', 'vimeo']
	types = ['video']

	/**
	 * @constructor
	 * @param {Object} options
	 * @param {Class} options.player Player instance
	 * @param {Object} options.options Plugins options
	 */
	constructor({ player, options = {} }: pluginParameter) {
		this.player = player
		this.options = options

		const DEFAULTS = {
			mode: 'on',
			width: 400,
			offset: 20,
			ratio: 16 / 9
		}

		this.options = { ...DEFAULTS, ...this.options }
		this.windowSizes = {
			clientWidth: document.documentElement.clientWidth,
			innerHeight: window.innerHeight
		}
		this.isSticky = false
		this.stickyIsClosed = false
		this.isOutViewport = null
		this.isPlayerSeen = false

		this.onClickOnCloseStickyButton = this.onClickOnCloseStickyButton.bind(this)
		this.onScroll = this.onScroll.bind(this)
		this.onResize = this.onResize.bind(this)
	}

	/**
	 * Initialize
	 */
	init() {
		this.render()
		this.closeStickyButton =
			this.player.elements.container.querySelector('.v-closeStickyButton')

		this.addEvents()
	}

	/**
	 * Render the plugin HTML
	 */
	render() {
		// @TODO: svg is cropped
		const template = `<button class="v-closeStickyButton">${svgClose}</button>`
		this.player.elements.container.insertAdjacentHTML('beforeend', template)
	}

	/**
	 * Add event listeners
	 */
	addEvents() {
		this.observer = new window.IntersectionObserver(this.callbackOnIntersection.bind(this), {
			rootMargin: '0px',
			threshold: 0.0
		})
		this.observer.observe(this.player.elements.outerContainer)

		this.closeStickyButton.addEventListener('click', this.onClickOnCloseStickyButton)

		window.addEventListener('scroll', this.onScroll, {
			passive: true
		})
		window.addEventListener('resize', this.onResize)
	}

	/**
	 * Handles scroll events for determining which action to take
	 * based on current scroll value
	 */
	onScroll() {
		this.updateSticky()
	}

	/**
	 * Update sticky position
	 * @param {Object} options
	 * @param {Boolean} options.resize Update is trigger by the resize event
	 */
	updateSticky({ resize = false } = {}) {
		if (this.isStickyGranted()) {
			if (!this.isSticky || resize) {
				this.setStickyOn()
			}
		} else {
			if (this.isSticky) {
				this.setStickyOff()
			}
		}
	}

	/**
	 * On window resize event
	 */
	onResize() {
		this.windowSizes.clientWidth = document.documentElement.clientWidth
		this.windowSizes.innerHeight = window.innerHeight

		clearTimeout(this.resizeTimer)
		this.resizeTimer = window.setTimeout(() => this.updateSticky({ resize: true }), 0)
	}

	/**
	 * Callback method on player intersection actions
	 * @callback
	 * @param {Array} entries List of elements being watched
	 */
	callbackOnIntersection(entries: Array<IntersectionObserverEntry>) {
		entries.forEach((entry: IntersectionObserverEntry) => {
			if (entry.isIntersecting) {
				this.inViewport()
			} else {
				this.outViewport()
			}
		})
	}

	/**
	 * Player is inside viewport
	 */
	inViewport() {
		this.isPlayerSeen = true
		this.isOutViewport = false

		this.isStickyGranted() && this.setStickyOff()
	}

	/**
	 * Player is outside the viewport
	 */
	outViewport() {
		this.isOutViewport = true

		this.isStickyGranted() && this.setStickyOn()
	}

	/**
	 * Check if the sticky is granted
	 * @returns {Boolean} Sticky is granted
	 */
	isStickyGranted() {
		return (
			!this.stickyIsClosed &&
			this.isOutViewport &&
			(this.options.mode === 'instant' || this.isPlayerSeen)
		)
	}

	/**
	 * Set the sticky
	 */
	setStickyOn() {
		this.player.dispatchEvent('entersticky')

		this.isSticky = true
		this.player.elements.outerContainer.classList.add('v-sticky')

		const height = this.options.width / this.options.ratio
		const x = this.windowSizes.clientWidth - this.options.width - this.options.offset
		const y = this.windowSizes.innerHeight - height - this.options.offset

		this.player.elements.container.style.width = `${this.options.width}px`
		this.player.elements.container.style.height = `${height}px`

		this.player.elements.container.style.transform = `translate3d(${x}px, ${y}px, 0)`
	}

	/**
	 * Unset the sticky
	 */
	setStickyOff() {
		this.player.dispatchEvent('leavesticky')

		this.isSticky = false

		this.player.elements.outerContainer.classList.remove('v-sticky')
		this.player.elements.container.style.removeProperty('width')
		this.player.elements.container.style.removeProperty('height')
		this.player.elements.container.style.removeProperty('transform')
	}

	/**
	 * On click on the close button
	 * @param {Event} e Event data
	 */
	onClickOnCloseStickyButton(e: Event) {
		e.preventDefault()
		this.stickyIsClosed = true
		this.setStickyOff()
	}

	/**
	 * Destroy the plugin
	 */
	destroy() {
		this.closeStickyButton.removeEventListener('click', this.onClickOnCloseStickyButton)
		window.removeEventListener('scroll', this.onScroll)
		window.removeEventListener('resize', this.onResize)
		this.observer.unobserve(this.player.elements.outerContainer)
	}
}
