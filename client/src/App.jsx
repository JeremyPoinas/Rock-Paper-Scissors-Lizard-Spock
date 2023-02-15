import {
  Routes, Route
} from 'react-router-dom';
import { EthProvider } from "./contexts/EthContext";
import Welcome from "./components/Welcome.jsx";
import StartGame from "./components/StartGame.jsx";
import OngoingGame from "./components/OngoingGame/index.jsx";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Welcome />
          <Routes>
              <Route path="/" element={<StartGame />} />
              <Route path="/game/:rpsAddress" element={<OngoingGame />} />
          </Routes>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
