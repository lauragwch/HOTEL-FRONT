import axios from "axios";

function getProfil() {
    const token = localStorage.getItem("authorization");
    return axios.get("http://localhost:3000/clients/me", {
        headers: {
            authorization: token
        }
    }
    )
}

function editProfil(id, user) {
    const token = localStorage.getItem("authorization");
    return axios.patch(`http://localhost:3000/clients/${id}`, user, {
        headers: {
            authorization: token
        }
    })
}

function getClients() {
    const token = localStorage.getItem("authorization");
    return axios.get("http://localhost:3000/clients", {
        headers: {
            authorization: token
        }
    })
}

function getProfilById(id) {
    const token = localStorage.getItem("authorization");
    return axios.get(`http://localhost:3000/clients/${id}`, {
        headers: {
            authorization: token
        }
    })
}

function resetPassword(token, data) {
    return axios.post(`http://localhost:3000/clients/password_reset/${token}`, data, 
    {
        headers: {
            authorization: token
        }
    })
}

function sendEmailToChangePassword(email) {
    return axios.post(`http://localhost:3000/clients/password_forget`, email)
}


export default {getProfil, editProfil, getClients, resetPassword, sendEmailToChangePassword, getProfilById};