import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import profilService from "../Services/profilService";
import "../Styles/editProfil.css";

const EditProfilPage = () => {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const response = await profilService.getProfil(id);
            const normalizedData = {
                first_name: response.data.first_name || "",
                last_name: response.data.last_name || "",
                phone: response.data.phone || "",
                email: response.data.email || "",
            };
            setUser(normalizedData);
        } catch (error) {
            console.error("Erreur lors de la récupération du profil:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await profilService.editProfil(id, user);
            console.log("Mise à jour réussie:", response);
            navigate("/profile");
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="edit-profil-page">
            <div className="edit-profil-container">
                <h1>Modifier le profil</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="first_name"
                            value={user.first_name}
                            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                            placeholder=" " // Nécessaire pour le label flottant
                        />
                        <label>Prénom</label>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="last_name"
                            value={user.last_name}
                            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                            placeholder=" "
                        />
                        <label>Nom</label>
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="phone"
                            value={user.phone}
                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                            placeholder=" "
                        />
                        <label>Téléphone</label>
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder=" "
                        />
                        <label>Email</label>
                    </div>
                    <button type="submit" className="update-btn">
                        Mettre à jour
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfilPage;