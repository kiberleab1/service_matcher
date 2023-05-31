const jwt = require('jsonwebtoken');

const userSessions = require("../models/userSessions.model")


async function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    // TODO for development only 
    console.log(token)
    if (token == "dev") {
        next()
        return;
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const session = await userSessions.UserSessions.findOne({ where: { access_token: token } })
        if (payload.exp < Date.now() / 1000) {
            return res.status(401).json({ success: false, message: 'Token has expired' });
        }

        if (!session) {
            return res.status(401).json({ success: false, message: 'Token not found' })
        }
        req.user = payload;

        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

exports.authMiddleware = authMiddleware