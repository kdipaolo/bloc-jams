(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/album", function(exports, require, module) {
 // Example Album
 var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: '/images/album-placeholder.png',
   songs: [
       { name: 'Blue', length: '4:26' },
       { name: 'Green', length: '3:14' },
       { name: 'Red', length: '5:01' },
       { name: 'Pink', length: '3:21'},
       { name: 'Magenta', length: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
   name: 'The Telephone',
   artist: 'Guglielmo Marconi',
   label: 'EM',
   year: '1909',
   albumArtUrl: '/images/album-placeholder.png',
   songs: [
       { name: 'Hello, Operator?', length: '1:01' },
       { name: 'Ring, ring, ring', length: '5:01' },
       { name: 'Fits in your pocket', length: '3:21'},
       { name: 'Can you hear me now?', length: '3:14' },
       { name: 'Wrong phone number', length: '2:15'}
     ]
 };
 
var currentlyPlayingSong = null;

var createSongRow = function(songNumber, songName, songLength) {
   var template =
       '<tr>'
     + '  <td class="song-number col-md-1" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="col-md-9">' + songName + '</td>'
     + '  <td class="col-md-2">' + songLength + '</td>'
     + '</tr>'
     ;
 
   var $row = $(template);
 
 // Change from a song number to play button when the song isn't playing and we hover over the row.
   var onHover = function(event) {
     var songNumberCell = $(this).find('.song-number');
     var songNumber = songNumberCell.data('song-number');
    if (songNumber !== currentlyPlayingSong) {
      songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
    }
   };
  // Change from a play button to song number when the song isn't playing and we hover off the row.
   var offHover = function(event) {
     var songNumberCell = $(this).find('.song-number');
      if (songNumber !== currentlyPlayingSong) {
      songNumberCell.html(songNumber);
    }
   };

   // Toggle the play, pause, and song number based on the button clicked.
   var clickHandler = function(event) {
     var songNumber = $(this).data('song-number');
 
       if (currentlyPlayingSong !== null) {
       // Revert to song number for currently playing song because user started playing new song.
       var currentlyPlayingCell = $('.song-number[data-song-number="' + currentlyPlayingSong + '"]');
       currentlyPlayingCell.html(currentlyPlayingSong);
     }
 
     if (currentlyPlayingSong !== songNumber) {
       // Switch from Play -> Pause button to indicate new song is playing.
       $(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');
       currentlyPlayingSong = songNumber;
     }
     else if (currentlyPlayingSong === songNumber) {
       // Switch from Pause -> Play button to pause currently playing song.
       $(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
       currentlyPlayingSong = null;
     }
   };
 
    $row.find('.song-number').click(clickHandler);
   $row.hover(onHover, offHover);
   return $row;
 };
 


 var changeAlbumView = function(album) {
   // Update the album title
   var $albumTitle = $('.album-title');
   $albumTitle.text(album.name);
 
   // Update the album artist
   var $albumArtist = $('.album-artist');
   $albumArtist.text(album.artist);
 
   // Update the meta information
   var $albumMeta = $('.album-meta-info');
   $albumMeta.text(album.year + " on " + album.label);
 
   // Update the album image
   var $albumImage = $('.album-image img');
   $albumImage.attr('src', album.albumArtUrl);
 
   // Update the Song List
   var $songList = $(".album-song-listing");
   $songList.empty();
   var songs = album.songs;
   for (var i = 0; i < songs.length; i++) {
     var songData = songs[i];
     var $newRow = createSongRow(i + 1, songData.name, songData.length);
     $songList.append($newRow);
   }
 
 };



 var updateSeekPercentage = function($seekBar, event) {
   var barWidth = $seekBar.width();
   var offsetX = event.pageX - $seekBar.offset().left;
 
   var offsetXPercent = (offsetX  / barWidth) * 100;
   offsetXPercent = Math.max(0, offsetXPercent);
   offsetXPercent = Math.min(100, offsetXPercent);
 
   var percentageString = offsetXPercent + '%';
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
 }

 var setupSeekBars = function() {
 
   $seekBars = $('.player-bar .seek-bar');
   $seekBars.click(function(event) {
     updateSeekPercentage($(this), event);
   });
  
  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();
    $seekBar.addClass('no-animate');
 
    $(document).bind('mousemove.thumb', function(event){
      updateSeekPercentage($seekBar, event);
    });
 
    //cleanup
    $(document).bind('mouseup.thumb', function(){
      $seekBar.addClass('no-animate');
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
 
  });
 };


// This 'if' condition is used to prevent the jQuery modifications
// from happening on non-Album view pages.
//  - Use a regex to validate that the url has "/album" in its path.
if (document.URL.match(/\/album.html/)) {
 // Wait until the HTML is fully processed.
 $(document).ready(function() {
   changeAlbumView(albumPicasso)
   setupSeekBars();
 });
}
});

;require.register("scripts/app", function(exports, require, module) {
 //require('./landing');
 //require('./album');
 //require('./collection');
 //require('./profile');

 // Example album.
 var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: '/images/album-placeholder.png',

   songs: [
    { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
    { name: 'Green', length: 105.66 , audioUrl: '/music/placeholders/green' },
    { name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red' },
    { name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink' },
    { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
   ]
 };
 
 


 var blocJams = angular.module('BlocJams', ['ui.router']);



 blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);

   $stateProvider.state('collection', {
     url: '/collection',
     controller: 'Collection.controller',
     templateUrl: '/templates/collection.html'
   });

   $stateProvider.state('landing', {
     url: '/',
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   });

   $stateProvider.state('song', {
     url: '/song',
     templateUrl: '/templates/song.html'
   });

   $stateProvider.state('album', {
     url: '/album',
     templateUrl: '/templates/album.html',
     controller: 'Album.controller'
   });

 }]);


 blocJams.controller('Landing.controller', ['$scope', function($scope) {  
  $scope.subText = "Turn the music up!";

  $scope.subTextClicked = function() {
    $scope.subText += '!';
  };

  $scope.albumURLs = [
  '/images/album-placeholders/album-1.jpg',
  '/images/album-placeholders/album-2.jpg',
  '/images/album-placeholders/album-3.jpg',
  '/images/album-placeholders/album-4.jpg',
  '/images/album-placeholders/album-5.jpg',
  '/images/album-placeholders/album-6.jpg',
  '/images/album-placeholders/album-7.jpg',
  '/images/album-placeholders/album-8.jpg',
  '/images/album-placeholders/album-9.jpg'
  ];
}]);


 blocJams.controller('Song.controller', ['$scope', function($scope){
   $scope.title = "Song Template";
 }])

 blocJams.controller('Collection.controller', ['$scope','SongPlayer', function($scope, SongPlayer) {

   $scope.albums = [];

   for (var i = 0; i < 33; i++) {
     $scope.albums.push(angular.copy(albumPicasso));
   } 

   $scope.playAlbum = function(album){
     SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
   }
 }])

 blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
   $scope.album = angular.copy(albumPicasso);

   var hoveredSong = null;


   $scope.onHoverSong = function(song) {
     hoveredSong = song;
     console.log("on");
   };

   $scope.offHoverSong = function(song) {
     hoveredSong = null;
     console.log("off");
   };


   $scope.getSongState = function(song) {
    if (song === SongPlayer.currentSong && SongPlayer.playing) {
     return 'playing';
   }
   else if (song === hoveredSong) {
     return 'hovered';
   }
   return 'default';
 };

 $scope.playSong = function(song) {
  SongPlayer.setSong($scope.album, song);

};

$scope.pauseSong = function(song) {
  SongPlayer.pause();
};
}]);

 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
   $scope.songPlayer = SongPlayer;

 $scope.volumeClass = function() {
     return {
       'fa-volume-off': SongPlayer.volume == 0,
       'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0,
       'fa-volume-up': SongPlayer.volume > 70
     }
   }
 

  SongPlayer.onTimeUpdate(function(event, time){
     $scope.$apply(function(){
       $scope.playTime = time;
     });
   });
 

 }]);
 
 blocJams.service('SongPlayer', ['$rootScope', function($rootScope) {

   var currentSoundFile = null;

   var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
   };

   return {
     currentSong: null,
     currentAlbum: null,
     playing: false,
     volume: 90,


     play: function() {
       this.playing = true;
       currentSoundFile.play();
     },
     pause: function() {
       this.playing = false;
       currentSoundFile.pause();
     },
     next: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex++;
       if (currentTrackIndex >= this.currentAlbum.songs.length) {
         currentTrackIndex = 0;
       }
       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     },
     previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) {
         currentTrackIndex = this.currentAlbum.songs.length - 1;
       }

       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     },
      seek: function(time) {
       // Checks to make sure that a sound file is playing before seeking.
       if(currentSoundFile) {
         // Uses a Buzz method to set the time of the song.
         currentSoundFile.setTime(time);
       }
     },
       onTimeUpdate: function(callback) {
      return $rootScope.$on('sound:timeupdate', callback);
    },
    setVolume: function(volume) {
      if(currentSoundFile){
        currentSoundFile.setVolume(volume);
      }
      this.volume = volume;
    },
     setSong: function(album, song) {
       if (currentSoundFile) {
        currentSoundFile.stop();
      }
      this.currentAlbum = album;
      this.currentSong = song;

      currentSoundFile = new buzz.sound(song.audioUrl, {
        formats: [ "mp3" ],
        preload: true
      });

     currentSoundFile.setVolume(this.volume);

     currentSoundFile.bind('timeupdate', function(e){
        $rootScope.$broadcast('sound:timeupdate', this.getTime());
      });
  
      this.play();
    }
  };
}]);

 // blocJams.directive('clickme', function(){
 //  return {
 //    templateUrl: 'templates/directives/clickMe.html',
 //    replace: true,
 //    restrict: 'E',
 //    link: function(){

 //    }
 //  }
 // });


 blocJams.directive('slider', ['$document', function($document){



  // Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
  var calculateSliderPercentFromMouseEvent = function($slider, event) {
    var offsetX =  event.pageX - $slider.offset().left; // Distance from left
    var sliderWidth = $slider.width(); // Width of slider
    var offsetXPercent = (offsetX  / sliderWidth);
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(1, offsetXPercent);
    return offsetXPercent;
  };

    var numberFromValue = function(value, defaultValue) {
     if (typeof value === 'number') {
       return value;
     }
 
     if(typeof value === 'undefined') {
       return defaultValue;
     }
 
     if(typeof value === 'string') {
       return Number(value);
     }
   }
 

  return {
    templateUrl: '/templates/directives/slider.html',
    replace: true,
    restrict: 'E',
      scope: {
      onChange: '&'
    },

    link: function(scope, element, attributes) {
      // These values represent the progress into the song/volume bar, and its max value.
      // For now, we're supplying arbitrary initial and max values.
      scope.value = 0;
      scope.max = 100;
      var $seekBar = $(element);
      console.log(attributes);

      attributes.$observe('value', function(newValue) {
        scope.value = numberFromValue(newValue, 0);
      });
 
      attributes.$observe('max', function(newValue) {
        scope.max = numberFromValue(newValue, 100) || 100;
      });

      var percentString = function () {
        var value = scope.value || 0;
        var max = scope.max || 100;
        percent = value / max * 100;
        return percent + "%";
      };

      scope.fillStyle = function() {
        return {width: percentString()};
      };

      scope.thumbStyle = function() {
        return {left: percentString()};
      };

      scope.onClickSlider = function(event) {
        var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
        scope.value = percent * scope.max;
        notifyCallback(scope.value);
      };

      scope.trackThumb = function() {
        $document.bind('mousemove.thumb', function(event){
        var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
        scope.$apply(function(){
          scope.value = percent * scope.max;
          notifyCallback(scope.value);
        });
      });

      //cleanup
      $document.bind('mouseup.thumb', function(){
        $document.unbind('mousemove.thumb');
        $document.unbind('mouseup.thumb');
      });

       // Place this as the last function defined in the 'link' function of the directive.
       var notifyCallback = function(newValue) {
         if(typeof scope.onChange === 'function') {
           scope.onChange({value: newValue});
         }
       };

    }; //ends link function
  }}; //ends return

}]);

  blocJams.filter('timecode', function(){
   return function(seconds) {
     seconds = Number.parseFloat(seconds);
 
     // Returned when no time is provided.
     if (Number.isNaN(seconds)) {
       return '-:--';
     }
 
     // make it a whole number
     var wholeSeconds = Math.floor(seconds);
 
     var minutes = Math.floor(wholeSeconds / 60);
 
     remainingSeconds = wholeSeconds % 60;
 
     var output = minutes + ':';
 
     // zero pad seconds, so 9 seconds should be :09
     if (remainingSeconds < 10) {
       output += '0';
     }
 
     output += remainingSeconds;
 
     return output;
   }
 })
});

