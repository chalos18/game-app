import React from 'react';
import './App.css';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";
import Navbar from "./components/NavBar";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";


function App() {
  // Use this if you want the user to be logged out when the app starts.
  // useEffect(() => {
  //   // Clear saved login details on app restart
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userId");
  // }, []);

  return (
    <div className="App">
      <Router>
        <ScrollToTop/>
        <Navbar/>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace/>}/>
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
