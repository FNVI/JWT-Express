"use strict";
var jwt = require('jsonwebtoken');
/**
 * @class JWTExpress
 */
class JWTExpress {



/**
 * Constructor
 * 
 * @param {String} secret 
 * @param {String} header 
 * @param {String} expiresIn 
 * @param {getPayload} getPayload
 */
    constructor(secret,header,expiresIn, getPayload, postVerify){
        this.secret = secret;
        this.header = header;
        this.expiresIn = expiresIn;
        this.payloadMiddleware = getPayload || function(request, response, setPayload){ setPayload({user:"user",permissions:["something"]})};
        this.postVerify = postVerify || function(req, payload, next){ req.payload = payload; next();};
    }
/**
 * Function for getting the payload
 * 
 * @callback getPayload
 * @param {Object} request
 * @param {Object} response
 * @param {setPayload} setPayload
 */





/**
 * This is used to issue JWTs, the function should be called as express middleware
 */
    issue(){
        var secret = this.secret;
        var expiresIn = this.expiresIn;
        var header = this.header;
        var getPayload = this.payloadMiddleware;

        return function(req, res, next){
            getPayload(req, res, function(payload){
                console.log(payload);
                var token = jwt.sign(payload,secret,{expiresIn:expiresIn});
                res.header(header,token);
                next();
            });
        };
    }

/**
 * This is used to verify JWTs, the function should be called as express middleware
 */
    verify(){ 
        var header = this.header.toLowerCase();
        var secret = this.secret;
        var postVerify = this.postVerify;

        return function(req, res, next){
            var token = req.headers[header];
            if(token){
                jwt.verify(token, secret, function(err,decoded){
                    if(err){
                        console.log(err);
                        res.status(401).json({message:"not authorised"});
                    }
                    else
                    {
                        postVerify(req, decoded, next);
                    }
                });
            }
            else
            {
                res.status(403).json({message:"not authenticated"});
            }
        }
    }

/**
 * This function checks the permissions in the request against those required for the route
 * @param {String[]} permissions 
 */
    permissions(permissions = []){
        return function(req,res,next){
            permissions.reduce((acc,val) => req.permissions.indexOf(val) > -1 ? true : false, true) ? next() : res.status(401).json({message:"not authorised"});
        }
    }

}

module.exports = JWTExpress;