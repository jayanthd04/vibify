const express = require('express');
const querystring = require('node:querystring');
const dotenv = require('dotenv');
const request = require('request');
const vibService = require('./vibifyRoutes.js');
dotenv.config();

const router = express.Router();
//const client_id = '780ab1210ec14978a9266b53a5760698';
const redirect_uri = 'http://localhost:8888/v1/spotify/callback';
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

module.exports = router; 

router.get('/login',(req,res)=>{
     var state = Math.random().toString(36).substring(2,18);
     //var state = generateRandomString(16);
     var scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private';
     res.redirect('https://accounts.spotify.com/authorize?'+
	     querystring.stringify({
		     response_type:'code',
		     client_id:client_id,
		     scope:scope,
		     redirect_uri:redirect_uri,
		     state:state
     }));
})
router.get('/callback', async (req,res)=>{
     var code = req.query.code || null;
     var state = req.query.state || null;
     if (state === null){
	res.redirect('/#'+
		querystring.stringify({
			error: 'state_mismatch'
	}));
     } else{
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code, 
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'Authorization': 'Basic ' + (new Buffer.from(client_id + ':'+ client_secret).toString('base64'))
		},
		json: true
	};
	request.post(authOptions,function(error,response){
		//res.write(response.body.access_token,'utf8',()=>{
		//});
		//res.redirect('http://localhost:3000/');
		res.redirect(303,'http://localhost:3000/user/?'+querystring.stringify(response.body));
		//res.json(response.body)
	})
	//res.json(authOptions);
     }
})

router.get('/getUserProfile',(req,res)=>{
    // use user access token that is aquired after letting user authorize using spotify data. 
    var access_token = req.get("Authorization");
    var options = {
	    url:'https://api.spotify.com/v1/me',
	    headers:{'Authorization': 'Bearer '+access_token},
	    json: true
    };
    request.get(options, function(error,response,body){
	    if(!error && response.statusCode===200){
	    	res.send(response.body.display_name);
	    }
	    else{
		res.send({'error':'Invalid access token'});
	    }
    });

})
router.get('/getTrackUri/:id',(req,res)=>{
    //use app access token 
    var access_token = req.get("Authorization");
    var track_id = req.params.id;
    var options = {
	    url:'https://api.spotify.com/v1/tracks?ids='+track_id,
	    headers:{'Authorization': 'Bearer '+access_token},
	    json:true
    };
    request.get(options, function(error, response, body){
	    res.send(response);
    });

})
router.get('/getNewlyCreatedPlaylist/:user_id/:playlist_name',(req,res)=>{
    var access_token = req.get("Authorization");
    var user_id = req.params.user_id;
    var playlist_name= req.params.playlist_name;
    var options = {
	    url: 'https://api.spotify.com/v1/users/'+user_id+'/playlists',
	    headers:{'Authorization': 'Bearer '+access_token},
	    body:{
		    'name': playlist_name,
		    'description': playlist_name+'.vib',
		    'public':false
	    },
	    json:true
    }
    request.post(options,function(error,response,body){
	    res.send(response);
    })
})
router.post('/addSongsToPlaylist/:playlist_id',(req,res)=>{
     var access_token = req.get("Authorization");
     var playlist_id = req.params.playlist_id; 
     var body = req.body;
     //console.log(body)
     var options = {
	     url: 'https://api.spotify.com/v1/playlists/'+playlist_id+'/tracks',
	     headers:{'Authorization': 'Bearer '+access_token},
	     body:body,
	     json:true
     }
     //console.log(body);
     request.post(options,function(error,response,body){
	     res.send(response);
     })
})
