import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/navBar.css';

const NavBar = () => {

  const token = localStorage.getItem("authorization");
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Nettoyage
  }, []);

  const logout = () => {
    localStorage.removeItem("authorization");
    navigate("/login");
  }


  if (!token) {
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      className={scroll ? "navbar active" : "navbar"}
    >
      <Container>
        <Navbar.Brand onClick={() => navigate("/")}>Hotel Park Ave</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Accueil</Nav.Link>
            <Nav.Link onClick={() => navigate("/chambres")}>Chambres</Nav.Link>
            <Nav.Link onClick={() => navigate('/services')}>Services</Nav.Link>
            <Nav.Link onClick={() => navigate("/reservations")}>Réservations</Nav.Link>
            <Nav.Link onClick={() => navigate("/contact")}>Contact</Nav.Link>
          </Nav>
        
          <Nav.Link onClick={() => navigate("/login")}>Connexion</Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  } else {

    return (
      <Navbar
        collapseOnSelect
        expand="lg"
        fixed="top"
        className={scroll ? "navbar active" : "navbar"}
      >
        <Container>
          <Navbar.Brand onClick={() => navigate("/")}>Hotel Park Ave</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/")}>Accueil</Nav.Link>
              <Nav.Link onClick={() => navigate("/chambres")}>Chambres</Nav.Link>
              <Nav.Link onClick={() => navigate('/services')}>Services</Nav.Link>
              <Nav.Link onClick={() => navigate("/reservations")}>Réservations</Nav.Link>
              <Nav.Link onClick={() => navigate("/contact")}>Contact</Nav.Link>
            </Nav>

            <Nav.Link onClick={() => navigate("/profile")}>Profil</Nav.Link>
            <Nav.Link onClick={logout}>Déconnexion</Nav.Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
};

export default NavBar;