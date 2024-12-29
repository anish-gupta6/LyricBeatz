import React from 'react'
import { PiHeart, PiHeartFill, PiMusicNotesFill } from 'react-icons/pi';
import {useSongContext} from '../../../context/SongContext'

const SongList = () => {
    const {states,setStates,handlers} = useSongContext();
    const {songList,selectedSong,listType,selectedSongIndex} = states;
    const {setSelectedSong,setIsPlaying,setListType,setSelectedSongIndex} = setStates;
    const {handleSongSelect,toggleFavourites,checkFavourite} = handlers;
    
  
  return (
    <div className='song-list-main'>
        <div className="song-list-type">
            <div className={`song-list-item ${listType === 'all'?'active':''}`} onClick={()=>setListType('all')}>All</div>
            <div className={`song-list-item ${listType === 'favourites'?'active':''}`} onClick={()=>setListType('favourites')}>Favourites</div>
        </div>
      <section className="list-main-wrapper">
       {songList.length>0 ? (songList.map((song,index)=>(
        <div className={`song-item ${selectedSong.title === song.title?'active':''}`} key={index} >
            <div className="song-thumbnail" onClick={()=>handleSongSelect(song,index)}><PiMusicNotesFill/></div>
            <div className="song-detail" onClick={()=>handleSongSelect(song,index)}>
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
            </div>
            <div className="song-option">
              <div className="song-option-icon" onClick={()=>toggleFavourites(song)}>{checkFavourite(song)?<PiHeartFill style={{color:'#fb8500'}}/>:<PiHeart />}</div>
            </div>
        </div>))):''}
      </section>
    </div>
  )
}

export default SongList
