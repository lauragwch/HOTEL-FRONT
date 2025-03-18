import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../Services/authService";
// import "../Styles/login.css"; // Import du CSS

const LoginPage = () => {
  const [user, setUser] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(user);
      console.log(response.data);
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
            value={user.email}
            name="email"
            onChange={handleChange}
          />
          <Form.Label>Email</Form.Label>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={user.password}
            name="password"
            onChange={handleChange}
          />
          <Form.Label>Password</Form.Label>
        </Form.Group>

        <Button variant="primary" type="submit">
          Se connecter
        </Button>
      </Form>

      <a href="/register" className="register-link">
        Nouveau ? Inscription
      </a>
    </Container>
  );
};

export default LoginPage;