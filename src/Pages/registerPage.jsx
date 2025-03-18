import React, { useState } from 'react';
import axios from 'axios';
import registerService from '../Services/registerService';
import '../Styles/register.css'; 
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (user.password === user.confirm_password) {
            const {first_name, last_name, phone, email, password} = user;
            const newUser = {first_name, last_name, phone, email, password};
      const response = await registerService.register(newUser); 
      console.log('Inscription réussie:', response.data);
      Navigate('/login');
    } else {
        alert('Les mots de passe ne correspondent pas');
    }
    } catch (error) {
      console.error('Erreur lors de l’inscription:', error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Inscription</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <input
              type="text"
              id="first_name" 
              name="first_name"
              value={user.first_name} 
              onChange={handleChange}
              required
            />
            <label htmlFor="first_name">Prénom</label>
          </div>

          <div className="form-group">
            <input
                type="text"
                id="last_name"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                required
            />
            <label htmlFor="last_name">Nom</label>
            </div>

            <div className="form-group">
            <input
              type="text"
              id="phone"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone">Téléphone</label>
            </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Mot de passe</label>
          </div>

            <div className="form-group">
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={user.confirm_password}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirm_password">Confirmer le mot de passe</label>
            </div>
                
          <button type="submit" className="register-btn">S'inscrire</button>
          <div className="login-link">
            <p>
              Déjà un compte ? <a href="/login">Se connecter</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

