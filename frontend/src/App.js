import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.tsx";
import HeroesTable from "./components/HeroesTable.tsx";
import Add from "./components/AddPage.tsx";
import Edit from "./components/Edit.tsx";
import BarChart from "./components/BarChart.tsx";
import AbilitiesTable from "./components/AbilitiesTable.tsx";
import EditAbility from "./components/EditAbility.tsx";
import AddAbility from "./components/AddAbilityPage.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import { io } from "socket.io-client";
import { base_backend_url } from "./components/baseBackendUrl.ts";
const socket = io(`${base_backend_url}`);


function App()
{
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/heroes" element={<HeroesTable socket={socket}/>}/>
                    <Route path="/heroes/add" element={<Add/>}/>
                    <Route path="/heroes/edit" element={<Edit/>}/>
                    <Route path="/heroes/bar_chart" element={<BarChart socket={socket}/>}/>
                    <Route path="/abilities" element={<AbilitiesTable/>}/>
                    <Route path="/abilities/add" element={<AddAbility/>}/>
                    <Route path="/abilities/edit" element={<EditAbility/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
