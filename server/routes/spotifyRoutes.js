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
