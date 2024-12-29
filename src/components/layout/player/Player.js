import React, { useRef, useState } from 'react'
import { PiArrowsClockwise, PiHeart, PiHeartFill, PiMinus, PiMusicNotesFill, PiPauseFill, PiPlayFill, PiPlus, PiShuffle, PiSkipBackFill, PiSkipForwardFill, PiSpeakerHigh, PiSpeakerHighFill, PiSpeakerLow, PiSpeakerSimpleX, PiSpeakerX } from 'react-icons/pi'
import {useSongContext} from '../../../context/SongContext'
const Player = () => {
    const {states,setStates,handlers} = useSongContext();
    const {isPlaying,isRotating,songRef,selectedSong,duration,currentTime} = states;
    const {setIsPlaying,setCurrentTime} = setStates;
    const {formatTime,handleSeek,toggleFavourites,checkFavourite,skipForward,skipBackward} = handlers;
  const [rotationDeg, setRotationDeg] = useState(0); 
  const [currentVolume, setCurrentVolume] = useState(1); 
  const [isSpeakerOpen, setIsSpeakerOpen] = useState(false); 
  const maxVolume = 1;
  const thumbnailRef = useRef(null);

  const handleRotation = ()=>{
    if (isRotating) {
      const computedStyle = window.getComputedStyle(thumbnailRef.current);
      const matrix = computedStyle.transform;

      if (matrix !== "none") {
        const values = matrix.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI)); 
        setRotationDeg(angle);
      }
    }
}

const handlePlayPause = () => {
  if (songRef.current) {
    setIsPlaying((prev) => !prev);
    handleRotation();
  }
};

const handleReplay = () => {
  if (songRef.current) {
    songRef.current.currentTime = 0;
    setCurrentTime(0);
  }
}
const handleVolume = (e) => {
  const newVolume = Number(e.target.value);
  // const newVolume = Math.min(Math.max(inputVolume / 100, 0), 1);
  console.log(newVolume);
  songRef.current.volume = newVolume;
  setCurrentVolume(newVolume);
};


const increaseVolume = () => {
  let newVolume = currentVolume + 0.05;
  if (newVolume > 1) {
    newVolume = 1;
  }
  songRef.current.volume = newVolume;
  setCurrentVolume(newVolume);
}

const decreaseVolume = () => {
  let newVolume = currentVolume - 0.05;
  if (newVolume < 0) {
    newVolume = 0;
  }
  songRef.current.volume = newVolume;
  setCurrentVolume(newVolume);
}

  return (
    <div>
      <section className="player-all-wrapper">
        <div className="player-song-detail-wrapper">
            <div className="player-song-detail-cntnr">
                <div className="player-song-thumbnail">
                    <div className="selected-song-thumbnail" ref={thumbnailRef} style={{transform: `rotate(${rotationDeg}deg)`,animation: isRotating ? "play 2s linear infinite" : "none"}}>
                        <PiMusicNotesFill/></div>
                    </div>
                <div className="player-song-detail">
                    <div className="selected-song-title">{selectedSong.title}</div>
                    <div className="selected-song-artist">{selectedSong.artist}</div>
                </div>
            </div>
            <div className="player-song-option-cntnr">
                <button className="player-song-option" onClick={handleReplay}><PiArrowsClockwise/></button>
                <button className="player-song-option" onClick={()=>toggleFavourites(selectedSong)}>{checkFavourite(selectedSong)?<PiHeartFill style={{color:'#fb8500'}}/>:<PiHeart />}</button>
                <div className="player-song-speaker-option">
                  {isSpeakerOpen && <div className="player-song-speaker-level">
                    <button className="player-song-speaker-option" onClick={decreaseVolume}><PiMinus/></button>
                    <input type="range" className="volume-slider" min="0" max={maxVolume} step="0.05" value={currentVolume} onChange={handleVolume}/>
                    <button className="player-song-speaker-option" onClick={increaseVolume}><PiPlus/></button>
                    <div className="player-song-option" style={{fontSize:'16px'}}>{Math.floor((currentVolume/maxVolume)*100)}%</div>
                  </div>}
                  <button className={`player-song-option ${isSpeakerOpen?'active':''}`} onClick={()=>setIsSpeakerOpen(prev => !prev)}>{currentVolume === 0 ? <PiSpeakerX/> : currentVolume >=0.5? <PiSpeakerHigh/>: <PiSpeakerLow/>}</button>
                </div>
                
            </div>
        </div>
        <audio src={selectedSong?.src} ref={songRef} ></audio>
        <div className="player-control-wrapper">
            <div className="progress-container">
                <span className='music-timestamp'>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    className='song-range'
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                />
                <span className='music-timestamp'>{formatTime(duration)}</span>
            </div>
            <div className="player-control-btn-cntnr">
                <div className="control-btn prev-btn" onClick={skipBackward}><PiSkipBackFill/></div>
                <div className="control-btn play-pause-btn" onClick={handlePlayPause}>{isPlaying?<PiPauseFill/> :<PiPlayFill/>}</div>
                <div className="control-btn next-btn" onClick={skipForward}><PiSkipForwardFill /></div>
            </div>
        </div>
      </section>
    </div>
  )
}

export default Player
