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
router.get('/getTrackRecs',async(req,res)=>{
    // Todo: store topArtists and topTracks to db. 
    await SpotifyService.sleep(10000);
    var access_token = req.get("Authorization");
    
    // max of 5 total values can be sent to all of the three seeds. 
    // get track recs for recently played tracks, and artists separately 
    // get track recs for top artists and top tracks separately 
    // 
    const recentlyPlayed = await spotifyService.getRecentlyPlayedTracks(access_token);
    const topArtists = await spotifyService.getUserTopArtists(access_token);
    const topTracks = await spotifyService.getUserTopTracks(access_token);
    const recs = new Set();
    const getRecsAndAddToSet = async function(artist,genre,track_id) {
        //await SpotifyService.sleep(2500);
        let recentRecs = await spotifyService.getTrackRecs(access_token, artist,genre,
        track_id); 
        //console.log(recentRecs.body.seeds.length);
        if(recentRecs.body.tracks){
            recentRecs = recentRecs.body.tracks.map(item=>item.id);
            recentRecs.forEach(item=>recs.add(item));
        }
        else{
            console.log(recentRecs.body);
            //console.log(recentRecs.headers);
            if(recentRecs.headers['retry-after']){
                let retry_after = Number(recentRecs.headers['retry-after']);
                console.log(retry_after);
            
                //await SpotifyService.sleep(retry_after*1000);
                //await getRecsAndAddToSet(artist,genre,track_id);
            }
        }
    } 
    for(let i=0;i<recentlyPlayed.length;i++){
        
        let track_id = [];
        track_id.push(recentlyPlayed[i].track_id);
        let artist = [];
        //artist.push(recentlyPlayed[i].artists[0].artist_id);
        let genre = [];
        //genre.push(recentlyPlayed[i].artists[0].genres[0]);
        await getRecsAndAddToSet(artist,genre,track_id);
        // could try at least two tries to get diff tracks and increase the number of tracks  
        track_id = [];
        artist.push(recentlyPlayed[i].artists[0]);
        await getRecsAndAddToSet(artist,genre,track_id); 
    }
    console.log(recs.size);
    res.send(Array.from(recs)); 
})

