import React, { useState } from "react";
import './ThemeButton.css'
import {useSongContext} from '../../../context/SongContext'

const ThemeButton = () => {
    const {states,setStates} = useSongContext();
    const {darkMode} = states;
    const {setDarkMode} = setStates;

    const handleTheme = () =>{
      setDarkMode((prev)=>!prev)
      localStorage.setItem('dark',JSON.stringify(!darkMode))
    }
  return (
    <div>
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={handleTheme}/>
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ThemeButton;
