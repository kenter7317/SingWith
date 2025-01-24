extensionSdk.handleInitialization((authInfo, broadInfo, playerInfo) => {
    extensionSdk.broadcast.listen((action, message, sender) => {
        if (!sender) {
            return;
        }
        switch (action) {
            case "request-current-game":
                sendMessage("current-game-whisper", current, sender);
                break;

            case "request-current-cover":
                sendCurrentCover(sender);
                break;
        }
    });

    extensionSdk.chat.listen((action, message) => {
        switch (action) {
            case "MESSAGE":
                if (current != null) {
                    if (message.message === "!게임") {
                        extensionSdk.chat.send(
                            "MESSAGE",
                            `게임: ${current.l || current.n}`
                        );
                    } else if (message.message === "!game") {
                        extensionSdk.chat.send("MESSAGE", `Game: ${current.n}`);
                    }
                }
                break;
        }
    });
});