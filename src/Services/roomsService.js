import axios from "axios";

function getRooms() {
  return axios.get("http://localhost:3000/rooms");
}

function getRoomById(id) {
  return axios.get(`http://localhost:3000/rooms/${id}`);
}

export default { getRooms, getRoomById };