const express = require('express');
const router = express.Router();
const request = require('request');
const dotenv = require('dotenv');
const querystring = require('node:querystring');
dotenv.config();

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

module.exports = router; 
const redirect_url = 'http://localhost:8888/auth/callback';
global.access_token='';
router.get('/login',(req,res)=>{
    var state = Math.random().toString(36).substring(2,18);
    var scope = 'streaming user-read-private user-read-email playlist-read-private playlist-modify-private';
    //res.send("Login function");
    res.redirect('https://accounts.spotify.com/authorize?'+
    querystring.stringify({
        response_type:'code',
        client_id:client_id,
        scope:scope,
        redirect_uri:redirect_url,
        state:state
    }));
})
//var access_token;
router.get('/callback',async(req,res)=>{
    var code = req.query.code || null;
    var state = req.query.state || null; 
    if(state=== null){
        res.redirect('/#'+
            querystring.stringify({
                error:'state_mismatch'
            })
        );
    }else{
        var authOptions = {
            url:'https://accounts.spotify.com/api/token',
            form:{
                code:code,
                redirect_uri:redirect_url,
                grant_type: 'authorization_code'
            },
            headers:{
                'content-type':'application/x-www-form-urlencoded',
                'Authorization': 'Basic '+(new Buffer.from(client_id + ':'+client_secret).toString('base64'))
            },
            json:true
        };

        request.post(authOptions,function(error,response,body){
            ref = req.header('Referer') || '/';
            access_token = body.access_token;
            res.redirect(ref);
        })
    }
})
router.get('/token',async(req,res)=>{
    let token = access_token;
    access_token='';
    res.json({
        access_token:token
    })
})