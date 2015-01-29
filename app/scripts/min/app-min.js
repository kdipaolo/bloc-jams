var albumPicasso={name:"The Colors",artist:"Pablo Picasso",label:"Cubism",year:"1881",albumArtUrl:"/images/album-placeholder.png",songs:[{name:"Blue",length:163.38,audioUrl:"/music/placeholders/blue"},{name:"Green",length:105.66,audioUrl:"/music/placeholders/green"},{name:"Red",length:270.14,audioUrl:"/music/placeholders/red"},{name:"Pink",length:154.81,audioUrl:"/music/placeholders/pink"},{name:"Magenta",length:375.92,audioUrl:"/music/placeholders/magenta"}]},blocJams=angular.module("BlocJams",["ui.router"]);blocJams.config(["$stateProvider","$locationProvider",function(e,l){l.html5Mode(!0),e.state("collection",{url:"/collection",controller:"Collection.controller",templateUrl:"/templates/collection.html"}),e.state("landing",{url:"/",controller:"Landing.controller",templateUrl:"/templates/landing.html"}),e.state("song",{url:"/song",templateUrl:"/templates/song.html"}),e.state("album",{url:"/album",templateUrl:"/templates/album.html",controller:"Album.controller"})}]),blocJams.controller("Landing.controller",["$scope",function(e){e.subText="Turn the music up!",e.subTextClicked=function(){e.subText+="!"},e.albumURLs=["/images/album-placeholders/album-1.jpg","/images/album-placeholders/album-2.jpg","/images/album-placeholders/album-3.jpg","/images/album-placeholders/album-4.jpg","/images/album-placeholders/album-5.jpg","/images/album-placeholders/album-6.jpg","/images/album-placeholders/album-7.jpg","/images/album-placeholders/album-8.jpg","/images/album-placeholders/album-9.jpg"]}]),blocJams.controller("Song.controller",["$scope",function(e){e.title="Song Template"}]),blocJams.controller("Collection.controller",["$scope","SongPlayer",function(e,l){e.albums=[];for(var n=0;33>n;n++)e.albums.push(angular.copy(albumPicasso));e.playAlbum=function(e){l.setSong(e,e.songs[0])}}]),blocJams.controller("Album.controller",["$scope","SongPlayer",function(e,l){e.album=angular.copy(albumPicasso);var n=null;e.onHoverSong=function(e){n=e,console.log("on")},e.offHoverSong=function(e){n=null,console.log("off")},e.getSongState=function(e){return e===l.currentSong&&l.playing?"playing":e===n?"hovered":"default"},e.playSong=function(n){l.setSong(e.album,n)},e.pauseSong=function(e){l.pause()}}]),blocJams.controller("PlayerBar.controller",["$scope","SongPlayer",function(e,l){e.songPlayer=l}]),blocJams.service("SongPlayer",function(){var e=null,l=function(e,l){return e.songs.indexOf(l)};return{currentSong:null,currentAlbum:null,playing:!1,play:function(){this.playing=!0,e.play()},pause:function(){this.playing=!1,e.pause()},next:function(){var e=l(this.currentAlbum,this.currentSong);e++,e>=this.currentAlbum.songs.length&&(e=0);var n=this.currentAlbum.songs[e];this.setSong(this.currentAlbum,n)},previous:function(){var e=l(this.currentAlbum,this.currentSong);e--,0>e&&(e=this.currentAlbum.songs.length-1);var n=this.currentAlbum.songs[e];this.setSong(this.currentAlbum,n)},seek:function(l){e&&e.setTime(l)},setSong:function(l,n){e&&e.stop(),this.currentAlbum=l,this.currentSong=n,e=new buzz.sound(n.audioUrl,{formats:["mp3"],preload:!0}),this.play()}}}),blocJams.directive("slider",["$document",function(e){var l=function(e,l){var n=l.pageX-e.offset().left,o=e.width(),t=n/o;return t=Math.max(0,t),t=Math.min(1,t)},n=function(e,l){return"number"==typeof e?e:"undefined"==typeof e?l:"string"==typeof e?Number(e):void 0};return{templateUrl:"/templates/directives/slider.html",replace:!0,restrict:"E",scope:{onChange:"&"},link:function(o,t,a){o.value=0,o.max=100;var u=$(t);console.log(a),a.$observe("value",function(e){o.value=n(e,0)}),a.$observe("max",function(e){o.max=n(e,100)||100});var r=function(){var e=o.value||0,l=o.max||100;return percent=e/l*100,percent+"%"};o.fillStyle=function(){return{width:r()}},o.thumbStyle=function(){return{left:r()}},o.onClickSlider=function(e){var n=l(u,e);o.value=n*o.max,notifyCallback(o.value)},o.trackThumb=function(){e.bind("mousemove.thumb",function(e){var t=l(u,e);o.$apply(function(){o.value=t*o.max,n(o.value)})}),e.bind("mouseup.thumb",function(){e.unbind("mousemove.thumb"),e.unbind("mouseup.thumb")});var n=function(e){"function"==typeof o.onChange&&o.onChange({value:e})}}}}}]);