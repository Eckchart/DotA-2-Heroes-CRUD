import { render, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios  from "axios";
import HeroesTable from "../HeroesTable";
import Edit from "../Edit";

jest.mock("axios");


describe("Edit Page", () =>
{
    beforeEach(() =>
    {
        jest.resetAllMocks();
    });
    
    it("should update certain (or all) attributes of a hero when pressing the edit button", async () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 10, _base_agi: 20, _base_int: 30, _base_ms: 300 }
        ];

        (axios.get as jest.Mock).mockImplementation((url: string) =>
        {
            if (url.includes("cur_page"))
            {
                return Promise.resolve({ data: 1 });
            }
            return Promise.resolve({ data: mockHeroesData });
        });
        
        render(
            <MemoryRouter initialEntries={["/heroes/edit", "/heroes"]}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable />} />
                    <Route path="/heroes/edit" element={<Edit />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for API call to complete and data to be rendered
        await screen.findByText("Drow Ranger");

        const heroTableEditBtns = screen.getAllByTestId("edit-btn");
        fireEvent.click(heroTableEditBtns[0]);  // edit the first element in the table
        fireEvent.change(screen.getByPlaceholderText("Enter hero name"),
        {
            // change first hero name in the table to Venomancer.
            target: { value: "Venomancer" }
        });
        let updateBtn = await screen.findByTestId("update-btn");
        fireEvent.click(updateBtn);
        
        expect(axios.put).toHaveBeenCalledWith(`http://localhost:3001/api/heroes/10`,
            {
                name: "Venomancer",
                str: 10,
                agi: 20,
                int: 30,
                ms: 300,
                id: 10
            }
        );
    });

    it("should throw when changing the str attribute of a hero to 1", async () =>
    {
        const mockHeroesData = [
            { _hero_id: 10, _hero_name: "Drow Ranger", _base_str: 10, _base_agi: 20, _base_int: 30, _base_ms: 300 }
        ];
        const mockErrorResponse = {
            response: {
                status: 400,
                data: { error: "str should be between 5 and 35!" }
            }
        };

        (axios.get as jest.Mock).mockImplementation((url: string) =>
        {
            if (url.includes("cur_page"))
            {
                return Promise.resolve({ data: 1 });
            }
            return Promise.resolve({ data: mockHeroesData });
        });
        (axios.put as jest.Mock).mockRejectedValue(mockErrorResponse);
        
        render(
            <MemoryRouter initialEntries={["/heroes/edit", "/heroes"]}>
                <Routes>
                    <Route path="/heroes" element={<HeroesTable />} />
                    <Route path="/heroes/edit" element={<Edit />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for API call to complete and data to be rendered
        await screen.findByText("Drow Ranger");

        const heroTableEditBtns = screen.getAllByTestId("edit-btn");
        fireEvent.click(heroTableEditBtns[0]);  // edit the first element in the table
        fireEvent.change(screen.getByPlaceholderText("Enter hero strength"),
        {
            // change first hero strength in the table to 1, which is not a valid value.
            target: { value: 1 }
        });
        let updateBtn = await screen.findByTestId("update-btn");
        fireEvent.click(updateBtn);
        
        expect(axios.put).toHaveBeenCalledWith(`http://localhost:3001/api/heroes/10`,
            {
                name: "Drow Ranger",
                str: 1,
                agi: 20,
                int: 30,
                ms: 300,
                id: 10
            }
        );
        expect(axios.put).rejects.toEqual(mockErrorResponse);
    });
});
