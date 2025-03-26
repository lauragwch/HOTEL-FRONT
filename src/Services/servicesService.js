import axios from "axios";
const API_URL = import.meta.env.VITE_URL_API;

function getServices() {
    return axios.get("http://localhost:3000/services");
}
function getServiceById(id) {
    return axios.get(`http://localhost:3000/services/${id}`);
}

function updateService(id, data) {
    const token = localStorage.getItem("authorization");
    return axios.patch(
        `http://localhost:3000/services/${id}`,
        data,
        {
            headers: {
                authorization: token,
            },
        }
    );
}

function addService(data) {
    const token = localStorage.getItem("authorization");
    return axios.post("http://localhost:3000/services", data, {
        headers: { authorization: token },
    });
}

function deleteService(id) {
    const token = localStorage.getItem("authorization");
    return axios.delete(`http://localhost:3000/services/${id}`, {
        headers: { authorization: token },
    });
}

function addServiceToReservation(serviceId, reservationId, quantity, totalPrice) {
    const token = localStorage.getItem("authorization");
    return axios.post(
        `${API_URL}inclure`,
        {
            id_service: serviceId,
            id_reservation: reservationId,
            quantity: quantity,
            total_price: totalPrice
        },
        {
            headers: { authorization: token },
        }
    );
}

export default { getServices, getServiceById, updateService, addService, deleteService, addServiceToReservation };