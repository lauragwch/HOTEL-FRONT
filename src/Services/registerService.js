import axios from "axios";

function register(user) {
    return axios.post("http://localhost:3000/clients", user);
}

export default { register };