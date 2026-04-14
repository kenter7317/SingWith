const SDK = window.AFREECA.ext;
const extensionSdk = SDK();
//import { search } from 'https://cdn.skypack.dev/youtube-search-without-api-key';

window.addEventListener("message", (event) => {
  if (event.data === "REMOVE_FIRST_VIDEO") {
    let targetElements = document.getElementsByClassName("video");
    let targetElement = targetElements[0];
    targetElement.remove();
  }
});

extensionSdk.handleInitialization((authInfo, broadInfo, playerInfo) => {
  extensionSdk.chat.send(
    "MESSAGE",
    "Singwith 노래 등록 서비스가 시작되었습니다",
  );
  extensionSdk.chat.send(
    "MESSAGE",
    "안내 : !노래 재생 <Youtube 링크>를 통해 신청할 수 있습니다!",
  );
  extensionSdk.chat.listen((action, message) => {
    let messageString = message.message;
    switch (action) {
      case "MESSAGE":
        if (messageString.startsWith("!노래")) {
          let {command, url, ID}= parseYoutubeCommand(messageString.substr(messageString.indexOf(" ") + 1))
          extensionSdk.chat.send(
              "MESSAGE",
              "추가 : " + ID + "를 추가했습니다"
          );
          runMethod(command, url, message);
        }
        break;
    }
  });
  extensionSdk.broadcast.listen((action, message, sender) => {
    switch (action) {
      case "getFirstVideo":
          extensionSdk.broadcast.send("addVideo", getFirstVideo());
        break;
    }

  });

  function parseYoutubeCommand(input) {
    // 1. 명령어 (문장 맨 앞 단어)
    const commandMatch = input.trim().match(/^\S+/);
    const command = commandMatch ? commandMatch[0] : null;

    // 2. URL 추출
    const urlMatch = input.match(/https?:\/\/[^\s]+/);
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
      command,
      url,
      videoId
    };
  }
  function runMethod(method, arg, message) {
    switch (method) {
      case "재생": {
        if (isYoutubeLink(arg)) {
          YoutubeLinkAdd(arg, message);
        } else {
          extensionSdk.chat.send("MESSAGE", "유튜브 링크가 아닙니다.");
        }
        break;
      }
    }
  }

  function isYoutubeLink(arg) {
    return !(
      arg.startsWith("https://www.youtube.com") ||
      arg.startsWith("https://youtu.be")
    );
  }

  function YoutubeLinkAdd(link, message) {
    let videoId = parseUrl(link);
    addVideo(videoId, message);
  }

  function addVideo(videoId, message) {
    handlePostMessage(videoId, message);
    addElement(videoId, message);
  }
    function getFirstVideo() {
      let targetElements = document.getElementsByClassName("video");
      let targetElement = targetElements[0];
      if (targetElement) {
        targetElement.remove();
        return targetElement;
      }
      return null;
    }
  function addElement(videoId, message) {
    let userId = message.userId;
    let userName = message.userNickName;
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
  function parseUrl(url) {
    let params = new URLSearchParams(url.search);
    return params.get("v");
  }

  async function handlePostMessage(videoId, message) {
    let userId = message.userId;
    let userName = message.userNickName;
    const result = await search(videoId)

    extensionSdk.chat.send(
        "MESSAGE",
        result[0].title + " : " + videoId + "를 추가했습니다"
    );
  }
});
