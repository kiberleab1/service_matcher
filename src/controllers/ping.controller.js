function ping(req, res) {
    const { pingString } = req?.query;
    res.send(pingString)
}

exports.ping = ping;