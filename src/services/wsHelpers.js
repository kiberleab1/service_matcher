const MESSAGE_TYPES = {
    "PING": "ping",
    "LOCATIONS": "locations",
}
const handleWsMessages = (ws, message) => {
    const req = JSON.parse(message)
    const response = {}
    switch (req.message_type) {
        case MESSAGE_TYPES.PING:
            response.message_type = req.message_type;
            response.data = {
                "hello": "love"
            }
            break;
    }
    console.log(response);
    ws.send(JSON.stringify(response))
}

exports.handleWsMessages = handleWsMessages;
