import axios from "axios";

const API_URL = import.meta.env.VITE_URL_API;

function getRooms() {
  return axios.get(API_URL + "rooms");
}

function getRoomById(id) {
  return axios.get(API_URL + `rooms/${id}`);
}

function updateRoom(id, data) {
  const token = localStorage.getItem("authorization");
  return axios.patch(API_URL +`rooms/${id}`, data,
    {
      headers: {
        authorization: token,
      },
    }
  );
}
function addRoom(data) {
  const token = localStorage.getItem("authorization");
  return axios.post(API_URL +"rooms", data, {
      headers: { authorization: token },
  });
}

function deleteRoom(id) {
  const token = localStorage.getItem("authorization");
  return axios.delete(API_URL +`rooms/${id}`, {
      headers: { authorization: token },
  });
}

export default { getRooms, getRoomById, updateRoom, addRoom, deleteRoom };