import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../styles/roomCard.css";
import blanchisserie from "../assets/blanchisserie.jpg";
import locationvelo from "../assets/locationvelo.jpeg";
import navette from "../assets/navette.jpg";
import petitdej from "../assets/petitdej.jpg";
import spa from "../assets/spa.jpg";
import wifi from "../assets/wifi.jpg";

const ServiceCard = ({service}) => {
        
        return (
            <Card style={{ width: '18rem' }}>
            {service.service_name === "Service de blanchisserie" && <Card.Img variant="top" src= {blanchisserie} styles={{objectFit: "contain"}} height={200} width={200} /> }
            {service.service_name === "Location de vélo" && <Card.Img variant="top" src= {locationvelo} styles={{objectFit: "contain"}} height={200} width={200} /> }
            {service.service_name === "Navette aéroport" && <Card.Img variant="top" src= {navette} styles={{objectFit: "contain"}} height={200} width={200} /> }
            {service.service_name === "Petit-déjeuner buffet" && <Card.Img variant="top" src= {petitdej} styles={{objectFit: "contain"}} height={200} width={200} /> }
            {service.service_name === "Accès au spa" && <Card.Img variant="top" src= {spa} styles={{objectFit: "contain"}} height={200} width={200} /> }
            {service.service_name === "Wifi" && <Card.Img variant="top" src= {wifi} styles={{objectFit: "contain"}} height={200} width={200} /> }
        
            <Card.Body>
            <Card.Title>{service.service_name}</Card.Title>
            <Card.Text>
                
                <li>{service.description}</li>
                <li>{service.price}</li>
            </Card.Text>
            <Button variant="primary">Réserver</Button>
            </Card.Body>
        </Card>
        );
        }

        export default ServiceCard;