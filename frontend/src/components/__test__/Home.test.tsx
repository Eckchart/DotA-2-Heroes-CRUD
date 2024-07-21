import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import HeroesTable from "../HeroesTable.tsx";
import Home from "../Home.tsx";
import { io, Socket } from "socket.io-client";
const socket: Socket = io('http://localhost:3001');


describe("Home Page", () =>
{
    it("should have a button with the text 'View Heroes' on it", () =>
    {
        render (
            <MemoryRouter initialEntries={['/heroes', '/']}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/heroes" element={<HeroesTable socket={socket}/>}/>
                </Routes>
            </MemoryRouter>
        );

        const viewBtn = screen.getByText("View Heroes");
        expect(viewBtn).toBeInTheDocument();

        let createBtn = screen.queryByText("Create");
        expect(createBtn).toBeNull();

        fireEvent.click(viewBtn);
        createBtn = screen.queryByText("Create");
        expect(createBtn).toBeInTheDocument();
    });
});
