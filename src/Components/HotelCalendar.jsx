import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import reservationsService from "../Services/reservationsService";
import { useEffect, useState } from "react";
import profilService from "../Services/profilService";

const HotelCalendar = () => {
    const [reservations, setReservations] = useState([]);


    function renderEventContent(eventInfo) {
        return (
            <div>
                <h3>{eventInfo.event.title}</h3>
                <p>{eventInfo.event.startStr}</p>
                <p>{eventInfo.event.endStr}</p>
            </div>

        )
    }


const fetchReservations = async () => {
    try {
        const response = await reservationsService.getReservations();
        const data = await Promise.all(response.data.map(async (reservation) => {

            return {
                title: reservation.first_name + " " + reservation.last_name,
                start: reservation.checkin_date,
                end: reservation.checkout_date,
                backgroundColor: reservation.reservation_status === "Confirmée" ? "#28a745" : reservation.reservation_status === "En attente de validation" ? "#ffc107" : "#dc3545", 
            }
        }));
        setReservations(data);
    } catch (error) {
        console.log(error);
    }
}

useEffect(() => {
    fetchReservations();
}, []);

    console.log(reservations);


    return (

        <div className="calendrier" style={{ width: '80%', margin: '0 auto', height: '80%' }}>

            <h1>Calendrier</h1>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView='dayGridMonth'
                weekends={true}
                events={reservations}
                eventContent={renderEventContent}
            />

        </div>
    );

    <></>
}

export default HotelCalendar;