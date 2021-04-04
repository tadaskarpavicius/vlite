# vLitejs

![vLitejs](https://img.shields.io/badge/vlitejs-v4.0.0-ff7f15.svg?style=for-the-badge) ![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/yoriiis/vlitejs/Build/main?style=for-the-badge) [![Gitter Chat](https://img.shields.io/gitter/room/yoriiis/vlitejs?color=%2345cba1&style=for-the-badge)](https://gitter.im/vlitejs/vlitejs)

<p align="center">
    <img src="./assets/svgs/logo.svg" alt="vLitejs logo" width="250" />
</p>

`vLitejs` is a fast and lightweight JavaScript library to customize and skin a video and audio player. Written in native JavaScript without dependency, it is built around an API of providers and plugins to extend these capabilities and keep the core with the minimal functionnalities.

HTML5 video and audio players are automatically included. Other providers like Youtube or Vimeo can be loaded on demand with the [Provider API](./src/providers/README.md). Plugins uses the same logic and can be loaded on demand by the [Plugin API](/src/plugins/README.md). Others providers and plugins can be created and loaded by the library.

## Why `vLitejs`?

- If you are concerned about your app's loading performance, this library makes sense as it is extremely lightweight compared to the competition (only 6 KB).
- It is quite rare to need to be compatible with HTML5, Youtube and Vimeo at the same time. The library contains by default only HTML5 capabilities and exposed the Provider API to extend capabilities with other providers.
- If you need specific behaviors, the plugin API allows to extends the library capabilities.
- If you need to create a video or audio player with a custom skin harmonized for all web browsers.

Bundle sizes of `vLitejs` compared to the competition:

|              | vLitejs |  Plyr  | Videojs |
| ------------ | :-----: | :----: | :-----: |
| Uncompressed |  69 KB  | 310 KB | 2000 KB |
| Compressed   |  27 KB  | 120 KB | 537 KB  |
| Gzip         |  6 KB   | 30 KB  | 149 KB  |

_\*`vlitejs 4.0.0`, `plyr 3.6.4`, `videojs 7.11.4`_

---

## Features

- **Video & audio** - HTML5 video, HTML5 audio, Youtube, Vimeo.
- **Customization** - Choose the control elements you want to display.
- **No dependency** - Written in native Javascript without any framework.
- **Fullscreen** - Supports native fullscreen API.
- [**Provider API**](./src/providers/README.md) - Use the available providers or create your own.
- [**Plugin API**](./src/plugins/README.md) - Use the available plugins or create your own.
- [**Events**](#Events) - Standardized events for all web browsers and providers.
- **Subtitles** - Supports multiple subtitle tracks (VTT).
- **Picture-in-Picture** - Supports Picture-in-Picture API.
- **Playsinline** - Supports the `playsinline` attribute.
- **SVG icons** - SVG are inlined into the library, no sprites to includes.
- [**Shortcuts**](#Shortcuts) - Supports keyboard shortcuts.
- **Accessibility** - W3C and A11Y valid.

[![Image of vLitejs](./assets/images/screenshot.jpg)](https://yoriiis.github.io/vlitejs)

---

## Installation

### NPM

NPM is the recommended installation method. Install `vlitejs` in your project with the following command:

```bash
npm install vlitejs --save-dev
# or
yarn add vlitejs  --dev
```

### CDN

You can also download and include with a script tag. The library will be registered as the global variable `window.Vlitejs`

```html
<link href="https://cdn.jsdelivr.net/npm/vlitejs@4/dist/vlite.css" rel="stylesheet" crossorigin />
<script src="https://cdn.jsdelivr.net/npm/vlitejs@4/dist/vlite.js" crossorigin></script>
```

## Examples

The project includes several examples of `vLitejs` implementation in the directory `examples` at the root directory. If you're interested in playing around with `vLitejs`, you can use the online code playground on CodePen:

- [HTML5 video](https://codepen.io/pen/?template=VwPWeyE)
- [HTML5 audio](https://codepen.io/pen/?template=RwKgrBd)
- [Youtube](https://codepen.io/pen/?template=zYNzrJp)
- [Vimeo](https://codepen.io/pen/?template=zYNzrmp)

## How it works

### HTML

#### HTML5 video

```html
<video id="player" class="vlite-js" src="/path/to/video.mp4"></video>
```

#### HTML5 audio

```html
<audio id="player" class="vlite-js" src="/path/to/audio.mp3"></audio>
```

#### Youtube video

```html
<div id="player" class="vlite-js" data-youtube-id="aqz-KE-bpKQ"></div>
```

#### Vimeo video

```html
<div id="player" class="vlite-js" data-vimeo-id="1084537"></div>
```

---

### Initialize the player

Import `vLitejs` styleheet and the JavaScript library as an ES6 modules.

```javascript
import 'vlitejs/vlite.css';
import Vlitejs from 'vlitejs';
```

The `Vlitejs` constructor accepts the following parameters:

| Arguments |         Type          | Default | Description                                                      |
| --------- | :-------------------: | :-----: | ---------------------------------------------------------------- |
| selector  | `String\|HTMLElement` | `null`  | Unique CSS selector string or `HTMLElement` to target the player |
| config    |       `Object`        |  `{}`   | Player configuration                                             |

Initialize the player with a CSS selector string.

```javascript
new Vlitejs('#player');
```

Or, initialize the player with an `HTMLElement`.

```js
new Vlitejs(document.querySelector('#player'));
```

### Configure the player

The second arguments of the contructor is an object with the following parameters:

| Arguments  |       Type       |  Default  | Description                                         |
| ---------- | :--------------: | :-------: | --------------------------------------------------- |
| `options`  |     `Object`     |   `{}`    | Player options                                      |
| `onReady`  | `Function\|null` |  `null`   | Callback function executed when the player is ready |
| `provider` |     `String`     | `'html5'` | Player provider                                     |
| `plugins`  |     `Array`      |   `[]`    | Player plugins                                      |

```javascript
new Vlitejs('#player', {
  options: {},
  onReady: function (player) {},
  provider: 'html5',
  plugins: []
});
```

### Player options

The player controls can be customized with the following parameters:

| Options             |      Type      | Default | Description                                               |
| ------------------- | :------------: | :-----: | --------------------------------------------------------- |
| `autoplay`          |   `Boolean`    | `false` | Enable the autoplay of the media                          |
| `controls`&sup1;    |   `Boolean`    | `true`  | Display the control bar of the video                      |
| `playPause`         |   `Boolean`    | `true`  | Display the play/pause button on the control bar          |
| `progressBar`       |   `Boolean`    | `true`  | Display the progress bar on the control bar               |
| `time`              |   `Boolean`    | `true`  | Display the time information on the control bar           |
| `volume`            |   `Boolean`    | `true`  | Display the volume button on the control bar              |
| `fullscreen`&sup1;  |   `Boolean`    | `true`  | Display the fullscreen button on the control bar          |
| `poster`&sup1;      | `String\|null` | `null`  | Personalize the poster url of the video                   |
| `bigPlay`&sup1;     |   `Boolean`    | `true`  | Display the big play button on the poster video           |
| `playsinline`&sup1; |   `Boolean`    | `false` | Add the `playsinline` attribute to the video              |
| `loop`              |   `Boolean`    | `false` | Whether to loop the current media                         |
| `muted`&sup1;       |   `Boolean`    | `false` | Whether to muted the current media                        |
| `autoHide`&sup1;    |   `Boolean`    | `false` | Auto hide the control bar in the event of inactivity (3s) |

_&sup1; Options available only on a video player, not on an audio player._

> The `autoplay` parameter automatically activates the `muted` option because the API can only be initiated by a user gesture.

Example of customization for the `autoHide` and the `poster` options.

```javascript
new Vlitejs('#player', {
  options: {
    autoHide: true,
    poster: '/path/to/poster.jpg'
  }
});
```

### Player ready

The callback function `onReady` is automatically executed when the player is ready. The HTML5 video and audio listen to the `canplay|loadedmetadata` event. The Youtube and Vimeo provider listen to the `onready` event returned by their API.

The function exposes the `player` parameter as the player instance. You can use it to interact with the player instance and the [player methods](#Player-methods).

Example of a player muted when ready:

```javascript
new Vlitejs('#player', {
  onReady: function (player) {
    this.player.mute();
  }
});
```

> The `onReady` function can also be written with an arrow function.

### Events

`vLitejs` exposes the following native `CustomEvent` on the player container element. Events are standardized for all providers, even for Youtube and Vimeo.

| Event Type              | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `play`                  | Sent when the playback state is no longer paused, after the play method or the autoplay |
| `pause`                 | Sent when the playback state is changed to paused                                       |
| `ended`                 | Sent when playback completes                                                            |
| `progress`              | Sent periodically to inform interested parties of progress downloading the media.       |
| `volumechange`          | Sent when audio volume changes                                                          |
| `timeupdate`            | Sent when the `currentTime` of the media has changed                                    |
| `enterfullscreen`&sup1; | Sent when the video switches to fullscreen mode                                         |
| `exitfullscreen`&sup1;  | Sent when the video exits fullscreen mode                                               |
| `enterpip`&sup1;        | Sent when the video switches to picture-in-picture mode                                 |
| `leavepip`&sup1;        | Sent when the video exits of picture-in-picture mode                                    |
| `trackenabled`&sup1;    | Sent when a track is enabled and displayed                                              |
| `trackdisabled`&sup1;   | Sent when a track is disabled and hidden                                                |

_&sup1; Options available only on a video player, not on an audio player._

Example listener when the media triggers a play event.

```javascript
const vlitePlayer = new Vlitejs('#player');

player.container.addEventListener('play', () => {
  // The video starts playing
});
```

### Player methods

The player instance exposed the following methods:

| Method                | Parameters |  Promise  | Description                       |
| --------------------- | :--------: | :-------: | --------------------------------- |
| `play()`              |     -      |     -     | Start the playback                |
| `pause()`             |     -      |     -     | Pause the playback                |
| `setVolume(volume)`   |  `Number`  |     -     | Set the volume between 0 and 1    |
| `getVolume()`         |     -      | `Promise` | Get the volume                    |
| `getCurrentTime()`    |     -      | `Promise` | Get the current time              |
| `getDuration()`       |     -      | `Promise` | Get the duration                  |
| `mute()`              |     -      |     -     | Mute the volume                   |
| `unMmute()`           |     -      |     -     | Unmute the volume                 |
| `seekTo(time)`        |  `Number`  |     -     | Seek to a current time in seconds |
| `requestFullscreen()` |     -      |     -     | Request the fullscreen            |
| `exitFullscreen()`    |     -      |     -     | Exit the fullscreen               |
| `getInstance()`       |     -      |     -     | Get the player instance           |
| `destroy()`           |     -      |     -     | Destroy the player                |

Example of the media duration recovered when the player is ready.

```javascript
new Vlitejs('#player', {
  onReady: (player) => {
    player.getDuration().then((duration) => {});
  }
});
```

Second example of a video muted when the button `.btn-mute` is pressed.

```html
<video id="player" class="vlite-js" src="/path/to/video.mp4"></video>
<button class="btn-mute">Mute</button>
```

```js
const vlitePlayer = new Vlitejs('#player');

document.querySelector('.btn-mute').addEventListener('click', () => {
  vlitePlayer.playerInstance.mute();
});
```

## Shortcuts

The player accepts the following keyboard shortcuts when in focus.

|        Key        | Action                  |
| :---------------: | ----------------------- |
| <kbd>space</kbd>  | Toggle playback         |
|  <kbd>Esc</kbd>   | Exit the fullscreen     |
| <kbd>&larr;</kbd> | Seek backward of `10s`  |
| <kbd>&rarr;</kbd> | Seek forward of `10s`   |
| <kbd>&uarr;</kbd> | Increase volume of `5%` |
| <kbd>&darr;</kbd> | Decrease volume of `5%` |

## Browser support

`vLitejs` supports the latest 2 versions of most modern browsers with the [.browserslist](https://github.com/yoriiis/vlitejs/blob/main/.browserslist) config.

| Browser    | Supported |
| ---------- | :-------: |
| Chrome     |  &#9989;  |
| Firefox    |  &#9989;  |
| Opera      |  &#9989;  |
| Edge       |  &#9989;  |
| Safari     |  &#9989;  |
| iOS Safari |  &#9989;  |

## Contributors

Many thanks to [Victor Schirm](https://www.behance.net/victorshm) for the `vLitejs` logo.

## Licence

`vLitejs` is licensed under the [MIT License](https://opensource.org/licenses/MIT). Created with &#9825; by [@yoriiis](http://github.com/yoriiis).

TODO: Parler des SVG ?
