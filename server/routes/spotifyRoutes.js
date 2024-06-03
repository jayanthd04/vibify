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
router.get('/getUserTopTracks',async(req,res)=>{
    var access_token=req.get("Authorization");
    const resp = await spotifyService.getUserTopTracks(access_token); 
    res.send(resp)
})
router.get('/getUserTopArtists',async(req,res)=>{
    var access_token = req.get("Authorization");
    const resp = await spotifyService.getUserTopArtists(access_token);
    res.send(resp);
})
router.get('/getRecentlyPlayedTracks', async(req,res)=>{
    var access_token = req.get("Authorization");
    const resp = await spotifyService.getRecentlyPlayedTracks(access_token);
    res.send(resp);
})

/*
 * Spotify recommendations endpoint doesn't work with valence and energy 
 * can get user's top artists, tracks, and most recently played tracks 
 * use user's most recent tracks and top artists/tracks to get at least 
 * 100k track recs and store them into tracks table as well as their features 
 * if they are not already there 
 * add the new recommended tracks to user recs table for the user.
 * */
router.get('/getTrackRecs/:valence/:energy',async(req,res)=>{
    var access_token = req.get("Authorization");
    var valence = Number(req.params.valence);
    var energy = Number(req.params.energy);
    
    const shuffle = function(array){
        for(let i= array.length-1;i>0;i--){
            let rand = Math.floor(Math.random() * (i+1));
            [array[i],array[j]] = [array[j],array[i]];
        }
    }
    // max of 5 total values can be sent to all of the three seeds. 
    // get most recent tracks as well as their associated artists and genres 
    // get top artists and their genres 
    // get top tracks 
    const recentlyPlayed = spotifyService.getRecentlyPlayedTracks(access_token);
    const topArtists = spotifyService.getUserTopArtists(access_token);
    // can have a max of 5 seed artists, genres, and tracks 
    // maintain a unique set of genres 
    // pick 3 random tracks from recently played 

    // add the genres of the random recently played tracks to genres set 
    // and add track ids to seed tracks 
    // get 2 random artists from top artists and add their genres to genres set 
    // and add artists to seed artists 
    // add genres set to seed genres 
})