;require.register("scripts/collection", function(exports, require, module) {
 var buildAlbumThumbnail = function() {
    var template =
        '<div class="collection-album-container col-md-2">'
      + '  <div class="collection-album-image-container">'
      + '     <img src="/images/album-placeholder.png"/>'
      + ' </div>'
      + '  <div class="caption album-collection-info">'
      + '    <p>'
      + '      <a class="album-name" href="/album.html"> Album Name </a>'
      + '      <br/>'
      + '      <a href="/album.html"> Artist name </a>'
      + '      <br/>'
      + '      X songs'
      + '      <br/>'
      + '    </p>'
      + '  </div>'
      + '</div>';
 
   return $(template);
 };

 var updateCollectionView = function() {
   var $collection = $(".collection-container .row");
   $collection.empty();
 
   for (var i = 0; i < 33; i++) {
     var $newThumbnail = buildAlbumThumbnail();
     $collection.append($newThumbnail);
   }
   var onHover = function(event) {
     $(this).append(buildAlbumOverlay("/album.html"));
   };
        var offHover = function(event) {
    $(this).find('.collection-album-image-overlay').remove();
  };
      $collection.find('.collection-album-image-container').hover(onHover, offHover);
 };
 
 if (document.URL.match(/\/collection.html/)) {
  // Wait until the HTML is fully processed.
  $(document).ready(function() {
    // Your code goes here.
        updateCollectionView();

  });
}


// below the buildAlbumThumbnail function

  var buildAlbumOverlay = function(albumURL) {
    var template =
        '<div class="collection-album-image-overlay">'
      + '  <div class="collection-overlay-content">'
      + '    <a class="collection-overlay-button" href="' + albumURL + '">'
      + '      <i class="fa fa-play"></i>'
      + '    </a>'
      + '    &nbsp;'
      + '    <a class="collection-overlay-button">'
      + '      <i class="fa fa-plus"></i>'
      + '    </a>'
      + '  </div>'
      + '</div>'
      ;
    return $(template);
  };
});

