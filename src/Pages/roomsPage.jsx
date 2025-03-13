import { useEffect, useState } from "react"
import { Button, Container, Image } from "react-bootstrap"
import { useParams } from "react-router-dom"
import roomsService from "../Services/roomsService"
import RoomCard from "../Components/roomCard"

// const generale de ma page - a souvent le meme nom que le fichier
const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);


 // Fonction pour récupérer les chambres   
    const fetchRooms = async () => {
        try {
            const response = await roomsService.getRooms();
            setRooms(response.data);
        } catch (error) {
            console.error(error);
        }
    }


// useEffect pour appeler la fonction fetchRooms
    useEffect(() => {
        fetchRooms();
    }, []);

    return <>
        <Container className="d-flex flex-column align-items-center mt-5">
            <h1>Chambres</h1>

            <div className="d-flex flex-wrap justify-content-center gap-3" >

            {/* Boucle pour afficher les chambres */}
            {rooms.map((room, index) => {
                return  <RoomCard key={index} room={room} />

            })}
</div>
        </Container>
    </>
}

export default RoomsPage