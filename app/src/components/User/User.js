import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import {useSearchParams} from 'react-router-dom';
import {useCookies} from 'react-cookie';
import Slider from 'rc-slider'
import Flexbox from 'flexbox-react';
//import {HexColorPicker} from 'react-colorful';
import {useState,useEffect} from 'react';
export default function User(){
	const [accessParams,setAccessParams] = useSearchParams();
	const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [valence,setValence] = useState(50);
    const [energy,setEnergy] = useState(50);
    const [songs,setSongs] = useState([]);
    const [songUris, setSongUris] = useState([]);
    const [username,setUsername] = useState("");
    const [numSongs,setNumSongs] = useState("");
    const [playlistName,setPlaylistName] = useState("");
    const [playlistId,setPlaylistId] = useState("");
    const api = process.env.REACT_APP_api_url;
    
    setCookie("access_token",accessParams.get('access_token'),{sameSite:'strict',path:"/",secure:"True"});
    useEffect(()=>{
        let val = valence/100;
        let ener = energy/100;
        axios.get(api+'/v1/vibify/getSongsByValence&Energy/'+val+'/'+ener).then((response)=>{
            setSongs(response.data.map(item=>item.track_id));
        },(error)=>{
            console.log(error);
        })

    },[valence,energy])
    
    useEffect(()=>{
        if(songUris.length>0){
            axios.post('http://localhost:8888/v1/spotify/addSongsToPlaylist/'+playlistId,{'uris':songUris},{
                headers:{
                    'Authorization':cookies.access_token
                },
            }).then((response)=>{
                console.log(response);
            },(error)=>{
                console.log(error);
            })
        }
    },[songUris])

    if(!cookies.user){
        axios.get('http://localhost:8888/v1/spotify/getUserProfile',{
            headers:{
                'Authorization':cookies.access_token
            }
        }).then((response)=>{
            var expDate = new Date(new Date().getTime()+(365*24*60*60*1000));
            setCookie("user",response.data,{sameSite:'strict',path:"/",expires:expDate});
            console.log(response.data);
        },(error)=>{
            console.log(error);
        })
    }
    const onChangeValence=(newVal)=>{
        setValence(newVal);
    };
    const onChangeEnergy=(newVal)=>{
        setEnergy(newVal);
    };
    const handleCreateClick=async()=>{
        let n = numSongs === "" ? 1 : Number(numSongs);
        // Shuffle songs 
        const shuffleSongs=()=>{
            let m = songs.length;
            while(m){
                const i = Math.floor(Math.random()*m--);
                [songs[m],songs[i]] = [songs[i],songs[m]];
            }
            return songs;
        }
        shuffleSongs();
        // get the first n songs from songs
        let playlistSongs = songs.slice(0,n);
        // create new playlist 
        let playName = playlistName ===""? "Awesome Mix": playlistName;
        axios.get('http://localhost:8888/v1/spotify/getNewlyCreatedPlaylist/'+cookies.user+'/'+playName,{
            headers:{
                'Authorization':cookies.access_token
            }
        }).then((response)=>{
            setPlaylistId(response.data.body.id)
            console.log(response.data.body);
        },(error)=>{
            console.log(error);
        })


        // do get requests to get the track uris for the
        // n songs
        let paramString=playlistSongs[0];
        for(let i=1;i<playlistSongs.length;i++){
            paramString+=","+playlistSongs[i];
        }
        axios.get('http://localhost:8888/v1/spotify/getTrackUri/'+paramString,{
            headers:{
                'Authorization':cookies.access_token
            }
        }).then((response)=>{
            //console.log(response.data);
            //console.log(paramString.split(",").length);
            setSongUris(response.data.body.tracks.map(item=>item.uri));
        },(error)=>{
            console.log(error);
        })
    };
	return (
		<div className="wrapper">

			<header className="App-header">
				<Flexbox flexDirection="column" minHeight="100vh" justifyContent="space-between">
					<Flexbox element="header" padding="200px">
						<h1>How are you feeling right now?</h1> 
					</Flexbox>

                    <Flexbox flexGrow={2}>
                        <Flexbox flexDirection="row" minWidth="100vh" justifyContent="space-between">
						    <div>
                                <h4>Unpleasant</h4>
                            </div>

                            <Flexbox flexGrow={0.5}>
                                <Slider
                                value={valence} onChange={onChangeValence}
                                />
                            </Flexbox>

                            <div>
                                <h4>Pleasant</h4>
                            </div>

                        </Flexbox>
					</Flexbox>

                    <Flexbox flexGrow={5}>
                        <Flexbox flexDirection="row" minWidth="100vh" justifyContent="space-between"> 
                            <div>
                                <h4>Low Energy</h4>
                            </div>

                            <Flexbox flexGrow={0.5}>    
						        <Slider
                                value={energy} onChange={onChangeEnergy}
                                />
                            </Flexbox>

                            <div>
                                <h4>High Energy</h4>
                            </div>

                        </Flexbox>
					</Flexbox>
                    
                    <Flexbox flexGrow={1.5}>
                        <Flexbox flexDirection="row" minWidth="100vh" justifyContent="center">
                                <div>
                                    <input 
                                    placeholder="0"
                                    type="number" 
                                    size="3"
                                    value={numSongs}
                                    onChange={e=>setNumSongs(e.target.value)}
                                    />
                                </div>
                                <p> of {songs.length} songs</p>
                        </Flexbox>
                    </Flexbox>
                    <Flexbox flexGrow={1} justifyContent="center">
                        <div>
                            <input
                                placeholder="Awesome mix"
                                size="13"
                                type="string"
                                value={playlistName}
                                onChange={e=>setPlaylistName(e.target.value)}
                            />
                        </div>
                    </Flexbox>
                    <Flexbox flexGrow={0.8} justifyContent="center">
                        <Button variant="success"
                        onClick={handleCreateClick}>
                        Create New Playlist
                        </Button>
                    </Flexbox>

				</Flexbox>
			</header>
		</div>

	);


}
