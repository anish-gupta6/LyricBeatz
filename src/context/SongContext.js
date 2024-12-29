import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { allSongs } from '../components/songs/AllSongs';

const songContext = createContext(null);

const SongContext = ({ children }) => {
  const songRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedSongIndex, setSelectedSongIndex] = useState(JSON.parse(localStorage.getItem('selectedSongIndex')));
  const [selectedSong, setSelectedSong] = useState();
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [songList, setSongList] = useState(allSongs);
  const [playingFrom, setPlayingFrom] = useState(allSongs);
  const [listType, setListType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [darkMode,setDarkMode] = useState(JSON.parse(localStorage.getItem('dark')));

  const getFavSongs = () =>{
    const favSongs = JSON.parse(localStorage.getItem("favouriteSongs"));
    if(favSongs){
      setFavouriteSongs(favSongs)
    }
  }
  useEffect(() => {
    const song = JSON.parse(localStorage.getItem('selectedSong'));
    if (song ) {
      setSelectedSong(song);
      getFavSongs();
      setLoading(false);
    } else {
      localStorage.setItem('selectedSong', JSON.stringify(allSongs[0]));
      setSelectedSong(allSongs[0]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (listType === 'favourites') {
      setSongList(favouriteSongs);
    } else {
      setSongList(allSongs);
    }
  }, [listType,favouriteSongs]);

  const playSong = () => {
    if (songRef.current) {
        console.log('playing')
        songRef.current.play().then(() => setIsRotating(true)).catch(console.error);
    }
  };
  const pauseSong = () => {
    if (songRef.current) {
    console.log('paused')
        songRef.current.pause();
        setIsRotating(false);
    }
  };
  
  useEffect(() => {
    if (songRef.current && selectedSong) {
        const updateTime = () => {
        setCurrentTime(songRef.current.currentTime);
        if (songRef.current.duration) {
          setDuration(songRef.current.duration);
        }
      };
  
      songRef.current.addEventListener('timeupdate', updateTime);
      return () => {
        songRef.current.removeEventListener('timeupdate', updateTime);
      };
    }
  }, [songRef.current,currentTime, selectedSong]);

  useEffect(() => {
    if (songRef.current && selectedSong && isPlaying) {
      playSong();
    }
    if (songRef.current && selectedSong && !isPlaying) {
      pauseSong();
    }
  }, [isPlaying,selectedSong]);
  
  

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    songRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setIsPlaying(true)
  };


  const checkFavourite = (song) =>{
    return favouriteSongs.some(obj => obj.title === song.title);
    
  }

  const toggleFavourites = (song) => {
    const isPresent = checkFavourite(song);
    if(isPresent){
      const favSongs = favouriteSongs.filter((obj)=>obj.title !== song.title);
      setFavouriteSongs(favSongs)
      localStorage.setItem('favouriteSongs', JSON.stringify(favSongs));
    }
    else{
      const favSong = {
        title: song.title,
        artist: '<Unknown Artist>',
        src: song.src,
      };
      favouriteSongs.push(favSong);
      localStorage.setItem('favouriteSongs', JSON.stringify(favouriteSongs));
    }
    getFavSongs();
  };

  const handleSongSelect = (song, index) => {
    setSelectedSong(song);
    setSelectedSongIndex(index);
    setIsPlaying(true);
    localStorage.setItem('selectedSong', JSON.stringify(song));
    localStorage.setItem('selectedSongIndex', JSON.stringify(index));
    if(songList == allSongs){
      setPlayingFrom(allSongs)
    }
    else{
      setPlayingFrom(favouriteSongs)
    }
  };

  const skipForward = () =>{
    console.log(playingFrom)
    let temp = selectedSongIndex;
    setSelectedSongIndex(() => {
      temp++;

      if (temp > playingFrom.length - 1) {
          temp = 0;
      }

      return temp;
  });
  setIsPlaying(true)
  setSelectedSong(playingFrom[temp])
  localStorage.setItem('selectedSong', JSON.stringify(playingFrom[temp]));
  localStorage.setItem('selectedSongIndex', JSON.stringify(temp));
  playSong();
  }

  useEffect(() => {
    if (songRef.current && duration > 0 && currentTime === duration) {
      setTimeout(() => {
        skipForward();
        console.log('skip',selectedSongIndex)
      }, 500);
    }
  }, [currentTime, duration]);

  const skipBackward = () =>{
    console.log(playingFrom)
    let temp = selectedSongIndex;
    setSelectedSongIndex(() => {
      temp--;

      if (temp < 0) {
          temp = playingFrom.length - 1;
      }

      return temp;
  });
  setSelectedSong(playingFrom[temp])
  setIsPlaying(true)
  localStorage.setItem('selectedSong', JSON.stringify(playingFrom[temp]));
  localStorage.setItem('selectedSongIndex', JSON.stringify(temp));
  playSong();
  }

  const states = {
    songRef,
    isPlaying,
    currentTime,
    duration,
    selectedSong,
    isRotating,
    songList,
    listType,
    selectedSongIndex,
    loading,
    darkMode
  };
  const setStates = {
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setSelectedSong,
    setIsRotating,
    setSongList,
    setListType,
    setSelectedSongIndex,
    setDarkMode
  };
  const handlers = {
    formatTime,
    handleSeek,
    toggleFavourites,
    handleSongSelect,
    checkFavourite,
    skipForward,
    skipBackward
  };

  return (
    <songContext.Provider value={{ states, setStates, handlers }}>
      {children}
    </songContext.Provider>
  );
};

export default SongContext;
export const useSongContext = () => {
  return useContext(songContext);
};
