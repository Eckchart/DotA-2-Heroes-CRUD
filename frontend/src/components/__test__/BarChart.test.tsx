import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import BarChart from "../BarChart.tsx";
import HeroesTable from "../HeroesTable.tsx";
import { io, Socket } from "socket.io-client";
const socket: Socket = io('http://localhost:3001');

jest.mock("chart.js");


describe("Bar Chart", () =>
{
    it("should appear on the screen when we press the button 'Strength Bar Chart'", () =>
    {
        render(
            <MemoryRouter initialEntries={['/heroes']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable socket={socket}/>}/>
                    <Route path="/heroes/bar_chart" element={<BarChart socket={socket}/>}/>
                </Routes>
            </MemoryRouter>
        );

        const strBtn = screen.getByTestId("strength-bar-chart-btn");
        fireEvent.click(strBtn);
        const goBackBtn = screen.queryByText("Go Back");
        expect(goBackBtn).toBeInTheDocument();
    });
});
