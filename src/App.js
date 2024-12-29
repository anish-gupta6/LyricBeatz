import Main from './components/layout/main/Main';
import {useSongContext} from './context/SongContext'

function App() {
  const {states} = useSongContext();
  const {darkMode} = states;
  
  return (
    <div className={`App ${darkMode ? 'dark':'light'}`}>
      <Main/>
    </div>
  );
}

export default App;
