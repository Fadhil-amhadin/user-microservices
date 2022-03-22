const jwt = require('jsonwebtoken')
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const JWTSECRET = process.env.JWT_SECRET

const signToken = (payload:any) => {
    return jwt.sign(payload, JWTSECRET)
};

const verifyToken = (token:any) => {
    return jwt.verify(token, JWTSECRET)
};

export { signToken, verifyToken }