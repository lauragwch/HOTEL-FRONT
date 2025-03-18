import axios from "axios";

function reservation(reservation) {
    const token = localStorage.getItem("authorization");
    console.log(token);
    return axios.post("http://localhost:3000/reservations", reservation, {
    headers: {
        'authorization': token
    }
}
    )
}



export default { reservation };