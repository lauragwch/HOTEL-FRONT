import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import reservationsService from "../Services/reservationsService";
import roomsService from "../Services/roomsService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "../Styles/reservation.css";

const Reservation = () => {
    const [reservation, setReservation] = useState({
        id_room: "",
        checkin_date: null, // Null pour DatePicker
        checkout_date: null, // Null pour DatePicker
        total_price: "",
    });

    const [tarifNuit, setTarifNuit] = useState(0);
    const [jours, setJours] = useState(0);
    const [rooms, setRooms] = useState([]);
    const [existingReservations, setExistingReservations] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    // Récupérer toutes les chambres disponibles
    const fetchRooms = async () => {
        try {
            const response = await roomsService.getRooms();
            setRooms(response.data);
        } catch (error) {
            console.log(error);
            setErrorMessages(["Erreur lors de la récupération des chambres."]);
        }
    };

    // Récupérer les réservations existantes
    const fetchReservations = async () => {
        try {
            const response = await reservationsService.getReservations();
            setExistingReservations(response.data);
        } catch (error) {
            console.log(error);
            setErrorMessages(["Erreur lors de la récupération des réservations."]);
        }
    };

    // Récupérer le tarif par nuit pour la chambre sélectionnée
    const fetchRoomData = async () => {
        if (reservation.id_room) {
            try {
                const response = await roomsService.getRoomById(reservation.id_room);
                setTarifNuit(response.data.price_per_night || 0);
            } catch (error) {
                console.log(error);
                setErrorMessages(["Erreur lors de la récupération des données de la chambre."]);
            }
        } else {
            setTarifNuit(0); // Réinitialiser si aucune chambre n'est sélectionnée
        }
    };

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

    // Générer les dates indisponibles pour la chambre sélectionnée
    const getUnavailableDates = () => {
        const unavailableDates = [];
        if (reservation.id_room) {
            existingReservations.forEach((res) => {
                if (res.id_room === parseInt(reservation.id_room)) {
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
        }
        return unavailableDates;
    };

    const handleChange = (e) => {
        setReservation({ ...reservation, [e.target.name]: e.target.value });
        setErrorMessages([]); // Réinitialiser les erreurs lors d'un changement
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessages([]);

        // Vérifier les dates valides
        const days = nbJours();
        if (!reservation.checkin_date || !reservation.checkout_date || days <= 0) {
            setErrorMessages(["Veuillez sélectionner des dates valides."]);
            return;
        }

        if (!reservation.id_room) {
            setErrorMessages(["Veuillez sélectionner une chambre."]);
            return;
        }

        // Calculer le prix total
        const totalPrice = tarifNuit * days;
        const reservationData = {
            ...reservation,
            checkin_date: reservation.checkin_date.toISOString().split("T")[0], // Format yyyy-mm-dd
            checkout_date: reservation.checkout_date.toISOString().split("T")[0], // Format yyyy-mm-dd
            total_price: totalPrice,
        };

        try {
            const response = await reservationsService.reservation(reservationData);
            console.log("Réservation réussie :", response.data);
            navigate("/"); // Redirection après succès
        } catch (error) {
            console.log(error);
            setErrorMessages(
                error.response?.data?.message
                    ? [error.response.data.message]
                    : ["Erreur lors de la réservation."]
            );
        }
    };

    useEffect(() => {
        fetchRooms();
        fetchReservations(); // Charger les réservations au démarrage
    }, []);

    useEffect(() => {
        fetchRoomData();
        nbJours();
    }, [reservation.id_room, reservation.checkin_date, reservation.checkout_date]);

    const today = new Date();

    return (
        <div className="container mt-5">
            <h1>Réservation</h1>

            {errorMessages.length > 0 && (
                <div className="alert alert-danger">
                    {errorMessages.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <select
                        className="form-control"
                        name="id_room"
                        value={reservation.id_room}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Sélectionnez une chambre</option>
                        {rooms.map((room) => (
                            <option key={room.id_room} value={room.id_room}>
                                Numéro de chambre {room.room_number} - Capacité: {room.capacity}{" "}
                                personne(s), Nuitée: {room.price_per_night} €
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <option value="">Date d'arrivée</option>
                    <DatePicker
                        selected={reservation.checkin_date}
                        onChange={(date) => setReservation({ ...reservation, checkin_date: date })}
                        minDate={today} // Pas de dates avant aujourd'hui
                        excludeDates={getUnavailableDates()} // Désactiver les dates réservées si chambre sélectionnée
                        placeholderText="Sélectionnez une date"
                        dateFormat="yyyy-MM-dd"
                        required
                    />
                </div>

                <div className="form-group">
                    <option value="">Date de départ</option>
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
                        excludeDates={getUnavailableDates()} // Désactiver les dates réservées si chambre sélectionnée
                        placeholderText="Sélectionnez une date"
                        dateFormat="yyyy-MM-dd"
                        required
                    />
                </div>

                {jours > 0 && reservation.id_room && (
                    <div className="cost-summary">
                        <p>
                            <strong>Coût total :</strong> {tarifNuit * jours} €
                        </p>
                    </div>
                )}

                <button type="submit" className="btn btn-primary mt-3">
                    Réserver
                </button>
            </form>
        </div>
    );
};

export default Reservation;