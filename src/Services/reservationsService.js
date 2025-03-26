import axios from "axios";

const API_URL = import.meta.env.VITE_URL_API;

function reservation(reservation) {
    const token = localStorage.getItem("authorization");
    console.log(token);
    return axios.post(`${API_URL}reservations`, reservation);
}

const getReservations = () => {
    return axios.get(`${API_URL}reservations`);
};

function updateReservation(id, data) {
    const token = localStorage.getItem("authorization");
    return axios.patch(`${API_URL}reservations/${id}`, data);
}

const deleteReservation = (reservationId) => {
    return axios.delete(`${API_URL}reservations/${reservationId}`);
};

export default { reservation, updateReservation, deleteReservation, getReservations };