var express = require('express');
var jwt = require('./index');

var noMiddleware = new jwt(process.env.secret,"X-Access-Token","1m", null, null);
var middleware = new jwt(process.env.secret,"X-Access-Token","1m",function(req,res,payload){ payload({some:"payload"}) },function(req, payload, next){ req.custom = payload; next();});

var app = express();

app.get('/noMiddleware/issue',noMiddleware.issue(),function(req,res){
    res.sendStatus(204);
});

app.get('/noMiddleware/verify',noMiddleware.verify(),function(req,res){
    res.sendStatus(204);
});

app.get('/middleware/issue',noMiddleware.issue(),function(req,res){
    res.sendStatus(204);
});

app.get('/middleware/verify',noMiddleware.verify(),function(req,res){
    res.sendStatus(204);
});

app.listen(3000);

module.exports = app;