;require.register("scripts/landing", function(exports, require, module) {
  $(document).ready(function() { 
    
    $('.hero-content h3').click(function(){
      var subText = $(this).text();
       $(this).text(subText + "!");
    });
 
   var onHoverAction = function(event) {
     console.log('Hover action triggered.');
     $(this).animate({'margin-top': '10px'});
   };
 
   var offHoverAction = function(event) {
     console.log('Off-hover action triggered.');
     $(this).animate({'margin-top': '0px'});
   };
 
    $('.selling-points .point').hover(onHoverAction, offHoverAction);
  });
});

;require.register("scripts/min/album-min", function(exports, require, module) {
var albumPicasso={name:"The Colors",artist:"Pablo Picasso",label:"Cubism",year:"1881",albumArtUrl:"/images/album-placeholder.png",songs:[{name:"Blue",length:"4:26"},{name:"Green",length:"3:14"},{name:"Red",length:"5:01"},{name:"Pink",length:"3:21"},{name:"Magenta",length:"2:15"}]},albumMarconi={name:"The Telephone",artist:"Guglielmo Marconi",label:"EM",year:"1909",albumArtUrl:"/images/album-placeholder.png",songs:[{name:"Hello, Operator?",length:"1:01"},{name:"Ring, ring, ring",length:"5:01"},{name:"Fits in your pocket",length:"3:21"},{name:"Can you hear me now?",length:"3:14"},{name:"Wrong phone number",length:"2:15"}]},currentlyPlayingSong=null,createSongRow=function(n,a,e){var t='<tr>  <td class="song-number col-md-1" data-song-number="'+n+'">'+n+'</td>  <td class="col-md-9">'+a+'</td>  <td class="col-md-2">'+e+"</td></tr>",l=$(t),r=function(n){var a=$(this).find(".song-number"),e=a.data("song-number");e!==currentlyPlayingSong&&a.html('<a class="album-song-button"><i class="fa fa-play"></i></a>')},u=function(a){var e=$(this).find(".song-number");n!==currentlyPlayingSong&&e.html(n)},o=function(n){var a=$(this).data("song-number");if(null!==currentlyPlayingSong){var e=$('.song-number[data-song-number="'+currentlyPlayingSong+'"]');e.html(currentlyPlayingSong)}currentlyPlayingSong!==a?($(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>'),currentlyPlayingSong=a):currentlyPlayingSong===a&&($(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>'),currentlyPlayingSong=null)};return l.find(".song-number").click(o),l.hover(r,u),l},changeAlbumView=function(n){var a=$(".album-title");a.text(n.name);var e=$(".album-artist");e.text(n.artist);var t=$(".album-meta-info");t.text(n.year+" on "+n.label);var l=$(".album-image img");l.attr("src",n.albumArtUrl);var r=$(".album-song-listing");r.empty();for(var u=n.songs,o=0;o<u.length;o++){var m=u[o],s=createSongRow(o+1,m.name,m.length);r.append(s)}},updateSeekPercentage=function(n,a){var e=n.width(),t=a.pageX-n.offset().left,l=t/e*100;l=Math.max(0,l),l=Math.min(100,l);var r=l+"%";n.find(".fill").width(r),n.find(".thumb").css({left:r})},setupSeekBars=function(){$seekBars=$(".player-bar .seek-bar"),$seekBars.click(function(n){updateSeekPercentage($(this),n)}),$seekBars.find(".thumb").mousedown(function(n){var a=$(this).parent();a.addClass("no-animate"),$(document).bind("mousemove.thumb",function(n){updateSeekPercentage(a,n)}),$(document).bind("mouseup.thumb",function(){a.addClass("no-animate"),$(document).unbind("mousemove.thumb"),$(document).unbind("mouseup.thumb")})})};document.URL.match(/\/album.html/)&&$(document).ready(function(){changeAlbumView(albumPicasso),setupSeekBars()});
});

