import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/home/page';

import "patterns-ui/styles/main.css";
import "./App.css";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
