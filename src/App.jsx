import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/homePage";
import ServicesPage from "./Pages/servicesPage";
import RoomsPage from "./Pages/roomsPage";
import LoginPage from "./Pages/loginPage";
import RegisterPage from "./Pages/registerPage";
import ReservationPage from "./Pages/reservationPage";
import ProfilPage from "./Pages/ProfilPage";
import EditProfilPage from "./Pages/editProfilPage";
import AdminPage from "./Pages/adminPage";


// import RoomPage from "./Pages/roomPage";
import { useState } from "react";
import NavBar from "./Components/navBar";


function App() {

    return (
        <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chambres" element={<RoomsPage />} />
            {/* <Route path="/chambres/:id" element={<RoomPage />} /> */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/profile" element={<ProfilPage />} />
            <Route path="/edit/:id" element={<EditProfilPage />} />
            <Route path="/admin" element={<AdminPage />} />
        

        </Routes>
        </BrowserRouter>
    );
    }

export default App;