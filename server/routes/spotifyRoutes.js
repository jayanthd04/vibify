const express = require('express');
const querystring = require('node:querystring');
const dotenv = require('dotenv');
const request = require('request');
const VibifyService = require('../services/vibify-service');
const SpotifyService = require('../services/spotify-service');
const vibifyService = new VibifyService();
const spotifyService = new SpotifyService();
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
	request.post(authOptions,function(error,response,body){
		//res.write(response.body.access_token,'utf8',()=>{
		//});
		//res.redirect('http://localhost:3000/');
        ref = req.header('Referer');

        console.log(ref);
		//res.redirect('/')
        res.redirect(303,'http://localhost:3000/user/?'+querystring.stringify(response.body));
		//res.json(response.body)
	})
	//res.json(authOptions);
     }
})

router.get('/getUserProfile',async(req,res)=>{
    // use user access token that is aquired after letting user authorize using spotify data. 
    var access_token = req.get("Authorization");
    const resp = await spotifyService.getUserProfile(access_token);
    res.send(resp);

})
router.post('/createNewPlaylistWithNsongsGivenValence&Energy/:valence/:energy/:n/:user_id/:playlist_name',async (req,res)=>{
    var valence = Number(req.params.valence);
    var energy = Number(req.params.energy); 
    var n = Number(req.params.n);
    var user_id = req.params.user_id; 
    var playlist_name = req.params.playlist_name; 
    var access_token = req.get("Authorization");
    const songs = await vibifyService.getNRandomSongsGivenValenceAndEnergy(valence,energy,n);
    const songIds = songs.map(item=>item.track_id);
    console.log(songIds);

    // create playlist with name playlist_name and get playlist_id
    const playlistId = await spotifyService.getNewlyCreatedPlaylist(user_id,playlist_name,access_token);
    console.log(playlistId);
    //res.send(playlistId);
    
    // get track uris for songIds 
    const songUris=await spotifyService.getTrackUris(songIds,access_token);
    console.log(songUris.length);
    //res.send(songUris);
    // add track uris to playlist
    const resp =await spotifyService.addSongsToPlaylist(playlistId,songUris,access_token);
    //console.log(resp);
    res.send(resp);
})
