import React, { useState, useRef, useEffect } from 'react';
import Controls from './Controls';
import Details from './Details';

const Player = (props) =>{
    const audioEl = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

     // Update current time and change progress bar color
     useEffect(() => {
        if (isPlaying) {
            audioEl.current.play();
        } else {
            audioEl.current.pause();
        }

        const updateTime = () => {
            setCurrentTime(audioEl.current.currentTime);
            if (audioEl.current.duration) {
                setDuration(audioEl.current.duration);
            }

            // Calculate percentage played
            const progressPercent = (audioEl.current.currentTime / audioEl.current.duration) * 100;

            // Update background gradient of the progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                progressBar.style.background = `linear-gradient(
                    to right,
                    #4caf50 ${progressPercent}%, /* Played portion in green */
                    #ddd ${progressPercent}%, /* Unplayed portion in gray */
                    #ddd 100%
                )`;
            }
        };

        audioEl.current.addEventListener('timeupdate', updateTime);

        // Clean up the event listener
        return () => {
            audioEl.current.removeEventListener('timeupdate', updateTime);
        };
    }, [isPlaying]);

    // Function to format time (seconds) into MM:SS format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Skip Song function
    const SkipSong = (forwards = true) => {
        if (forwards) {
            props.setCurrentSongIndex(() => {
                let temp = props.currentSongIndex;
                temp++;

                if (temp > props.songs.length - 1) {
                    temp = 0;
                }

                return temp;
            });
        } else {
            props.setCurrentSongIndex(() => {
                let temp = props.currentSongIndex;
                temp--;

                if (temp < 0) {
                    temp = props.songs.length - 1;
                }

                return temp;
            });
        }
    };

    // Handle progress bar change (user seeking through song)
    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * duration;
        audioEl.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    return (
        <div className="c-player">
            <audio src={props.songs[props.currentSongIndex].src} ref={audioEl}></audio>
            <h4>Playing now</h4>
            <Details song={props.songs[props.currentSongIndex]} />

            {/* Progress bar and time stamps */}
            <div className="progress-container">
                <span>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                />
                <span>{formatTime(duration)}</span>
            </div>

            <Controls isPlaying={isPlaying} setIsPlaying={setIsPlaying} SkipSong={SkipSong} />
            <p>Next up: <span>{props.songs[props.nextSongIndex].title} by {props.songs[props.nextSongIndex].artist}</span></p>
        </div>
    );
}

export default Player;
