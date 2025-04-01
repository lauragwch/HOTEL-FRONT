import axios from "axios";

function register(user) {
    return axios.post("http://localhost:3002/clients", user);
}

export default { register };