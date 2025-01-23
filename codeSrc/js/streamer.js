const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const handleChatInfoReceived = (action, message) => {
    let messageString = message.message
    switch (action) {
        case 'MESSAGE' && messageString.startWith('!노래') :
            let command = messageString.substr(messageString.indexOf(" ") + 1);
            let array = command.split(" ") // 0 : method, 1 : word or a YouTube link
            runMethod(array[0], array[1], message)
            break
    }
}
extensionSdk.chat.listen(handleChatInfoReceived);
function runMethod(method, arg, message){
    switch (method) {
        case '재생': {
            if (isYoutubeLink(arg)) {
                YoutubeLinkAdd(arg, message)
            } else {
                extensionSdk.chat.send('MESSAGE', '유튜브 링크가 아닙니다.');
            }
            break
        }
    }
}

function isYoutubeLink(arg) {
    return !!(arg.startWith("https://www.youtube.com") || arg.startWith("https://youtu.be"));
}

function hasWaitList() {

    return false;
}

function YoutubeLinkAdd(link, message) {
    let videoId = parseUrl(link)
    addVideo(videoId, message)
}

function addVideo(videoId, message) {
    handlePostMessage(sendingMessage(videoId, message))
}

function sendingMessage(videoId, message){
    return {
        action: 'ADD_VIDEO',
        videoId: videoId,
        userId: message.userNickname,
        userName: message.userName
    }
}
function parseUrl(url) {
    let params = new URLSearchParams(url.search)
    return params.get("v")
}

function handlePostMessage(message) {
    let videoId = message.videoId;
    let userId = message.userId;
    let userName = message.userName;
    let newHtml = `
    <div class="video">
        <div class="id">${videoId}</div>
        <div class="UserId" id="${userId}">${userName}</div>               
    </div>
`;
// 특정 요소 선택 (예: class="target" 뒤에 삽입)
    let targetElements = document.getElementsByClassName("video")
    let targetElement = targetElements[targetElements.length - 1]
// targetElement 바로 뒤에 삽입
    if (targetElement) {
        targetElement.insertAdjacentHTML("afterend", newHtml);
    } else {
        console.error("Target element not found!");
    }
}