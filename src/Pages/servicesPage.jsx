import { useEffect, useState } from "react"
import { Button, Container, Image } from "react-bootstrap"
import { useParams } from "react-router-dom"
import servicesService from "../Services/servicesService"
import ServiceCard from "../Components/serviceCard"

const ServicesPage = () => {
    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const response = await servicesService.getServices();
            setServices(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchServices();
    }, []);

    return <>
        <Container className="d-flex flex-column align-items-center mt-5">
            <h1>Services</h1>

            <div className="d-flex flex-wrap justify-content-center gap-3" >

                {services.map((service, index) => {
                    return <ServiceCard key={index} service={service} />
                })}
            </div>

        </Container>

    </>

}

export default ServicesPage

