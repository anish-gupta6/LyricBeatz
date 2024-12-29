import React, { useEffect, useState } from 'react'
import './Main.css'
import { PiPlaylistBold, PiWaveformBold } from 'react-icons/pi'
import ThemeButton from '../ThemeButton/ThemeButton'
import SongList from '../songList/SongList'
import Player from '../player/Player'
import {useSongContext} from '../../../context/SongContext'

const Main = () => {
  const {states} = useSongContext();
  const {loading} = states;
  const [listVisible,setListVisible] = useState(false)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (listVisible && !event.target.closest('.player-list-cntnr')) {
        setListVisible(false);
      }
    };

    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, [listVisible]);
  return (
    <div>
      {loading?<div>loading</div>:(<>
      <nav className="player-top-nav">
        <div className="player-title"><img src='/Logo.png' alt="" style={{height:'30px',width:'30px'}}/> <span className='title1'>Lyric</span><span className='title2'>Beatz</span></div>
        <div className="theme-btn"><ThemeButton/></div>
      </nav>
      <section className="player-body">
        <div className={`player-list-cntnr ${listVisible?'active':''}`}>
          <SongList/>
        </div>
        <div className="player-main-cntnr">
          <Player/>
        </div>
      </section>
      <div className={`list-icon ${!listVisible?'active':''}`} onClick={()=>setListVisible(true)}>
        <PiPlaylistBold/>
      </div>
      </>)}
    </div>
  )
}

export default Main
