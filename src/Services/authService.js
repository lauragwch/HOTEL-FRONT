import axios from "axios";

function login (user) {
    return axios.post('http://localhost:3000/auth/login', user);
}

export default {login};