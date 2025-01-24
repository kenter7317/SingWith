const SDK = window.AFREECA.ext;
const extensionSdk = SDK();


window.addEventListener("message", (event) => {
    if (event.data === 'REMOVE_FIRST_VIDEO') {
        let targetElements = document.getElementsByClassName ("video");
        let targetElement = targetElements[0];
        targetElement.remove();
    }
});

extensionSdk.handleInitialization((authInfo, broadInfo, playerInfo) => {
    extensionSdk.chat.listen((action, message) => {
        let messageString = message.message
        switch (action) {
            case 'MESSAGE' :
                if (messageString.startsWith('!노래')) {
                    let command = messageString.substr(messageString.indexOf(" ") + 1);
                    let array = command.split(" "); // 0 : method, 1 : word or a YouTube link
                    runMethod(array[0], array[1], message);
                }
                break
        }
    });

    function runMethod(method, arg, message) {
        switch (method) {
            case '재생': {
                if (isYoutubeLink(arg)) {
                    YoutubeLinkAdd(arg, message);
                } else {
                    extensionSdk.chat.send('MESSAGE', '유튜브 링크가 아닙니다.');
                }
                break
            }
        }
    }

    function isYoutubeLink(arg) {
        return !!(arg.startsWith("https://www.youtube.com") || arg.startsWith("https://youtu.be"));
    }

    function YoutubeLinkAdd(link, message) {
        let videoId = parseUrl(link);
        addVideo(videoId, message);
    }

    function addVideo(videoId, message) {
        handlePostMessage(videoId, message)
    }



    function parseUrl(url) {
        let params = new URLSearchParams(url.search)
        return params.get("v")
    }

    function handlePostMessage(videoId, message) {
        let videoId = videoId
        let userId = message.userId;
        let userName = message.userName;
        let newHtml = `
    <div class="video">
        <div class="id">${videoId}</div>
        <div class="UserId" id="${userId}">${userName}</div>               
    </div>
`;
// 특정 요소 선택 (예: class="target" 뒤에 삽입)
        let targetElements = document.getElementsByClassName("video");
        let targetElement = targetElements[targetElements.length - 1];
// targetElement 바로 뒤에 삽입
        if (targetElement) {
            targetElement.insertAdjacentHTML("afterend", newHtml);
        } else {
            console.error("Target element not found!");
        }
    }

});

