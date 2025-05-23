import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import "patterns-ui/styles/main.css";
import "./App.css";
import "./index.css";

import Launcher from './routes/launcher/main';
import Preferences from './routes/preferences/main';
import Apps from './routes/apps/main';
import Loading from './routes/loading/main';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/launcher" />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/launcher" element={<Launcher />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/apps" element={<Apps />} />
      </Routes>
    </Router>
  );
};

export default App;