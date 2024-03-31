import {render, fireEvent, screen} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import BarChart from "../BarChart";
import HeroesTable from "../HeroesTable";
jest.mock("chart.js");


describe("Bar Chart", () =>
{
    it("appear on the screen when we press the button 'Strength Bar Chart'", () =>
    {
        render (
            <MemoryRouter initialEntries={['/heroes']}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                    <Route path="/heroes/bar_chart" element={<BarChart/>}/>
                </Routes>
            </MemoryRouter>
        )
        const strBtn = screen.getByTestId("strength-bar-chart-btn");
        fireEvent.click(strBtn);
        const goBackBtn = screen.queryByText("Go Back");
        expect(goBackBtn).toBeInTheDocument();
    });
})
