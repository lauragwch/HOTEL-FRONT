import axios from "axios";
import {jwtDecode} from "jwt-decode";

const API_URL = 'http://localhost:3002/auth';

function login (user) {
    return axios.post('http://localhost:3002/auth/login', user);
}

function logout () {
    window.localStorage.removeItem("token");
    delete axios.defaults.headers['Authorization'];
}

function isConnected () {
    const token = localStorage.getItem("authorization");
    if (token) {
        const data = jwtDecode(token);
        if (data.exp * 1000 > new Date().getTime()) {
            axios.defaults.headers['Authorization'] = `${token}`;
            return true;
        }
    }
    logout();
    return false;
}

function getRole () {
    const token = localStorage.getItem("authorization");
    if (token) {
        const data = jwtDecode(token);
        return data.role;
    }
    return '';
}

function getUser () {
    const token = localStorage.getItem("authorization");
    if (token) {
        const data = jwtDecode(token);
        return {
            id: data.id,
            email: data.email,
            nom: data.nom,
            prenom: data.prenom,
        }
    }
    return {};
}

const forgotPassword = (data) => {
    return axios.post(`${API_URL}/`, data);
};

export default {login, isConnected, getRole, getUser, logout, forgotPassword};