import React, {useEffect,useState} from 'react';
import Button from 'react-bootstrap/Button'
import logo from '../../record.png';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
export default function Home(){
	/*fetch('/').then(response=>{
		console.log(response.headers)
	})*/
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [token,setToken]=useState('');
    useEffect(()=>{
        async function getToken(){
            const response = await fetch('/api/auth/token');
            const json = await response.json();
            setToken(json.access_token);
            //console.log(token);
        }
        getToken();
    },[]);
    useEffect(()=>{
        if(token!=''){
            cookies.set("access_token",token,{sameSite:'strict',path:"/",secure:"True"});
            console.log(token);
            navigate('/user');
        }
    },[token])
    //const api = process.env.REACT_APP_api_url;
    // create a state variable token that is initially set to ''
    // set token to response from /auth/token
    // create a new useEffect to set cookies.access_token to token 
    // if token is not an empty string and navigate to '/user'
	return (
		<div className="App"> 
			<header className="App-header"> 
				<img src={logo} className="App-logo" alt="logo"/>
				<p> 
		 		    Vibify is a Spotify companion app that can create a playlist based on your current mood
				</p>
                <a href='/api/auth/login'>
        {/*<a href={`${api}/auth/login`}>*/}
        {/*<a href={`${api}/v1/spotify/login`}>*/}
				<Button variant="primary"
				>Login</Button>
				</a>
			</header> 
		</div>
	);

}
function login(){
	//call our login api 
	var state = Math.random().toString(36).substring(2,18);
	//console.log(process.env.REACT_APP_client_id)
	const redirect_uri = 'http://localhost:3000/'
	var scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private';
	console.log(redirect_uri)
}
