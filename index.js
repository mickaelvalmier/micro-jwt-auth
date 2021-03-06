'use strict'
const url = require('url')
const jwt = require('jsonwebtoken')

module.exports = exports = (secret, whitelist) => (fn) => {
       
    if (!secret) {
        throw Error('micro-jwt-auth must be initialized passing a secret to decode incoming JWT token')
    }
    
    return (req, res) => {
        const bearerToken = req.headers.authorization
        const pathname = url.parse(req.url).pathname
        
        if (!(Array.isArray(whitelist) && whitelist.indexOf(pathname) !== -1)) {
            if (!bearerToken) {
                res.writeHead(401)
                res.end('missing Authorization header')
                return
            }
            
            try {
                const token = bearerToken.replace('Bearer ', '')
                req.jwt = jwt.verify(token, secret);
            } catch(err) {
                res.writeHead(401)
                res.end('invalid token in Authorization header')
                return
            }
        }
        
        return fn(req, res)
    }
}
