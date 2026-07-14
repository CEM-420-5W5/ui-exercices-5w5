'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { MyButton } from "./my-button";

export interface LoginViewProps {
    apiBaseUrl?: string;
}

export function LoginView({ apiBaseUrl = "http://localhost:5011/api/" }: LoginViewProps) {

    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState("test");
    const [password, setPassword] = useState("Passw0rd!");

    useEffect(() => {
        const tokenJSON : string | null = sessionStorage.getItem("token");
        setToken(tokenJSON);
    }, []);

    const accountBaseUrl = apiBaseUrl + "Account/";

    async function enregistrer(){
        let registerData = {
            username: username,
            email : username + "@test.com",
            password : password,
            passwordConfirm : password,
        }
        await axios.post(accountBaseUrl + "Register", registerData);
    }

    async function login(){
        let loginData = {
            username: username,
            password: password
        }
        const result = await axios.post(accountBaseUrl + "Login", loginData);
        sessionStorage.setItem("token", result.data.token);
        setToken(result.data.token);
    }

    async function logout(){
        // Rien d'autre à faire que d'oublier le Token
        sessionStorage.removeItem("token");
        setToken(null);
    }

    function isLoggedIn() : boolean{
        return token != null;
    }

    function displayLogin(){
        if(!isLoggedIn()){
            return(
                <div>
                    <div className="mb-2">
                        Qui êtes-vous?
                    </div>
                    <div className="flex gap-2">
                        <MyButton variant="secondary" onClick={enregistrer}>
                            Enregistrer
                        </MyButton>
                        <MyButton onClick={login}>
                            Login
                        </MyButton>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div>
                    <div className="mb-2">
                        Bienvenue!
                    </div>
                    <MyButton onClick={logout}>
                        Logout
                    </MyButton>
                </div>
            );
        }
    }

    return(
        <div className="borderedZone">
            {displayLogin()}   
        </div>
    );
}