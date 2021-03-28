!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.vlitejsSubtitle=e():t.vlitejsSubtitle=e()}(globalThis,(function(){return(()=>{"use strict";var t={583:(t,e,s)=>{var i,n,a=function(t){return t&&t.__esModule?t:{default:t}};i=[s,e,s(62),s(270),s(967)],void 0===(n=function(t,e,s,i,n){Object.defineProperty(e,"__esModule",{value:!0}),s=a(s),i=a(i),n=a(n);e.default=class{constructor({player:t}){this.providers=["html5"],this.types=["video"],this.player=t,this.video=this.player.element,this.tracks=Array.from(this.video.textTracks),this.onClickOnSubtitleButton=this.onClickOnSubtitleButton.bind(this),this.onClickOnSubtitlesList=this.onClickOnSubtitlesList.bind(this)}init(){this.tracks.length&&this.player.options.controls&&(this.hideTracks(),this.render(),this.captions=this.player.container.querySelector(".v-captions"),this.subtitleButton=this.player.container.querySelector(".v-subtitleButton"),this.subtitlesList=this.player.container.querySelector(".v-subtitlesList"),this.addEvents())}hideTracks(){this.tracks.forEach((t=>t.mode="hidden"))}render(){this.player.container.insertAdjacentHTML("beforeend",'<div class="v-captions"></div>');const t=this.player.container.querySelector(".v-volumeButton");t&&t.insertAdjacentHTML("beforebegin",`\n\t\t\t\t<div class="v-subtitle">\n\t\t\t\t\t<button class="v-subtitleButton v-controlButton v-pressed">\n\t\t\t\t\t\t<span class="v-controlButtonIcon v-iconSubtitleOn">${s.default}</span>\n\t\t\t\t\t\t<span class="v-controlButtonIcon v-iconSubtitleOff">${i.default}</span>\n\t\t\t\t\t</button>\n\t\t\t\t\t<div class="v-subtitlesList">\n\t\t\t\t\t\t<ul>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<button class="v-trackButton v-active" data-language="off">\n\t\t\t\t\t\t\t\t\t${n.default}Off\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t${this.tracks.map((t=>`<li>\n\t\t\t\t\t\t\t\t\t\t\t<button class="v-trackButton" data-language="${t.language}">\n\t\t\t\t\t\t\t\t\t\t\t\t${n.default}\n\t\t\t\t\t\t\t\t\t\t\t\t${t.label}\n\t\t\t\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t\t\t</li>`)).join(" ")}\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t`)}addEvents(){this.subtitleButton.addEventListener("click",this.onClickOnSubtitleButton),this.subtitlesList.addEventListener("click",this.onClickOnSubtitlesList)}onClickOnSubtitleButton(t){t.preventDefault(),this.subtitlesList.classList.toggle("v-active")}onClickOnSubtitlesList(t){t.preventDefault();const e=t.target,s=e.classList.contains("v-active"),i=this.subtitlesList.querySelector(".v-active"),n=e.getAttribute("data-language");!s&&this.subtitleButton.classList.contains("v-pressed")&&this.subtitleButton.classList.remove("v-pressed"),!s&&n&&"button"===e.nodeName.toLowerCase()&&(this.subtitlesList.classList.remove("v-active"),i&&i.classList.remove("v-active"),e.classList.add("v-active"),"off"!==n?(this.activeTrack=this.getTrackByLanguage(n),this.activeTrack&&this.updateCues()):(this.subtitleButton.classList.add("v-pressed"),this.captions.classList.remove("v-active"),this.captions.innerHTML="",this.activeTrack&&this.updateCues({isDisabled:!0})))}getTrackByLanguage(t){return this.tracks.find((e=>e.language===t))||null}updateCues({isDisabled:t=!1}={}){if(this.activeTrack&&this.activeTrack.cues&&this.activeTrack.cues.length){const e=Array.from(this.activeTrack.cues),s=this.activeTrack.activeCues,i=this,n=function(){i.addCue(this)},a=function(){i.hideCue(this)};e.forEach((e=>{e.onenter=t?null:n,e.onexit=t?null:a})),!t&&s&&s.length&&this.addCue(s[0])}}addCue(t){this.captions.innerHTML=t.text,this.captions.classList.add("v-active")}hideCue(){this.captions.classList.remove("v-active")}}}.apply(e,i))||(t.exports=n)},197:(t,e,s)=>{s.r(e)},967:t=>{t.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>'},270:t=>{t.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H6.83l8 8H20v2h-3.17l4.93 4.93c.15-.28.24-.59.24-.93V6c0-1.1-.9-2-2-2zM1.04 3.87l1.2 1.2C2.09 5.35 2 5.66 2 6v12c0 1.1.9 2 2 2h13.17l2.96 2.96 1.41-1.41L2.45 2.45 1.04 3.87zM8 12v2H4v-2h4zm6 4.83V18H4v-2h9.17l.83.83z"/></svg>'},62:t=>{t.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"/></svg>'}},e={};function s(i){var n=e[i];if(void 0!==n)return n.exports;var a=e[i]={exports:{}};return t[i](a,a.exports,s),a.exports}s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var i={};return(()=>{var t,e=i;e.default=void 0,s(197);var n=((t=s(583))&&t.__esModule?t:{default:t}).default;e.default=n})(),i=i.default})()}));