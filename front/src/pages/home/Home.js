import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import './home.css';

const Home = () => {
  const navigate = useNavigate(); // Utilisation du hook useNavigate

  const handleEstimateClick = () => {
    navigate('/estimate'); // Redirige vers la page /estimate
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="header">
        <div className="logo">KarVidy</div>
        <nav>
          <ul>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Section */}
      <div className="home-ct">
        <div className="overlay"></div>
        <div className="cta-ct">
          <h1>Welcome to KarVidy</h1>
          <p>We estimate the price of your car using Machine Learning and real-world datasets.</p>
          <button onClick={handleEstimateClick}>Estimate My Car</button> {/* Bouton avec la redirection */}
        </div>
      </div>
    </div>
  );
};

export default Home;
