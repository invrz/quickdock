import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import "patterns-ui/styles/main.css";
import "./App.css";
import "./index.css";

import Launcher from './routes/launcher/main';
import Preferences from './routes/preferences/main';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/preferences" />} />
        <Route path="/launcher" element={<Launcher />} />
        <Route path="/preferences" element={<Preferences />} />
      </Routes>
    </Router>
  );
};

export default App;