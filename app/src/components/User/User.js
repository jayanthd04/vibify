import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import {useSearchParams} from 'react-router-dom';
import Cookies from 'universal-cookie';
import Slider from 'rc-slider'
import Flexbox from 'flexbox-react';
import {useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';
import VibifySlider from '../VibifySlider/VibifySlider';
import VibifyInput from '../VibifyInput/VibifyInput';
import EmotionGraph from '../EmotionGraph/EmotionGraph.js';
import SpotifyPlayback from '../SpotifyPlayback/SpotifyPlayback';
export default function User(){
	const cookies = new Cookies();
    const sliderMax=1000;
    const navigate = useNavigate();
    const [valence,setValence] = useState(sliderMax/2);
    const [energy,setEnergy] = useState(sliderMax/2);
    const [songCount,setSongCount] = useState([]);
    const [username,setUsername] = useState("");
    const [numSongs,setNumSongs] = useState("");
    const [playlistName,setPlaylistName] = useState("");
    //const [access,setAccess] = useState("");
    //const api = process.env.REACT_APP_api_url;
    //const sliderMax=1000; 
    const data = [
        {
            id:'',
            x:valence/sliderMax,
            y:energy/sliderMax
        }
    ];

    useEffect(()=>{
        let val = valence/sliderMax;
        let ener = energy/sliderMax;
        axios.get('/api/v1/vibify/getSongCountForValence&Energy/'+val+'/'+ener).then((response)=>{
            setSongCount(response.data);
        },(error)=>{
            console.log(error);
        })

    },[valence,energy])

    useEffect(()=>{
        const cookieChangeListener = (name,value) =>{
            if(name.name==="access_token"&&!value){
                navigate('/');
            }
        }
        cookies.addChangeListener(cookieChangeListener);
    },[]);

    if(!cookies.get("user")){
        axios.get('/api/v1/spotify/getUserProfile',{
            headers:{
                'Authorization':cookies.get("access_token")
            }
        }).then((response)=>{
            var expDate = new Date(new Date().getTime()+(365*24*60*60*1000));
            cookies.set("user",response.data,{sameSite:'strict',path:"/",expires:expDate});
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
        let playName = playlistName ===""? "Awesome Mix": playlistName;
        let valen = valence/sliderMax;
        let energ = energy/sliderMax;

        axios.post('/api/v1/spotify/createNewPlaylistWithNsongsGivenValence&Energy/'+valen+'/'+energ+'/'+n+'/'+cookies.get("user")+'/'+playName,{},{
            headers:{
                'Authorization':cookies.get("access_token")
            }
        }).then((response)=>{
            console.log(response)
        },(error)=>{
            console.log(error);
        });
    };
	return (
		<div className="wrapper">

			<header className="App-header">
				<Flexbox flexDirection="column" minHeight="100vh" justifyContent="space-between">
					<Flexbox element="header" padding="50px" justifyContent="center">
						<h1>How are you feeling right now?</h1> 
					</Flexbox>
                    
                    <Flexbox flexGrow={1}>
                        <EmotionGraph data={data}/>
                    </Flexbox>
                    <Flexbox flexGrow={2}>
                        <VibifySlider
                            leftText="Unpleasant"
                            rightText="Pleasant"
                            sliderVal={valence}
                            callback={onChangeValence}
                            max={sliderMax}
                        />
					</Flexbox>

                    <Flexbox flexGrow={5}>
                        <VibifySlider
                            leftText="Low Energy"
                            rightText="High Energy"
                            sliderVal={energy}
                            callback={onChangeEnergy}
                            max={sliderMax}
                        />
					</Flexbox>
                    
                    <Flexbox flexGrow={1.5}>
                        <VibifyInput
                        placeholder="0"
                        type="number"
                        size="3"
                        value={numSongs}
                        onChange={e=>setNumSongs(e.target.value)}
                        text={`of ${songCount} songs`}
                        />
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
        {/*<Flexbox flexGrow={0.5}>
                        <SpotifyPlayback token={cookies.get("access_token")}/>
                    </Flexbox>*/} 

				</Flexbox>
			</header>
		</div>

	);


}
