import { useParams } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import roomsService from "../Services/roomsService";
import servicesService from "../Services/servicesService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contextes/AuthContext";
import "../styles/bookingConfirmation.css";

const BookingConfirmation = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState({
        id_room: roomId,
        checkin_date: "",
        checkout_date: "",
        total_price: "",
    });
    const [tarifNuit, setTarifNuit] = useState(0);
    const [jours, setJours] = useState(0);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                console.log("Fetching room with ID:", roomId);
                const response = await roomsService.getRoomById(roomId);
                setRoom(response.data);
                setTarifNuit(parseFloat(response.data.price_per_night));
                setReservation((prev) => ({ ...prev, id_room: roomId }));
            } catch (error) {
                console.error("Erreur:", error.response || error.message);
                setError("Impossible de charger les détails de la chambre.");
            }
        };
        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await servicesService.getServices();
                const parsedServices = response.data.map((service) => ({
                    ...service,
                    price: parseFloat(service.price),
                }));
                setServices(parsedServices);
            } catch (error) {
                console.error("Erreur lors de la récupération des services:", error);
            }
        };
        fetchServices();
    }, []);

    const nbJours = () => {
        const date1 = new Date(reservation.checkin_date);
        const date2 = new Date(reservation.checkout_date);
        const diff = Math.abs(date2 - date1);
        setJours(Math.ceil(diff / (1000 * 60 * 60 * 24)) || 0);
    };

    useEffect(() => {
        nbJours();
    }, [reservation.checkin_date, reservation.checkout_date]);

    const calculatePrices = () => {
        const basePrice = parseFloat(tarifNuit) * jours;
        const servicesPrice = selectedServices.reduce((total, serviceId) => {
            const service = services.find((s) => s.id_service === serviceId);
            return total + (service ? parseFloat(service.price) : 0);
        }, 0);
        const totalPrice = basePrice + servicesPrice;
        return { basePrice, servicesPrice, totalPrice };
    };

    const handleChange = (e) => {
        setReservation({ ...reservation, [e.target.name]: e.target.value });
    };

    const handleServiceChange = (serviceId) => {
        setSelectedServices((prev) =>
            prev.includes(serviceId)
                ? prev.filter((id) => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reservation.checkin_date || !reservation.checkout_date || jours <= 0) {
            setError("Veuillez sélectionner des dates valides.");
            return;
        }
        if (!user) {
            setError("Utilisateur non connecté. Veuillez vous connecter.");
            return;
        }
    
        const { basePrice, servicesPrice, totalPrice } = calculatePrices();
        const reservationData = {
            id_client: user,
            id_room: reservation.id_room,
            checkin_date: reservation.checkin_date,
            checkout_date: reservation.checkout_date,
            basePrice,
            servicesPrice,
            total_price: totalPrice,
            selectedServices,
            allServices: services, // Passe tous les services pour l’affichage
        };
    
        navigate(`/payment/${roomId}`, { state: reservationData });
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!room) return <div className="loading-message">Chargement...</div>;

    return (
        <Container className="booking-confirmation-container">
            <h1>Confirmation de réservation</h1>
            <h3>Chambre numéro {room.room_number}</h3>
            <p>Prix: {room.price_per_night}€ / nuit</p>

            <form onSubmit={handleSubmit}>
                <div className="date-field">
                    <label>Date d'arrivée</label>
                    <input
                        type="date"
                        name="checkin_date"
                        value={reservation.checkin_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                    />
                </div>
                <div className="date-field">
                    <label>Date de départ</label>
                    <input
                        type="date"
                        name="checkout_date"
                        value={reservation.checkout_date}
                        onChange={handleChange}
                        min={
                            reservation.checkin_date ||
                            new Date().toISOString().split("T")[0]
                        }
                        required
                    />
                </div>

                {jours > 0 && (
                    <>
                        <h5>Ajouter des services</h5>
                            {services.map((service) => (
                                <Form.Check
                                    key={service.id_service}
                                    type="checkbox"
                                    id={`service-${service.id_service}`}
                                    label={`${service.service_name} (${service.price}€)`}
                                    checked={selectedServices.includes(service.id_service)}
                                    onChange={() => handleServiceChange(service.id_service)}
                                />
                            ))}
                      

                        <div className="cost-summary">
                            <p><strong>Coût de la réservation (sans services) :</strong> {calculatePrices().basePrice}€</p>
                            <p><strong>Coût des services :</strong> {calculatePrices().servicesPrice}€</p>
                            <p><strong>Coût total :</strong> {calculatePrices().totalPrice}€</p>
                        </div>
                    </>
                )}

                <Button variant="primary" type="submit">
                    Confirmer la réservation
                </Button>
            </form>
        </Container>
    );
};

export default BookingConfirmation;