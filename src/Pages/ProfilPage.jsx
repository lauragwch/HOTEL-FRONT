import React, { useState, useEffect } from "react";
import profilService from "../Services/profilService";
import ProfilCard from "../Components/profilCard";
import "../Styles/profil.css";

const ProfilPage = () => {
    const [user, setUser] = useState({});

    const fetchUser = async () => {
        try {
            const response = await profilService.getProfil();
            console.log(response.data);
            setUser(response.data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="profil-page">
            <div className="profil-container mt-5">
                <h1>Profil</h1>
                <ProfilCard profil={user} />
            </div>
        </div>
    );
};

export default ProfilPage;