import axios from "axios";

function getProfil(user) {
    const token = localStorage.getItem("authorization");
    return axios.get("http://localhost:3000/clients/me", user, {
        headers: {
            'authorization': token
        }
    }
    )
}

export default { getProfil };