'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./base/button";
import { BorderedContainer } from "./bordered-container";
import { Field, FieldLabel } from "./base/field";
import { Input } from "./base/input";

export interface LoginViewProps {
    apiUrl?: string;
}

export function LoginView({ apiUrl = "http://localhost:5011/api/Account" }: LoginViewProps) {

    const [token, setToken] = useState<string | null>(null);
    const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null);
    const [username, setUsername] = useState("test");
    const password = "Passw0rd!";

    useEffect(() => {
        const tokenJSON : string | null = sessionStorage.getItem("token");
        setToken(tokenJSON);

        const usernameJSON : string | null = sessionStorage.getItem("username");
        setLoggedInUsername(usernameJSON);
    }, []);

    async function enregistrer(){
        let registerData = {
            username: username,
            email : username + "@test.com",
            password : password,
            passwordConfirm : password,
        }
        await axios.post(apiUrl + "Register", registerData);
    }

    async function login(){
        let loginData = {
            username: username,
            password: password
        }
        const result = await axios.post(apiUrl + "Login", loginData);
        sessionStorage.setItem("token", result.data.token);
        sessionStorage.setItem("username", result.data.username);
        setToken(result.data.token);
    }

    async function logout(){
        // Rien d'autre à faire que d'oublier le Token
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
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
                        <Field className="mb-2">
                            <FieldLabel htmlFor="input-field-data-name">Ajout de data</FieldLabel>
                            <Input
                                id="input-field-data-name"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="N'importe quel texte"
                            />      
                        </Field>
                        <Button variant="secondary" onClick={enregistrer}>
                            Enregistrer
                        </Button>
                        <Button onClick={login}>
                            Login
                        </Button>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div>
                    <div className="mb-2">
                        Bienvenue {loggedInUsername}!
                    </div>
                    <Button onClick={logout}>
                        Logout
                    </Button>
                </div>
            );
        }
    }

    return(
        <BorderedContainer>
            {displayLogin()}   
        </BorderedContainer>
    );
}