import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import './index.css';
import Intro from './pages/intro';
import Home from './pages/Home';
import Jroom from "./pages/Jroom";
import Croom from "./pages/Croom";

function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Intro />}></Route>
          <Route path = "/home" element = {<Home />}></Route>
          <Route path = "/Jroom" element = {<Jroom />}></Route>
          <Route path = "/Croom" element = {<Croom />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
