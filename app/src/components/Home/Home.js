import React from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button'
import logo from '../../logo.svg';
export default function Home(){
	/*fetch('/').then(response=>{
		console.log(response.headers)
	})*/
	return (
		<div className="App"> 
			<header className="App-header"> 
				<img src={logo} className="App-logo" alt="logo"/>
				<p> 
		 		    Vibify is a Spotify companion app that can create a playlist based on your current mood
				</p>
				<a href="http://localhost:8888/v1/spotify/login">
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
