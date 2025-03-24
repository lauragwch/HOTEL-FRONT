import { useParams } from "react-router-dom";
import { Container, Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import roomsService from "../Services/roomsService";
import reservationsService from "../Services/reservationsService"; // Import pour la réservation
import { useNavigate } from "react-router-dom";
import "../styles/bookingConfirmation.css";

const BookingConfirmation = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState({
        id_room: roomId, // Pré-rempli avec roomId
        checkin_date: "",
        checkout_date: "",
        total_price: "",
    });
    const [tarifNuit, setTarifNuit] = useState(0);
    const [jours, setJours] = useState(0);
    const [showModal, setShowModal] = useState(false); // État pour la modale

    // Récupérer les détails de la chambre
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                console.log("Fetching room with ID:", roomId);
                const response = await roomsService.getRoomById(roomId);
                console.log("API Response:", response.data);
                setRoom(response.data);
                setTarifNuit(response.data.price_per_night); // Tarif par nuit
                setReservation((prev) => ({ ...prev, id_room: roomId })); // Assigner roomId
            } catch (error) {
                console.error("Erreur:", error.response || error.message);
                setError("Impossible de charger les détails de la chambre.");
            }
        };
        fetchRoom();
    }, [roomId]);

    // Calculer le nombre de jours
    const nbJours = () => {
        const date1 = new Date(reservation.checkin_date);
        const date2 = new Date(reservation.checkout_date);
        const diff = Math.abs(date2 - date1);
        setJours(Math.ceil(diff / (1000 * 60 * 60 * 24)) || 0);
    };

    // Mettre à jour les jours quand les dates changent
    useEffect(() => {
        nbJours();
    }, [reservation.checkin_date, reservation.checkout_date]);

    // Gestion des changements dans les inputs
    const handleChange = (e) => {
        setReservation({ ...reservation, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!reservation.checkin_date || !reservation.checkout_date || jours <= 0) {
                setError("Veuillez sélectionner des dates valides.");
                return;
            }
            const totalPrice = tarifNuit * jours;
            const reservationData = {
                ...reservation,
                total_price: totalPrice,
            };
            console.log("Données envoyées:", reservationData);
            await reservationsService.reservation(reservationData);
            setShowModal(true); // Ouvre la modale après succès
        } catch (error) {
            console.error("Erreur lors de la réservation:", error.response || error.message);
            setError(error.response?.data?.message || "Erreur lors de la réservation.");
        }
    };

    // Ferme la modale et redirige
    const handleCloseModal = () => {
        setShowModal(false);
        navigate("/");
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!room) return <div className="loading-message">Chargement...</div>;

    return (
        <>
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
                        min={new Date().toISOString().split("T")[0]} // Pas de dates passées
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
                        } // Pas avant la date d'arrivée
                        required
                    />
                </div>

                {jours > 0 && (
                    <p>
                        Durée: {jours} nuit(s) - Total: {tarifNuit * jours}€
                    </p>
                )}

                <Button variant="primary" type="submit">
                    Confirmer la réservation
                </Button>
            </form>
        </Container>
        
        {/* Modale de confirmation */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
            <Modal.Title>Réservation confirmée</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>
                Votre réservation pour la chambre numéro {room?.room_number} est confirmée !
            </p>
            <p>
                <strong>Date d'arrivée :</strong> {reservation.checkin_date}
            </p>
            <p>
                <strong>Date de départ :</strong> {reservation.checkout_date}
            </p>
            <p>
                <strong>Total :</strong> {tarifNuit * jours}€
            </p>
            <p>
                <strong>Informations :</strong> Veuillez arriver à partir de 14h00 le jour de votre arrivée. Merci de nous contacter en cas de retard.
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleCloseModal}>
                Fermer
            </Button>
        </Modal.Footer>
    </Modal>
    </>

    );
};

export default BookingConfirmation;