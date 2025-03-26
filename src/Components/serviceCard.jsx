import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "../styles/roomCard.css";
import blanchisserie from "../assets/blanchisserie.jpg";
import locationvelo from "../assets/locationvelo.jpeg";
import navette from "../assets/navette.jpg";
import petitdej from "../assets/petitdej.jpg";
import spa from "../assets/spa.jpg";
import wifi from "../assets/wifi.jpg";
import servicesService from "../Services/servicesService";

const ServiceCard = ({ service, reservationId }) => {
    const handleAddService = async () => {
        if (!reservationId) {
            alert("Aucune réservation sélectionnée.");
            return;
        }
        try {
            // Vérifiez l'ID du service dans la console pour déboguer
            console.log("Ajout du service ID:", service.id_service);
            await servicesService.addServiceToReservation(reservationId, service.id_service);
            alert(`Service "${service.service_name}" ajouté à votre réservation !`);
        } catch (error) {
            console.error("Erreur lors de l'ajout du service:", error.response || error.message);
            alert("Erreur lors de l'ajout du service.");
        }
    };

    return (
        <Card style={{ width: '18rem' }}>
            {service.service_name === "Service de blanchisserie" && (
                <Card.Img
                    variant="top"
                    src={blanchisserie}
                    style={{ objectFit: "contain" }}
                    height={200}
                    width={200}
                />
            )}
            {service.service_name === "Location de vélo" && (
                <Card.Img
                    variant="top"
                    src={locationvelo}
                    style={{ objectFit: "contain" }}
                    height={200}
                    width={200}
                />
            )}
            {service.service_name === "Navette aéroport" && (
                <Card.Img
                    variant="top"
                    src={navette}
                    style={{ objectFit: "contain" }}
                    height={200}
                    width={200}
                />
            )}
            {service.service_name === "Petit-déjeuner buffet" && (
                <Card.Img
                    variant="top"
                    src={petitdej}
                    style={{ objectFit: "contain" }}
                    height={200}
                    width={200}
                />
            )}
            {service.service_name === "Accès au spa" && (
                <Card.Img
                    variant="top"
                    src={spa}
                    style={{ objectFit: "contain" }}
                    height={200}
                    width={200}
                />
            )}
            {service.service_name === "Wifi" && (
                <Card.Img
                    variant="top"
                    src={wifi}
                    style={{ objectFit: "contain" }}
                    height={200}
                    width={200}
                />
            )}
            <Card.Body>
                <Card.Title>{service.service_name}</Card.Title>
                <Card.Text>
                    
                        <li>{service.description}</li>
                        <li>{service.price}€</li>
                    
                </Card.Text>
                
            </Card.Body>
        </Card>
    );
};

export default ServiceCard;