;require.register("scripts/min/app-min", function(exports, require, module) {
var albumPicasso={name:"The Colors",artist:"Pablo Picasso",label:"Cubism",year:"1881",albumArtUrl:"/images/album-placeholder.png",songs:[{name:"Blue",length:163.38,audioUrl:"/music/placeholders/blue"},{name:"Green",length:105.66,audioUrl:"/music/placeholders/green"},{name:"Red",length:270.14,audioUrl:"/music/placeholders/red"},{name:"Pink",length:154.81,audioUrl:"/music/placeholders/pink"},{name:"Magenta",length:375.92,audioUrl:"/music/placeholders/magenta"}]},blocJams=angular.module("BlocJams",["ui.router"]);blocJams.config(["$stateProvider","$locationProvider",function(e,n){n.html5Mode(!0),e.state("collection",{url:"/collection",controller:"Collection.controller",templateUrl:"/templates/collection.html"}),e.state("landing",{url:"/",controller:"Landing.controller",templateUrl:"/templates/landing.html"}),e.state("song",{url:"/song",templateUrl:"/templates/song.html"}),e.state("album",{url:"/album",templateUrl:"/templates/album.html",controller:"Album.controller"})}]),blocJams.controller("Landing.controller",["$scope",function(e){e.subText="Turn the music up!",e.subTextClicked=function(){e.subText+="!"},e.albumURLs=["/images/album-placeholders/album-1.jpg","/images/album-placeholders/album-2.jpg","/images/album-placeholders/album-3.jpg","/images/album-placeholders/album-4.jpg","/images/album-placeholders/album-5.jpg","/images/album-placeholders/album-6.jpg","/images/album-placeholders/album-7.jpg","/images/album-placeholders/album-8.jpg","/images/album-placeholders/album-9.jpg"]}]),blocJams.controller("Song.controller",["$scope",function(e){e.title="Song Template"}]),blocJams.controller("Collection.controller",["$scope","SongPlayer",function(e,n){e.albums=[];for(var l=0;33>l;l++)e.albums.push(angular.copy(albumPicasso));e.playAlbum=function(e){n.setSong(e,e.songs[0])}}]),blocJams.controller("Album.controller",["$scope","SongPlayer",function(e,n){e.album=angular.copy(albumPicasso);var l=null;e.onHoverSong=function(e){l=e,console.log("on")},e.offHoverSong=function(e){l=null,console.log("off")},e.getSongState=function(e){return e===n.currentSong&&n.playing?"playing":e===l?"hovered":"default"},e.playSong=function(l){n.setSong(e.album,l)},e.pauseSong=function(e){n.pause()}}]),blocJams.controller("PlayerBar.controller",["$scope","SongPlayer",function(e,n){e.songPlayer=n,e.volumeClass=function(){return{"fa-volume-off":0==n.volume,"fa-volume-down":n.volume<=70&&n.volume>0,"fa-volume-up":n.volume>70}},n.onTimeUpdate(function(n,l){e.$apply(function(){e.playTime=l})})}]),blocJams.service("SongPlayer",["$rootScope",function(e){var n=null,l=function(e,n){return e.songs.indexOf(n)};return{currentSong:null,currentAlbum:null,playing:!1,volume:90,play:function(){this.playing=!0,n.play()},pause:function(){this.playing=!1,n.pause()},next:function(){var e=l(this.currentAlbum,this.currentSong);e++,e>=this.currentAlbum.songs.length&&(e=0);var n=this.currentAlbum.songs[e];this.setSong(this.currentAlbum,n)},previous:function(){var e=l(this.currentAlbum,this.currentSong);e--,0>e&&(e=this.currentAlbum.songs.length-1);var n=this.currentAlbum.songs[e];this.setSong(this.currentAlbum,n)},seek:function(e){n&&n.setTime(e)},onTimeUpdate:function(n){return e.$on("sound:timeupdate",n)},setVolume:function(e){n&&n.setVolume(e),this.volume=e},setSong:function(l,o){n&&n.stop(),this.currentAlbum=l,this.currentSong=o,n=new buzz.sound(o.audioUrl,{formats:["mp3"],preload:!0}),n.setVolume(this.volume),n.bind("timeupdate",function(n){e.$broadcast("sound:timeupdate",this.getTime())}),this.play()}}}]),blocJams.directive("slider",["$document",function(e){var n=function(e,n){var l=n.pageX-e.offset().left,o=e.width(),t=l/o;return t=Math.max(0,t),t=Math.min(1,t)},l=function(e,n){return"number"==typeof e?e:"undefined"==typeof e?n:"string"==typeof e?Number(e):void 0};return{templateUrl:"/templates/directives/slider.html",replace:!0,restrict:"E",scope:{onChange:"&"},link:function(o,t,u){o.value=0,o.max=100;var a=$(t);console.log(u),u.$observe("value",function(e){o.value=l(e,0)}),u.$observe("max",function(e){o.max=l(e,100)||100});var r=function(){var e=o.value||0,n=o.max||100;return percent=e/n*100,percent+"%"};o.fillStyle=function(){return{width:r()}},o.thumbStyle=function(){return{left:r()}},o.onClickSlider=function(e){var l=n(a,e);o.value=l*o.max,notifyCallback(o.value)},o.trackThumb=function(){e.bind("mousemove.thumb",function(e){var t=n(a,e);o.$apply(function(){o.value=t*o.max,l(o.value)})}),e.bind("mouseup.thumb",function(){e.unbind("mousemove.thumb"),e.unbind("mouseup.thumb")});var l=function(e){"function"==typeof o.onChange&&o.onChange({value:e})}}}}}]),blocJams.filter("timecode",function(){return function(e){if(e=Number.parseFloat(e),Number.isNaN(e))return"-:--";var n=Math.floor(e),l=Math.floor(n/60);remainingSeconds=n%60;var o=l+":";return 10>remainingSeconds&&(o+="0"),o+=remainingSeconds}});
});

