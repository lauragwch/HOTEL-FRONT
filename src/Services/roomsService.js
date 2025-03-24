import axios from "axios";

function getRooms() {
  return axios.get("http://localhost:3000/rooms");
}

function getRoomById(id) {
  return axios.get(`http://localhost:3000/rooms/${id}`);
}

function updateRoom(id, data) {
  const token = localStorage.getItem("authorization");
  return axios.patch(`http://localhost:3000/rooms/${id}`, data,
    {
      headers: {
        authorization: token,
      },
    }
  );
}
function addRoom(data) {
  const token = localStorage.getItem("authorization");
  return axios.post("http://localhost:3000/rooms", data, {
      headers: { authorization: token },
  });
}

function deleteRoom(id) {
  const token = localStorage.getItem("authorization");
  return axios.delete(`http://localhost:3000/rooms/${id}`, {
      headers: { authorization: token },
  });
}

export default { getRooms, getRoomById, updateRoom, addRoom, deleteRoom };