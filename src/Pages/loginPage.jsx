import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Services/authService";
// import "../Styles/login.css"; // Import du CSS
import AuthContext from "../Contextes/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


const LoginPage = () => {
  const [currentUser, setCurrentUser] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  const { setIsConnected, setRole, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(currentUser);
      const data = jwtDecode(response.data.token);
      axios.defaults.headers['Authorization'] = 'Bearer ' + response.data.token;
      console.log(data);
      setRole(data.role);
      setUser({
        id: data.id,
        email: data.email,
        role: data.role,
        nom: data.nom,
        prenom: data.prenom,
      })
      setIsConnected(true);
      navigate("/");
      const token = response.data.token;
      localStorage.setItem("authorization", token);
      navigate("/");
      // Ajoutez une redirection ou un message de succès ici
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={currentUser.email}
            name="email"
            onChange={handleChange}
          />
          <Form.Label>Email</Form.Label>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={currentUser.password}
            name="password"
            onChange={handleChange}
          />
          <Form.Label>Password</Form.Label>
        </Form.Group>

        <Button variant="primary" type="submit">
          Se connecter
        </Button>
      </Form>

      <Button
        variant="link"
        onClick={() => navigate("/forgot-password")}
        className="w-100 text-center"
      >
        Mot de passe oublié ?
      </Button>

      <a href="/register" className="register-link">
        Nouveau ? Inscription
      </a>
    </Container>
  );
};

export default LoginPage;