import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../styles/roomCard.css";
import simple from "../assets/simple.jpg";
import double from "../assets/double.jpg";
import suite from "../assets/suite.jpg";
import reservationPage from "../Pages/reservationPage";
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Fonction pour gérer le clic sur "Réserver"
  const handleReserveClick = () => {
    console.log(room);
    navigate(`/booking/${room.id_room}`); // Redirige vers la page de réservation avec l'ID de la chambre
  };

  return (
    <Card style={{ width: '18rem' }}>
      {room.room_type === "suite" && <Card.Img variant="top" src={suite} styles={{ objectFit: "contain" }} height={200} width={200} />}
      {room.room_type === "double" && <Card.Img variant="top" src={double} styles={{ objectFit: "contain" }} height={200} width={200} />}
      {room.room_type === "simple" && <Card.Img variant="top" src={simple} styles={{ objectFit: "contain" }} height={200} width={200} />}

      <Card.Body>
        <Card.Title>{room.room_number}</Card.Title>
        <Card.Text>

          <li>Type de chambre : {room.room_type}</li>
          <li>Prix par nuit : {room.price_per_night}</li>
          <li>Capacité : {room.capacity}</li>
          <li>Disponibilité : {room.status}</li>



        </Card.Text>
        <Button variant="primary" onClick={handleReserveClick}>Réserver</Button>
      </Card.Body>
    </Card>
  );
}

export default RoomCard;