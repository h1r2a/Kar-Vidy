import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import './app.css';
import Estimate from './pages/estimator/Estimate';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Définition de la route pour la page Home */}
          <Route path="/" element={<Home />} />
          <Route path="/estimate" element={<Estimate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
