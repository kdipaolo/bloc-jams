var albumPicasso={name:"The Colors",artist:"Pablo Picasso",label:"Cubism",year:"1881",albumArtUrl:"/images/album-placeholder.png",songs:[{name:"Blue",length:"4:26",audioUrl:"/music/placeholders/blue"},{name:"Green",length:"3:14",audioUrl:"/music/placeholders/green"},{name:"Red",length:"5:01",audioUrl:"/music/placeholders/red"},{name:"Pink",length:"3:21",audioUrl:"/music/placeholders/pink"},{name:"Magenta",length:"2:15",audioUrl:"/music/placeholders/magenta"}]},blocJams=angular.module("BlocJams",["ui.router"]);blocJams.config(["$stateProvider","$locationProvider",function(l,e){e.html5Mode(!0),l.state("collection",{url:"/collection",controller:"Collection.controller",templateUrl:"/templates/collection.html"}),l.state("landing",{url:"/",controller:"Landing.controller",templateUrl:"/templates/landing.html"}),l.state("song",{url:"/song",templateUrl:"/templates/song.html"}),l.state("album",{url:"/album",templateUrl:"/templates/album.html",controller:"Album.controller"})}]),blocJams.controller("Landing.controller",["$scope",function(l){l.subText="Turn the music up!",l.subTextClicked=function(){l.subText+="!"},l.albumURLs=["/images/album-placeholders/album-1.jpg","/images/album-placeholders/album-2.jpg","/images/album-placeholders/album-3.jpg","/images/album-placeholders/album-4.jpg","/images/album-placeholders/album-5.jpg","/images/album-placeholders/album-6.jpg","/images/album-placeholders/album-7.jpg","/images/album-placeholders/album-8.jpg","/images/album-placeholders/album-9.jpg"]}]),blocJams.controller("Song.controller",["$scope",function(l){l.title="Song Template"}]),blocJams.controller("Collection.controller",["$scope","SongPlayer",function(l,e){l.albums=[];for(var o=0;33>o;o++)l.albums.push(angular.copy(albumPicasso));l.playAlbum=function(l){e.setSong(l,l.songs[0])}}]),blocJams.controller("Album.controller",["$scope","SongPlayer",function(l,e){l.album=angular.copy(albumPicasso);var o=null;l.onHoverSong=function(l){o=l,console.log("on")},l.offHoverSong=function(l){o=null,console.log("off")},l.getSongState=function(l){return l===e.currentSong&&e.playing?"playing":l===o?"hovered":"default"},l.playSong=function(o){e.setSong(l.album,o)},l.pauseSong=function(l){e.pause()}}]),blocJams.controller("PlayerBar.controller",["$scope","SongPlayer",function(l,e){l.songPlayer=e}]),blocJams.service("SongPlayer",function(){var l=null,e=function(l,e){return l.songs.indexOf(e)};return{currentSong:null,currentAlbum:null,playing:!1,play:function(){this.playing=!0,l.play()},pause:function(){this.playing=!1,l.pause()},next:function(){var l=e(this.currentAlbum,this.currentSong);l++,l>=this.currentAlbum.songs.length&&(l=0);var o=this.currentAlbum.songs[l];this.setSong(this.currentAlbum,o)},previous:function(){var l=e(this.currentAlbum,this.currentSong);l--,0>l&&(l=this.currentAlbum.songs.length-1);var o=this.currentAlbum.songs[l];this.setSong(this.currentAlbum,o)},setSong:function(e,o){l&&l.stop(),this.currentAlbum=e,this.currentSong=o,l=new buzz.sound(o.audioUrl,{formats:["mp3"],preload:!0}),this.play()}}});