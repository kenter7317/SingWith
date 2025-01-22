// 2. This code loads the IFrame Player API code asynchronously.

window.onload = initialize;
function initialize() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
function onYouTubeIframeAPIReady() {
     player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}
function onPlayerStateChange(event) {
    if (event.data == 0) {
        stopVideo();
    }
}

function stopVideo() {
    player.stopVideo();
}
function addVideo(){
    player.cueVideoById('VIDEO_ID', 0, 'large');
}