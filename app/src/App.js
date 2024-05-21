import logo from './logo.svg';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import Home from './components/Home/Home'
import User from './components/User/User'
//import {CookiesProvider} from 'react-cookie';
function App() {
    
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
	            <Route path="/user/*" element={<User/>} />
	        </Routes>
	    </BrowserRouter>
	
  );

  
}

export default App;
