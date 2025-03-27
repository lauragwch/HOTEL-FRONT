import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import roomsService from "../Services/roomsService";
import servicesService from "../Services/servicesService";
import reservationsService from "../Services/reservationsService";
import profilService from "../Services/profilService";
import "../styles/adminPage.css";
import { jwtDecode } from "jwt-decode";
import  HotelCalendar  from "../Components/hotelCalendar";

const AdminPage = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [services, setServices] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newRoom, setNewRoom] = useState({ room_number: "", room_type: "simple", price_per_night: 0 });
    const [newService, setNewService] = useState({ service_name: "", description: "", price: 0 });
    const [clients, setClients] = useState([]);


    const formatDateToYYYYMMDD = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return ""; // Retourne "" si la date est invalide
        return date.toISOString().split("T")[0]; // Retourne yyyy-mm-dd
    };

    useEffect(() => {
        const token = localStorage.getItem("authorization");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role !== "ADMIN") {
                navigate("/");
            } else {
                fetchRooms();
                fetchServices();
                fetchReservations();
                fetchClients();
            }
        } catch (error) {
            console.log("Token invalide", error);
            navigate("/login");
        }
    }, [navigate]);

    const fetchRooms = async () => {
        try {
            const response = await roomsService.getRooms();
            setRooms(response.data.map(room => ({
                ...room,
                editedPrice: parseFloat(room.price_per_night) || 0,
                editedType: room.room_type || "simple",
            })));
        } catch (err) {
            setError("Erreur lors de la récupération des chambres.");
            console.error(err);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await servicesService.getServices();
            setServices(response.data.map(service => ({
                ...service,
                editedName: service.service_name || "",
                editedDescription: service.description || "",
                editedPrice: parseFloat(service.price) || 0,
            })));
            setLoading(false);
        } catch (err) {
            setError("Erreur lors de la récupération des services.");
            setLoading(false);
            console.error(err);
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await reservationsService.getReservations();
            setReservations(response.data.map(reservation => ({
                ...reservation,
                editedCheckinDate: formatDateToYYYYMMDD(reservation.checkin_date) || "",
                editedCheckoutDate: formatDateToYYYYMMDD(reservation.checkout_date) || "",
                editedTotalPrice: parseFloat(reservation.total_price) || 0,
                editedReservationStatus: reservation.reservation_status || "", // Valeur actuelle conservée
                editedIsValidated: reservation.is_validated || false,
            })));
        } catch (err) {
            setError("Erreur lors de la récupération des réservations.");
            console.error(err);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await profilService.getClients();
            console.log("Données des clients :", response.data);
            setClients(response.data.map(client => ({
                ...client,
                editedFirstName: client.first_name || "",
                editedLastName: client.last_name || "",
                editedPhone: client.phone || "",
                editedEmail: client.email || "",
                editedRegistrationDate: formatDateToYYYYMMDD(client.registration_date) || "",
            })));
        } catch (err) {
            setError("Erreur lors de la récupération des clients.");
            console.error(err);
        }
    };

    const handleUpdateRoom = async (roomId) => {
        const roomToUpdate = rooms.find(room => room.id_room === roomId);
        try {
            await roomsService.updateRoom(roomId, {
                price_per_night: roomToUpdate.editedPrice,
                room_type: roomToUpdate.editedType,
            });
            alert(`Chambre ${roomToUpdate.room_number} mise à jour avec succès !`);
            fetchRooms();
        } catch (err) {
            setError("Erreur lors de la mise à jour de la chambre.");
            console.error(err);
        }
    };

    const handleUpdateService = async (serviceId) => {
        const serviceToUpdate = services.find(service => service.id_service === serviceId);
        try {
            await servicesService.updateService(serviceId, {
                service_name: serviceToUpdate.editedName,
                description: serviceToUpdate.editedDescription,
                price: serviceToUpdate.editedPrice,
            });
            alert(`Service ${serviceToUpdate.editedName} mis à jour avec succès !`);
            fetchServices();
        } catch (err) {
            setError("Erreur lors de la mise à jour du service.");
            console.error(err);
        }
    };

    const handleUpdateReservation = async (reservationId) => {
        const reservationToUpdate = reservations.find(res => res.id_reservation === reservationId);
        try {
            await reservationsService.updateReservation(reservationId, {
                checkin_date: reservationToUpdate.editedCheckinDate,
                checkout_date: reservationToUpdate.editedCheckoutDate,
                total_price: reservationToUpdate.editedTotalPrice,
                reservation_status: reservationToUpdate.editedReservationStatus,
                is_validated: reservationToUpdate.editedIsValidated,
            });
            alert(`Réservation ${reservationId} mise à jour avec succès !`);
            fetchReservations();
        } catch (err) {
            setError("Erreur lors de la mise à jour de la réservation.");
            console.error(err);
        }
    };

    const handleDeleteReservation = async (reservationId) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette réservation ?")) {
            try {
                await reservationsService.deleteReservation(reservationId);
                alert("Réservation supprimée avec succès !");
                fetchReservations();
            } catch (err) {
                setError("Erreur lors de la suppression de la réservation.");
                console.error(err);
            }
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await roomsService.addRoom({
                room_number: newRoom.room_number,
                room_type: newRoom.room_type,
                price_per_night: parseFloat(newRoom.price_per_night),
            });
            alert("Chambre ajoutée avec succès !");
            setNewRoom({ room_number: "", room_type: "simple", price_per_night: 0 });
            fetchRooms();
        } catch (err) {
            setError("Erreur lors de l'ajout de la chambre.");
            console.error(err);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette chambre ?")) {
            try {
                await roomsService.deleteRoom(roomId);
                alert("Chambre supprimée avec succès !");
                fetchRooms();
            } catch (err) {
                setError("Erreur lors de la suppression de la chambre.");
                console.error(err);
            }
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            await servicesService.addService({
                service_name: newService.service_name,
                description: newService.description,
                price: parseFloat(newService.price),
            });
            alert("Service ajouté avec succès !");
            setNewService({ service_name: "", description: "", price: 0 });
            fetchServices();
        } catch (err) {
            setError("Erreur lors de l'ajout du service.");
            console.error(err);
        }
    };

    const handleDeleteService = async (serviceId) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce service ?")) {
            try {
                await servicesService.deleteService(serviceId);
                alert("Service supprimé avec succès !");
                fetchServices();
            } catch (err) {
                setError("Erreur lors de la suppression du service.");
                console.error(err);
            }
        }
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce client ?")) {
            try {
                await profilService.deleteClient(clientId);
                alert("Client supprimé avec succès !");
                fetchClients();
            } catch (err) {
                setError("Erreur lors de la suppression du client.");
                console.error(err);
            }
        }
    };

    const handleUpdateClient = async (clientId) => {
        const clientToUpdate = clients.find(client => client.id_client === clientId);
        try {
            await profilService.editProfil(clientId, {
                first_name: clientToUpdate.editedFirstName,
                last_name: clientToUpdate.editedLastName,
                phone: clientToUpdate.editedPhone,
                email: clientToUpdate.editedEmail,
                registration_date: clientToUpdate.editedRegistrationDate,
            });
            alert(`Client ${clientToUpdate.editedFirstName} ${clientToUpdate.editedLastName} mis à jour avec succès !`);
            fetchClients();
        } catch (err) {
            setError("Erreur lors de la mise à jour du client.");
            console.error(err);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="admin-page">
            <h1>Gestion administrative</h1>

            <Accordion defaultActiveKey="0" className="admin-accordion">
                {/* Accordéon pour les chambres */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Chambres</Accordion.Header>
                    <Accordion.Body>
                        <Form onSubmit={handleAddRoom} className="mb-4">
                            <div className="row">
                                <div className="col-md-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Numéro"
                                        value={newRoom.room_number}
                                        onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Form.Control
                                        as="select"
                                        value={newRoom.room_type}
                                        onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                                    >
                                        <option value="simple">Simple</option>
                                        <option value="double">Double</option>
                                        <option value="suite">Suite</option>
                                    </Form.Control>
                                </div>
                                <div className="col-md-3">
                                    <Form.Control
                                        type="number"
                                        placeholder="Prix par nuit"
                                        value={newRoom.price_per_night}
                                        onChange={(e) => setNewRoom({ ...newRoom, price_per_night: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Button variant="success" type="submit">Ajouter</Button>
                                </div>
                            </div>
                        </Form>

                        <Table striped bordered hover responsive className="rooms-table">
                            <thead>
                                <tr><th>Numéro</th><th>Type</th><th>Prix par nuit</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id_room}>
                                        <td>{room.room_number}</td>
                                        <td>
                                            <Form.Control
                                                as="select"
                                                value={room.editedType}
                                                onChange={(e) => setRooms(rooms.map(r => r.id_room === room.id_room ? { ...r, editedType: e.target.value } : r))}
                                            >
                                                <option value="simple">Simple</option>
                                                <option value="double">Double</option>
                                                <option value="suite">Suite</option>
                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={room.editedPrice}
                                                onChange={(e) => setRooms(rooms.map(r => r.id_room === room.id_room ? { ...r, editedPrice: parseFloat(e.target.value) || 0 } : r))}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleUpdateRoom(room.id_room)} className="me-2">Mettre à jour</Button>
                                            <Button variant="danger" onClick={() => handleDeleteRoom(room.id_room)}>Supprimer</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Accordéon pour les services */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Services</Accordion.Header>
                    <Accordion.Body>
                        <Form onSubmit={handleAddService} className="mb-4">
                            <div className="row">
                                <div className="col-md-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nom"
                                        value={newService.service_name}
                                        onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Form.Control
                                        type="text"
                                        placeholder="Description"
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Form.Control
                                        type="number"
                                        placeholder="Prix"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <Button variant="success" type="submit">Ajouter</Button>
                                </div>
                            </div>
                        </Form>

                        <Table striped bordered hover responsive className="services-table">
                            <thead>
                                <tr><th>Nom</th><th>Description</th><th>Prix</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {services.map(service => (
                                    <tr key={service.id_service}>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={service.editedName}
                                                onChange={(e) => setServices(services.map(s => s.id_service === service.id_service ? { ...s, editedName: e.target.value } : s))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={service.editedDescription}
                                                onChange={(e) => setServices(services.map(s => s.id_service === service.id_service ? { ...s, editedDescription: e.target.value } : s))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={service.editedPrice}
                                                onChange={(e) => setServices(services.map(s => s.id_service === service.id_service ? { ...s, editedPrice: parseFloat(e.target.value) || 0 } : s))}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleUpdateService(service.id_service)} className="me-2">Mettre à jour</Button>
                                            <Button variant="danger" onClick={() => handleDeleteService(service.id_service)}>Supprimer</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Accordéon pour les réservations */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Réservations</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover responsive className="reservations-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Chambre</th>
                                    <th>Date d'arrivée</th>
                                    <th>Date de départ</th>
                                    <th>Prix total</th>
                                    <th>Statut de la réservation</th>
                                    <th>Validée</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(reservation => (
                                    <tr key={reservation.id_reservation}>
                                        <td>{reservation.id_reservation}</td>
                                        <td>{reservation.id_room}</td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={reservation.editedCheckinDate}
                                                onChange={(e) => setReservations(reservations.map(r => r.id_reservation === reservation.id_reservation ? { ...r, editedCheckinDate: e.target.value } : r))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={reservation.editedCheckoutDate}
                                                onChange={(e) => setReservations(reservations.map(r => r.id_reservation === reservation.id_reservation ? { ...r, editedCheckoutDate: e.target.value } : r))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="number"
                                                value={reservation.editedTotalPrice}
                                                onChange={(e) => setReservations(reservations.map(r => r.id_reservation === reservation.id_reservation ? { ...r, editedTotalPrice: parseFloat(e.target.value) || 0 } : r))}
                                            />
                                        </td>


                                        <td>
                                            <Form.Control
                                                as="select"
                                                value={reservation.editedReservationStatus || ""}
                                                onChange={(e) => setReservations(reservations.map(r => r.id_reservation === reservation.id_reservation ? { ...r, editedReservationStatus: e.target.value } : r))}
                                            >
                                                <option value="">Sélectionner un statut</option>
                                                <option value="En attente de validation">En attente de validation</option>
                                                <option value="Confirmée">Confirmée</option>
                                                <option value="Annulée">Annulée</option>

                                            </Form.Control>
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                checked={reservation.editedIsValidated}
                                                onChange={(e) => setReservations(reservations.map(r => r.id_reservation === reservation.id_reservation ? { ...r, editedIsValidated: e.target.checked } : r))}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleUpdateReservation(reservation.id_reservation)} className="me-2">Mettre à jour</Button>
                                            <Button variant="danger" onClick={() => handleDeleteReservation(reservation.id_reservation)}>Supprimer</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>Clients</Accordion.Header>
                    <Accordion.Body>
                        <Table striped bordered hover responsive className="reservations-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Prénom</th>
                                    <th>Nom</th>
                                    <th>Numéro de téléphone</th>
                                    <th>Date d'inscription</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {clients.map(client => (
                                    <tr key={client.id_client}>
                                        <td>{client.id_client}</td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={client.editedFirstName}
                                                onChange={(e) => setClients(clients.map(c => c.id_client === client.id_client ? { ...c, editedFirstName: e.target.value } : c))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={client.editedLastName}
                                                onChange={(e) => setClients(clients.map(c => c.id_client === client.id_client ? { ...c, editedLastName: e.target.value } : c))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={client.editedPhone}
                                                onChange={(e) => setClients(clients.map(c => c.id_client === client.id_client ? { ...c, editedPhone: e.target.value } : c))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="date"
                                                value={client.editedRegistrationDate}
                                                onChange={(e) => setClients(clients.map(c => c.id_client === client.id_client ? { ...c, editedRegistrationDate: e.target.value } : c))}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="text"
                                                value={client.editedEmail}
                                                onChange={(e) => setClients(clients.map(c => c.id_client === client.id_client ? { ...c, editedEmail: e.target.value } : c))}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="primary" onClick={() => handleUpdateClient(client.id_client)} className="me-2">Mettre à jour</Button>
                                            <Button variant="danger" onClick={() => handleDeleteClient(client.id_client)}>Supprimer</Button>
                                            <Button variant="danger" onClick={async () => {
                                                try {
                                                    console.log("Envoi d'email à", client.editedEmail);
                                                    await profilService.sendEmailToChangePassword(client.editedEmail);
                                                    alert("Email envoyé avec succès !");
                                                } catch (err) {
                                                    setError("Erreur lors de l'envoi de l'email.");
                                                    console.error(err);
                                                }

                                            }} >Envoi d'email</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>


            <div className="w-100 mt-5">
                <HotelCalendar />
            </div>
        </div>



    );
};

export default AdminPage;