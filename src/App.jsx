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
import AuthContext from "./Contextes/AuthContext";
// import RoomPage from "./Pages/roomPage";
import { useState } from "react";
import NavBar from "./Components/navBar";
import authService from "./Services/authService";
import BookingConfirmation from "./Pages/bookingConfirmationPage";
import PaymentPage from "./Pages/paymentPage";
import ResetPasswordPage from './Pages/resetPasswordPage'
import ForgotPasswordPage from './Pages/forgotPasswordPage'
import "./App.css";

function App() {
    const [isConnected, setIsConnected] = useState(authService.isConnected());
    const [role, setRole] = useState(authService.getRole());
    const [user, setUser] = useState(authService.getUser());

    return (
        <AuthContext.Provider value={{ isConnected, setIsConnected, role, setRole, user, setUser }}>
            <BrowserRouter>
                <NavBar />
                <div className="page-container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chambres" element={<RoomsPage />} />
                    {/* <Route path="/chambres/:id" element={<RoomPage />} /> */}
                    <Route path="/services" element={<ServicesPage />} />

                    <Route path="/login" element={<LoginPage />} />
                    {role == 'ADMIN' ?
                        <Route path="/admin" element={<AdminPage />} /> :
                        <Route path='*' element={<HomePage />} />
                    }


                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/reservations" element={<ReservationPage />} />
                    <Route path="/profile" element={<ProfilPage />} />
                    <Route path="/edit/:id" element={<EditProfilPage />} />
                    <Route path="/booking/:roomId" element={<BookingConfirmation />} />
                    <Route path="/payment/:roomId" element={<PaymentPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />


                </Routes>
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;