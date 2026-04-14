window.onload = initialize;
const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
let player = null;

function parseYoutubeCommand(input) {
    // 1. 명령어 (문장 맨 앞 단어)
    const commandMatch = input.trim().match(/^\S+/);
    const command = commandMatch ? commandMatch[0] : null;

    // 2. URL 추출
    const urlMatch = input.match(/https?:\/\/\S+/);
    const url = urlMatch ? urlMatch[0] : null;

    // 3. Video ID 추출 (youtube 전용)
    let videoId = null;
    if (url) {
        const idMatch = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        videoId = idMatch ? idMatch[1] : null;
    }

    return {
        command : command, url : url, ID : videoId
    }
}

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
        videoId: '',
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            extensionSdk.broadcast.listen((action, message, sender) => {
                if (action === "addVideo") {
                    player.loadVideoById(message);
                    player.playvideo();
                }
            });
            break;
        case YT.PlayerState.unstarted:
            extensionSdk.broadcast.send("getFirstVideo", null);
            break;
    }

}

function stopVideo() {
    player.stopVideo();
}

extensionSdk.handleInitialization((authInfo, broadInfo, playerInfo) => {
    extensionSdk.chat.send(
        "MESSAGE",
        "Singwith 노래 플레이어 서비스가 시작되었습니다",
    );
    extensionSdk.chat.listen((action, message) => {
        let messageString = message.message;
        switch (action) {
            case "MESSAGE":
                if (messageString.startsWith("!노래")) {
                    let {command, url, ID} = parseYoutubeCommand(messageString.substr(messageString.indexOf(" ") + 1))
                    switch (command) {
                        case "일시정지":
                            if (message.userId !== authInfo.userid) return;
                            if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                                player.pauseVideo();
                            }
                            break;
                        case "재생":
                            if (message.userId !== authInfo.userid) return;
                            if (player.getPlayerState() === YT.PlayerState.PAUSED) {
                                player.playVideo();
                            }
                            break;
                        case "곡 정보":
                            extensionSdk.chat.send(
                                "MESSAGE",
                                `현재 재생 중인 곡: ${player.getVideoData().title} (https://www.youtube.com/watch?v=${player.getVideoData().video_id})`
                            )
                    }
                }
                break;
        }
    });
    extensionSdk.broadcast.listen((action, message, sender) => {
        switch (action) {
            case "addVideo":
                addVideo(message);
                break;
            case "removeVideo":
                if (player.getVideoData().video_id === message) {
                    player.stopVideo();
                }
                break;
        }

    });

    function addVideo(videoId) {
        if (player.getPlayerState === 0) {
            player.loadVideoById(videoId);
            if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
                player.play();
            }
        }
    }
});