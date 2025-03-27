import { useParams } from "react-router-dom";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import roomsService from "../Services/roomsService";
import servicesService from "../Services/servicesService";
import reservationsService from "../Services/reservationsService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contextes/AuthContext";
import DatePicker from "react-datepicker"; // Ajout de react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Style du calendrier
import "../styles/bookingConfirmation.css";

const BookingConfirmation = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState({
        id_room: roomId,
        checkin_date: null, // Changé en null pour DatePicker
        checkout_date: null, // Changé en null pour DatePicker
        total_price: "",
    });
    const [tarifNuit, setTarifNuit] = useState(0);
    const [jours, setJours] = useState(0);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [existingReservations, setExistingReservations] = useState([]);
    const { user } = useContext(AuthContext);

    // Charger les détails de la chambre
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                console.log("Fetching room with ID:", roomId);
                const response = await roomsService.getRoomById(roomId);
                setRoom(response.data);
                setTarifNuit(parseFloat(response.data.price_per_night) || 0);
                setReservation((prev) => ({ ...prev, id_room: roomId }));
            } catch (error) {
                console.error("Erreur:", error.response || error.message);
                setError("Impossible de charger les détails de la chambre.");
            }
        };
        fetchRoom();
    }, [roomId]);

    // Charger les services
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

    // Charger les réservations existantes
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await reservationsService.getReservations();
                setExistingReservations(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des réservations:", error);
                setError("Erreur lors de la vérification des disponibilités.");
            }
        };
        fetchReservations();
    }, []);

    // Calculer le nombre de jours
    const nbJours = () => {
        if (reservation.checkin_date && reservation.checkout_date) {
            const date1 = new Date(reservation.checkin_date);
            const date2 = new Date(reservation.checkout_date);
            const diff = Math.abs(date2 - date1);
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 0;
            setJours(days);
            return days;
        }
        return 0;
    };

    useEffect(() => {
        nbJours();
    }, [reservation.checkin_date, reservation.checkout_date]);

    // Calculer les prix
    const calculatePrices = () => {
        const basePrice = parseFloat(tarifNuit) * jours;
        const servicesPrice = selectedServices.reduce((total, serviceId) => {
            const service = services.find((s) => s.id_service === serviceId);
            return total + (service ? parseFloat(service.price) : 0);
        }, 0);
        const totalPrice = basePrice + servicesPrice;
        return { basePrice, servicesPrice, totalPrice };
    };

    // Générer les dates indisponibles
    const getUnavailableDates = () => {
        const unavailableDates = [];
        existingReservations.forEach((res) => {
            if (res.id_room === parseInt(roomId)) {
                const start = new Date(res.checkin_date);
                const end = new Date(res.checkout_date);
                for (
                    let date = new Date(start);
                    date <= end;
                    date.setDate(date.getDate() + 1)
                ) {
                    unavailableDates.push(new Date(date));
                }
            }
        });
        return unavailableDates;
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
        setError(null);

        // Vérifier les dates valides
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
            checkin_date: reservation.checkin_date.toISOString().split("T")[0], // Format yyyy-mm-dd
            checkout_date: reservation.checkout_date.toISOString().split("T")[0], // Format yyyy-mm-dd
            basePrice,
            servicesPrice,
            total_price: totalPrice,
            selectedServices,
            allServices: services,
        };

        navigate(`/payment/${roomId}`, { state: reservationData });
    };

    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!room) return <div className="loading-message">Chargement...</div>;

    const today = new Date();

    return (
        <Container className="booking-confirmation-container">
            <h1>Confirmation de réservation</h1>
            <h3>Chambre numéro {room.room_number}</h3>
            <p>Prix: {room.price_per_night}€ / nuit</p>

            <form onSubmit={handleSubmit}>
                <div className="date-field">
                    <label>Date d'arrivée</label>
                    <DatePicker
                        selected={reservation.checkin_date}
                        onChange={(date) => setReservation({ ...reservation, checkin_date: date })}
                        minDate={today} // Pas de dates avant aujourd'hui
                        excludeDates={getUnavailableDates()} // Désactiver les dates réservées
                        placeholderText="Sélectionnez une date"
                        dateFormat="yyyy-MM-dd"
                        required
                    />
                </div>
                <div className="date-field">
                    <label>Date de départ</label>
                    <DatePicker
                        selected={reservation.checkout_date}
                        onChange={(date) => setReservation({ ...reservation, checkout_date: date })}
                        minDate={
                            reservation.checkin_date
                                ? new Date(reservation.checkin_date).setDate(
                                      new Date(reservation.checkin_date).getDate() + 1
                                  )
                                : today
                        } // Minimum après la date d'arrivée ou aujourd'hui
                        excludeDates={getUnavailableDates()} // Désactiver les dates réservées
                        placeholderText="Sélectionnez une date"
                        dateFormat="yyyy-MM-dd"
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
                            <p>
                                <strong>Coût de la réservation (sans services) :</strong>{" "}
                                {calculatePrices().basePrice}€
                            </p>
                            <p>
                                <strong>Coût des services :</strong> {calculatePrices().servicesPrice}€
                            </p>
                            <p>
                                <strong>Coût total :</strong> {calculatePrices().totalPrice}€
                            </p>
                        </div>
                    </>
                )}

                <Button variant="primary" type="submit" className="mt-3">
                    Confirmer la réservation
                </Button>
            </form>
        </Container>
    );
};

export default BookingConfirmation;