;require.register("scripts/min/profile-min", function(exports, require, module) {
var tabsContainer=".user-profile-tabs-container",selectTabHandler=function(e){$tab=$(this),$(tabsContainer+" li").removeClass("active"),$tab.parent().addClass("active"),selectedTabName=$tab.attr("href"),console.log(selectedTabName),$(".tab-pane").addClass("hidden"),$(selectedTabName).removeClass("hidden"),e.preventDefault()};document.URL.match(/\/profile.html/)&&$(document).ready(function(){var e=$(tabsContainer+" a");e.click(selectTabHandler),e[0].click()});
});

;require.register("scripts/profile", function(exports, require, module) {
var tabsContainer = ".user-profile-tabs-container"
 var selectTabHandler = function(event) {
   $tab = $(this);
   $(tabsContainer + " li").removeClass('active');
   $tab.parent().addClass('active');
   selectedTabName = $tab.attr('href');
   console.log(selectedTabName);
   $(".tab-pane").addClass('hidden');
   $(selectedTabName).removeClass('hidden');
   event.preventDefault();
 };

 
 if (document.URL.match(/\/profile.html/)) {
   $(document).ready(function() {
     var $tabs = $(tabsContainer + " a");
     $tabs.click(selectTabHandler);
     $tabs[0].click();
   });
 }
});

;
//# sourceMappingURL=app.js.map