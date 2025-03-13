import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/homePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImage from '../assets/accueilHotel.webp'; // Image de fond

const HomePage = () => {
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Nettoyage
  }, []);

  return (
    <>

      {/* Contenu principal */}
      <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="content">
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Bienvenue à l'Hôtel Park Avenue
          </motion.h1>
          <motion.p
            className="subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Découvrez l'élégance et le charme au cœur de Paris
          </motion.p>
          <motion.button
            className="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate('/chambres')}
          >
            Réserver Maintenant
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default HomePage;