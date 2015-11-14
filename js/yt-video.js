/*
* This video is hosted on YT and is using the YT API to control functionality
*/

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe>(and YouTube player)
//after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
   player = new YT.Player('video-loop', {
    videoId: 'S0Txx9jTQVQ',
    height: 'auto',
    width: '100%',
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'autohide':0,
      'wmode':'transparent',
      'loop':1,
      'showinfo':0,
      'playlist':'S0Txx9jTQVQ',
      'modestbranding':1,
      'enablejsapi':1,
    },
      events: {
        'onReady': onPlayerReady
        //'onready': onPlayerReady
      }
  });
}


      // The API calls this function when the player's state changes.
      // The function indicates that when playing a video (state=1),
      // the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }

      // The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        player.setPlaybackQuality('hd720');
        // Only play the sound in the video when the user is on the intro page
        // Otherwise, pause the video
        if (window.location.pathname.substring(1) === 'intro' || window.location.pathname.substring(1) === '') {
          console.log('yes');
          event.target.playVideo()
        } else {
          console.log('no');
          event.target.pauseVideo()
        }
      }


    function init() {
      // Pause video when going to other sections
      $('.nav a').on('click', function() {
        if ($(this).hasClass('intro')) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      });
    }

    // Initalize the functions in the init
    init();




