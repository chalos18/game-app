import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Games from "./components/Games";
import Game from "./components/Game";
import NotFound from "./components/NotFound";


function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Routes>
            <Route path="/games" element={<Games/>}/>
            <Route path="/games/:id" element={<Game/>}/>
            <Route path="/*" element={<NotFound/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
