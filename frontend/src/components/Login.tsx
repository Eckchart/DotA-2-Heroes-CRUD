import React from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { base_backend_url } from "./baseBackendUrl.ts";


function Login()
{
    type User =
    {
        username: string,
        password: string
    }
    const [user, setUser] = useState<User>({username: "", password: ""});
    let history = useNavigate();

    const handleLogin = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        try
        {
            const response = await axios.post(`${base_backend_url}/api/login`,
                {
                    username: user.username,
                    password: user.password
                }
            );
            if (response.status === 200)
            {
                localStorage.setItem("jwt_token", response.data.access_token);
                history("/");
            }
            else
            {
                alert("Bad login attempt.");
            }
        }
        catch (error)
        {
            console.error("Error logging in:", error);
        }
    };
    
    return (
        <div className="wrapper">
            <Form className="d-grid gap-2" style={{margin: "15rem"}}>
                <Form.Group className="mb-2" controlId="formLoginUsername">
                    <Form.Control type="text" placeholder="Username" required style={{width: "25rem", marginLeft: "25rem"}} onChange={(e) => setUser((prevUser: User) => {
                        return { username: e.target.value, password: prevUser.password };
                    })} />
                </Form.Group>
                <Form.Group className="mb-2" controlId="formLoginPassword">
                    <Form.Control type="password" placeholder="Password" required style={{width: "25rem", marginLeft: "25rem"}} onChange={(e) => setUser((prevUser: User) => {
                        return { username: prevUser.username, password: e.target.value };
                    })} />
                </Form.Group>

                <div className="buttonWrapper" style={{marginRight: "1rem"}}>
                    <Button data-testid="login-btn" size="lg" onClick={(e) => handleLogin(e)} type="submit">Login</Button>
                    &nbsp;
                    <Link to="/register">
                        <Button size="lg">Go Register</Button>
                    </Link>
                </div>
            </Form>
        </div>
    )
}

export default Login;
