import { render, fireEvent, screen } from "@testing-library/react";
import {MemoryRouter, BrowserRouter, Route, Routes} from "react-router-dom";
import HeroesTable from "../HeroesTable";
import Edit from "../Edit";
import MyServices from "../../services";


describe("Edit Page", () =>
{
    it("should update certain (or all) attributes of a hero when pressing the edit button", () =>
    {
        render (
            <MemoryRouter initialEntries={["/heroes/edit", "/heroes"]}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable/>}/>
                    <Route path="/heroes/edit" element={<Edit/>}/>
                </Routes>
            </MemoryRouter>
        )

        const heroTableEditBtns = screen.getAllByTestId("edit-btn");
        fireEvent.click(heroTableEditBtns[0]);  // edit the first element in the table
        fireEvent.change(screen.getByPlaceholderText("Enter hero name"),
        {
            // change first hero name in the table to Venomancer.
            target: { value: "Venomancer" }
        });
        const updateBtn = screen.getByTestId("update-btn");
        fireEvent.click(updateBtn);
        expect(MyServices.heroes.some(hero => hero.name === "Venomancer")).toBe(true);

        const heroTableRows = screen.getAllByTestId("hero-row");
        expect(heroTableRows.some(heroTableRow => heroTableRow.textContent?.match(/^Venomancer/))).toBe(true);
    });
})