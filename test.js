var express = require('express');
var bodyParser = require('body-parser');
var JWTExpress = require('./index');
var app = express();
app.use(bodyParser.json());
var security = new JWTExpress("secretsentence","X-Access-Token","1d",function(req, res, setPayload){
        setPayload({user:req.user,permissions:req.permissions});
},function(req,payload, next){
    req.user = payload.user;
    req.permissions = payload.permissions;
    next();
});

var security2 = new JWTExpress("othersecret","X-Refresh-Token","1d",function(req,res,setPayload){
    if(req.body.password == "password"){
        req.user = {username:req.body.username};
        req.permissions = ["create","edit"];
        setPayload({id:1});
    }
    else
    {
        res.status(401).json({message:"unauthorised"});
    }
},function(req, payload, next){
    req.user = {username:"joe"};
    req.permissions = ["create","edit"];
    next();
});


app.post('/issue',security2.issue(),security.issue(),function(req,res){
    res.sendStatus(204);
});

app.get('/refresh',security2.verify(),security.issue(),function(req,res){
    res.sendStatus(204);
});

app.use('/',security.verify());

app.get('/verify',function(req,res){
    res.json({message:"success??", user:req.user,permissions:req.permissions});
});

app.get('/permissions',security.permissions(["create","edit"]),function(req,res){
    res.json({message:"success?",user:req.user,permissions:req.permissions});
});

app.listen(3000);