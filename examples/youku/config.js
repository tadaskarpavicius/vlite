import '../../dist/vlite.css'
import Vlitejs from '../../dist/vlite.js'
import VlitejsYouku from '../../dist/providers/youku.js'

Vlitejs.registerProvider('youku', VlitejsYouku, {
	clientId: '44503cca1be605b5'
})
const vlite = new Vlitejs('#player', {
	options: {
		controls: true,
		autoplay: false,
		playPause: true,
		progressBar: true,
		time: true,
		volume: true,
		fullscreen: true,
		poster: 'https://yoriiis.github.io/cdn/static/vlitejs/demo-poster.jpg',
		bigPlay: true,
		playsinline: true,
		loop: false,
		muted: false,
		autoHide: true
	},
	provider: 'youku',
	onReady: (player) => {
		console.log(player)

		player.on('play', () => console.log('play'))
		player.on('pause', () => console.log('pause'))
		player.on('progress', () => console.log('progress'))
		player.on('timeupdate', () => console.log('timeupdate'))
		player.on('volumechange', () => console.log('volumechange'))
		player.on('enterfullscreen', () => console.log('enterfullscreen'))
		player.on('exitfullscreen', () => console.log('exitfullscreen'))
		player.on('ended', () => console.log('ended'))
	}
})
