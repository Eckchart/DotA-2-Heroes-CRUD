import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { base_backend_url } from "./baseBackendUrl.ts";


function Register()
{
    type User =
    {
        username: string,
        password: string
    }
    const [user, setUser] = useState<User>({ username: "", password: "" });
    let history = useNavigate();

    const handleRegister = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        try
        {
            const response = await axios.post(`${base_backend_url}/api/register`,
                {
                    username: user.username,
                    password: user.password
                }
            );
            if (response.status === 201)
            {
                localStorage.setItem("jwt_token", response.data.access_token);
                history("/");
            }
            else
            {
                alert("Bad register attempt.");
            }
        }
        catch (error)
        {
            console.error("Error registering:", error);
        }
    };
    
    return (
        <div className="wrapper">
            <Form className="d-grid gap-2" style={{margin: "15rem"}}>
                <Form.Group className="mb-2" controlId="formRegisterUsername">
                    <Form.Control type="text" placeholder="Username" required style={{width: "25rem", marginLeft: "25rem"}} onChange={(e) => setUser((prevUser: User) => {
                        return { username: e.target.value, password: prevUser.password };
                    })} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="formRegisterPassword">
                    <Form.Control type="password" placeholder="Password" required style={{width: "25rem", marginLeft: "25rem"}} onChange={(e) => setUser((prevUser: User) => {
                        return { username: prevUser.username, password: e.target.value };
                    })} />
                </Form.Group>

                <Button data-testid="register-btn" size="lg" style={{width: "10rem", marginLeft: "32.5rem"}} onClick={(e) => handleRegister(e)} type="submit">Register</Button>
            </Form>
        </div>
    )
}

export default Register;
