import React, { use } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import reservationsService from "../Services/reservationsService";
import roomsService from "../Services/roomsService";
import { useEffect } from "react";
// import "../Styles/reservation.css"

const Reservation = () => {

    const [reservation, setReservation] = useState({
        id_room: '',
        checkin_date: '',
        checkout_date: '',
        total_price: '',
    });

    const [tarifNuit, setTarifNuit] = useState ({});
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [jours, setJours] = useState({});

    const fetchRooms = async () => {
        try {
            const response = await roomsService.getRooms();
            setRooms(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputClick = (e) => {
        e.target.select();
    }

    const handleChange = (e) => {
        setReservation({ ...reservation, [e.target.name]: e.target.value });
        setErrorMessages("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            reservation.total_price = tarifNuit * jours;
            const response = await reservationsService.reservation(reservation);
            navigate("/");
        } catch (error) {
            console.log(error);
            setErrorMessages(error.response.data.message);
        }
    }

    const fetchRoomData = async () => {
        try {
            const response = await roomsService.getRoomById(reservation.id_room);
            setTarifNuit(response.data.price_per_night);
        } catch (error) {
            console.log(error);
        }
    }

    const nbJours = () => {
        const date1 = new Date(reservation.checkin_date);
        const date2 = new Date(reservation.checkout_date);
        const diff = Math.abs(date2 - date1);
        return setJours (Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }


    useEffect(() => {
        fetchRooms();
        fetchRoomData();
        nbJours();
    }
        , [reservation.id_room, reservation.checkin_date, reservation.checkout_date]);



    return (
        <div className="container mt-5">

            <h1>Réservation</h1>

            <form onSubmit={handleSubmit}>
                    <label> Sélectionnez une chambre </label>
                <div className="form-group">
                    <select
                        className="form-control"
                        name="id_room"
                        value={reservation.id_room}
                        onChange={handleChange}
                    >
                        <option value=""> Choisissez une chambre </option>
                        {rooms.map((room) => (
                            <option
                                key={room.id_room}
                                value={room.id_room}>
                                Numéro de chambre {room.room_number} Capacité: {room.capacity} personne.s, Nuitée: {room.price_per_night} €
                            </option>
                        ))}
                    </select>
                </div>
                    <label>Date d'arrivée</label>
                <div className="form-group">
                    <input
                        type="date"
                        className="form-control"
                        name="checkin_date"
                        value={reservation.checkin_date}
                        onChange={handleChange}
                        onClick={handleInputClick}
                        required
                    />
                </div>
                    <label>Date de départ</label>
                <div className="form-group">
                    <input
                        type="date"
                        className="form-control"
                        name="checkout_date"
                        value={reservation.checkout_date}
                        onChange={handleChange}
                        onClick={handleInputClick}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" >Réserver</button>
            </form>
        </div>
    );
}

export default Reservation;