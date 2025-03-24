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


export default { getProfil, editProfil };