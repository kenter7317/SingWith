const handleChatInfoReceived = (action, message) => {
    let messageString = message.message	
    switch(action) {
		case 'MESSAGE' && messageString.startWith('!노래') :
            let command = messageString.substr(original.indexOf(" ") + 1);
		    let array = command.split(" ") // 0 : method, 1 : word or a youtube link
            runMethod(array[0], array[1])
            break
	}
}

function runMethod(method, arg){
    switch (method){
        case '검색':{
            searchAndAdd(arg)
        }
        case '재생' && isYoutubeLink(arg):{
            YoutubeLinkAdd(arg)
        }

    }
}

function isYoutubeLink(arg){
    if (arg.startWith("https://www.youtube.com")|| arg.startWith("https://youtu.be") ){
        return true;
    }else {
        return false;
    }
}

function YoutubeLinkAdd(link){
    if (hasWaitList()){
        addVideo(link)
    }else{
        playVideo(link)
    }
}

function addVideo(){
    
}

function playVideo(){
    
}