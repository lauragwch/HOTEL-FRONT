import axios from "axios";

function getRooms() {
  return axios.get("http://localhost:3000/rooms");
}

export default { getRooms };