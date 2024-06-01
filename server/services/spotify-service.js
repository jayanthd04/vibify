const request = require('request');
const querystring = require('node:querystring');
const postResponse = async function(options){
    let resp; 

    await new Promise((resolve,reject)=>{
        request.post(options,function(error,response,body){
            if(error){
                console.log(error);
                reject(error);
            }
            else{
                resp =response;
                resolve();
            }
        });
    });
    return resp;
};
const getResponse = async function(options){
    let resp; 
    await new Promise((resolve,reject)=>{
        request.get(options,function(error,response,body){
            if(error){
                console.log(error);
                reject(error);
            }
            else{
                resp = response; 
                resolve();
            }
        });
    });
    return resp; 
};
class SpotifyService{
    async getNewlyCreatedPlaylist(userId,playlistName,accessToken){
        let options ={
            url:'https://api.spotify.com/v1/users/'+userId+'/playlists',
            headers:{'Authorization': 'Bearer '+accessToken},
            body:{
                'name': playlistName,
                'description': playlistName+'.vib',
                'public':false
            },
            json:true
        }
        //var resp;
        let resp = await postResponse(options);
        /*await new Promise((resolve,reject)=>{
            request.post(options,function(error,response,body){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    resp = response.body.id;
                    //console.log(response.body);
                    resolve();
                }
            });
        });*/ 
        //return resp;
        return resp.body.id;
    }

    async getTrackUris(songIds,access_token){
        // max len of song ids is 50 
        let resp=[]; 
        let n = songIds.length;
        for(let i=0;i<n;i+=50){
            let j = Math.min(n,i+50);
            let split = songIds.slice(i,j);
            let paramString = split[0];
            for(let k=1;k<split.length;k++){
                paramString+=","+split[k];
            }
            let options ={
                url:'https://api.spotify.com/v1/tracks?ids='+paramString,
                headers:{'Authorization': 'Bearer '+access_token},
                json:true
            }
            /*await new Promise((resolve,reject)=>{
                request.get(options,function(error,response,body){
                    if(error){
                        console.log(error);
                        reject(error);
                    }
                    else{
                        //push response.body.tracks.map(item=>item.uri) to resp; 
                        let uris = response.body.tracks.map(item=>item.uri);
                        resp.push.apply(resp,uris);
                        //console.log(uris);
                        resolve();
                    }
                })
            })*/
            let r = await getResponse(options);
            let uris = r.body.tracks.map(item=>item.uri);
            resp.push.apply(resp,uris);
        }
        return resp;
    }
    async addSongsToPlaylist(playlistId,songUris,access_token){
        let options = {
           url: 'https://api.spotify.com/v1/playlists/'+playlistId+'/tracks',
           headers: {'Authorization': 'Bearer '+access_token},
           body:songUris,
           json:true
        };
        let resp = await postResponse(options);
        /*await new Promise((resolve,reject)=>{
            request.post(options,function(error,response,body){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    resp=response;
                    resolve();
                }
            })
        })*/
        return resp;
    }
    async getUserProfile(access_token){
        let options ={
            url:'https://api.spotify.com/v1/me',
            headers:{'Authorization': 'Bearer '+access_token
            },
            json:true
        }
        let resp = await getResponse(options); 
        /*await new Promise((resolve,reject)=>{
            request.get(options,function(error,response,body){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    resp=response.body.display_name;
                    resolve();
                }
            })
        })*/
        return resp.body.display_name;
    }
    async getUserTopTracks(access_token){
        let options = {
            url: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
            headers: {'Authorization': 'Bearer '+access_token
            },
            json:true
        }
        let resp = await getResponse(options); 
        /*await new Promise((resolve,reject)=>{
            request.get(options,function(error,response,body){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    resp=response;
                    resolve();
                }
            })
        })*/
        return resp; 
    }
    async getUserTopArtists(access_token){
        let options = {
            url: 'https://api.spotify.com/v1/me/top/artists?limit=50',
            headers: {'Authorization': 'Bearer '+access_token
            },
            json:true
        }
        let resp = await getResponse(options);
        /*await new Promise((resolve, reject)=>{
            request.get(options,function(error,response,body){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    resp=response;
                    resolve();
                }
            })

        })*/
        return resp;
    }
    async getRecentlyPlayedTracks(access_token){
        let time = Date.now();
        let options = {
            url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
            headers: {'Authorization': 'Bearer '+access_token
            },
            json:true
        };
        let resp = await getResponse(options); 
        /*await new Promise((resolve, reject)=>{
            request.get(options, )
        })*/
        return resp;
    }
    async getTrackRecs(access_token,seedArtists, seedGenres,seedTracks,
        valence,energy,numSongs){
        // seedArtists, seedGenres, and seedTracks are arrays 
        let artistString = seedArtists[0];
        for(let i=1;i<seedArtists.length;i++){
            artistString+=","+seedArtists[i];
        }
        let genreString=seedGenres[0];
        for(let i=1;i<seedGenres.length;i++){
            genreString+=","+seedGenres[i];
        }
        let trackString=seedTracks[0];
        for(let i=1;i<seedTracks.length;i++){
            trackString+=","+seedTracks[i];
        }
        let minValence=valence-0.01;
        let maxValence= valence+0.01;
        let minEnergy = energy-0.01;
        let maxEnergy = energy-0.01;
        let options = {
            url: 'https://api.spotify.com/v1/recommendations?'+querystring.stringify({
                seed_artists:artistString,
                seed_genres: genreString,
                seed_tracks: trackString,
                min_energy: minEnergy,
                max_energy: maxEnergy,
                min_valence: minValence,
                max_valence: maxValence
            }),
            headers:{'Authorization': 'Bearer '+access_token
            },
            json:true
        }
        let resp = await getResponse(options);

        return resp; 
    }
}
module.exports = SpotifyService;
