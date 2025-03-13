import axios from "axios";

function getServices() {
    return axios.get("http://localhost:3000/services");
    }

export default { getServices };