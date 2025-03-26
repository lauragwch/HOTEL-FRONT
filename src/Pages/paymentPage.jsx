import { useLocation, useNavigate } from "react-router-dom";
import { Container, Button, Form, Modal } from "react-bootstrap"; // Ajout de Modal
import { useState } from "react";
import reservationsService from "../Services/reservationsService";
import servicesService from "../Services/servicesService";
import "../styles/paymentPage.css";

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [reservationId, setReservationId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [showModal, setShowModal] = useState(false); // État pour la modale

    const handlePayment = async () => {
        try {
            // Créer la réservation avec la méthode de paiement
            const response = await reservationsService.reservation({
                id_client: state.id_client,
                id_room: state.id_room,
                checkin_date: state.checkin_date,
                checkout_date: state.checkout_date,
                total_price: state.total_price,
                payment_method: paymentMethod,
            });
            const newReservationId = response.data[0].id_reservation;
            setReservationId(newReservationId);

            // Ajouter les services sélectionnés
            for (const serviceId of state.selectedServices) {
                // Note : Inversion des paramètres selon votre backend
                await servicesService.addServiceToReservation(serviceId, newReservationId);
            }

            // Afficher la modale au lieu de rediriger
            setShowModal(true);
        } catch (error) {
            console.error("Erreur lors du paiement:", error.response || error.message);
            alert("Erreur lors de la confirmation du paiement.");
        }
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate(`/services/${reservationId}`);
    };

    if (!state) return <div>Erreur : Aucune donnée de réservation disponible.</div>;

    return (
        <Container className="payment-container">
            <h1>Paiement de votre réservation</h1>
            <p>Veuillez confirmer votre paiement pour finaliser la réservation.</p>
            <p><strong>Date d'arrivée :</strong> {state.checkin_date}</p>
            <p><strong>Date de départ :</strong> {state.checkout_date}</p>
            <p><strong>Coût de la réservation (sans services) :</strong> {state.basePrice}€</p>
            <p><strong>Coût des services :</strong> {state.servicesPrice}€</p>
            <p><strong>Coût total :</strong> {state.total_price}€</p>
            <h5>Services sélectionnés :</h5>
            {state.selectedServices.length > 0 ? (
                <ul>
                    {state.selectedServices.map((serviceId) => {
                        const service = state.allServices.find((s) => s.id_service === serviceId);
                        return <li key={serviceId}>{service?.service_name} ({service?.price}€)</li>;
                    })}
                </ul>
            ) : (
                <p>Aucun service sélectionné.</p>
            )}

            <h5>Type de paiement</h5>
            <Form.Select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                className="payment-select"
            >
                <option value="">Sélectionnez une méthode de paiement</option>
                <option value="Virement bancaire">Virement bancaire</option>
                <option value="Espèces">Espèces</option>
                <option value="Carte de crédit">Carte de crédit</option>
            </Form.Select>

            <Button
                variant="primary"
                onClick={handlePayment}
                disabled={!paymentMethod}
                className="mt-3"
            >
                Confirmer le paiement
            </Button>

            {/* Modale de confirmation */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Réservation confirmée</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Votre réservation est confirmée !</p>
                    <p><strong>Date d'arrivée :</strong> {state.checkin_date}</p>
                    <p><strong>Date de départ :</strong> {state.checkout_date}</p>
                    <p><strong>Coût de la réservation (sans services) :</strong> {state.basePrice}€</p>
                    <p><strong>Coût des services :</strong> {state.servicesPrice}€</p>
                    <p><strong>Coût total :</strong> {state.total_price}€</p>
                    <h5>Services sélectionnés :</h5>
                    {state.selectedServices.length > 0 ? (
                        <ul>
                            {state.selectedServices.map((serviceId) => {
                                const service = state.allServices.find((s) => s.id_service === serviceId);
                                return <li key={serviceId}>{service?.service_name} ({service?.price}€)</li>;
                            })}
                        </ul>
                    ) : (
                        <p>Aucun service sélectionné.</p>
                    )}
                    <p><strong>Méthode de paiement :</strong> {paymentMethod}</p>
                    <p>
                        <strong>Informations :</strong> Veuillez arriver à partir de 14h00 le jour de votre arrivée.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PaymentPage;