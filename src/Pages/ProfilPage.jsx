import React, { use } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profilService from "../Services/profilService";
import { useEffect } from "react";

const ProfilPage = () => {
    const [user, setUser] = useState({});


const fetchUser = async () => {
    try {
        const response = await profilService.getProfil();
        setUser(response.data);
    } catch (error) {
        console.error(error);
    }    
}

useEffect(() => {
    fetchUser();
}
, []);

    return ( 
        <div className="mt-5" >
            <h1>Bienvenue {user.first_name}</h1>

            <p>Informations personnelles:</p>

            <p>Prénom: {user.first_name}</p>
            <p>Nom: {user.last_name}</p>
            <p>Email: {user.email}</p>



        </div>
     );
}
 
export default ProfilPage;