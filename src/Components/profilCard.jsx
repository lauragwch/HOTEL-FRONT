import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const ProfilCard = ({ profil }) => {
    const navigate = useNavigate();

    return (
      <Card style={{ width: "18rem", margin: "0 auto" }}>
      <Card.Body className="card-body-centered">
          <Card.Title>
              {profil.first_name} {profil.last_name}
          </Card.Title>
          <ul className="profil-details">
              <li data-label="Prénom :">{profil.first_name || "Non défini"}</li>
              <li data-label="Nom :">{profil.last_name || "Non défini"}</li>
              <li data-label="Email :">{profil.email || "Non défini"}</li>
              <li data-label="Téléphone :">{profil.phone || "Non défini"}</li>
          </ul>
          <Button
              variant="primary"
              onClick={() => navigate(`/edit/${profil.id_client}`)}
          >
              Modifier profil
          </Button>
      </Card.Body>
  </Card>
    );
};

export default ProfilCard;