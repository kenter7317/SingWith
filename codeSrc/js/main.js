const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
const handleChatInfoReceived = (action, message) => {
    let messageString = message.message
    switch(action) {
		case 'MESSAGE' && messageString.startWith('!노래') :
            let command = messageString.substr(messageString.indexOf(" ") + 1);
		    let array = command.split(" ") // 0 : method, 1 : word or a YouTube link
            runMethod(array[0], array[1])
            break
	}
}
function searchAndAdd(arg) {

}
function runMethod(method, arg){
    switch (method){
        case '검색':{
            searchAndAdd(arg)
        break
        }
        case '재생':{
            if (isYoutubeLink(arg)){
                YoutubeLinkAdd(arg)
            } else {
                extensionSdk.chat.send('MESSAGE', '유튜브 링크가 아닙니다.');
            }
            break
        }

    }
}
function isYoutubeLink(arg){
    return !!(arg.startWith("https://www.youtube.com") || arg.startWith("https://youtu.be"));
}

function hasWaitList() {

    return false;
}
function YoutubeLinkAdd(link){
    let videoId = parseUrl(link)
    addVideo(videoId)
}
function addVideo(){
    player.cueVideoById(videoId, 0, 'large');
}
function parseUrl(url){
    let params = new URLSearchParams(url.search)
    return params.get("v")
}