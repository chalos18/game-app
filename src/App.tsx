import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import Navbar from "./components/NavBar";
import Profile from "./pages/Profile";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <div>
          <Routes>
            <Route path="/home" element={<Home/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/games/:id" element={<GamePage/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
