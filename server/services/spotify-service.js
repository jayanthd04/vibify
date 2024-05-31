const request = require('request');
class SpotifyService{
    async getNewlyCreatedPlaylist(userId,playlistName,accessToken){
        var options ={
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
        let resp;
        await new Promise((resolve,reject)=>{
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
        }); 
        return resp;
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
            var options ={
                url:'https://api.spotify.com/v1/tracks?ids='+paramString,
                headers:{'Authorization': 'Bearer '+access_token},
                json:true
            }
            await new Promise((resolve,reject)=>{
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
            })
        }
        return resp;
    }
    async addSongsToPlaylist(playlistId,songUris,access_token){
        var options = {
           url: 'https://api.spotify.com/v1/playlists/'+playlistId+'/tracks',
           headers: {'Authorization': 'Bearer '+access_token},
           body:songUris,
           json:true
        };
        let resp;
        await new Promise((resolve,reject)=>{
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
        })
        return resp;
    }
    async getUserProfile(access_token){
        var options ={
            url:'https://api.spotify.com/v1/me',
            headers:{'Authorization': 'Bearer '+access_token
            },
            json:true
        }
        let resp; 
        await new Promise((resolve,reject)=>{
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
        })
        return resp;
    }
    async getUserTopTracks(access_token){
        var options = {
            url: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
            headers: {'Authorization': 'Bearer '+access_token
            },
            json:true
        }
        let resp; 
        await new Promise((resolve,reject)=>{
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
        })
        return resp; 
    }
    async getUserTopArtists(access_token){
        var options = {
            url: 'https://api.spotify.com/v1/me/top/artists?limit=50',
            headers: {'Authorization': 'Bearer '+access_token
            },
            json:true
        }
        let resp;
        await new Promise((resolve, reject)=>{
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

        })
        return resp;
    }
}
module.exports = SpotifyService;
