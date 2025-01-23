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
    if (event.data === 0) {
        fetch('./streamer_screen.html').then(
            response => response.text()
        ).then(
            data =>{
                let parser = new DOMParser();
                let doc = parser.parseFromString(data, "text/html");
                let list = doc.getElementById('component-list')
                let video = list.getElementsByClassName('video')[0]
                player.loadVideoById(video.getElementsByClassName("id")[0].innerText, 5, "large")
                window.postMessage({
                    action: 'REMOVE_VIDEO',
                    userId: video.getElementsByClassName("UserId")[0].id
                }, '*' )
            }
        ).catch(
            error => console.error(error)
        )
    }
}

function stopVideo() {
    player.stopVideo();
}